from __future__ import annotations

from typing import Any


def normalize_customer(customer: dict[str, Any], domain_outputs: list[dict[str, Any]]) -> dict[str, Any]:
    profile: dict[str, Any] = {
        "customer_id": customer["customer_id"],
        "customer_name": customer["name"],
        "industry": customer["industry"],
        "region": customer["region"],
        "renewal": customer["contracts"][0],
        "domain_outputs": {item["domain"]: item for item in domain_outputs},
    }
    return profile


def score_profile(profile: dict[str, Any]) -> dict[str, Any]:
    sales = profile["domain_outputs"]["sales"]
    billing = profile["domain_outputs"]["billing"]
    support = profile["domain_outputs"]["support"]
    telemetry = profile["domain_outputs"]["telemetry"]

    growth_score = min(100, sales["growth_signal"] + telemetry["adoption_signal"] // 2)
    savings_score = min(100, billing["savings_signal"] + sales["license_gap"] // 50)
    risk_score = min(100, support["risk_signal"])
    health_score = max(0, min(100, 100 - risk_score + telemetry["feature_adoption_pct"] // 3))

    return {
        "growth_score": growth_score,
        "savings_score": savings_score,
        "risk_score": risk_score,
        "health_score": health_score,
    }


def build_recommendations(profile: dict[str, Any], scores: dict[str, int]) -> list[dict[str, Any]]:
    sales = profile["domain_outputs"]["sales"]
    billing = profile["domain_outputs"]["billing"]
    support = profile["domain_outputs"]["support"]
    telemetry = profile["domain_outputs"]["telemetry"]
    renewal = profile["renewal"]

    recs: list[dict[str, Any]] = []

    if billing["idle_resource_pct"] >= 10 or billing["reserved_coverage_pct"] < 30:
        recs.append({
            "type": "Cost Optimization",
            "priority": "High",
            "owner": "FinOps Lead",
            "title": "Right-size cloud workloads and improve reservation coverage",
            "rationale": f"Idle resources are {billing['idle_resource_pct']}% and reservation coverage is {billing['reserved_coverage_pct']}%, indicating avoidable spend.",
            "impact": f"Estimated savings potential: ${round((billing['idle_resource_pct'] * 12000) + max(0, 30 - billing['reserved_coverage_pct']) * 8000):,}",
        })

    if sales["has_e3_whitespace"]:
        recs.append({
            "type": "Revenue Growth",
            "priority": "High",
            "owner": "Account Executive",
            "title": "Target E3 to E5 upgrade motion",
            "rationale": "Installed base on Microsoft 365 E3 suggests whitespace for security and compliance monetization.",
            "impact": f"Estimated ARR uplift: ${round((scores['growth_score'] * 4200)):,}",
        })

    if telemetry["feature_adoption_pct"] < 80:
        recs.append({
            "type": "Adoption Expansion",
            "priority": "Medium",
            "owner": "Customer Success Manager",
            "title": "Drive persona-based product adoption",
            "rationale": f"Feature adoption is {telemetry['feature_adoption_pct']}%, suggesting activation and enablement opportunity.",
            "impact": f"Protect and expand spend by improving utilization for {sales['license_gap']} currently underused licenses.",
        })

    if support["open_tickets"] >= 5 or support["p1_incidents"] > 0:
        recs.append({
            "type": "Retention & Risk",
            "priority": "Medium",
            "owner": "Renewal Desk",
            "title": "Proactively stabilize support and renewal risk",
            "rationale": f"Open tickets: {support['open_tickets']}, P1 incidents: {support['p1_incidents']}, NPS: {support['nps']}.",
            "impact": f"Defend renewal value of ${renewal['annual_value_usd']:,}.",
        })

    if billing["token_growth_pct"] >= 15:
        recs.append({
            "type": "AI Monetization",
            "priority": "Medium",
            "owner": "AI Solutions Lead",
            "title": "Scale AI workloads with governance controls",
            "rationale": f"AI token growth is {billing['token_growth_pct']}%, indicating readiness for expanded governed AI usage.",
            "impact": f"Potential new AI revenue: ${round(billing['token_growth_pct'] * 5000):,}",
        })

    return recs

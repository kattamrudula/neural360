from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any, Dict


def _sum_license_gap(products: list[dict[str, Any]]) -> int:
    gap = 0
    for product in products:
        purchased = product.get("licenses_purchased", 0)
        used = product.get("licenses_used", 0)
        if purchased and purchased >= used:
            gap += purchased - used
    return gap


@dataclass
class SalesDomainAgent:
    id: str = "sales-domain-agent"

    async def run(self, customer: dict[str, Any]) -> dict[str, Any]:
        await asyncio.sleep(0.01)
        products = customer.get("products", [])
        total_product_spend = sum(p.get("annual_spend_usd", 0) for p in products)
        license_gap = _sum_license_gap(products)
        has_e3 = any("E3" in p.get("name", "") for p in products)
        return {
            "domain": "sales",
            "total_product_spend_usd": total_product_spend,
            "license_gap": license_gap,
            "growth_signal": 25 + customer["engagement"].get("sales_meetings_last_quarter", 0) * 4 + (18 if has_e3 else 8),
            "has_e3_whitespace": has_e3,
        }


@dataclass
class BillingDomainAgent:
    id: str = "billing-domain-agent"

    async def run(self, customer: dict[str, Any]) -> dict[str, Any]:
        await asyncio.sleep(0.01)
        products = customer.get("products", [])
        idle = max((p.get("idle_resource_pct", 0) for p in products), default=0)
        reserved = min((p.get("reserved_coverage_pct", 100) for p in products if "reserved_coverage_pct" in p), default=100)
        token_growth = max((p.get("token_growth_pct", 0) for p in products), default=0)
        anomaly = customer["billing"].get("cost_anomaly_score", 0)
        return {
            "domain": "billing",
            "idle_resource_pct": idle,
            "reserved_coverage_pct": reserved,
            "token_growth_pct": token_growth,
            "anomaly_score": anomaly,
            "savings_signal": idle * 3 + max(0, 45 - reserved) + anomaly // 5,
        }


@dataclass
class SupportDomainAgent:
    id: str = "support-domain-agent"

    async def run(self, customer: dict[str, Any]) -> dict[str, Any]:
        await asyncio.sleep(0.01)
        support = customer["support"]
        risk_signal = support["open_tickets"] * 4 + support["p1_incidents"] * 18 + max(0, 50 - support["nps"])
        return {
            "domain": "support",
            "open_tickets": support["open_tickets"],
            "p1_incidents": support["p1_incidents"],
            "nps": support["nps"],
            "risk_signal": risk_signal,
        }


@dataclass
class TelemetryDomainAgent:
    id: str = "telemetry-domain-agent"

    async def run(self, customer: dict[str, Any]) -> dict[str, Any]:
        await asyncio.sleep(0.01)
        usage = customer["usage"]
        engagement = customer["engagement"]
        adoption_signal = usage["feature_adoption_pct"] + usage["weekly_active_growth_pct"] + engagement["emails_opened"] // 3
        return {
            "domain": "telemetry",
            "active_users": usage["active_users"],
            "feature_adoption_pct": usage["feature_adoption_pct"],
            "weekly_active_growth_pct": usage["weekly_active_growth_pct"],
            "adoption_signal": adoption_signal,
        }

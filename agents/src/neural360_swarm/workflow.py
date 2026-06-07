from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from agent_framework import Executor, WorkflowBuilder, WorkflowContext, handler
from typing_extensions import Never

from .agents import BillingDomainAgent, SalesDomainAgent, SupportDomainAgent, TelemetryDomainAgent
from .scoring import build_recommendations, normalize_customer, score_profile


class CustomerBatchSource(Executor):
    def __init__(self, id: str = "customer_batch_source"):
        super().__init__(id=id)

    @handler
    async def load_customers(self, input_path: str, ctx: WorkflowContext[str]) -> None:
        customers = json.loads(Path(input_path).read_text(encoding="utf-8"))
        for customer in customers:
            await ctx.send_message(customer)


class SwarmCollector(Executor):
    def __init__(self, id: str = "swarm_collector"):
        super().__init__(id=id)
        self.sales_agent = SalesDomainAgent()
        self.billing_agent = BillingDomainAgent()
        self.support_agent = SupportDomainAgent()
        self.telemetry_agent = TelemetryDomainAgent()

    @handler
    async def collect_domains(self, customer: dict[str, Any], ctx: WorkflowContext[dict[str, Any]]) -> None:
        domain_outputs = await asyncio.gather(
            self.sales_agent.run(customer),
            self.billing_agent.run(customer),
            self.support_agent.run(customer),
            self.telemetry_agent.run(customer),
        )
        normalized_profile = normalize_customer(customer, list(domain_outputs))
        await ctx.send_message(normalized_profile)


class RecommendationScorer(Executor):
    def __init__(self, id: str = "recommendation_scorer"):
        super().__init__(id=id)

    @handler
    async def score_and_recommend(self, profile: dict[str, Any], ctx: WorkflowContext[Never, dict[str, Any]]) -> None:
        scores = score_profile(profile)
        recommendations = build_recommendations(profile, scores)
        output = {
            "customer_id": profile["customer_id"],
            "customer_name": profile["customer_name"],
            "scores": scores,
            "recommendations": recommendations,
        }
        await ctx.yield_output(output)


def create_workflow():
    source = CustomerBatchSource()
    swarm = SwarmCollector()
    scorer = RecommendationScorer()
    return (
        WorkflowBuilder(start_executor=source)
        .add_edge(source, swarm)
        .add_edge(swarm, scorer)
        .build()
    )

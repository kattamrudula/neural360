from __future__ import annotations

import asyncio
import json
from pathlib import Path

from .workflow import create_workflow


async def run() -> None:
    project_root = Path(__file__).resolve().parents[2]
    customers_path = project_root / "data" / "customers.json"
    output_path = project_root / "output" / "recommendations.json"

    workflow = create_workflow()
    events = await workflow.run(str(customers_path))

    outputs = events.get_outputs()
    output_path.write_text(json.dumps(outputs, indent=2), encoding="utf-8")
    print(f"Saved {len(outputs)} recommendation records to {output_path}")


if __name__ == "__main__":
    asyncio.run(run())

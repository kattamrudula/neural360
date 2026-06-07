# Neural 360 sample Python project using Microsoft Agent Framework

This sample demonstrates a **swarm-style Customer 360 pipeline** using **Microsoft Agent Framework (Python)** for workflow orchestration.

> The sample customer data is synthetic and intended for demonstration only.

## What it does

- reads `data/customers.json`
- uses a **MAF graph workflow** to orchestrate a swarm pipeline
- runs multiple domain agents in parallel per customer:
  - sales agent
  - billing agent
  - support agent
  - telemetry agent
- cleanses and normalizes domain data
- computes scores
- generates recommendations
- writes final records to `output/recommendations.json`

## Project structure

```text
neural360_maf_swarm_python_project/
├── data/
│   └── customers.json
├── output/
│   └── recommendations.json
├── src/
│   └── neural360_swarm/
│       ├── __init__.py
│       ├── agents.py
│       ├── scoring.py
│       ├── workflow.py
│       └── main.py
├── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.10+
- `pip install -r requirements.txt`

## Run

```bash
python -m src.neural360_swarm.main
```

## Notes

- This sample is intentionally **deterministic and offline-friendly**.
- It uses **Agent Framework workflow primitives** for orchestration, but the domain agents themselves use rule-based Python logic so you can run it without model credentials.
- You can later swap the domain agents for LLM-backed `Agent` instances or provider-backed chat clients.

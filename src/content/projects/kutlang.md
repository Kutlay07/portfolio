## The problem

A language model can suggest code, but completing a software task also requires reading a repository, selecting useful context, running tools, handling failures, and checking the result. Kutlang explores the software around the model that makes that workflow possible.

## What I am building

A modular Python coding agent harness with separate areas for agent execution, model adapters, context management, tools, policies, and observability. The goal is to make execution decisions explicit and keep the system extensible as the runtime evolves.

| Area | Responsibility |
| --- | --- |
| Agent runtime | Coordinate model responses and tool execution |
| Model adapters | Connect the runtime to model providers |
| Context | Prepare the information passed to a model |
| Tools | Provide filesystem, execution, and search capabilities |
| Policy and security | Apply controls around actions |
| Observability | Record execution events for inspection |

## Engineering approach

The package declares tool providers through Python entry points. This gives filesystem, execution, and search tools a defined extension boundary. The project uses Pydantic for structured data, FastAPI for its API layer, and pytest for testing.

The important distinction is between the model deciding what it wants to do and the runtime deciding how that action is represented, checked, and executed. Keeping those responsibilities separate makes individual parts easier to inspect and test.

## Current status and limits

Kutlang is under active development. Its product vision targets reliable, end-to-end software engineering tasks; that is a goal, not a claim of parity with established coding agents.

No task-success rate, latency benchmark, or current full-suite pass count is claimed here. A reproducible evaluation set and recorded runs are needed before those comparisons would be meaningful.

## What this work teaches me

- How model integration differs from agent orchestration.
- Why contracts between context, tools, and execution matter.
- How policy checks and audit records support debugging.
- Why a successful tool call is only one part of verifying a completed task.

## Explore the implementation

See the [source repository](https://github.com/Kutlay07/kutlang), [package configuration](https://github.com/Kutlay07/kutlang/blob/main/pyproject.toml), and [product vision](https://github.com/Kutlay07/kutlang/blob/main/PRODUCT_VISION.md). This write-up describes the repository structure and intended boundaries; it does not substitute for a runtime evaluation.

# SweepLens

Liquidity Sweep Detector product repository.

## Repo purpose

This repository is being used to plan and build a trading product focused on:
- liquidity sweep detection
- reclaim and confirmation logic
- chart-based signal visualization
- explainable market-structure analysis

## Current status

The repository is currently in the documentation and planning foundation phase.
No production application code has been added yet.

## Start here

If you are continuing work in a fresh Kaino session, read docs in this order:

1. [`docs/README.md`](./docs/README.md)
2. [`docs/session-handoffs/latest.md`](./docs/session-handoffs/latest.md)
3. [`docs/implementation-plans/liquidity-sweep-detector-mvp.md`](./docs/implementation-plans/liquidity-sweep-detector-mvp.md)
4. [`docs/product/rules-specification.md`](./docs/product/rules-specification.md)
5. [`docs/architecture/end-to-end-architecture.md`](./docs/architecture/end-to-end-architecture.md)
6. [`docs/engineering/file-structure.md`](./docs/engineering/file-structure.md)
7. [`docs/engineering/module-contracts.md`](./docs/engineering/module-contracts.md)
8. [`docs/execution/jira-tickets-detailed.md`](./docs/execution/jira-tickets-detailed.md)

## Initial planned stack

- Next.js
- TypeScript
- Tailwind CSS
- Lightweight Charts
- TypeScript-based detection engine
- Vercel for initial deployment

## Suggested Git workflow

- `main` for stable history
- `feature/*` branches for implementation work
- keep docs updated when architecture or scope changes

# Work Log — Detection Engine Foundation

## Purpose

This work log summarizes the first implementation pass for the SweepLens detection engine foundation on branch `feature/detection-engine-foundation`.

---

## Context

After the initial Next.js scaffold was merged into `develop`, implementation moved to the domain core described in:
- `docs/product/rules-specification.md`
- `docs/engineering/module-contracts.md`
- `docs/qa/test-cases.md`

This phase focuses on creating testable TypeScript modules for candle validation, market-data normalization, swing detection, equal-level clustering, sweep candidate detection, reclaim detection, confirmation classification, confidence scoring, and explanation payload generation.

---

## What was added

### Validation and market data
- `lib/validation/guards.ts`
- `lib/market-data/normalize.ts`

### Detection engine modules
- `lib/detection/swing.ts`
- `lib/detection/equal-levels.ts`
- `lib/detection/sweep.ts`
- `lib/detection/reclaim.ts`
- `lib/detection/confirm.ts`
- `lib/detection/score.ts`
- `lib/detection/explain.ts`
- `lib/detection/index.ts`

### Unit tests
- `tests/unit/detection/validation.test.ts`
- `tests/unit/detection/swing.test.ts`
- `tests/unit/detection/equal-levels.test.ts`
- `tests/unit/detection/sweep-reclaim.test.ts`

---

## Key implementation decisions

### 1. Keep domain logic pure and testable
Detection modules are framework-independent TypeScript functions. They do not depend on React or chart UI.

### 2. Validate candles before detection
The detector returns structured errors for malformed candle input instead of throwing during normal pipeline execution.

### 3. Use staged pipeline composition
The `runDetector` flow currently follows:
1. validate candles
2. detect swings
3. detect equal levels
4. detect sweep candidates
5. detect reclaims
6. apply confirmation logic
7. convert to explainable sweep signals

### 4. Prefer explainable outputs
Signals include reasons and metrics so UI can show why a sweep was detected.

---

## Validation performed

The following checks passed:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Test coverage added in this phase includes:
- candle validation
- raw candle normalization
- swing detection
- equal-level clustering
- bearish sweep + reclaim pipeline
- bullish sweep + reclaim pipeline
- validation error handling in `runDetector`

---

## Known limitations

This is still foundation logic, not final trading-grade behavior.

Known limitations:
- confirmation logic is intentionally simple
- structure shift detection is basic
- equal-level clustering policy may need refinement with real market examples
- no live data provider integration yet
- workspace UI still uses demo fixtures instead of the detector pipeline
- no Lightweight Charts rendering yet

---

## Recommended next step

After this PR is merged, the next implementation phase should connect the detector foundation into the workspace and begin replacing static demo signals with `runDetector` output.

Recommended next branch:
- `feature/workspace-detector-integration`

Potential follow-up tasks:
1. update workspace to run detector on fixture candles
2. show generated signals in `ChartContainer`
3. show generated signal reasons in `ExplanationPanel`
4. add basic debug display for swings/equal levels
5. start Lightweight Charts integration in a separate PR if scope grows

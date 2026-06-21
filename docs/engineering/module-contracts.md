# Engineering Module Contracts — Liquidity Sweep Detector MVP

## Purpose

This document defines the core module contracts that implementation should follow for the Liquidity Sweep Detector MVP.
It is meant to reduce ambiguity before coding so a fresh Kaino session can build modules with stable boundaries.

This document focuses on:
- domain models
- module input/output expectations
- detection pipeline contracts
- provider abstraction contracts
- UI-facing payload shapes
- implementation sequencing notes

---

## 1. Contract philosophy

The MVP should use narrow, explicit contracts.
Each module should:
- accept a predictable input shape
- return a predictable output shape
- avoid hidden provider-specific assumptions
- remain independently testable
- expose enough detail for UI explanations and QA

Where possible, modules should be pure.

---

## 2. Foundational domain models

## 2.1 Candle

Every detection step depends on a normalized candle model.

Suggested shape:

```ts
type Candle = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}
```

Rules:
- timestamps must be time-ordered ascending
- all numeric values must be finite
- high should be >= open/close/low
- low should be <= open/close/high

---

## 2.2 SwingPoint

```ts
type SwingPoint = {
  index: number
  timestamp: number
  price: number
  kind: 'high' | 'low'
  strength?: number
}
```

---

## 2.3 EqualLevelCluster

```ts
type EqualLevelCluster = {
  id: string
  kind: 'equalHighs' | 'equalLows'
  startIndex: number
  endIndex: number
  memberIndexes: number[]
  lowerBound: number
  upperBound: number
  representativePrice: number
}
```

Notes:
- use bounds instead of one exact line if tolerance is nonzero
- `representativePrice` can be midpoint or chosen reference price

---

## 2.4 DetectorSettings

```ts
type DetectorSettings = {
  swingLookback: number
  equalLevelTolerancePct: number
  reclaimWindowCandles: number
  minBreachPct: number
  requireCloseReclaim: boolean
  requireConfirmation: boolean
  enableDisplacementCheck: boolean
  enableStructureShiftCheck: boolean
  showFailedSignals: boolean
}
```

This can evolve, but v1 should keep it tight.

---

## 2.5 SweepCandidate

```ts
type SweepCandidate = {
  id: string
  direction: 'bullish' | 'bearish'
  levelType: 'swingHigh' | 'swingLow' | 'equalHighs' | 'equalLows'
  levelPrice: number
  levelBounds?: {
    lower: number
    upper: number
  }
  breachIndex: number
  breachTimestamp: number
  breachPrice: number
  breachMagnitudePct: number
  wickOnly: boolean
}
```

---

## 2.6 SweepSignal

```ts
type SweepSignal = {
  id: string
  symbol?: string
  timeframe?: string
  direction: 'bullish' | 'bearish'
  levelType: 'swingHigh' | 'swingLow' | 'equalHighs' | 'equalLows'
  sweptLevelPrice: number
  breachIndex: number
  reclaimIndex?: number
  state: 'candidate' | 'reclaimed' | 'confirmed' | 'failed'
  confidence: 'low' | 'medium' | 'high'
  reasons: string[]
  metrics: {
    breachMagnitudePct: number
    reclaimWindowUsed?: number
    displacementDetected?: boolean
    structureShiftDetected?: boolean
  }
}
```

This is the core UI-facing domain signal.

---

## 3. Detection module contracts

## 3.1 Swing detection contract

### Input
- normalized candle array
- swing lookback setting

### Output

```ts
type SwingDetectionResult = {
  highs: SwingPoint[]
  lows: SwingPoint[]
}
```

### Contract rules
- do not mutate candle input
- output indexes must align to candle indexes
- recent candles without enough lookforward context should be handled consistently

---

## 3.2 Equal-level clustering contract

### Input
- candle array
- swing points or raw highs/lows depending on implementation choice
- tolerance setting

### Output

```ts
type EqualLevelResult = {
  equalHighs: EqualLevelCluster[]
  equalLows: EqualLevelCluster[]
}
```

### Contract rules
- cluster boundaries must be deterministic
- one level should not silently belong to contradictory clusters without clear policy
- output should preserve member indexes for explanations and UI

---

## 3.3 Sweep detection contract

### Input
- candle array
- swings
- equal-level clusters
- settings

### Output

```ts
type SweepCandidateResult = {
  candidates: SweepCandidate[]
}
```

### Contract rules
- identify breaches against tracked levels only
- include level type and breach metrics
- do not classify as confirmed here; this stage only finds candidates

---

## 3.4 Reclaim detection contract

### Input
- candle array
- sweep candidates
- settings

### Output

```ts
type ReclaimResult = {
  candidates: Array<
    SweepCandidate & {
      reclaimIndex?: number
      reclaimed: boolean
      failed: boolean
    }
  >
}
```

### Contract rules
- must respect reclaim window
- must distinguish no-reclaim from reclaim
- should not assign confidence yet unless intentionally combined later

---

## 3.5 Confirmation contract

### Input
- candle array
- reclaimed candidate set
- settings

### Output

```ts
type ConfirmationResult = {
  signals: Array<
    SweepSignal & {
      state: 'candidate' | 'reclaimed' | 'confirmed' | 'failed'
    }
  >
}
```

### Contract rules
- should only upgrade state based on explicit logic
- should preserve earlier metrics and level context
- should record why confirmation passed or failed

---

## 3.6 Confidence scoring contract

### Input
- partially classified signals
- scoring-relevant metrics
- settings if needed

### Output
- same signal set with `confidence` assigned

### Contract rules
- keep scoring deterministic
- confidence should come from explicit metrics, not vague intuition
- reasons should remain auditable in UI and tests

---

## 3.7 Explanation payload contract

### Input
- final signal
- intermediate metrics and context

### Output

```ts
type SignalExplanation = {
  title: string
  summary: string
  reasons: string[]
  metrics: Record<string, string | number | boolean>
}
```

### Contract rules
- explanation strings should not require UI reverse engineering
- reasons should align with rules-specification language
- output should be user-readable but grounded in actual logic

---

## 4. Orchestrator contract

The orchestrator connects data loading, detection modules, and UI.

### Input

```ts
type DetectorRunRequest = {
  symbol: string
  timeframe: string
  settings: DetectorSettings
  candles?: Candle[]
}
```

### Output

```ts
type DetectorRunResponse = {
  candles: Candle[]
  swings: SwingDetectionResult
  equalLevels: EqualLevelResult
  signals: SweepSignal[]
  errors: string[]
}
```

### Rules
- if `candles` are supplied, the orchestrator may skip live fetch for testing/fixtures
- response should always be well-shaped even when no signals exist
- errors should be readable and not raw provider internals

---

## 5. Data provider abstraction contract

### Input
- symbol
- timeframe
- optional range/limit

### Output
- raw or normalized candle data depending on provider layer split

Suggested interface:

```ts
interface MarketDataProvider {
  fetchCandles(input: {
    symbol: string
    timeframe: string
    limit?: number
    from?: number
    to?: number
  }): Promise<Candle[]>
}
```

### Rules
- provider must not leak provider-specific shapes beyond this boundary
- malformed responses should become normalized errors
- symbol/timeframe incompatibility should be surfaced clearly

---

## 6. UI-facing annotation contract

The UI should not derive business meaning from raw candles alone.
It should consume structured annotations or signal view models.

Suggested shape:

```ts
type SignalAnnotation = {
  id: string
  direction: 'bullish' | 'bearish'
  state: 'candidate' | 'reclaimed' | 'confirmed' | 'failed'
  levelType: string
  levelPrice: number
  breachIndex: number
  reclaimIndex?: number
  confidence: 'low' | 'medium' | 'high'
  label: string
  colorToken: string
}
```

This helps chart rendering stay simple.

---

## 7. Error contract guidance

Modules should prefer structured failures over thrown surprises when reasonable.

Suggested app-level error shape:

```ts
type AppError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

Use cases:
- invalid candles
- insufficient candles
- unsupported timeframe
- provider timeout
- normalization failure

---

## 8. Recommended implementation order

A fresh Kaino session should implement contracts in this order:
1. Candle and shared domain types
2. provider interface contract
3. swing detection contract
4. equal-level clustering contract
5. sweep candidate contract
6. reclaim contract
7. final signal + explanation contract
8. orchestrator contract
9. annotation view-model contract

---

## 9. Final guidance

If these contracts stay explicit and stable, the MVP becomes much easier to build, test, and evolve.
The most important architectural protection is this:
- provider logic stays separate
- detection logic stays pure
- UI consumes already-structured results

That separation should be preserved from the first implementation commit.

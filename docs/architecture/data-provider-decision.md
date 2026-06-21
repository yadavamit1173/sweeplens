# Data Provider Decision — Liquidity Sweep Detector MVP

## Purpose

This document records the data-provider decision framework for the Liquidity Sweep Detector MVP.
A future Kaino session should use this file before implementing market data ingestion so that provider choice stays deliberate and aligned with MVP scope.

It covers:
- what the data layer must do
- evaluation criteria
- provider categories
- MVP recommendation
- fallback plan
- implementation impact

---

## 1. Why this decision matters

The detector depends on reliable OHLC candle data.
Even a strong detection engine becomes untrustworthy if:
- candles are inconsistent
- timestamps are malformed
- symbol mapping is confusing
- resolution support is weak
- data access is unstable or expensive

For MVP, the goal is not to support every market.
The goal is to choose one narrow, dependable source path that makes the detector implementation possible quickly.

---

## 2. What the MVP data layer must support

At minimum, the selected provider approach should support:
- OHLC candles
- time-ordered responses
- reasonable timeframe granularity
- a stable way to request symbol and timeframe
- a response format that can be normalized easily

Nice-to-have but not mandatory for v1:
- volume
- websocket/live streaming
- broad multi-asset coverage
- enterprise SLAs
- large historical depth

---

## 3. Evaluation criteria

When comparing providers, score them on:

### 3.1 Implementation speed
How quickly can the provider be integrated for a narrow MVP?

### 3.2 Data simplicity
How clean is the response shape for OHLC normalization?

### 3.3 Symbol clarity
How easy is it to map and expose supported symbols in the UI?

### 3.4 Timeframe coverage
Does it support the exact chart resolutions needed for MVP?

### 3.5 Reliability
Is it stable enough for beta usage?

### 3.6 Cost
Can the MVP run with low initial cost?

### 3.7 Future extensibility
Can this path be upgraded later without rewriting the whole app?

---

## 4. Provider categories to consider

## Option A — Static fixture or bundled sample data
Description:
- local JSON fixtures or sample candle files

### Best use
- earliest engineering and QA stage
- deterministic testing
- visual and rule validation

### Pros
- fastest possible start
- no API dependency
- deterministic tests
- zero runtime provider risk

### Cons
- not usable as a real user-facing live product alone
- symbol/timeframe realism limited

### Recommendation
This should exist regardless of the eventual live provider.
Fixtures are not the production provider, but they are essential for early implementation.

---

## Option B — Simple REST market data API
Description:
- app fetches historical candles over HTTP from a provider

### Best use
- first beta version
- narrow market and timeframe support

### Pros
- implementation is straightforward
- enough for detector MVP
- easy to normalize
- cheaper than enterprise-grade feeds

### Cons
- response shapes vary
- rate limits may appear
- symbol coverage may be inconsistent

### Recommendation
This is the best default category for MVP.

---

## Option C — Exchange-native API
Description:
- integrate directly with one exchange or venue

### Best use
- if MVP is intentionally limited to one market such as crypto

### Pros
- direct source
- often free or relatively accessible
- easier if symbol scope is intentionally narrow

### Cons
- market-specific lock-in
- less flexible if product later expands across asset classes
- may require more symbol-specific logic

### Recommendation
A strong choice if the MVP chooses one market only, especially crypto.

---

## Option D — Charting platform feed integration
Description:
- rely on a chart platform or charting vendor feed abstraction

### Best use
- when charting library choice strongly influences data source choice

### Pros
- can reduce custom data plumbing in some setups
- closer to chart-native workflows

### Cons
- may increase vendor coupling
- can complicate future custom logic or pricing

### Recommendation
Reasonable only if chart-library selection makes this path naturally simpler.

---

## Option E — Enterprise/paid market data vendor
Description:
- premium market data provider with commercial contract

### Best use
- later stage
- broader scale or serious B2B ambitions

### Pros
- stronger reliability
- broader coverage
- more mature support

### Cons
- more expensive
- not ideal for a fast MVP unless already justified

### Recommendation
Do not start here unless there is a very specific reason.

---

## 5. Recommended MVP posture

For the Liquidity Sweep Detector MVP, the safest path is:

1. use local fixtures for engine development and QA
2. use one simple live REST or exchange-native provider for beta
3. keep symbol/timeframe support deliberately narrow
4. abstract provider access from day one

This gives:
- low complexity
- fast iteration
- stable testing path
- easier replacement later

---

## 6. Narrow-scope market recommendation

If the team has not yet chosen a market, the decision should be made before live provider integration.

### Safer MVP principle
Pick one of these narrow scopes first:
- one crypto venue and a handful of symbols
- one forex-like source and a small symbol list
- one index/market source with a very small supported set

Avoid trying to support everything at once.

---

## 7. Suggested implementation contract

Even before choosing the live provider, the code should expose a provider interface like:

- fetch candles by symbol
- fetch candles by timeframe
- fetch candles across a requested range or limit
- normalize into internal candle format

### Internal candle format should include
- timestamp
- open
- high
- low
- close
- optional volume
- optional symbol/timeframe metadata if helpful

---

## 8. Recommended phased approach

## Phase 1 — Fixtures only
Use curated JSON candle sets for:
- swing detection testing
- equal-level testing
- sweep and reclaim validation
- chart annotation validation

## Phase 2 — One live provider
Add one real provider for:
- demo environment
- beta chart usage
- basic real-market validation

## Phase 3 — Hardening
Add:
- retry handling
- caching strategy if needed
- error messaging improvements
- optional multiple providers later

---

## 9. Error cases the provider layer must handle

The provider layer should gracefully handle:
- empty response
- malformed candle values
- duplicate timestamps
- unordered candles
- unsupported symbol
- unsupported timeframe
- rate-limit or timeout response

The rest of the app should receive a clean error contract rather than raw provider-specific errors.

---

## 10. Impact on architecture

Provider choice affects:
- normalization complexity
- chart loading states
- settings/symbol UX
- test strategy
- deployment secrets/config

That is why provider integration should sit behind a dedicated abstraction and not leak all over the app.

---

## 11. Recommendation for a fresh Kaino session

Before writing live data code:
1. keep fixture datasets in place
2. finalize initial market scope
3. finalize timeframe scope
4. choose one provider only
5. implement the provider abstraction first
6. normalize data before any detection logic runs

---

## 12. Final recommendation

The MVP should optimize for clarity and implementation speed, not maximum market coverage.

Best decision pattern:
- fixtures for development
- one narrow live provider for beta
- abstraction from day one
- replace or expand later only when needed
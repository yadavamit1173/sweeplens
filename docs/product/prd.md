# Product Requirements Document (PRD) — Liquidity Sweep Detector MVP

## 1. Purpose

This PRD translates the master implementation plan into a product-facing document that a fresh Kaino session, product owner, designer, or engineer can use to understand what must be built, why it matters, and what success looks like.

This product is not a guaranteed trading signal engine. It is a structured chart-analysis tool that helps traders detect likely liquidity sweeps and understand the confirmation state around them.

---

## 2. Product summary

### Working product names
- Liquidity Sweep Detector
- Liquidity Grab Confirmation Tool
- Smart Money Sweep Scanner
- Market Structure Sweep Engine

### One-line value proposition
Detect likely liquidity sweeps using prior highs/lows, reclaim behavior, and market structure confirmation.

### Primary use case
A trader loads a chart, selects a symbol/timeframe, and sees likely bullish or bearish liquidity sweep events marked visually with supporting context and explanation.

---

## 3. Problem statement

Retail traders who follow price action, SMC, or ICT-style concepts often struggle to consistently identify:
- meaningful prior highs and lows
- equal highs and equal lows
- when a breakout is actually a liquidity sweep
- whether reclaim happened fast enough to matter
- whether a sweep is weak, medium, or strong

Because of this, traders:
- enter too early
- chase false breakouts
- misread continuation as reversal
- overfit hindsight on charts

The product should reduce interpretation friction and make sweep logic more structured and repeatable.

---

## 4. Goals and non-goals

## 4.1 Goals

### Product goals
- help users identify likely bullish and bearish liquidity sweeps
- show whether a sweep is reclaimed or unreclaimed
- provide clear confirmation state and confidence
- reduce subjectivity in reading chart structure
- be useful enough for beta traders within 30 days

### Business goals
- launch an MVP in one month
- get initial beta users to test signal usefulness
- collect structured feedback on false positives and missed detections
- create a foundation for later paid tiers

### UX goals
- show signals clearly on chart
- avoid noisy signal spam
- explain why a signal appears
- expose core settings without overwhelming users

## 4.2 Non-goals for MVP
- automatic trade execution
- guaranteed profitability
- broker integrations
- full backtesting engine
- social/community features
- advanced journaling suite
- AI co-pilot in v1

---

## 5. Target users

## Primary users
1. Retail intraday traders
2. Forex/crypto/index traders using liquidity concepts
3. Traders already familiar with SMC/ICT-style terminology
4. Traders who want faster chart interpretation

## Secondary users
1. Trading educators
2. Trading communities
3. Prop-firm challenge traders
4. Traders evaluating setups across a limited watchlist

## Not the initial audience
- complete beginners with no chart knowledge
- institutional desks
- brokers as primary customer for v1

---

## 6. Core user stories

### Chart analysis story
As a trader, I want to see likely liquidity sweep events on a chart so that I can evaluate whether a prior high or low was taken and reclaimed.

### Confirmation story
As a trader, I want the product to tell me whether the sweep is only a candidate or has confirmation so that I do not react too early.

### Clarity story
As a trader, I want to understand why the signal appeared so that I can trust the output instead of blindly following labels.

### Tuning story
As an advanced trader, I want to adjust thresholds and sensitivity so that the detector aligns with my market and timeframe preferences.

---

## 7. Functional requirements

## 7.1 Must-have requirements

### FR1 — Load market data
The system must load normalized OHLC candle data for selected supported symbols and timeframes.

### FR2 — Render chart
The system must render candlestick data in a readable chart workspace.

### FR3 — Detect swing highs and swing lows
The system must identify local swing highs and lows using configurable lookback logic.

### FR4 — Detect equal highs and equal lows
The system must group similar highs or lows within a configurable tolerance threshold.

### FR5 — Detect sweep candidates
The system must identify when price trades beyond a tracked swing or equal-level cluster.

### FR6 — Detect reclaim/rejection
The system must determine whether price returned through the swept level within a configurable candle window.

### FR7 — Apply confirmation logic
The system must classify a sweep as at least one of:
- candidate
- reclaimed
- confirmed
- failed / continuation-likely

### FR8 — Display signal overlays
The system must show levels, sweep points, and signal direction clearly on chart.

### FR9 — Show explanation panel
The system must show machine-readable reasons for the signal, such as:
- prior equal highs swept
- reclaim occurred within 2 candles
- displacement present
- confirmation pending

### FR10 — Support settings
The system must expose core settings for thresholds and detection sensitivity.

## 7.2 Should-have requirements
- session filters
- alert-ready event model
- confidence scoring
- preset configurations by market/timeframe

## 7.3 Nice-to-have requirements
- save user presets
- onboarding walkthrough
- signal history panel
- shareable screenshot annotations

---

## 8. Non-functional requirements

### Performance
- chart interactions should feel responsive for the supported candle range
- detection should rerun only when data or settings change

### Reliability
- malformed or missing data should fail visibly with usable messages
- detection functions should be deterministic for the same inputs and settings

### Explainability
- signals must be accompanied by reasons
- avoid black-box-only output

### Maintainability
- detection modules should remain separated and testable
- settings should be serializable

### Trust
- include visible disclaimer text
- avoid advice-like wording

---

## 9. UX requirements

## Main surfaces
1. Landing page
2. App workspace
3. Explanation/details panel
4. Settings panel
5. Docs/disclaimer area

## Workspace expectations
- chart is primary visual focus
- settings must be accessible but not dominant
- detected levels and events should use clear color coding
- explanation panel should update with selected event

## Recommended signal language
- Bullish sweep candidate
- Bearish sweep candidate
- Reclaimed sweep
- Confirmed bearish reversal setup
- Failed sweep / continuation likely

---

## 10. Success metrics

## Product success metrics for beta
- beta users can understand what the tool is showing without verbal explanation
- at least some detected setups are judged useful by test traders
- false positives are reduced enough that the tool is not dismissed as noise
- users can describe the tool as helping them read charts faster

## Business success metrics for early MVP
- first beta cohort onboarded
- first feedback loop completed
- first pricing hypothesis validated

## Metrics to track later
- charts analyzed per user
- settings usage patterns
- signal clickthrough or inspection rate
- retention by trader type

---

## 11. MVP release scope

## Included in MVP
- limited supported market/timeframe scope
- chart rendering
- detection pipeline v1
- settings for threshold tuning
- clear signal overlays
- explanation panel
- landing page and docs

## Excluded from MVP
- broker integration
- automated trading
- large watchlist scanning
- full subscription platform depth
- social proof systems

---

## 12. Risks and mitigations

### Risk: too many false positives
Mitigation:
- keep confirmation logic configurable
- keep initial market scope narrow
- validate on curated examples before launch

### Risk: users expect perfect prediction
Mitigation:
- clear positioning as probability-based detector
- visible disclaimer
- explanation-driven UI

### Risk: overbuilt v1
Mitigation:
- focus on chart + detection + explanation only
- defer accounts/billing complexity if needed

### Risk: users disagree on what counts as liquidity grab
Mitigation:
- make thresholds explicit and tunable
- document default rules clearly

---

## 13. Release recommendation

For the first public or semi-public MVP, success means:
- the tool works end to end
- the signal output is understandable
- traders can test it on real charts
- feedback can be collected systematically

Do not wait for perfection. Ship a narrow, explainable v1.

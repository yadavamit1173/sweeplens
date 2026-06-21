# Rules Specification — Liquidity Sweep Detector MVP

## Purpose

This document defines the detection rules in implementation-ready detail for the Liquidity Sweep Detector MVP.
It exists to reduce ambiguity before engineering begins.
A fresh Kaino session should use this file when implementing domain logic and when validating whether the detector behaves as intended.

This document focuses on:
- exact conceptual definitions
- default rule flow
- configurable thresholds
- signal states
- examples of valid and invalid detections
- implementation notes for each stage

---

## 1. Core philosophy

The detector should not claim certainty.
It should identify **likely liquidity sweep events** based on explicit, reproducible rule steps.

A good detection rule for MVP should be:
- explainable
- deterministic
- tunable
- visually auditable on chart
- narrow enough to test

The output should answer:
- which level was swept?
- what kind of level was it?
- did reclaim happen?
- is reversal confirmation present?
- how confident is the signal?

---

## 2. Core domain concepts

## 2.1 Swing high
A swing high is a candle high that is greater than the highs of a configurable number of candles on both sides.

### Example concept
If lookback/lookforward is `N = 2`, then a candle is a swing high if:
- its high is greater than the highs of the previous 2 candles
- its high is greater than the highs of the next 2 candles

## 2.2 Swing low
A swing low is a candle low that is lower than the lows of a configurable number of candles on both sides.

## 2.3 Equal highs
Equal highs are two or more highs that fall within a configurable tolerance threshold.
These are treated as a possible buy-side liquidity pool.

## 2.4 Equal lows
Equal lows are two or more lows that fall within a configurable tolerance threshold.
These are treated as a possible sell-side liquidity pool.

## 2.5 Liquidity level
A liquidity level is any tracked level that may be swept.
For MVP this includes:
- swing high
- swing low
- equal highs cluster
- equal lows cluster

## 2.6 Sweep
A sweep occurs when price trades beyond a tracked level.
The detector must distinguish between:
- initial breach only
- breach + reclaim
- breach + reclaim + confirmation
- breach + no reclaim / probable continuation

## 2.7 Reclaim
A reclaim occurs when price moves back through the swept level within a configurable candle window after the breach.

## 2.8 Confirmation
Confirmation is a second-stage validation after reclaim.
For MVP this may include one or more of:
- strong opposite-direction close
- displacement candle
- short-term structure shift
- minimum wick penetration

---

## 3. Supported signal directions

## 3.1 Bearish sweep logic
A bearish sweep is a likely reversal setup after **buy-side liquidity** is taken.

Typical path:
1. prior highs or equal highs exist
2. price trades above them
3. price fails to hold above them
4. price reclaims below the swept zone
5. optional bearish confirmation appears

This is often interpreted as:
- stop hunt above highs
- failed breakout
- possible bearish reversal setup

## 3.2 Bullish sweep logic
A bullish sweep is a likely reversal setup after **sell-side liquidity** is taken.

Typical path:
1. prior lows or equal lows exist
2. price trades below them
3. price fails to hold below them
4. price reclaims above the swept zone
5. optional bullish confirmation appears

---

## 4. Detection pipeline rules

## Step 1 — Precondition: valid candle data
The detector should only run if:
- candle series is time-ordered
- all candles have timestamp/open/high/low/close
- enough candles exist to evaluate swing logic and reclaim window

If not, return a non-fatal no-signal result with a reason.

## Step 2 — Detect structural levels
The detector should first extract:
- swing highs
- swing lows
- equal highs clusters
- equal lows clusters

These levels become eligible sweep targets.

## Step 3 — Choose sweep candidates
A candle becomes a sweep candidate if it breaches a tracked level.

### Bearish sweep candidate
A candle breaches a tracked buy-side liquidity level if:
- its high is above the tracked high/cluster threshold

### Bullish sweep candidate
A candle breaches a tracked sell-side liquidity level if:
- its low is below the tracked low/cluster threshold

## Step 4 — Measure breach quality
The system should record:
- breach magnitude
- whether breach is wick-only or body-assisted
- distance beyond level
- which exact level type was breached

This is important for confidence scoring later.

## Step 5 — Evaluate reclaim
After the breach candle, the detector looks ahead for a limited number of candles.

### Bearish reclaim
The market must close or decisively move back below the swept level within `reclaimWindowCandles`.

### Bullish reclaim
The market must close or decisively move back above the swept level within `reclaimWindowCandles`.

If reclaim does not happen within the allowed window, the event should move toward failed/continuation classification.

## Step 6 — Evaluate confirmation
If reclaim occurs, the detector may apply optional filters.
For MVP, recommended confirmation filters are:
- opposite-direction strong close
- minimum candle body threshold
- optional short-term structure shift

## Step 7 — Assign final state
Final states for MVP:
- candidate
- reclaimed
- confirmed
- failed

## Step 8 — Assign confidence
Confidence should depend on:
- quality of swept level
- size of breach
- reclaim speed
- presence of confirmation
- optional alignment filters

---

## 5. Default rule definitions

These defaults are suggestions for MVP and should remain configurable.

## 5.1 Swing detection defaults
- swing lookback: 3
- swing lookforward: 3

## 5.2 Equal-level tolerance defaults
Tolerance can be expressed in one of these ways:
- percentage threshold
- absolute price distance
- ATR-relative threshold

### Recommended MVP default
Use percentage-based or simple absolute distance first, because it is easier to reason about and debug.

## 5.3 Reclaim defaults
- reclaim window: 1 to 3 candles after breach
- reclaim must be based on close by default for stricter signals
- optional setting: allow wick reclaim mode for looser signals

## 5.4 Minimum breach defaults
A small random tick above/below a level should not always count.
Recommend adding:
- minimum wick penetration threshold
or
- minimum relative breach threshold

## 5.5 Confirmation defaults
Recommended MVP confirmation rule:
- after reclaim, at least one strong opposite-direction candle must appear

Optional later additions:
- micro structure shift
- fair value gap logic
- session filter
- volume spike confirmation

---

## 6. Signal state definitions

## 6.1 Candidate
A candidate signal means:
- price breached a tracked level
- but reclaim and/or confirmation is not yet complete

Use this for early awareness, not high trust.

## 6.2 Reclaimed
A reclaimed signal means:
- price breached a level
- then returned through it within the allowed window
- but confirmation logic may still be partial or minimal

## 6.3 Confirmed
A confirmed signal means:
- breach occurred
- reclaim occurred within the allowed window
- at least one configured confirmation rule passed

## 6.4 Failed
A failed signal means:
- breach occurred
- reclaim did not happen in time
or
- price continued in breach direction strongly enough to invalidate reversal expectation

---

## 7. Confidence scoring guidance

Confidence should be explainable, not magical.
A simple rule-based scoring model is enough for MVP.

## Example scoring inputs

### Positive confidence contributors
- swept level is equal highs/lows cluster rather than isolated weak level
- breach penetration is meaningful, not tiny noise
- reclaim happens quickly
- confirmation candle is strong
- opposite-direction close is decisive

### Negative confidence contributors
- weak or old level
- shallow breach only
- delayed reclaim
- choppy candles around level
- immediate re-breach after reclaim

## Suggested output classes
- low
- medium
- high

---

## 8. Rules by level type

## 8.1 Sweep of swing high
Bearish candidate if:
- candle high exceeds prior swing high
- reclaim below swing high happens in allowed window

## 8.2 Sweep of equal highs
Bearish candidate if:
- candle high exceeds equal-high cluster ceiling
- reclaim below cluster reference level happens in allowed window

## 8.3 Sweep of swing low
Bullish candidate if:
- candle low falls below prior swing low
- reclaim above swing low happens in allowed window

## 8.4 Sweep of equal lows
Bullish candidate if:
- candle low falls below equal-low cluster floor
- reclaim above cluster reference level happens in allowed window

---

## 9. Example scenarios

## 9.1 Valid bearish sweep
- multiple recent highs sit near same price
- current candle trades above them
- next candle closes back below cluster
- following candle is strongly bearish
- result: confirmed bearish sweep

## 9.2 Valid bullish sweep
- prior equal lows exist
- price wicks below them
- next candle closes back above level
- bullish displacement follows
- result: confirmed bullish sweep

## 9.3 False breakout, not yet confirmed
- prior highs swept
- candle closes above highs
- no reclaim in next two candles
- result: candidate then failed

## 9.4 Noisy touch, should not count
- price barely taps one old swing level
- breach magnitude too small
- no real reclaim pattern
- result: ignore or low-confidence candidate depending on settings

---

## 10. Edge cases

The implementation should explicitly consider:
- overlapping equal-level clusters
- multiple sweeps in short sequence
- one candle breaching multiple nearby levels
- insufficient lookforward candles for recent swing labeling
- reclaim happening exactly at window boundary
- gap-like candles in some markets
- very low-volatility chop causing over-detection

---

## 11. Recommended implementation order

A fresh Kaino session should implement the rule engine in this order:
1. candle/domain types
2. swing high/low detection
3. equal-high/equal-low clustering
4. sweep candidate detection
5. reclaim detection
6. signal state classification
7. confidence scoring
8. explanation payload generation

---

## 12. Explanation payload requirements

Every signal should be explainable to UI and to the user.
Suggested payload fields:
- direction
- level type
- swept level price
- breach candle index/time
- reclaim candle index/time
- final state
- confidence
- reasons array

### Example reasons array
- "Swept prior equal highs"
- "Reclaimed below cluster within 2 candles"
- "Bearish confirmation candle detected"
- "Breach penetration exceeded minimum threshold"

---

## 13. Things deliberately excluded from these MVP rules

Do not require these for v1:
- full ICT market structure suite
- order blocks
- fair value gaps as mandatory logic
- execution entries and stop placement
- automated trade recommendations
- broker-specific routing

These may be added later, but should not block v1 implementation.

---

## 14. Open decisions still to finalize

Before or during implementation, confirm:
- exact threshold method for equal levels
- exact reclaim definition: close-based only or wick-based optional
- exact confidence formula
- whether structure-shift confirmation is in v1 or v1.1
- whether volume plays any role in MVP

---

## 15. Recommendation for MVP default posture

For launch, it is safer to be:
- more selective
- more explainable
- less noisy

A stricter detector that users trust is better than a noisy detector that draws labels everywhere.

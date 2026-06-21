# QA Test Cases — Liquidity Sweep Detector MVP

## Purpose

This document defines the QA and validation scenarios for the Liquidity Sweep Detector MVP.
It is intended to help future Kaino sessions test implementation systematically instead of relying on ad hoc chart inspection only.

It covers:
- rule-engine validation scenarios
- UI validation scenarios
- edge cases
- failure handling
- regression priorities

---

## 1. QA philosophy

The MVP should be validated at three levels:
1. domain logic correctness
2. chart annotation correctness
3. user-facing clarity and stability

The goal is not to prove perfect prediction.
The goal is to verify that the implementation behaves consistently with the documented rules.

---

## 2. Test categories

## 2.1 Unit-level detection tests
These confirm individual logic modules behave as expected.

### Areas
- swing high detection
- swing low detection
- equal high clustering
- equal low clustering
- sweep candidate detection
- reclaim detection
- confirmation classification
- confidence scoring
- explanation payload generation

## 2.2 Integration tests
These confirm modules work together.

### Areas
- normalized candles flow through full detector pipeline
- settings changes rerun detection correctly
- provider data errors become app-safe errors
- annotation payloads remain aligned with signal outputs

## 2.3 UI/visual QA
These confirm the workspace renders results in a readable and correct way.

### Areas
- swings render at correct locations
- equal-level zones match cluster data
- sweep markers match breach candles
- reclaim markers match reclaim candles
- selected signal updates explanation panel
- candidate vs confirmed states are clearly distinguishable

---

## 3. Core rule-engine test cases

## TC-01 — Detect a basic swing high
### Purpose
Verify a local maximum becomes a swing high.

### Input expectation
A candle high is greater than highs of configured surrounding candles.

### Expected result
- candle index appears in swing highs
- price matches candle high
- no false swing low recorded for same candle

---

## TC-02 — Detect a basic swing low
### Expected result
- candle index appears in swing lows
- price matches candle low

---

## TC-03 — Do not mark swing when lookforward is insufficient
### Purpose
Prevent unstable labeling on newest candles without enough right-side context.

### Expected result
- latest candles lacking required lookforward are not prematurely marked
- behavior is deterministic and documented

---

## TC-04 — Detect equal highs cluster within tolerance
### Input expectation
Two or more swing highs fall within configured tolerance.

### Expected result
- one equal-highs cluster created
- member indexes preserved
- bounds represent tolerance zone correctly

---

## TC-05 — Do not cluster highs outside tolerance
### Expected result
- separate highs remain separate
- no false equal-high cluster created

---

## TC-06 — Detect equal lows cluster within tolerance
### Expected result
- one equal-lows cluster created
- correct lower/upper bounds present

---

## TC-07 — Detect bearish sweep candidate on prior highs
### Scenario
Price breaches prior swing high or equal-high cluster.

### Expected result
- bearish-direction sweep candidate created
- level type recorded correctly
- breach index is correct candle
- breach magnitude is computed

---

## TC-08 — Detect bullish sweep candidate on prior lows
### Expected result
- bullish-direction sweep candidate created
- swept level is correct

---

## TC-09 — Mark reclaim within allowed window
### Scenario
After breach, price closes back through swept threshold within configured reclaim window.

### Expected result
- candidate marked `reclaimed: true`
- reclaim index stored correctly
- signal state later eligible for `reclaimed` or `confirmed`

---

## TC-10 — Fail candidate when no reclaim occurs in time
### Expected result
- candidate marked failed
- no reclaim index stored
- final state becomes `failed` or equivalent pipeline result

---

## TC-11 — Distinguish wick breach from stronger breach
### Purpose
Ensure breach quality metrics are recorded for scoring.

### Expected result
- wick-only flag correct
- breach magnitude reflects candle structure

---

## TC-12 — Confirmation upgrades reclaimed signal
### Scenario
Reclaimed signal also passes configured confirmation rule(s).

### Expected result
- final state becomes `confirmed`
- reasons include confirmation rationale
- metrics include confirmation-related flags

---

## TC-13 — Reclaimed but unconfirmed stays reclaimed
### Expected result
- final state stays `reclaimed`
- no false upgrade to `confirmed`

---

## TC-14 — Confidence scoring assigns low/medium/high deterministically
### Expected result
- same inputs always produce same confidence
- score reasons align with rule quality

---

## TC-15 — Explanation payload reflects actual reasons
### Expected result
- reasons array references actual detected conditions
- no generic or misleading explanation text

---

## 4. Integrated pipeline scenarios

## TC-16 — Full bearish sweep flow
### Scenario
Fixture contains:
- prior highs
- sweep above highs
- reclaim below highs
- bearish confirmation

### Expected result
- swings detected
- equal highs or swing high tracked
- candidate created
- reclaim detected
- final confirmed bearish signal returned
- explanation populated

---

## TC-17 — Full bullish sweep flow
### Expected result
- mirrored positive flow for bullish case

---

## TC-18 — Failed sweep flow
### Scenario
Price breaches level and continues without reclaim.

### Expected result
- candidate created first if applicable
- final signal marked failed or filtered according to settings
- no misleading confirmed signal shown

---

## TC-19 — Noisy range should not flood signals
### Purpose
Ensure selective behavior in chop.

### Expected result
- signal count remains controlled
- weak taps do not generate excessive candidates under default settings

---

## TC-20 — Settings change affects output predictably
### Scenario
User changes tolerance, reclaim window, or min breach threshold.

### Expected result
- detector reruns
- signals update without reload
- outputs change in ways consistent with rules

---

## 5. UI and annotation test cases

## TC-21 — Swings render on correct candles
### Expected result
- swing high marker aligns to candle high
- swing low marker aligns to candle low

---

## TC-22 — Equal-level zones render with correct bounds
### Expected result
- displayed zone reflects cluster lower/upper bounds
- zone is not drawn as a misleading exact line when tolerance exists

---

## TC-23 — Sweep marker appears on breach candle
### Expected result
- marker anchored to correct candle
- direction and label match signal direction

---

## TC-24 — Reclaim marker appears on reclaim candle
### Expected result
- reclaim marker not shown when no reclaim exists
- reclaim marker aligns with reclaim index

---

## TC-25 — Candidate vs confirmed visual distinction is clear
### Expected result
- candidate has subdued styling
- confirmed has stronger styling
- users can visually distinguish state at a glance

---

## TC-26 — Clicking a signal updates explanation panel
### Expected result
- selected signal highlighted
- explanation panel shows reasons, confidence, timestamps, and level info

---

## TC-27 — Toggling annotation layers changes visibility only
### Expected result
- turning structure layers off hides them visually
- underlying signal logic does not change unless settings changed intentionally

---

## 6. Error and resilience cases

## TC-28 — Empty data response
### Expected result
- readable empty/error state shown
- no crash
- detector returns safe empty result

---

## TC-29 — Malformed candle data
### Expected result
- validation catches issue
- user sees readable error
- raw malformed data does not break UI unexpectedly

---

## TC-30 — Unsupported symbol/timeframe
### Expected result
- clear app-level error returned
- no silent broken chart state

---

## TC-31 — Insufficient candles for detection
### Expected result
- detector returns no-signal or insufficient-data state
- UI communicates clearly

---

## 7. Edge-case scenarios

These are especially important once implementation exists.

## TC-32 — One candle breaches multiple nearby levels
### Expected result
- policy is deterministic
- either multiple candidate links are preserved or one chosen level is documented clearly

## TC-33 — Overlapping equal-level clusters
### Expected result
- clustering logic resolves overlap consistently

## TC-34 — Reclaim exactly at window boundary
### Expected result
- boundary behavior matches documented rule

## TC-35 — Consecutive sweeps in short sequence
### Expected result
- signals do not corrupt one another
- indexes and reasons remain correct

---

## 8. Regression priorities

After each meaningful implementation change, re-check at minimum:
1. one bullish valid fixture
2. one bearish valid fixture
3. one failed sweep fixture
4. one noisy/no-signal fixture
5. one UI selection/explanation flow

This is the minimum focused regression set.

---

## 9. Manual QA checklist for a fresh Kaino session

Before calling the MVP usable, confirm:
- detector outputs make sense on known fixtures
- UI labels match signal state
- explanation panel reflects actual rule reasons
- settings produce understandable changes
- error states are readable
- chart remains usable without annotation overload

---

## 10. Final guidance

The detector should be tested as an explainable rules engine, not judged only by hindsight screenshots.
A good QA process for this MVP proves:
- the rules were implemented faithfully
- the UI presents them accurately
- the system behaves predictably under normal and edge cases

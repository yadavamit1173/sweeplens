# 30-Day Sprint Plan — Liquidity Sweep Detector MVP

## Purpose

This document turns the MVP plan into a practical 30-day delivery sequence.
It is written so that a fresh Kaino session can continue execution without re-planning from scratch.

---

## Assumptions

- Single focused builder or very small team
- AI-assisted coding available
- Scope remains limited to MVP
- Web-based app remains the default implementation target
- Initial market/timeframe support stays intentionally narrow

---

## Success definition for day 30

By day 30, the project should ideally have:
- working chart workspace
- normalized candle input
- swing/equal-level/sweep detection pipeline
- basic explanation panel
- editable settings panel
- landing page
- disclaimer/docs
- beta-ready build for review and feedback

---

## Week 1 — Product rules and technical foundations

### Goals
- freeze core rules
- reduce ambiguity
- start project setup
- define technical contracts

### Deliverables
- finalized liquidity sweep rule definitions
- supported market/timeframe decision
- settings model
- domain types
- data provider interface
- project scaffold

### Suggested tasks
1. finalize bullish and bearish sweep definitions
2. finalize reclaim rules and time window assumptions
3. document confirmation states
4. define candle and signal types
5. scaffold app structure
6. create provider abstraction

### End-of-week checkpoint
A fresh engineer should be able to answer:
- what exactly counts as a sweep?
- what data shape enters the detector?
- what result shape exits the detector?

---

## Week 2 — Core detection engine

### Goals
- implement pure detection logic
- validate on curated examples
- keep logic explainable

### Deliverables
- swing detection module
- equal-level clustering module
- sweep candidate detector
- reclaim logic
- basic confirmation states
- test fixtures

### Suggested tasks
1. implement swing high/low detection
2. implement equal highs/lows clustering
3. implement sweep breach detection
4. implement reclaim detection within configured window
5. classify candidate/reclaimed/failed states
6. create curated bullish/bearish/noise fixtures

### End-of-week checkpoint
The detector should produce structured outputs for known examples even if the UI is still basic.

---

## Week 3 — Chart UI, explanation panel, and settings

### Goals
- make the detector visible and usable
- connect settings to recalculation
- improve interpretability

### Deliverables
- chart workspace shell
- candle rendering
- overlays for swings, equal levels, and sweeps
- settings panel
- explanation/details panel
- confidence display

### Suggested tasks
1. build app workspace layout
2. render candles and handle loading/error states
3. render structure and signal overlays
4. build settings controls for threshold tuning
5. rerun detector when settings change
6. display machine-readable explanation reasons

### End-of-week checkpoint
A beta user should be able to load the workspace and understand why a signal appears.

---

## Week 4 — Polish, validation, docs, and beta readiness

### Goals
- reduce obvious false positives
- improve messaging and trust
- prepare for beta use

### Deliverables
- landing page
- disclaimer/docs surfaces
- validation on curated examples
- bug fixes
- known limitations list
- beta release checklist

### Suggested tasks
1. build landing page with clear positioning
2. add visible disclaimers and limitation language
3. validate detector against curated examples
4. tune thresholds/defaults
5. document known weak spots
6. prepare feedback collection path

### End-of-week checkpoint
The project should be demoable end-to-end and usable for controlled beta feedback.

---

## Daily execution guidance

For a solo builder, each day should end with:
- one concrete working increment
- one updated doc/checkpoint
- one clear next task

Avoid spending full days on design polish before the detection engine is usable.

---

## Scope control reminders

Do not let these enter the 30-day MVP unless the detector is already stable:
- broker integrations
- trade execution
- advanced backtesting
- social/community features
- large-scale multi-symbol scanning
- complex billing systems

---

## Recommended priorities if time gets tight

If compression is required, preserve these in order:
1. detection engine correctness
2. explanation clarity
3. chart visualization
4. settings tuning
5. landing page polish
6. advanced extras

---

## Notes for future Kaino sessions

If implementation starts and the schedule changes, this plan should be updated instead of silently drifting.
The sprint plan is meant to remain an accurate execution artifact, not a static wish list.

# Jira Breakdown — Liquidity Sweep Detector MVP

## Purpose

This document converts the implementation plan into Jira-ready execution structure.
It is meant to help a fresh Kaino session or delivery owner quickly create epics, stories, and tasks.

---

## 1. Recommended Jira structure

Recommended hierarchy:
- Epic
- Story
- Task / Subtask

Recommended Jira epics for MVP:
1. Product Definition and Rules
2. Project Setup and Foundations
3. Market Data and Normalization
4. Detection Engine
5. Chart UI and Workspace
6. Explanation and Settings
7. Marketing Site and Docs
8. QA and Launch Readiness

---

## 2. Epic breakdown

## Epic 1 — Product Definition and Rules

### Story 1.1 — Finalize liquidity sweep rule definitions
Acceptance criteria:
- bullish sweep definition documented
- bearish sweep definition documented
- reclaim rule documented
- confirmation rule documented
- known ambiguities captured

### Story 1.2 — Finalize supported MVP market/timeframe scope
Acceptance criteria:
- initial market documented
- initial timeframe options documented
- unsupported cases explicitly noted

### Story 1.3 — Finalize settings model
Acceptance criteria:
- tunable settings documented
- default values proposed
- safe ranges proposed

---

## Epic 2 — Project Setup and Foundations

### Story 2.1 — Initialize application structure
Acceptance criteria:
- app scaffold created
- docs linked from project root if applicable
- TypeScript configured
- linting configured

### Story 2.2 — Define domain types
Acceptance criteria:
- candle type defined
- swing point type defined
- equal-level cluster type defined
- signal output type defined
- settings type defined

### Story 2.3 — Define application orchestration boundaries
Acceptance criteria:
- data provider interface defined
- detection pipeline orchestration file created
- settings flow documented in code comments or docs

---

## Epic 3 — Market Data and Normalization

### Story 3.1 — Implement market data provider interface
Acceptance criteria:
- provider contract exists
- provider returns normalized candle structure
- provider errors handled cleanly

### Story 3.2 — Implement normalization layer
Acceptance criteria:
- raw provider response converted into internal candle shape
- timestamps normalized consistently
- edge cases handled for malformed data

### Story 3.3 — Prepare fixture dataset for testing
Acceptance criteria:
- sample bullish sweep cases included
- sample bearish sweep cases included
- neutral/noise cases included

---

## Epic 4 — Detection Engine

### Story 4.1 — Implement swing high/low detection
Acceptance criteria:
- local swing highs detected correctly
- local swing lows detected correctly
- configurable lookback supported
- tests cover basic cases

### Story 4.2 — Implement equal highs/lows clustering
Acceptance criteria:
- tolerance-based clustering works
- equal highs identified
- equal lows identified
- tests cover threshold behavior

### Story 4.3 — Implement sweep candidate detection
Acceptance criteria:
- sweep beyond swing highs/lows can be detected
- sweep beyond equal-level clusters can be detected
- direction classification works

### Story 4.4 — Implement reclaim detection
Acceptance criteria:
- reclaim window configurable
- reclaimed vs unreclaimed events distinguished
- tests cover timing edge cases

### Story 4.5 — Implement confirmation logic
Acceptance criteria:
- candidate / reclaimed / confirmed / failed states supported
- optional filters can be toggled
- output remains deterministic

### Story 4.6 — Implement confidence scoring
Acceptance criteria:
- low/medium/high confidence supported
- reasons behind confidence available to UI

---

## Epic 5 — Chart UI and Workspace

### Story 5.1 — Build chart workspace shell
Acceptance criteria:
- chart area exists
- symbol/timeframe controls exist
- side panel layout exists

### Story 5.2 — Render candle data
Acceptance criteria:
- candles render correctly
- empty/loading/error states handled

### Story 5.3 — Render structure overlays
Acceptance criteria:
- swing markers render
- equal-level markers render
- sweep markers render

### Story 5.4 — Render signal state overlays
Acceptance criteria:
- candidate vs confirmed states visually distinguishable
- bullish and bearish states color coded

---

## Epic 6 — Explanation and Settings

### Story 6.1 — Build settings panel
Acceptance criteria:
- core settings editable in UI
- safe ranges enforced
- defaults resettable

### Story 6.2 — Connect settings to detection reruns
Acceptance criteria:
- changing settings updates results
- no full page reload needed

### Story 6.3 — Build explanation/details panel
Acceptance criteria:
- selected signal shows structured reasons
- signal metadata visible
- confidence visible

---

## Epic 7 — Marketing Site and Docs

### Story 7.1 — Build landing page
Acceptance criteria:
- headline and positioning present
- screenshots or placeholders present
- CTA present

### Story 7.2 — Build docs/disclaimer surfaces
Acceptance criteria:
- disclaimer visible
- product explanation visible
- misuse risk reduced via wording

### Story 7.3 — Link docs structure for future sessions
Acceptance criteria:
- docs index updated
- handoff path documented

---

## Epic 8 — QA and Launch Readiness

### Story 8.1 — Validate curated test examples
Acceptance criteria:
- bullish examples reviewed
- bearish examples reviewed
- false-positive examples reviewed

### Story 8.2 — Run focused regression checks
Acceptance criteria:
- no major UI regressions
- no obvious detection crashes
- invalid settings handled

### Story 8.3 — Prepare beta release checklist
Acceptance criteria:
- launch checklist documented
- feedback collection path documented
- known limitations documented

---

## 3. Suggested story point ranges

Typical sizing:
- Small: 1–2 points
- Medium: 3 points
- Complex: 5 points
- Uncertain/high complexity: 8 points

Estimated MVP total:
- Lean implementation: 35–60 points
- More polished MVP: 60–90 points

---

## 4. Sequencing recommendation

Suggested build order:
1. Product Definition and Rules
2. Project Setup and Foundations
3. Market Data and Normalization
4. Detection Engine
5. Chart UI and Workspace
6. Explanation and Settings
7. Marketing Site and Docs
8. QA and Launch Readiness

---

## 5. Notes for Kaino

If a future Kaino session turns this into actual Jira tickets, each story should be expanded with:
- technical notes
- dependencies
- explicit priority
- assignee
- estimate
- definition of done

# Detailed Jira Tickets — Liquidity Sweep Detector Product

## Purpose

This document expands the higher-level Jira breakdown into a much deeper execution-ready planning artifact.
It is intended for:
- full end-to-end project execution
- implementation sequencing
- engineering ownership
- QA alignment
- future Kaino session continuity
- eventual transfer into Jira with minimal reinterpretation

This file should be treated as the primary detailed Jira planning source once delivery begins.

---

## 1. Recommended Jira hierarchy

Recommended structure:
- Epic
- Story
- Task
- Subtask

Recommended fields in Jira:
- Title
- Description
- Acceptance criteria
- Dependencies
- Priority
- Estimate / story points
- Notes / implementation references
- QA notes

Suggested labels:
- `architecture`
- `market-data`
- `detection-engine`
- `ui`
- `chart`
- `settings`
- `docs`
- `qa`
- `launch`
- `technical-debt`

---

## 2. Delivery philosophy

This project should not be managed like a shallow landing-page build.
It has a meaningful domain core, so Jira should reflect:
- technical sequencing
- domain correctness
- validation discipline
- UI trust and readability
- future extensibility

The most important implementation principle is:
**do not start by building pretty UI before contracts, data normalization, and detector logic are stable enough.**

---

## 3. Epic summary

Recommended full end-to-end epics:
1. Product Scope and Domain Rule Finalization
2. Repository Setup and Engineering Foundations
3. Market Data Layer and Normalization
4. Core Domain Detection Engine
5. Detector Explanation and View-Model Layer
6. Workspace Shell and App State
7. Chart Rendering and Annotation Layer
8. Settings, Controls, and Interactions
9. QA Fixtures, Validation, and Regression Safety
10. Marketing Site, Docs, and Disclaimer Surfaces
11. Beta Readiness, Packaging, and Launch Preparation
12. Post-MVP Productization Foundations

---

# Epic 1 — Product Scope and Domain Rule Finalization

## Objective
Remove ambiguity from product behavior before deep implementation begins.

### Story 1.1 — Finalize supported market scope
**Description**
Define the initial market(s) the product will support in first implementation.

**Acceptance criteria**
- primary market documented
- unsupported markets documented
- symbol scope documented
- rationale captured in docs

**Suggested subtasks**
- compare crypto vs forex vs indices for MVP fit
- document chosen market and why
- list initial supported symbols
- document explicitly unsupported symbol categories

**Dependencies**
- none

**Estimate**
- 3 points

---

### Story 1.2 — Finalize supported timeframe scope
**Acceptance criteria**
- initial timeframe list documented
- unsupported timeframes documented
- rule engine assumptions around timeframe sensitivity noted

**Suggested subtasks**
- identify likely trader timeframes
- document initial supported intervals
- record reasons for exclusions

**Estimate**
- 2 points

---

### Story 1.3 — Finalize liquidity sweep rule definitions
**Acceptance criteria**
- bullish sweep documented
- bearish sweep documented
- reclaim rule documented
- candidate/reclaimed/confirmed/failed states documented
- ambiguous cases captured

**Suggested subtasks**
- review rules-specification.md
- resolve open definition decisions
- lock v1 rule assumptions
- add examples for valid and invalid sweeps

**References**
- `docs/product/rules-specification.md`

**Estimate**
- 5 points

---

### Story 1.4 — Finalize settings model and safe defaults
**Acceptance criteria**
- configurable settings list approved
- default values proposed
- safe ranges documented
- aggressive vs strict settings posture discussed

**Suggested subtasks**
- list all v1 settings
- mark must-have vs optional settings
- propose conservative launch defaults
- document settings validation rules

**Estimate**
- 3 points

---

### Story 1.5 — Finalize signal annotation language
**Acceptance criteria**
- final user-facing terms chosen for candidate/reclaimed/confirmed/failed states
- bullish and bearish language standardized
- explanation labels aligned with UI and docs

**References**
- `docs/product/chart-annotation-guide.md`

**Estimate**
- 2 points

---

# Epic 2 — Repository Setup and Engineering Foundations

## Objective
Create clean project foundations that preserve modular architecture.

### Story 2.1 — Scaffold application repository
**Acceptance criteria**
- app scaffold exists
- TypeScript configured
- linting configured
- formatting conventions set
- docs accessible from repository

**Suggested subtasks**
- initialize Next.js app
- enable TypeScript strictness as appropriate
- configure ESLint
- configure formatting baseline
- add root README pointer to docs

**Estimate**
- 3 points

---

### Story 2.2 — Create repository folder structure
**Acceptance criteria**
- `app/`, `components/`, `lib/`, `tests/`, and `docs/` structure exists
- engineering structure aligns with docs guidance

**Suggested subtasks**
- create route folders
- create component domains
- create detection/data/app lib folders
- create tests layout

**References**
- `docs/engineering/file-structure.md`

**Estimate**
- 3 points

---

### Story 2.3 — Define foundational domain types
**Acceptance criteria**
- candle type exists
- swing point type exists
- equal-level cluster type exists
- settings type exists
- sweep candidate and final signal types exist

**Suggested subtasks**
- define normalized candle model
- define swing model
- define cluster model
- define signal state enums/types
- define app error types

**References**
- `docs/engineering/module-contracts.md`

**Estimate**
- 5 points

---

### Story 2.4 — Define application orchestration contracts
**Acceptance criteria**
- detector request/response contract exists
- provider interface exists
- annotation view-model contract exists

**Suggested subtasks**
- define detector request shape
- define detector response shape
- define provider interface contract
- define signal annotation/view-model shape

**Estimate**
- 5 points

---

### Story 2.5 — Add baseline test harness and fixture loading support
**Acceptance criteria**
- unit test framework configured
- fixture files can be loaded in tests
- one sample detection test passes

**Estimate**
- 3 points

---

# Epic 3 — Market Data Layer and Normalization

## Objective
Create a stable and replaceable market data foundation.

### Story 3.1 — Implement candle validation and guards
**Acceptance criteria**
- malformed candles rejected safely
- unordered candles handled or reported
- invalid numeric values rejected

**Suggested subtasks**
- implement candle guard utilities
- create validation error messages
- add tests for malformed data cases

**Estimate**
- 3 points

---

### Story 3.2 — Implement normalization pipeline
**Acceptance criteria**
- raw provider response converted into normalized candles
- timestamp normalization consistent
- high/low sanity enforced

**Suggested subtasks**
- create normalization function
- add mapping tests
- add malformed input tests

**Estimate**
- 5 points

---

### Story 3.3 — Implement fixture-based data source
**Acceptance criteria**
- local fixtures can be loaded as candle input
- fixtures cover bullish, bearish, failed, and noisy cases
- fixtures usable by tests and local workspace

**Estimate**
- 3 points

---

### Story 3.4 — Implement provider abstraction
**Acceptance criteria**
- provider interface implemented
- app can switch between fixture and live provider source path
- provider errors normalized at boundary

**Estimate**
- 5 points

---

### Story 3.5 — Implement first live market data provider
**Acceptance criteria**
- one selected provider integrated
- symbol and timeframe mapping documented
- provider fetch returns normalized candles
- unsupported symbol/timeframe errors are readable

**Dependencies**
- Stories 1.1, 1.2, 3.2, 3.4

**Estimate**
- 8 points

---

### Story 3.6 — Implement symbol and timeframe configuration registry
**Acceptance criteria**
- supported symbols defined centrally
- supported timeframes defined centrally
- UI can consume these configs later

**Estimate**
- 2 points

---

# Epic 4 — Core Domain Detection Engine

## Objective
Build the product’s domain moat as pure, testable modules.

### Story 4.1 — Implement swing high detection
**Acceptance criteria**
- swing highs identified correctly for configured lookback
- insufficient lookforward handled consistently
- tests cover normal and edge cases

**Suggested subtasks**
- implement high comparison logic
- handle trailing candles without enough lookforward
- add unit tests

**Estimate**
- 5 points

---

### Story 4.2 — Implement swing low detection
**Acceptance criteria**
- swing lows identified correctly
- tests cover normal and edge cases

**Estimate**
- 5 points

---

### Story 4.3 — Implement equal highs clustering
**Acceptance criteria**
- equal highs grouped within tolerance
- cluster bounds deterministic
- member indexes preserved

**Estimate**
- 5 points

---

### Story 4.4 — Implement equal lows clustering
**Acceptance criteria**
- equal lows grouped within tolerance
- cluster bounds deterministic
- member indexes preserved

**Estimate**
- 5 points

---

### Story 4.5 — Implement sweep candidate detection against swing levels
**Acceptance criteria**
- breaches of swing highs/lows detected
- direction classified correctly
- breach metrics recorded

**Estimate**
- 5 points

---

### Story 4.6 — Implement sweep candidate detection against equal-level clusters
**Acceptance criteria**
- breaches of equal highs/equal lows detected
- level type recorded correctly
- overlapping cluster policy is deterministic

**Estimate**
- 5 points

---

### Story 4.7 — Implement reclaim detection logic
**Acceptance criteria**
- reclaim window respected
- reclaimed and failed candidate outcomes distinguished
- boundary behavior documented and tested

**Estimate**
- 5 points

---

### Story 4.8 — Implement confirmation logic
**Acceptance criteria**
- confirmation stage upgrades only eligible reclaimed signals
- optional checks configurable
- output deterministic

**Suggested subtasks**
- implement close-strength or displacement check
- implement optional structure-shift placeholder or full rule if included
- add tests for confirmed vs reclaimed-only outcomes

**Estimate**
- 8 points

---

### Story 4.9 — Implement confidence scoring
**Acceptance criteria**
- low/medium/high confidence supported
- confidence depends on documented rule factors
- output reasons are available downstream

**Estimate**
- 5 points

---

### Story 4.10 — Implement explanation payload generation
**Acceptance criteria**
- every final signal has explanation reasons
- reasons align with actual rule path
- explanation payload is UI-ready

**Estimate**
- 5 points

---

### Story 4.11 — Implement detector pipeline index/orchestrated domain entry
**Acceptance criteria**
- one domain entrypoint composes swing -> equal levels -> sweep -> reclaim -> confirm -> score -> explain
- no UI dependency inside detector pipeline

**Estimate**
- 5 points

---

# Epic 5 — Detector Explanation and View-Model Layer

## Objective
Translate domain signals into chart/UI-ready structures cleanly.

### Story 5.1 — Define signal annotation view-model
**Acceptance criteria**
- annotation contract supports chart needs
- candidate/reclaimed/confirmed/failed styles can map from view-model
- no business meaning needs to be invented in UI

**Estimate**
- 3 points

---

### Story 5.2 — Build domain-to-annotation mapper
**Acceptance criteria**
- signals convert cleanly into chart annotations
- labels and color tokens generated consistently
- signal metadata remains linked for selection

**Estimate**
- 5 points

---

### Story 5.3 — Build explanation panel payload formatter
**Acceptance criteria**
- explanation panel receives structured display data
- timestamps, prices, reasons, confidence, and state are included

**Estimate**
- 3 points

---

# Epic 6 — Workspace Shell and App State

## Objective
Build the shell that hosts the detector workflow.

### Story 6.1 — Build workspace route and layout shell
**Acceptance criteria**
- workspace page exists
- chart area placeholder exists
- settings and explanation panel regions exist

**Estimate**
- 3 points

---

### Story 6.2 — Implement workspace state model
**Acceptance criteria**
- selected symbol state exists
- selected timeframe state exists
- detector settings state exists
- selected signal state exists
- loading/error state exists

**Estimate**
- 5 points

---

### Story 6.3 — Implement detector orchestration in workspace flow
**Acceptance criteria**
- workspace can request data
- workspace can run detector
- workspace stores and exposes resulting signals and annotations

**Estimate**
- 5 points

---

### Story 6.4 — Implement empty/loading/error workspace states
**Acceptance criteria**
- loading visible during fetch/run
- empty state shown when no signals or no data
- errors displayed clearly without crash

**Estimate**
- 3 points

---

# Epic 7 — Chart Rendering and Annotation Layer

## Objective
Render market data and structured annotations clearly and accurately.

### Story 7.1 — Select and integrate charting library
**Acceptance criteria**
- charting library chosen and documented
- basic candlestick chart renders
- library fits overlay needs

**Estimate**
- 5 points

---

### Story 7.2 — Render normalized candle data on chart
**Acceptance criteria**
- candles display correctly
- time axis aligns with candle timestamps
- empty/error handling coexists with chart container

**Estimate**
- 5 points

---

### Story 7.3 — Render swing markers
**Acceptance criteria**
- swing highs and swing lows shown at correct candle locations
- styling remains subtle and readable

**Estimate**
- 3 points

---

### Story 7.4 — Render equal-level zones
**Acceptance criteria**
- equal highs/equal lows visual zones align with cluster bounds
- cluster zones do not mislead as exact single-price lines when tolerance exists

**Estimate**
- 5 points

---

### Story 7.5 — Render sweep breach markers
**Acceptance criteria**
- breach marker appears on correct candle
- bullish and bearish directions distinguishable
- candidate markers visually lower confidence than confirmed

**Estimate**
- 5 points

---

### Story 7.6 — Render reclaim markers
**Acceptance criteria**
- reclaim marker appears only when reclaim exists
- reclaim visual state distinct from candidate and confirmed

**Estimate**
- 3 points

---

### Story 7.7 — Render final signal state labels
**Acceptance criteria**
- candidate, reclaimed, confirmed, and failed states visually distinct
- labels match approved terminology

**Estimate**
- 5 points

---

### Story 7.8 — Implement signal selection behavior
**Acceptance criteria**
- clicking or hovering a signal updates selected state
- selected signal is highlighted
- explanation panel updates correctly

**Estimate**
- 5 points

---

### Story 7.9 — Implement chart overlay visibility toggles
**Acceptance criteria**
- users can show/hide swings
- users can show/hide equal levels
- users can choose whether failed signals appear
- visual toggles do not mutate detector logic unintentionally

**Estimate**
- 3 points

---

# Epic 8 — Settings, Controls, and Interactions

## Objective
Make the detector tunable and usable without breaking determinism.

### Story 8.1 — Build symbol selector UI
**Acceptance criteria**
- supported symbols can be chosen
- unsupported symbols cannot be selected

**Estimate**
- 2 points

---

### Story 8.2 — Build timeframe selector UI
**Acceptance criteria**
- supported timeframes selectable
- current timeframe visible clearly

**Estimate**
- 2 points

---

### Story 8.3 — Build settings panel UI
**Acceptance criteria**
- core detector settings editable
- defaults clear
- ranges constrained safely

**Estimate**
- 5 points

---

### Story 8.4 — Connect settings changes to controlled detector reruns
**Acceptance criteria**
- changing a setting reruns detector correctly
- no full page reload required
- stale state does not leak into next run

**Estimate**
- 5 points

---

### Story 8.5 — Add reset-to-default behavior
**Acceptance criteria**
- settings can be reset to documented defaults
- rerun behavior after reset is correct

**Estimate**
- 2 points

---

### Story 8.6 — Add overlay/visibility preferences controls
**Acceptance criteria**
- chart layer visibility controls accessible
- controls reflect current state reliably

**Estimate**
- 2 points

---

# Epic 9 — QA Fixtures, Validation, and Regression Safety

## Objective
Build systematic validation around documented rules.

### Story 9.1 — Create curated bullish fixture set
**Acceptance criteria**
- at least one valid bullish sweep fixture exists
- expected outcomes documented

**Estimate**
- 2 points

---

### Story 9.2 — Create curated bearish fixture set
**Acceptance criteria**
- at least one valid bearish sweep fixture exists
- expected outcomes documented

**Estimate**
- 2 points

---

### Story 9.3 — Create failed-sweep fixture set
**Acceptance criteria**
- at least one failed sweep fixture exists
- expected failed-state outcome documented

**Estimate**
- 2 points

---

### Story 9.4 — Create noisy/no-signal fixture set
**Acceptance criteria**
- at least one noisy market fixture exists
- expected no-signal or low-signal behavior documented

**Estimate**
- 2 points

---

### Story 9.5 — Add unit tests for swing and clustering logic
**Acceptance criteria**
- swing tests exist
- clustering tests exist
- edge cases covered

**Estimate**
- 5 points

---

### Story 9.6 — Add unit tests for sweep, reclaim, and confirmation logic
**Acceptance criteria**
- candidate detection tests exist
- reclaim tests exist
- confirmation tests exist
- boundary cases covered

**Estimate**
- 8 points

---

### Story 9.7 — Add tests for confidence and explanation payloads
**Acceptance criteria**
- confidence tests deterministic
- explanation reasons validated

**Estimate**
- 3 points

---

### Story 9.8 — Add integration tests for full detector pipeline
**Acceptance criteria**
- fixture data flows through full pipeline
- expected final signal states produced

**Estimate**
- 5 points

---

### Story 9.9 — Add integration tests for workspace rerun behavior
**Acceptance criteria**
- settings change triggers rerun
- selected symbol/timeframe changes handled
- error and loading transitions safe

**Estimate**
- 5 points

---

### Story 9.10 — Create manual QA checklist for chart annotation correctness
**Acceptance criteria**
- manual QA sheet covers structure markers, sweep markers, selection behavior, and explanation panel alignment

**References**
- `docs/qa/test-cases.md`

**Estimate**
- 2 points

---

# Epic 10 — Marketing Site, Docs, and Disclaimer Surfaces

## Objective
Give the product a trustworthy external face and internal guidance surfaces.

### Story 10.1 — Build landing page shell
**Acceptance criteria**
- headline, value proposition, and CTA exist
- product explained without hype language

**Estimate**
- 3 points

---

### Story 10.2 — Build feature and methodology sections
**Acceptance criteria**
- product workflow explained
- candidate/reclaim/confirmation logic summarized clearly

**Estimate**
- 3 points

---

### Story 10.3 — Add disclaimer and FAQ surfaces
**Acceptance criteria**
- no-advice disclaimer visible
- risk language present
- FAQ reduces misuse and confusion

**Estimate**
- 3 points

---

### Story 10.4 — Add workspace help / methodology entry point
**Acceptance criteria**
- user can access brief interpretation guidance from product UI
- chart labels and states explained

**Estimate**
- 3 points

---

### Story 10.5 — Add docs pointers for engineering continuity if repo contains docs
**Acceptance criteria**
- root readme or equivalent points to docs start path
- fresh-session continuity remains obvious

**Estimate**
- 2 points

---

# Epic 11 — Beta Readiness, Packaging, and Launch Preparation

## Objective
Prepare the product for controlled external usage.

### Story 11.1 — Define beta cohort and feedback mechanism
**Acceptance criteria**
- beta target profile documented
- feedback path defined
- feedback questions structured

**Estimate**
- 2 points

---

### Story 11.2 — Add lightweight beta gating or access flow if needed
**Acceptance criteria**
- beta access path documented or implemented
- public/private posture clear

**Estimate**
- 3 points

---

### Story 11.3 — Prepare launch screenshots and demo flows
**Acceptance criteria**
- at least one bullish and one bearish example prepared for demonstration
- chart readability acceptable in screenshots

**Estimate**
- 2 points

---

### Story 11.4 — Prepare known limitations document
**Acceptance criteria**
- unsupported markets/timeframes noted
- known false-positive or rule-boundary areas noted

**Estimate**
- 2 points

---

### Story 11.5 — Prepare pricing/packaging decision for first release
**Acceptance criteria**
- first launch pricing posture decided
- early-access vs subscription decision documented

**References**
- `docs/execution/pricing-and-launch-plan.md`

**Estimate**
- 2 points

---

### Story 11.6 — Prepare launch checklist
**Acceptance criteria**
- functional checklist exists
- QA checklist exists
- product messaging checklist exists

**Estimate**
- 3 points

---

# Epic 12 — Post-MVP Productization Foundations

## Objective
Prepare for sensible expansion without forcing it into the first build.

### Story 12.1 — Define saved settings persistence plan
**Acceptance criteria**
- persistence posture documented
- scope included or deferred intentionally

**Estimate**
- 2 points

---

### Story 12.2 — Define alerting architecture path
**Acceptance criteria**
- future alert trigger path documented
- detector/output implications captured

**Estimate**
- 2 points

---

### Story 12.3 — Define watchlist / multi-symbol scan direction
**Acceptance criteria**
- future expansion path documented
- no accidental coupling in current architecture

**Estimate**
- 2 points

---

### Story 12.4 — Define accounts/billing integration boundaries
**Acceptance criteria**
- account and billing surfaces identified for future phases
- current architecture kept compatible but decoupled

**Estimate**
- 2 points

---

## 4. Priority guidance

### P0 — Must build before meaningful beta
- Epics 1 through 10 core stories
- especially types, normalization, detector engine, workspace, chart rendering, settings, QA fixtures, and disclaimer surfaces

### P1 — Important for controlled launch
- Beta cohort preparation
- launch checklist
- pricing/packaging decision

### P2 — Later productization
- saved settings
- alerts planning
- billing/accounts boundaries
- watchlist direction

---

## 5. Suggested implementation sequence

Recommended order:
1. Epic 1
2. Epic 2
3. Epic 3
4. Epic 4
5. Epic 5
6. Epic 6
7. Epic 7
8. Epic 8
9. Epic 9
10. Epic 10
11. Epic 11
12. Epic 12

This sequence protects domain correctness and reduces rework.

---

## 6. Definition of done guidance

A story should generally not be marked done unless:
- implementation exists
- acceptance criteria are met
- tests or focused validation were performed where relevant
- docs or comments updated if the behavior changes architecture or product assumptions
- obvious edge cases were considered

---

## 7. Notes for future Kaino sessions

If this file is converted into actual Jira tickets:
- keep issue titles short and scannable
- keep acceptance criteria explicit
- preserve dependencies
- separate domain logic work from UI work
- avoid burying QA inside vague engineering tickets

For this product, clean ticket structure is part of successful delivery, not admin overhead.
# Engineering File Structure — Liquidity Sweep Detector MVP

## Purpose

This document defines the recommended repository and application file structure for the Liquidity Sweep Detector MVP.
It is intended to help a fresh Kaino session start implementation without spending time re-deciding folder layout.

This structure is optimized for:
- fast MVP delivery
- modular detection logic
- easy navigation
- low coupling between chart UI and domain rules
- future support for accounts, billing, alerts, and analytics

---

## 1. Guiding principles

The codebase should:
- keep domain logic separate from UI
- keep data provider code separate from chart rendering
- keep app orchestration thin
- make detection modules testable with fixtures
- avoid unnecessary enterprise nesting in v1

This should remain a **modular monolith**.

---

## 2. Recommended top-level repository structure

```text
pro/
  docs/
  app/
  components/
  lib/
  public/
  styles/
  tests/
  package.json
  tsconfig.json
  next.config.ts
  README.md
```

If implementation begins in a fresh Next.js app, this is a good starting shape.

---

## 3. Suggested application structure

```text
app/
  page.tsx
  layout.tsx
  globals.css
  workspace/
    page.tsx
  docs/
    page.tsx
```

### Notes
- `app/page.tsx` should be the landing page.
- `app/workspace/page.tsx` should be the main trading workspace.
- `app/docs/page.tsx` can later expose product help, disclaimer, or methodology notes if desired.

---

## 4. Suggested component structure

```text
components/
  layout/
    site-header.tsx
    site-footer.tsx
    workspace-shell.tsx
  chart/
    chart-container.tsx
    candle-chart.tsx
    chart-toolbar.tsx
    chart-legend.tsx
  annotations/
    swing-markers.tsx
    equal-level-zones.tsx
    sweep-markers.tsx
    reclaim-markers.tsx
    signal-labels.tsx
  panels/
    settings-panel.tsx
    explanation-panel.tsx
    signal-list-panel.tsx
  marketing/
    hero-section.tsx
    feature-grid.tsx
    faq-section.tsx
    cta-section.tsx
  ui/
    button.tsx
    card.tsx
    input.tsx
    select.tsx
    switch.tsx
    slider.tsx
    tabs.tsx
```

### Intent by folder
- `layout/` contains shell-level UI used across pages.
- `chart/` contains generic chart-related containers and controls.
- `annotations/` contains visual overlays driven by detector output.
- `panels/` contains side panels and settings UX.
- `marketing/` contains landing-page-only content blocks.
- `ui/` contains reusable presentational components.

---

## 5. Suggested library structure

```text
lib/
  app/
    orchestrator.ts
    workspace-state.ts
    settings-defaults.ts
    signal-view-model.ts
  detection/
    types.ts
    swing.ts
    equal-levels.ts
    sweep.ts
    reclaim.ts
    confirm.ts
    score.ts
    explain.ts
    index.ts
  market-data/
    provider.ts
    normalize.ts
    fixtures.ts
    symbols.ts
    timeframes.ts
  validation/
    guards.ts
    errors.ts
  utils/
    math.ts
    price.ts
    dates.ts
    arrays.ts
```

---

## 6. Folder responsibilities in detail

## 6.1 `lib/detection/`
This is the core business logic area.
Every function here should aim to be pure and testable.

### Suggested files
- `types.ts` — domain models for candles, swings, clusters, signals, settings
- `swing.ts` — swing high/low detection
- `equal-levels.ts` — cluster highs/lows within threshold
- `sweep.ts` — detect level breaches and classify candidate direction
- `reclaim.ts` — detect reclaim within configured window
- `confirm.ts` — optional confirmation logic for confirmed state
- `score.ts` — confidence classification
- `explain.ts` — build structured reasons payload
- `index.ts` — single export surface for detector pipeline

## 6.2 `lib/market-data/`
All candle-source code should live here.
This prevents provider concerns from leaking into the detector.

### Suggested files
- `provider.ts` — interface and concrete provider wiring
- `normalize.ts` — transform raw provider data into internal candle format
- `fixtures.ts` — curated bullish, bearish, and noisy chart samples
- `symbols.ts` — supported symbol definitions
- `timeframes.ts` — supported timeframe config

## 6.3 `lib/app/`
This layer connects market data, detector logic, and UI needs.

### Suggested files
- `orchestrator.ts` — fetch data, run detector, return UI-ready payload
- `workspace-state.ts` — central app state shape if needed
- `settings-defaults.ts` — default configuration values and safe ranges
- `signal-view-model.ts` — convert raw domain signals into display-ready annotation models

---

## 7. Suggested tests structure

```text
tests/
  unit/
    detection/
      swing.test.ts
      equal-levels.test.ts
      sweep.test.ts
      reclaim.test.ts
      confirm.test.ts
      score.test.ts
  integration/
    workspace/
      detector-pipeline.test.ts
      settings-rerun.test.ts
  fixtures/
    bullish-sweep.json
    bearish-sweep.json
    failed-sweep.json
    noisy-range.json
```

### Notes
- Keep domain tests close to logic concepts.
- Use fixture datasets for deterministic validation.
- Integration tests should confirm end-to-end detector orchestration, not just tiny functions.

---

## 8. Suggested docs-to-code mapping

This is useful for future Kaino sessions.

- `docs/product/rules-specification.md` maps to `lib/detection/*`
- `docs/product/chart-annotation-guide.md` maps to `components/annotations/*` and `components/panels/explanation-panel.tsx`
- `docs/architecture/data-provider-decision.md` maps to `lib/market-data/*`
- `docs/execution/jira-breakdown.md` maps to implementation sequencing across all folders

---

## 9. Minimal first-code sequence

When implementation starts, create files in this order:

1. `lib/detection/types.ts`
2. `lib/market-data/normalize.ts`
3. `lib/detection/swing.ts`
4. `lib/detection/equal-levels.ts`
5. `lib/detection/sweep.ts`
6. `lib/detection/reclaim.ts`
7. `lib/detection/explain.ts`
8. `lib/app/orchestrator.ts`
9. `app/workspace/page.tsx`
10. `components/chart/chart-container.tsx`

This order keeps the foundation clean.

---

## 10. Anti-patterns to avoid

Avoid these in MVP:
- putting detection math inside React components
- mixing provider-specific response shapes into chart components
- coupling explanation strings directly to UI markup only
- inventing a heavy service architecture too early
- storing all business logic in one giant file

---

## 11. Final recommendation

For this MVP, a clean codebase matters more than a clever one.
The repository should make these boundaries obvious:
- data comes in
- detector runs
- annotations are derived
- chart and panels render the result

If that separation stays intact, future expansion will be much easier.

# Chart Annotation Guide — Liquidity Sweep Detector MVP

## Purpose

This document explains exactly how the detector output should be shown on the chart.
It is intended for implementation, QA, and future Kaino sessions so the visual layer stays consistent with the rules engine.

It covers:
- annotation types
- visual hierarchy
- color semantics
- layering rules
- interaction behavior
- explanation-panel linkage
- anti-noise guidance

---

## 1. Visual design principles

The chart must remain readable first.
Annotations should help interpretation, not turn the chart into a crowded drawing board.

### Principles
- price candles remain the primary visual element
- major structure should be visible before signal details
- bullish and bearish states must be instantly distinguishable
- candidate signals should look less certain than confirmed signals
- old or secondary annotations should visually recede
- every displayed signal should be clickable or inspectable

---

## 2. Annotation categories

The MVP should support these annotation classes:

1. swing highs
2. swing lows
3. equal highs clusters
4. equal lows clusters
5. sweep breach markers
6. reclaim markers
7. signal state labels
8. optional confidence styling

---

## 3. Recommended visual language

## 3.1 Swing highs
Purpose:
- show prior local highs used in level detection

Visual recommendation:
- small subtle marker above candle high
- shape: small triangle, dot, or short tag
- color: muted neutral or faint bearish-tinted gray
- label text optional: `SH`

Behavior:
- always lower priority than final sweep labels
- should not dominate chart

## 3.2 Swing lows
Purpose:
- show prior local lows used in level detection

Visual recommendation:
- small subtle marker below candle low
- shape: small triangle, dot, or short tag
- color: muted neutral or faint bullish-tinted gray
- label text optional: `SL`

## 3.3 Equal highs cluster
Purpose:
- identify likely buy-side liquidity pool

Visual recommendation:
- thin horizontal band or bracketed line across cluster area
- color: muted orange, amber, or soft red-neutral
- optional text: `EQH`
- should span from first relevant candle to latest cluster member or slightly beyond

Important:
- cluster zone is better than a single pixel-perfect line if tolerance is nonzero

## 3.4 Equal lows cluster
Purpose:
- identify likely sell-side liquidity pool

Visual recommendation:
- thin horizontal band or bracketed line across cluster area
- color: muted teal or soft green-neutral
- optional text: `EQL`

---

## 4. Sweep event annotations

## 4.1 Bearish sweep breach marker
This is when buy-side liquidity was taken.

Visual recommendation:
- marker above or near breach candle high
- icon/label examples:
  - `Sweep`
  - `BSL taken`
  - `Bearish candidate`
- use a stronger red/orange tone than raw level lines

If the event is only a candidate:
- use lower opacity
- dashed accent or hollow marker is useful

## 4.2 Bullish sweep breach marker
This is when sell-side liquidity was taken.

Visual recommendation:
- marker below or near breach candle low
- icon/label examples:
  - `Sweep`
  - `SSL taken`
  - `Bullish candidate`
- use stronger green/teal tone than raw level lines

---

## 5. Reclaim annotations

Reclaim is a key state change and should be visible.

## 5.1 Bearish reclaim
Visual recommendation:
- small label near reclaim candle or just below swept level
- text example: `Reclaimed below`
- line from breach candle to reclaim candle optional for debug mode

## 5.2 Bullish reclaim
Visual recommendation:
- small label near reclaim candle or just above swept level
- text example: `Reclaimed above`

Important:
Reclaim should not look as strong as full confirmation.
It is a middle state.

---

## 6. Final signal state labels

The detector should visually distinguish these states:
- candidate
- reclaimed
- confirmed
- failed

## 6.1 Candidate
Meaning:
- level was swept but reclaim/confirmation is incomplete

Visual style:
- lower opacity
- dashed outline or lighter fill
- short label examples:
  - `Bearish candidate`
  - `Bullish candidate`

## 6.2 Reclaimed
Meaning:
- level was swept and reclaimed, but confirmation may be limited

Visual style:
- medium emphasis
- solid marker but smaller than final confirmed label
- label examples:
  - `Bearish reclaimed`
  - `Bullish reclaimed`

## 6.3 Confirmed
Meaning:
- reclaim plus configured confirmation logic passed

Visual style:
- highest emphasis in signal system
- stronger color saturation
- prominent label examples:
  - `Confirmed bearish sweep`
  - `Confirmed bullish sweep`

## 6.4 Failed
Meaning:
- sweep candidate did not reclaim or continued through level

Visual style:
- faded marker or small invalidation tag
- should be visible for analysis but less dominant than valid signals
- label examples:
  - `Failed sweep`
  - `Continuation likely`

---

## 7. Color semantics

Suggested default color logic:

### Bullish-related
- green
- teal
- aqua

### Bearish-related
- red
- orange-red
- amber-red

### Structural/non-directional
- gray
- slate
- muted blue-gray

### Confidence intensity
- low confidence: lighter/less saturated
- medium confidence: standard saturation
- high confidence: most saturated or bolder outline

Avoid using too many unrelated colors.
The chart should still feel coherent.

---

## 8. Confidence representation

Confidence should not rely only on text.
Visual reinforcement helps.

## Recommended options
1. label suffix
   - `Confirmed bearish sweep — High`
2. color intensity
3. border thickness
4. tooltip details

### Best MVP recommendation
Use:
- text confidence in details panel
- light visual confidence distinction on chart

Do not overcomplicate with giant badges everywhere.

---

## 9. Layering order

Recommended layer order from back to front:
1. candles and grid
2. equal high/low zones
3. swing markers
4. sweep breach markers
5. reclaim markers
6. final signal labels
7. hover/selection highlight

Reason:
- structural context stays behind
- actual trade-relevant event states stay in front

---

## 10. Selection behavior

When a user clicks or hovers a signal:
- highlight the selected signal
- visually emphasize the swept level
- open or update the explanation panel
- show rule reasons
- show timestamps/prices/state/confidence

### Minimum selected-state behavior
- slightly thicker border or glow
- dim non-selected signals if needed

---

## 11. Explanation panel linkage

Every annotation should connect to structured explanation data.

When selected, the panel should show:
- direction
- level type
- swept price/zone
- breach candle time
- reclaim time if any
- final state
- confidence
- reasons array

### Example reasons
- Swept prior equal highs
- Reclaimed below level within 2 candles
- Bearish confirmation candle detected
- Breach penetration exceeded minimum threshold

---

## 12. Anti-noise rules for the UI

The UI should avoid displaying every possible structural mark at once if clutter becomes high.

### Recommended controls
- toggle swings on/off
- toggle equal levels on/off
- show only confirmed signals
- show candidate signals
- show failed signals

### MVP default
- structure visible
- candidate signals visible but subdued
- failed signals optional or hidden by default

---

## 13. Responsive behavior

On smaller screens:
- reduce label density
- prefer tooltips over always-on long text
- keep settings collapsible
- keep explanation panel docked below or in slide-over mode

But desktop should remain the primary target for MVP.

---

## 14. Debug mode recommendation

A debug mode is useful for development and QA.

When enabled, it may show:
- raw swing points
- exact cluster bounds
- breach magnitude
- reclaim window markers
- internal reasons and thresholds

This should not be the default trader-facing view.

---

## 15. QA checklist for annotations

Validation should confirm:
- swings appear where expected
- equal-level zones align with cluster logic
- breach markers sit on correct candles
- reclaim markers appear only when rule passes
- candidate vs confirmed states are visually distinct
- explanation panel matches selected annotation
- chart remains readable with multiple signals

---

## 16. Recommended implementation order

For the visual layer, implement in this order:
1. candle chart
2. swing markers
3. equal-level zones
4. sweep markers
5. reclaim markers
6. final state labels
7. selection behavior
8. explanation linkage
9. toggle controls

---

## 17. Final guidance

The right annotation strategy for MVP is:
- selective
- readable
- explainable
- confidence-aware

If there is a choice between showing more data and keeping the chart understandable, choose readability.
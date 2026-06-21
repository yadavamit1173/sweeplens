# System Architecture — Liquidity Sweep Detector MVP

## Purpose

This document explains the technical architecture for the Liquidity Sweep Detector MVP in a way that a fresh Kaino session can use immediately to begin implementation.

It covers:
- system goals
- app layers
- module boundaries
- data flow
- detection pipeline
- storage needs
- deployment assumptions
- extension points for later phases

---

## 1. Architecture goals

The MVP architecture should optimize for:
- speed of implementation within 1 month
- clear and modular detection logic
- low operational complexity
- easy debugging and tuning of rules
- future support for accounts, billing, alerts, and analytics

This should be a **modular monolith**, not microservices.

---

## 2. Recommended MVP architecture

### Frontend
- Next.js web app
- TypeScript
- Tailwind CSS
- reusable component structure

### Chart / visualization
- browser-based candlestick chart rendering
- signal overlays
- level overlays
- settings-driven redraws

### Detection engine
- TypeScript rule engine running inside the app layer
- modular functions for swing, equal levels, sweep, reclaim, confirmation, and scoring

### Data source
- normalized OHLC market data from a provider abstraction
- initial support should be narrow: selected market(s) and timeframe(s)

### Persistence
- optional minimal persistence for settings and beta-user feedback
- no heavy analytics storage required for first docs-only MVP planning stage

---

## 3. High-level system diagram

```text
User
  -> Web App UI
      -> Chart Renderer
      -> Settings Panel
      -> Signal Explanation Panel
      -> Data Fetch Layer
          -> Market Data Provider Adapter
      -> Detection Engine
          -> Swing Detection
          -> Equal Level Detection
          -> Sweep Detection
          -> Reclaim Logic
          -> Confirmation Logic
          -> Confidence Scoring
      -> Optional persistence layer
```

---

## 4. App layers

## 4.1 Presentation layer

Responsible for:
- page layout
- navigation
- chart container
- settings controls
- signal display
- explanation UI
- onboarding and landing page content

Suggested areas:
- marketing pages
- app workspace page
- shared UI components

## 4.2 Application layer

Responsible for:
- orchestration of market data loading
- applying detection settings
- invoking detection pipeline
- transforming raw outputs into display-ready annotations

This should remain thin and delegate actual logic to the detection modules.

## 4.3 Domain logic layer

This is the most important layer.
It should contain pure functions where possible.

Core modules:
- swing detection
- equal highs / equal lows detection
- sweep detection
- reclaim detection
- confirmation logic
- scoring logic
- shared domain types

## 4.4 Infrastructure layer

Responsible for:
- fetching price data
- optional storage adapters
- environment configuration
- deployment wiring

---

## 5. Detection pipeline design

The detection pipeline should be sequential and explainable.

### Step 1: Load OHLC data
The app receives a time-ordered series of candles.
Each candle should include at least:
- timestamp
- open
- high
- low
- close
- optional volume

### Step 2: Identify swing highs and swing lows
A swing high is a local high compared with candles around it.
A swing low is a local low compared with candles around it.
The lookback/lookforward window should be configurable.

### Step 3: Identify equal highs and equal lows
Group highs or lows that fall within a configurable tolerance threshold.
These groups represent potential liquidity pools.

### Step 4: Detect sweep candidate
A sweep candidate occurs when price trades beyond a tracked swing level or equal-level cluster.
Examples:
- price moves above prior highs and then shows rejection behavior
- price moves below prior lows and then shows reclaim behavior

### Step 5: Detect reclaim / rejection
A reclaim confirms that price returned back through the relevant swept threshold within an allowed candle window.
This helps distinguish likely stop hunt behavior from simple continuation breakout.

### Step 6: Apply confirmation logic
Optional confirmation rules may include:
- displacement candle
- close strength
- short-term structure shift
- minimum wick penetration
- session filter

### Step 7: Score the setup
Return a confidence score or class such as:
- low
- medium
- high

### Step 8: Return annotations
The engine returns structured annotations for the chart and explanation panel.

---

## 6. Detection output contract

Each detected event should return a consistent shape.

Suggested fields:
- id
- symbol
- timeframe
- direction (`bullish` or `bearish`)
- levelType (`swingHigh`, `swingLow`, `equalHighs`, `equalLows`)
- sweptLevelPrice
- sweepCandleIndex
- reclaimCandleIndex
- confirmationState
- confidence
- explanationReasons
- settingsSnapshot

The important principle is that the UI should never infer business logic from raw candles directly. It should render based on a processed signal payload.

---

## 7. Settings architecture

The settings model should be centralized and serializable.

Recommended settings groups:
- swing settings
- equal-level threshold settings
- reclaim window settings
- confirmation settings
- session filters
- visualization toggles

This enables:
- reproducible results
- future user presets
- easier debugging
- saved profiles later

---

## 8. File/module layout recommendation

```text
Desktop/pro/
  docs/
  app/
    (future implementation)
  src/
    components/
      chart/
      settings/
      signals/
      layout/
    lib/
      detection/
        swing.ts
        equal-levels.ts
        sweep.ts
        reclaim.ts
        confirm.ts
        score.ts
        types.ts
      market-data/
        provider.ts
        normalize.ts
      app/
        orchestrator.ts
        settings.ts
```

This is not required immediately, but implementation should generally follow this boundary.

---

## 9. Data provider abstraction

A provider abstraction should exist from day one even if only one provider is used initially.

Why:
- market source may change
- response shape may differ across providers
- easier testing with fixtures

Suggested contract:
- fetch candles by symbol/timeframe/range
- normalize to internal candle format

---

## 10. State management

MVP state can remain simple.

Recommended split:
- local component state for UI-only behavior
- centralized app state for chart settings, selected symbol, timeframe, and detection results

Avoid overengineering with heavy global state unless clearly needed.

---

## 11. Error handling philosophy

The MVP should fail visibly and clearly.

Handle these cases:
- no data returned
- malformed data
- insufficient candles for detection
- provider timeout or fetch failure
- invalid settings combinations

Return readable user-facing messages and detailed developer-facing logs.

---

## 12. Performance guidance

The MVP does not need hyper-optimized HFT-level performance.
But it should still:
- avoid unnecessary recomputation
- rerun detection only when data or settings change
- separate calculation from rendering
- allow future memoization

---

## 13. Security and trust basics

Even if this is only a chart tool, include:
- disclaimer page or visible disclaimer section
- no guaranteed-profit language
- safe config handling
- clean environment variable management if data APIs are used

---

## 14. Deployment assumption

Recommended MVP deployment path:
- web app deployed on Vercel or similar
- docs remain in repository under `docs/`
- lightweight configuration via environment variables

---

## 15. What not to build in v1

Do not start with:
- broker integrations
- auto-trade execution
- social features
- full backtesting engine
- multi-tenant enterprise architecture
- complex billing logic before the detector works well

---

## 16. Extension points for later phases

The architecture should later support:
- alerts
- watchlists
- user accounts
- saved presets
- historical signal logs
- journaling integration
- educator white-labeling
- broker embedding

---

## 17. Implementation readiness note for Kaino

If a fresh Kaino session begins implementation, the first engineering deliverables should be:
1. domain types
2. normalized candle model
3. swing detection
4. equal-level clustering
5. sweep detection
6. explanation payload formatting

That sequence preserves clean foundations.

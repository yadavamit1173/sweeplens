# Liquidity Sweep Detector MVP — Detailed Implementation Plan

## 1. Document Purpose

This document defines the complete MVP implementation plan for a trading product that detects likely liquidity sweeps (also referred to as liquidity grabs or stop hunts) and presents them to traders in a usable, structured, and sellable format.

This is intentionally detailed so it can be used for:
- product planning
- engineering execution
- Jira breakdown
- AI-assisted coding sessions
- design alignment
- launch preparation
- later conversion into a SaaS roadmap

---

## 2. Product Summary

### Product name (working)
- Liquidity Sweep Detector
- Liquidity Grab Confirmation Tool
- Smart Money Sweep Scanner
- Market Structure Sweep Engine

### MVP goal
Build a tool that identifies probable bullish and bearish liquidity sweeps using market structure rules, reclaim behavior, and optional confirmation logic, then displays those events clearly on a chart.

### Core user problem
Retail traders often identify liquidity grabs inconsistently. They struggle with:
- locating meaningful prior highs and lows
- identifying equal highs and equal lows
- distinguishing real sweep + rejection from normal breakout continuation
- reacting too early before confirmation
- taking low-quality entries during fake moves

### MVP outcome
The product should help traders answer:
- Was a key liquidity level just swept?
- Was it reclaimed or rejected?
- Is there confirmation of reversal or continuation?
- How strong is the setup based on selected rules?

---

## 3. Product Scope Decision

## Recommended MVP format
The best 1-month MVP is:

### Primary recommendation
**Web-based detector with chart visualization and rule engine**

### Alternate launch path
**TradingView-first indicator + landing page**

For this implementation document, the primary architecture assumes a **web app MVP** because:
- it gives full control of UX
- it can later become SaaS
- it supports future billing, analytics, user accounts, backtests, and dashboards
- it is easier to productize beyond a single indicator

---

## 4. Product Objectives

### Business objectives
- launch a working MVP in 1 month
- validate user interest with beta traders
- collect feedback on detection quality
- create a paid pathway for early adopters
- prepare a foundation for subscription product expansion

### Product objectives
- detect likely liquidity sweeps with explainable rules
- reduce false positives using configurable confirmation
- present signals visually and clearly
- support trader trust with transparent reasoning

### Engineering objectives
- ship quickly with controllable scope
- create modular detection logic
- make rule tuning easy
- support future expansion to alerts, analytics, and backtesting

---

## 5. Target Users

### Primary users
1. Retail intraday traders
2. Smart money concept / price action traders
3. Forex, crypto, and index traders
4. Traders who already use liquidity / sweep / structure concepts

### Secondary users
1. Trading educators
2. Trading communities
3. Prop-firm traders
4. Advanced retail traders looking for workflow tools

### Future users
1. Brokers wanting engagement tooling
2. Prop firms wanting trader analytics
3. White-label B2B customers

---

## 6. Core Product Positioning

The product should **not** be positioned as:
- guaranteed signal software
- financial advice
- automatic profitable trading engine
- certainty-based stop hunt confirmation

The product **should** be positioned as:
- a probability-based market structure analysis tool
- a liquidity sweep detection and confirmation assistant
- a chart intelligence tool for smart money style traders
- a structured way to identify likely sweep + reclaim events

### Safe positioning statement
> Detect likely liquidity sweeps using prior highs/lows, reclaim behavior, and market structure confirmation.

---

## 7. MVP Feature Set

## 7.1 Must-have features

### A. Price data ingestion
- load OHLC candle data for supported symbols/timeframes
- render candles on chart
- allow timeframe switching
- support chosen initial market(s)

### B. Swing detection
- identify local swing highs
- identify local swing lows
- support configurable lookback length
- expose swing points to downstream detection engine

### C. Equal highs / equal lows detection
- detect clusters of highs within threshold tolerance
- detect clusters of lows within threshold tolerance
- plot them visually as potential liquidity pools

### D. Liquidity sweep detection
- detect when price trades beyond prior swing or equal high/low zone
- distinguish buy-side and sell-side sweeps
- classify initial sweep event

### E. Reclaim / rejection logic
- determine whether price returned back inside the swept range
- determine whether reclaim happened within allowed candle window
- mark reclaimed vs unreclaimed sweep

### F. Confirmation logic
- structure shift or displacement-based confirmation
- bullish confirmation after sell-side sweep
- bearish confirmation after buy-side sweep

### G. Signal scoring / confidence state
- low / medium / high confidence
- confidence should be rule-based in MVP, not ML-based

### H. Chart visualization
- show swing points
- show equal highs/lows
- show swept level
- label sweep direction
- label confirmation state
- use readable color scheme and legend

### I. Settings panel
- swing sensitivity
- equal level threshold
- reclaim candle window
- confirmation toggle
- session filter toggle (optional if shipped in MVP)

### J. Landing page / product explanation
- explain what a liquidity sweep is
- show screenshots and example charts
- explain signal states
- collect leads or onboard beta users

---

## 7.2 Should-have features
- alerts for new sweep events
- historical event list for active chart
- session-based filtering (London, New York, Asia)
- symbol presets
- explanation tooltip for each signal

---

## 7.3 Nice-to-have features
- order block context
- fair value gap context
- premium/discount zone context
- journaling integration
- screenshot export
- replay / forward simulation mode
- AI explanation layer

---

## 7.4 Explicitly out of scope for MVP
- broker integration
- auto-execution
- portfolio management
- direct trading advice
- advanced machine learning model
- full multi-user role system
- complex billing workflows
- mobile app
- prop-firm dashboard
- guaranteed backtest engine

---

## 8. Market and Asset Scope

The MVP must not try to support every market equally.

## Recommended asset focus for MVP
Pick one primary market first:
1. Crypto perpetuals
2. Forex majors
3. Major indices

### Recommended MVP choice
**Crypto + major forex pairs** is a reasonable first step if data access is available.

### Recommended initial symbol list
- BTCUSDT
- ETHUSDT
- EURUSD
- GBPUSD
- XAUUSD (optional if data source supports well)

### Recommended timeframe support
Start with:
- 5m
- 15m
- 1h

Avoid too many timeframes initially because logic will feel inconsistent if not tuned.

---

## 9. Detection Logic Overview

The logic must remain explainable.

## 9.1 Key concepts

### Swing high
A local high higher than surrounding candles based on a defined lookback rule.

### Swing low
A local low lower than surrounding candles based on a defined lookback rule.

### Equal highs
Two or more highs within a configured tolerance range that likely represent clustered buy-side liquidity.

### Equal lows
Two or more lows within a configured tolerance range that likely represent clustered sell-side liquidity.

### Buy-side liquidity
Liquidity above highs that may be swept before bearish movement.

### Sell-side liquidity
Liquidity below lows that may be swept before bullish movement.

### Sweep
Price trades beyond a significant liquidity level.

### Reclaim
After sweeping the level, price closes back through or back inside the level range.

### Confirmation
Additional evidence that the sweep led to likely reversal rather than continuation.

---

## 9.2 Bullish setup definition
A bullish setup identifies a likely **sell-side liquidity sweep**.

### Base conditions
1. A valid prior swing low or equal lows cluster exists.
2. Current price trades below that level.
3. The breach exceeds the configured minimum penetration threshold.
4. Price reclaims back above the level within N candles.

### Optional confirmation conditions
5. A bullish displacement candle appears.
6. A micro structure shift occurs after reclaim.
7. Rejection wick ratio exceeds threshold.

### Signal states
- Sweep candidate
- Sweep reclaimed
- Sweep confirmed bullish

---

## 9.3 Bearish setup definition
A bearish setup identifies a likely **buy-side liquidity sweep**.

### Base conditions
1. A valid prior swing high or equal highs cluster exists.
2. Current price trades above that level.
3. The breach exceeds the configured minimum penetration threshold.
4. Price reclaims back below the level within N candles.

### Optional confirmation conditions
5. A bearish displacement candle appears.
6. A micro structure shift occurs after reclaim.
7. Upper wick rejection ratio exceeds threshold.

### Signal states
- Sweep candidate
- Sweep reclaimed
- Sweep confirmed bearish

---

## 9.4 Sweep detection modes
The engine should support two internal modes even if only one is exposed initially.

### Mode A: Swing-based sweep
- uses prior swing highs/lows
- simpler and reliable for MVP

### Mode B: Equal-high / equal-low sweep
- more aligned with common liquidity concepts
- should be included if stable

---

## 9.5 Confidence scoring
MVP confidence should be deterministic.

### Example scoring inputs
- level type = swing or equal high/low
- penetration quality
- reclaim speed
- wick rejection strength
- displacement confirmation
- structure shift confirmation
- session quality

### Example confidence output
- Low: level taken but reclaim weak or incomplete
- Medium: reclaim completed with one confirmation
- High: reclaim + displacement + structure shift

---

## 10. Technical Architecture

## 10.1 Frontend
Recommended stack:
- Next.js
- TypeScript
- Tailwind CSS
- component library such as shadcn/ui
- chart library capable of OHLC rendering

### Frontend responsibilities
- render chart
- display overlays and labels
- manage settings panel
- render signal metadata
- display event history
- host landing pages and docs

---

## 10.2 Backend
Recommended stack:
- Next.js API routes or separate Node service
- TypeScript
- modular service structure

### Backend responsibilities
- fetch and normalize market data
- run sweep detection engine
- return structured signal objects
- cache results if needed
- support future alerts and analytics

---

## 10.3 Database
Recommended MVP database:
- PostgreSQL or Supabase Postgres

### Database responsibilities in MVP
- store users if auth exists
- store user settings
- store saved symbols / preferences
- store detected events if event history is persisted
- store feedback / beta tester notes

### Database can be skipped in first technical spike if app is demo-only.

---

## 10.4 Data flow
1. User selects symbol and timeframe.
2. Frontend requests OHLC data.
3. Backend fetches market data from source or cache.
4. Backend runs detection engine.
5. Backend returns candles + signal objects + metadata.
6. Frontend renders chart and overlays.
7. User adjusts settings.
8. Detection reruns using updated parameters.

---

## 10.5 Suggested project structure

```text
apps/
  web/
    app/
    components/
    lib/
    services/
    styles/

packages/
  detection-engine/
    src/
      swing/
      equal-levels/
      sweeps/
      confirmation/
      scoring/
      types/
      utils/

  shared-types/
  ui/
```

If monorepo is too heavy for MVP, use:

```text
src/
  app/
  components/
  lib/
  modules/
    chart/
    market-data/
    detection/
      swing.ts
      equalLevels.ts
      sweep.ts
      confirmation.ts
      scoring.ts
```

---

## 11. Detection Engine Design

## 11.1 Engine inputs
- candles: timestamp, open, high, low, close, volume(optional)
- symbol
- timeframe
- settings object

### Settings object example
```ts
{
  swingLookback: number,
  equalLevelToleranceBps: number,
  minSweepPenetrationBps: number,
  reclaimWindowCandles: number,
  requireDisplacement: boolean,
  requireStructureShift: boolean,
  wickRejectionThreshold: number,
  sessionFilter: 'all' | 'london' | 'newyork' | 'asia',
}
```

---

## 11.2 Engine outputs

```ts
{
  symbol: string,
  timeframe: string,
  swings: SwingPoint[],
  equalLevels: EqualLevel[],
  sweeps: SweepEvent[],
}
```

### Sweep event example
```ts
{
  id: string,
  type: 'bullish' | 'bearish',
  liquiditySide: 'sell-side' | 'buy-side',
  sourceLevelType: 'swing-low' | 'swing-high' | 'equal-lows' | 'equal-highs',
  levelPrice: number,
  sweepCandleTime: string,
  reclaimCandleTime?: string,
  confirmationTime?: string,
  confidence: 'low' | 'medium' | 'high',
  state: 'candidate' | 'reclaimed' | 'confirmed' | 'failed',
  reasons: string[],
}
```

---

## 11.3 Engine modules

### Module A: Swing detection
Input: candles, swingLookback
Output: swing points

### Module B: Equal level detection
Input: swing points or raw highs/lows
Output: clustered equal highs/lows

### Module C: Sweep detection
Input: candles + levels
Output: raw sweep candidates

### Module D: Reclaim analysis
Input: sweep candidates + following candles
Output: reclaimed / not reclaimed state

### Module E: Confirmation analysis
Input: reclaim events + subsequent price action
Output: confirmed / unconfirmed state

### Module F: Scoring
Input: full event metadata
Output: confidence label

---

## 12. Data Source Strategy

## 12.1 MVP requirement
The app needs clean OHLC data.

### Options
1. exchange API directly
2. aggregator API
3. demo historical data during early prototype

### Recommended approach
- start with one simple market data source
- normalize all candle data into one internal format

### Key design rule
Keep the detector independent from the external data provider.

---

## 12.2 Data normalization layer
Every data source should be converted to a standard structure:

```ts
{
  time: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume?: number,
}
```

---

## 13. UI / UX Design

## 13.1 Main user experience
The user should be able to:
1. open product
2. choose symbol
3. choose timeframe
4. see chart with marked liquidity zones
5. see sweep labels
6. inspect signal details
7. tune settings
8. understand why a signal exists

---

## 13.2 Main screens

### Screen 1: Landing page
Sections:
- hero section
- what problem it solves
- how it works
- example screenshots
- feature list
- FAQs
- CTA

### Screen 2: Detector dashboard
Sections:
- top controls
- chart area
- settings sidebar
- recent sweep list
- selected signal details panel

### Screen 3: Docs / methodology page
- define liquidity sweep logic
- explain confidence levels
- describe limitations
- show examples

### Screen 4: Beta waitlist / onboarding
- collect email
- trader type
- preferred market
- preferred timeframe

---

## 13.3 Dashboard layout

```text
------------------------------------------------------
Header: Logo | Symbol | Timeframe | Status | Account
------------------------------------------------------
Left/Center: Main Chart
Right Sidebar: Settings / Signal Details
Bottom Panel: Recent Events / History
------------------------------------------------------
```

---

## 13.4 Chart overlays
The following visual objects should exist:
- swing high markers
- swing low markers
- equal highs line/zone
- equal lows line/zone
- sweep label
- reclaim label
- confirmation label
- confidence badge

### Color suggestions
- bullish signals: green/teal
- bearish signals: red/orange
- equal highs: blue
- equal lows: purple
- low confidence: gray/yellow

---

## 13.5 Signal detail panel
When user clicks a signal, show:
- signal type
- liquidity side swept
- source level
- sweep candle timestamp
- reclaim status
- confirmation status
- reasons array
- confidence score

Example:
- Bearish sweep confirmed
- Buy-side liquidity above equal highs taken
- Reclaimed within 2 candles
- Bearish displacement present
- Confidence: High

---

## 14. Rules Tuning and Configuration

The detector will require tuning. Settings must be internal at minimum and UI-exposed where useful.

## Important configurable parameters
- swing lookback length
- equal-level tolerance
- minimum sweep penetration
- reclaim window
- minimum wick rejection ratio
- structure shift requirement
- displacement requirement
- signal cooldown after same level sweep

### Why settings matter
Different assets and timeframes behave differently. A rigid detector will feel inaccurate.

---

## 15. Validation Strategy

The biggest product risk is not coding speed. It is signal quality.

## 15.1 Validation goals
- verify that marked sweeps are visually credible
- ensure logic does not spam noise
- identify false positive patterns
- tune settings per market/timeframe

---

## 15.2 Validation methods

### A. Historical chart review
- collect manually labeled examples
- compare detector output against expected behavior

### B. Rule-by-rule output inspection
- inspect swing points first
- inspect equal levels next
- inspect raw sweeps next
- inspect reclaim next
- inspect confirmation last

### C. Beta tester review
- ask traders if marked levels are useful
- ask whether settings feel too sensitive or too strict

---

## 15.3 Validation dataset
Create a small curated validation library with:
- bullish sweep examples
- bearish sweep examples
- fake breakout continuation examples
- messy choppy examples
- equal-high sweep examples
- equal-low sweep examples

Store chart screenshots and notes for each.

---

## 15.4 Signal QA checklist
For each candidate signal ask:
- Was the level meaningful?
- Was the penetration sufficient?
- Was the reclaim valid?
- Was the confirmation real or weak?
- Would a trader understand this label on-chart?
- Is the event too late to be useful?

---

## 16. Limitations and Risk Handling

## Product limitations to acknowledge
- liquidity sweep concepts are interpretive
- no detector can guarantee future reversal
- different traders define sweeps differently
- market data variance can affect precision
- lower timeframes may generate noisy results

## Product safeguards
- visible disclaimer
- no profit claims
- confidence is probabilistic, not certainty-based
- settings are user adjustable

---

## 17. Legal / Compliance Positioning

This product must not be marketed as financial advice.

### Required disclaimers
- educational and informational use only
- not investment advice
- users are responsible for their own decisions
- past pattern detection does not guarantee future results

### Avoid messaging such as
- guaranteed profitable signals
- 100% accurate stop hunt detector
- auto-winning setup scanner

---

## 18. Monetization Strategy

## Recommended launch options

### Option A: Beta waitlist first
- collect users
- onboard manually
- refine product before pricing

### Option B: Early access lifetime deal
- good for first adopters
- simple pricing
- faster validation

### Option C: Subscription
- better long-term model
- requires more polished product

---

## Suggested pricing experiments
- Beta early access: low entry price
- Founding user plan: one-time limited deal
- Pro plan: monthly subscription after validation

### Example tiers
1. Free demo / waitlist
2. Pro chart detector
3. Premium alerts and analytics later

---

## 19. 30-Day Delivery Plan

## Week 1 — Product and logic freeze
Deliverables:
- finalize supported market(s)
- finalize supported timeframe(s)
- define sweep rules v1
- define chart event schema
- create simple wireframes
- set up repo and base app

### Engineering tasks
- scaffold project
- create candle types
- build chart shell
- implement first swing detection function

---

## Week 2 — Detection engine core
Deliverables:
- swing detection working
- equal levels working
- raw sweep detection working
- reclaim state logic working

### Engineering tasks
- implement detector modules
- create sample fixtures
- render overlays on chart
- create debug mode for engine outputs

---

## Week 3 — Confirmation, scoring, UX
Deliverables:
- confirmation logic working
- confidence scoring added
- settings panel working
- signal details panel working

### Engineering tasks
- add displacement / structure shift logic
- hook settings to engine reruns
- improve chart readability
- add event list panel

---

## Week 4 — Launch prep
Deliverables:
- landing page
- docs page
- feedback form
- demo screenshots/videos
- disclaimer
- beta-ready deployment

### Engineering tasks
- polish UI
- fix major bugs
- perform QA pass
- deploy
- onboard early users

---

## 20. Suggested Jira Structure

## Epic 1: Product definition
- define liquidity sweep logic
- define supported markets
- define MVP scope
- define signal taxonomy

## Epic 2: Market data and chart foundation
- choose data source
- normalize candles
- render chart
- add symbol/timeframe controls

## Epic 3: Detection engine
- swing detection
- equal level detection
- sweep candidate detection
- reclaim logic
- confirmation logic
- scoring logic

## Epic 4: Dashboard UI
- chart overlay rendering
- settings panel
- signal details panel
- recent events list

## Epic 5: Launch website
- landing page
- methodology page
- FAQs
- beta signup

## Epic 6: QA and release
- validation dataset
- bug fixes
- disclaimer
- deployment

---

## 21. File and Module Suggestions

## Frontend modules
- `components/chart/`
- `components/settings/`
- `components/signals/`
- `components/layout/`

## Detection modules
- `lib/detection/swing.ts`
- `lib/detection/equal-levels.ts`
- `lib/detection/sweep.ts`
- `lib/detection/reclaim.ts`
- `lib/detection/confirm.ts`
- `lib/detection/score.ts`
- `lib/detection/types.ts`

## Data modules
- `lib/market-data/provider.ts`
- `lib/market-data/normalize.ts`

## Validation modules
- `lib/fixtures/`
- `lib/tests/`

---

## 22. Testing Strategy

## Unit tests
Must cover:
- swing identification
- equal high/low clustering
- sweep breach detection
- reclaim window handling
- confidence classification

## Integration tests
- chart receives signal payload and renders correctly
- settings changes rerun engine and update UI

## Manual QA
- validate 20–50 chart examples
- compare detector vs visual reasoning

---

## 23. Future Roadmap Beyond MVP

## Phase 2
- alerts
- user accounts
- saved settings
- multi-symbol watchlist
- historical sweep log

## Phase 3
- journaling integration
- screenshot review
- backtest assistant
- AI explanation
- session analytics

## Phase 4
- white-label educator plans
- broker widgets
- team features
- advanced market structure suite

---

## 24. Launch Checklist

Before launch confirm:
- chart renders properly
- detector identifies both bullish and bearish sweeps
- settings update output correctly
- false positive rate is acceptable for beta
- disclaimer is visible
- landing page copy is clear
- screenshots and examples are ready
- feedback channel exists

---

## 25. Final Recommendation

To succeed, this product should be built as a **tight, explainable MVP**, not as a giant all-in-one trading platform.

### Best MVP definition
A web tool that:
- loads chart data
- highlights prior highs/lows and equal levels
- detects likely liquidity sweeps
- marks reclaim and confirmation states
- explains why the signal exists
- helps traders interpret structure faster

### Best success metric for month one
Not revenue first. The first success metric should be:
- traders understand the tool
- traders trust the logic enough to test it
- traders say the signals are useful
- the product can be demoed clearly and repeatedly

Once that works, monetization becomes realistic.

---

## 26. Next Documents to Create

After this implementation plan, the next most useful docs would be:
1. detailed PRD
2. Jira issue breakdown
3. rules specification with examples
4. chart annotation guide
5. launch and pricing plan
6. QA validation checklist

---

## 27. Direct Next Step

Immediate next step should be:
**convert this implementation plan into a sprintable Jira board with acceptance criteria for each issue.**

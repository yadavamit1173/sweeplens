# End-to-End Architecture — Liquidity Sweep Detector Product

## Purpose

This document is the deep architecture reference for the Liquidity Sweep Detector product.
It goes beyond the shorter system-architecture note and is intended to support:
- full implementation planning
- end-to-end engineering alignment
- Jira decomposition
- phased delivery decisions
- future Kaino session continuity
- product hardening beyond MVP

This file should be treated as the primary architecture source once implementation begins.

---

## 1. Architecture intent

The product should be built as a **modular web application with a clear domain core**.
The main architectural principle is:

> market data comes in, domain rules transform it into interpretable sweep signals, and the UI renders those signals with explanation, settings, and validation support.

This product is not just a chart screen.
It is a combination of:
- market data ingestion
- normalized candle modeling
- market-structure analysis
- liquidity-sweep rule evaluation
- confidence/explanation generation
- chart annotation rendering
- settings-driven recalculation
- QA/fixture-based validation workflow
- optional future packaging as a paid SaaS tool

---

## 2. Product architecture summary

At a high level, the product has 7 major layers:

1. Presentation layer
2. Interaction/state layer
3. Application orchestration layer
4. Domain detection layer
5. Data provider and normalization layer
6. Persistence/supporting infrastructure layer
7. Documentation/validation/operational layer

### High-level flow

```text
User
  -> Landing page / Workspace UI
  -> Settings + Symbol + Timeframe selection
  -> App state update
  -> Data request / fixture selection
  -> Provider adapter returns normalized candles
  -> Detector pipeline runs
      -> swing extraction
      -> equal-level clustering
      -> sweep candidate detection
      -> reclaim evaluation
      -> confirmation evaluation
      -> confidence scoring
      -> explanation payload generation
  -> Signal view-model transformation
  -> Chart annotations + explanation panel + signal list render
  -> Optional persistence of settings / feedback / beta events
```

---

## 3. Architectural goals

## 3.1 Primary goals
- make the rules engine explainable and testable
- preserve clean boundaries between data, logic, and UI
- support iterative refinement of sweep logic
- allow future addition of alerts, accounts, and billing without rewriting core detection
- make fresh-session continuation easy for Kaino and human contributors

## 3.2 Operational goals
- simple deployment
- narrow initial infrastructure footprint
- deterministic testing with fixtures
- low-risk dependency structure

## 3.3 Product goals supported by architecture
- clear chart output
- settings-driven experimentation
- user trust through reasons and confidence levels
- future upgrade path into a paid trader tool

---

## 4. Architectural style

## Recommended style
**Modular monolith with strong domain boundaries**

This means:
- one main web application repository
- one main application runtime
- pure or mostly pure domain modules
- clear separation between domain logic and framework code
- no microservices for initial build

### Why this is correct here
A microservice architecture would create unnecessary complexity because the initial product does not need:
- independent service scaling
- distributed deployments
- networked domain boundaries
- separate teams working on separate services

The right complexity level is:
- one repo
- one web app
- one domain core
- one provider abstraction layer
- one docs system

---

## 5. End-to-end system diagram

```text
[ User Browser ]
    |
    v
[ Next.js Application ]
    |
    +--> [ Landing / Marketing Pages ]
    |
    +--> [ Workspace UI ]
    |       |
    |       +--> [ Chart Renderer ]
    |       +--> [ Settings Panel ]
    |       +--> [ Explanation Panel ]
    |       +--> [ Signal List / Metadata ]
    |
    +--> [ Workspace State / Orchestration ]
    |       |
    |       +--> [ Market Data Provider Interface ]
    |       |       +--> [ Fixture Source ]
    |       |       +--> [ Live REST / Exchange Source ]
    |       |
    |       +--> [ Detection Engine ]
    |               +--> swing
    |               +--> equal-levels
    |               +--> sweep
    |               +--> reclaim
    |               +--> confirm
    |               +--> score
    |               +--> explain
    |
    +--> [ Optional Persistence ]
            +--> saved settings
            +--> beta feedback
            +--> future accounts/billing/history
```

---

## 6. Major product surfaces

## 6.1 Marketing / public site
Purpose:
- explain the product
- collect beta interest
- explain positioning and scope
- reduce confusion about what the tool is and is not

Typical pages:
- home page
- feature overview
- methodology summary
- disclaimer / FAQ
- beta signup or contact

## 6.2 Workspace
Purpose:
- core trading analysis experience
- user sees price data and signal annotations
- user changes settings and interprets results

Primary areas:
- chart canvas
- toolbar
- symbol/timeframe selection
- settings panel
- explanation/details panel
- optional signal list

## 6.3 Docs/help surface
Purpose:
- reinforce safe usage
- explain terms and states
- explain candidate vs confirmed
- support onboarding and reduce support burden

## 6.4 Future surfaces
Not required for first implementation, but architecture should allow:
- user dashboard
- saved presets
- watchlists
- alerts
- account/billing pages
- historical analysis logs

---

## 7. Core architectural domains

## 7.1 Market data domain
Responsible for:
- candle retrieval
- provider abstraction
- normalization
- symbol/timeframe compatibility
- empty/error handling

Key concern:
The domain logic must not depend on provider-specific shapes.

## 7.2 Detection domain
Responsible for:
- swing modeling
- equal-high / equal-low modeling
- breach/sweep recognition
- reclaim determination
- confirmation determination
- confidence scoring
- explanation reasoning

Key concern:
This is the product moat and should remain pure, testable, and auditable.

## 7.3 Visualization domain
Responsible for:
- transforming domain outputs into chart-friendly annotations
- keeping UI readable
- linking selected signals to explanations

Key concern:
The UI should render meaning, not invent meaning.

## 7.4 Settings/configuration domain
Responsible for:
- tunable detector thresholds
- safe ranges and defaults
- deterministic reruns when settings change

## 7.5 Validation/QA domain
Responsible for:
- fixture management
- regression scenarios
- chart-validation discipline
- rule adherence testing

---

## 8. Detailed app layers

## 8.1 Presentation layer
Contains:
- page layouts
- panels
- chart container
- labels
- controls
- visual states
- empty/loading/error messaging

Should not contain:
- sweep-rule logic
- provider-specific parsing
- direct detector math

## 8.2 Interaction/state layer
Contains:
- selected symbol/timeframe
- detector settings state
- selected signal state
- loading/error state
- toggles for overlays and visibility

Should coordinate:
- when to fetch data
- when to run detector
- when to update view-models

## 8.3 Application orchestration layer
Contains:
- input validation
- data fetch or fixture resolution
- detector pipeline invocation
- error translation
- transformation into UI-ready payloads

This is the glue layer.
It should remain thin but explicit.

## 8.4 Domain logic layer
Contains pure functions and deterministic rule modules.
This layer should be framework-agnostic.

## 8.5 Infrastructure layer
Contains:
- provider adapters
- optional persistence adapters
- deployment config
- environment access

---

## 9. Domain pipeline in detail

## 9.1 Input stage
Input should be either:
- normalized candles from provider
- curated fixture candles

Preconditions:
- candles sorted by time ascending
- numeric OHLC integrity valid
- enough candle count available for configured settings

## 9.2 Structure extraction stage
Substeps:
1. detect swing highs
2. detect swing lows
3. cluster equal highs
4. cluster equal lows

Outputs:
- swing points
- equal-level clusters

## 9.3 Sweep candidate stage
Substeps:
- compare active candles against tracked levels
- detect bullish or bearish breach events
- classify level type
- measure breach magnitude
- record wick/body characteristics

Output:
- sweep candidates only

## 9.4 Reclaim stage
Substeps:
- scan allowed number of subsequent candles
- determine if reclaimed condition passes
- classify failed/no-reclaim behavior

Output:
- reclaimed or failed candidates

## 9.5 Confirmation stage
Substeps:
- evaluate opposite-direction close strength
- evaluate optional displacement logic
- evaluate optional short-term structure shift logic
- upgrade state if configured checks pass

Output:
- candidate / reclaimed / confirmed / failed

## 9.6 Scoring stage
Substeps:
- score based on breach quality
- score based on reclaim timing
- score based on confirmation evidence
- downgrade noisy or borderline events

Output:
- low / medium / high confidence

## 9.7 Explanation stage
Substeps:
- convert detection facts into human-readable reasons
- preserve structured metadata for the UI

Output:
- reasons array
- metrics object
- explanation payload

## 9.8 View-model stage
Substeps:
- map domain signal into annotation styles
- map state to labels/colors/tokens
- shape data for chart components and panel components

---

## 10. Detector state model

The detector should consistently support these states:
- `candidate`
- `reclaimed`
- `confirmed`
- `failed`

### Candidate
A level was swept, but reclaim and/or confirmation is not sufficient.

### Reclaimed
A level was swept and reclaimed within configured rules, but optional confirmation may still be absent.

### Confirmed
Reclaim occurred and configured confirmation rules passed.

### Failed
A candidate existed, but reclaim failed or continuation behavior dominated.

This state model should be reused in:
- domain output
- UI labels
- QA cases
- analytics later
- Jira tickets

---

## 11. Settings architecture

Settings should be treated as first-class architecture, not incidental UI.

## 11.1 Core settings categories
- swing sensitivity
- equal-level tolerance
- minimum breach threshold
- reclaim window size
- reclaim strictness
- confirmation toggles
- visibility toggles

## 11.2 Settings behavior rules
- every setting must have a default
- every setting must have a safe min/max range
- changing a relevant setting must trigger deterministic recalculation
- purely visual toggles must not rerun detection logic unnecessarily

## 11.3 Recommended settings split
### Detection settings
Affect domain output.

### Visualization settings
Affect display only.

### Debug settings
Expose internal signals and validation aids.

---

## 12. Chart architecture

## 12.1 Chart responsibilities
- render candles
- render structural levels
- render sweep/reclaim/confirmation markers
- render selected annotation emphasis
- support readable visibility with minimal clutter

## 12.2 Chart should not do
- compute market structure logic
- infer business rules from raw data on its own
- own provider fetching logic

## 12.3 Annotation architecture
Annotations should be separate subcomponents for:
- swing markers
- equal-level zones
- breach markers
- reclaim markers
- final signal labels

This allows:
- isolated rendering logic
- easier QA
- easier debug toggles

---

## 13. Explanation panel architecture

The explanation panel is critical for trust.
It should be designed as an architecture feature, not a cosmetic addon.

## 13.1 Responsibilities
- display selected signal details
- show direction and state
- show level type and swept level
- show breach/reclaim timing
- show confidence
- show reasons array
- optionally show raw metrics in debug mode

## 13.2 Input contract
It should consume already structured explanation payloads.
It should not reconstruct reasons itself.

---

## 14. Data provider architecture

## 14.1 Provider abstraction requirement
A provider interface must exist from day one.

Reason:
- implementation may start with fixtures
- later move to one live provider
- later switch providers without rewriting domain logic

## 14.2 Provider lifecycle
1. request symbol/timeframe/range
2. provider returns raw data
3. normalization layer validates and transforms
4. downstream code receives internal candle model only

## 14.3 Provider error handling
Provider errors must become app-safe errors such as:
- unsupported symbol
- unsupported timeframe
- empty response
- malformed response
- timeout
- rate limit

---

## 15. Persistence architecture

Persistence is optional in very first coding steps, but the architecture should reserve space for it.

## 15.1 Possible persisted entities
### Early-stage optional
- user settings presets
- feedback submissions
- beta invite data

### Later-stage likely
- user accounts
- saved workspaces
- watchlists
- signal history
- alert subscriptions
- subscription/billing status

## 15.2 Persistence guideline
Do not let persistence concerns leak into domain modules.
Domain modules should operate on inputs passed to them, not fetch their own data.

---

## 16. Error architecture

The product should fail clearly, not mysteriously.

## 16.1 Error categories
- validation errors
- provider errors
- insufficient-data errors
- settings incompatibility errors
- rendering state errors

## 16.2 Error presentation
User-facing:
- readable, calm language
- clear next step if possible

Developer-facing:
- structured logs
- enough detail to debug normalization or rule failures

---

## 17. Validation architecture

Validation is not just a test afterthought.
For this product it is a core architecture concern because trust depends on rule fidelity.

## 17.1 Validation pillars
1. fixture-based deterministic validation
2. unit-level rule validation
3. integration-level pipeline validation
4. visual QA alignment with chart annotations

## 17.2 Fixture strategy
Maintain a curated set of:
- bullish sweep examples
- bearish sweep examples
- failed sweep examples
- noisy no-signal examples
- edge-case examples

## 17.3 Debug mode support
Architecture should allow optional debug outputs like:
- raw swing points
- cluster bounds
- breach magnitude values
- reclaim window markers
- confidence factors

---

## 18. Security and trust architecture

Even though this is not a banking product, it is still trust-sensitive.

## 18.1 Trust requirements
- visible disclaimer
- no guaranteed-profit language
- no misleading signal framing
- careful marketing copy
- sane config handling for API keys if live providers are used

## 18.2 User safety posture
The system should present itself as:
- analytical support
- probability-based interpretation
- configurable detection engine

Not as:
- trade execution advice
- guaranteed setup confirmation

---

## 19. Deployment architecture

## 19.1 Recommended starting deployment
- Next.js app deployment
- environment-based provider config
- static/public pages plus dynamic workspace
- docs kept in repository

## 19.2 Environments
At minimum:
- local
- preview/staging
- production

## 19.3 Deployment concerns later
- monitoring
- error tracking
- usage analytics
- feature gating
- billing plan enforcement

---

## 20. Observability architecture

Not all observability needs to be built immediately, but the architecture should anticipate it.

## 20.1 Useful signals later
- provider fetch failures
- detector runtime failures
- settings usage patterns
- most-used markets/timeframes
- selected signal types
- false-positive feedback events

## 20.2 Important caution
Do not mix observability instrumentation directly into pure domain functions if it pollutes testability.
Use orchestration boundaries where possible.

---

## 21. Scalability posture

The first version does not need large-scale distributed architecture.
The main scalability requirement is **maintainability**, not server scale.

## 21.1 What should scale well early
- adding new confirmation rules
- adding new annotation styles
- adding a second provider
- adding saved settings
- adding alerts later

## 21.2 What should not be prematurely optimized
- multi-service infrastructure
- distributed queues
- complex caching layers
- high-frequency real-time streaming unless actually needed

---

## 22. Recommended repository structure relationship

This architecture assumes a codebase roughly aligned with:
- `app/` for routes/pages
- `components/` for UI pieces
- `lib/detection/` for domain logic
- `lib/market-data/` for providers and normalization
- `lib/app/` for orchestration and state helpers
- `tests/` for fixture-driven validation
- `docs/` for planning, architecture, QA, and handoffs

The shorter engineering file structure doc should be treated as the concrete companion to this architecture note.

---

## 23. Phase architecture roadmap

## Phase 1 — Core detector foundation
Build:
- candle model
- swings
- equal levels
- sweep detection
- reclaim logic
- explanation payload

## Phase 2 — Usable workspace
Build:
- chart workspace
- annotations
- settings panel
- explanation panel
- error and loading states

## Phase 3 — Validation and trust
Build:
- fixtures
- unit tests
- integration checks
- clearer debug outputs
- docs/disclaimer surface

## Phase 4 — Productization
Build:
- beta funnel
- saved settings
- optional accounts
- launch pages
- early pricing and gating

## Phase 5 — Expansion
Potentially add:
- alerts
- watchlists
- history
- educator plans
- broker embedding

---

## 24. Architecture decisions to preserve

A future Kaino session should preserve these decisions unless there is a strong reason to change them:

1. keep detection logic pure and separated from UI
2. keep provider integration abstracted and normalized
3. keep explanation payloads generated by domain/app layers, not ad hoc in the UI
4. keep validation fixture-driven
5. keep first implementation as a modular monolith
6. keep scope tight before moving to broader platform ideas

---

## 25. Recommended next engineering move

If implementation starts after this architecture document, the correct next sequence is:
1. scaffold repository/app structure
2. define foundational types and contracts
3. implement fixture-backed candle normalization
4. implement detector pipeline from swing -> equal-levels -> sweep -> reclaim -> explain
5. integrate the pipeline into a basic workspace
6. layer chart annotations and panel UX on top

---

## 26. Final guidance

The product will succeed architecturally if this remains true:

- domain rules are understandable
- chart output is derived, not improvised
- settings are controlled and deterministic
- QA is built around documented rules
- docs remain synchronized with implementation reality

That is the architectural standard future sessions should maintain.
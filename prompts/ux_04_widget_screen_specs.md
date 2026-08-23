# Phase 4 — Widget & Screen Specs (file 04)

**Reads:** `ux_00_conventions.md` · `01-foundation/*` · `02-wireframes/*` · `03-system/*` · all handoffs
**Produces:** `04-specs/WIDGET_SPECS.md` · `04-specs/SCREEN_SPECS.md` · `04-specs/RESPONSIVE.md` · `PHASE_04_HANDOFF.md`
**Question:** exactly how does each piece behave?

**Paste `ux_00_conventions.md` first, then this file.**

---

## What a widget is, and why it's the unit here

A **widget** is a self-contained, data-bound, placeable unit: it answers one question, has its own data source, its own permission gate, its own loading and failure behavior, and can be moved between screens without rewriting it.

| Tier | Owns | Data source | Settled in |
|---|---|---|---|
| `SCR-*` | Composition and navigation context | No | Phase 1–2 |
| `WGT-*` | A question answered and an action enabled | **Yes** | **This phase** |
| `CMP-*` | Presentation of a value or control | No | Phase 3 |

Widgets come last because they are the composition of everything before them: a wireframe region, built from Phase 3 components, following Phase 3 patterns, serving a Phase 1 job. Specifying them first — as tempting as it is, because they feel like the real work — means inventing their context.

**Nothing new is invented here.** A widget that needs a component the inventory lacks means returning to Phase 3. A widget that needs a screen region the wireframe lacks means returning to Phase 2. Say so and stop; don't paper over it.

---

## Inputs

```text
PHASE 1–3 OUTPUT:
[paths to 01-foundation/, 02-wireframes/, 03-system/, and handoffs]

ENGINEERING DOCS:
[path to docs/ — needed for API_CONTRACTS, ERROR_CATALOG, STATE_MACHINES, NFRs]

SCOPE FOR THIS RUN:
[which widgets or which screen — a run of 5 to 8 widgets is a healthy batch]
```

---

=== BEGIN PHASE 4 PROMPT ===

You are a senior product designer specifying implementation-ready behavior.

## 4.1 Execution

| Step | Output | Gate |
|---|---|---|
| A | Widget inventory derived from wireframe regions, classes assigned, gaps found | **STOP — approval** |
| B | `WIDGET_SPECS.md`, one widget per response | — |
| C | `SCREEN_SPECS.md` | — |
| D | `RESPONSIVE.md` where applicable | — |
| E | Verification report, `PHASE_04_HANDOFF.md` | **STOP — phase gate** |

In step A, derive the widget list from Phase 2's wireframe regions. Every widget traces to a region; every region that is data-bound becomes a widget. Regions that are pure chrome do not.

## 4.2 The two state axes

Keep them separate. Merging them is why dashboards ship broken.

**Interaction states** belong to components and were settled in Phase 3: default · hover · focus-visible · active · disabled · loading · error · selected/read-only.

**Data states** belong to widgets and are specified here. All nine, every widget, no blanks.

| State | Why it is distinct |
|---|---|
| `loading-initial` | Nothing yet — skeleton matching final layout |
| `loading-refresh` | Data visible — must not blank out, jump, or move focus |
| `empty-no-data` | Nothing exists yet — needs an onboarding action |
| `empty-filtered` | Data exists, filter excluded it — needs a clear-filter action |
| `partial` | Paginated, truncated, or capped — must say so visibly |
| `stale` | Fetch failed or polling paused — data plus an age label |
| `error-fetch` | Request failed — `ERR-*` and a retry affordance |
| `error-permission` | Role cannot see it — hide or explain, per `IX-*` |
| `success` | An action inside the widget completed |

## 4.3 `WIDGET_SPECS.md`

```md
### WGT-DOMAIN-001 — Widget Name
**Implements:** FR-… , BR-…
**Derived from:** WF-… region N
**Appears on:** SCR-… (position from the wireframe)
**Status:** Specified | Blocked (Q-…) | Existing | Change required | New
**Class:** metric | chart | table | list | form | feed | filter | action-panel | custom
**Build type:** Stock | Extended | Custom        ← Profile A only

**Purpose:** the decision or action this enables, in one sentence
**Question it answers:** phrased as the user would ask it
**Glanceable value:** what must be readable in under two seconds
**Next action:** what they do with it, and where that leads

**Data contract**
| Aspect | Value |
|---|---|
| Source | API-… |
| Shape | fields consumed → view model derived |
| Freshness | on-load \| polled Ns \| manual \| live |
| Volume | expected N; behavior beyond N |
| Latency budget | NFR-… |
| Permission | reference PERMISSIONS_MATRIX; do not restate |
| Timezone / locale | how dates and numbers resolve |

**Anatomy** — reading order, components from the Phase 3 inventory only
| Region | Content | Component | Required |
|---|---|---|---|

**Data states** — every row required, `n/a` with a reason is valid, blank is a defect
| State | Trigger | What the user sees | Copy | Recovery |
|---|---|---|---|---|
| loading-initial | | | TXT-… | |
| loading-refresh | | | | |
| empty-no-data | | | TXT-… | |
| empty-filtered | | | TXT-… | clear filter |
| partial | | | TXT-… | |
| stale | | | TXT-… | retry |
| error-fetch | | ERR-… | TXT-… | retry |
| error-permission | | | TXT-… | |
| success | | | TXT-… | |

**Interactions**
| Trigger | Behavior | Result | Pattern |
|---|---|---|---|
| | | | IX-… |

**Sizing and density**
| Breakpoint / container | Span | Min height | Content behavior |
|---|---|---|---|

**Visual hierarchy:** elements ranked 1..n, inherited from the wireframe's priority order,
and what is deliberately de-emphasized
**Tokens:** semantic names only
**Motion:** entry, value-change, refresh — with reduced-motion parity
**Accessibility:** role, accessible name, live-region policy, keyboard contract,
chart alternative, A11Y-…
**Platform binding:** Profile A — base class, column span, polling interval, visibility
method, heading (verify API names against the installed version)
   · Profile B — CSS layout intent · Profile C — native container and size classes
**Open questions:** Q-… with severity
```

### Class-specific requirements

| Class | Also specify |
|---|---|
| **metric** | comparison basis (prior period, target, benchmark) or a documented reason none exists · trend direction semantics — is up good? · precision and rounding · zero and negative treatment · unit placement |
| **chart** | chart type and why that type · axis scales and whether they start at zero · series limit and overflow behavior · legend placement · tooltip contents · colour-blind-safe palette · **table or summary-sentence fallback** |
| **table** | default sort · column set and priority order · resize and reorder · row actions vs. bulk actions · pagination or virtualization · narrow-viewport strategy and which columns survive |
| **list / feed** | item anatomy · grouping and separators · ordering rule · load-more behavior · unread or new-item treatment |
| **form** | field order and grouping · validation timing per `IX-*` · save model · unsaved-changes handling · success destination |
| **filter** | control types · defaults · applied-filter display · clear-all · persistence across sessions and whether filter state is shareable |
| **action-panel** | which actions, their permission gates, destructive treatment, and confirm-vs-undo per `IX-*` |

### Rules enforced at verification

A metric with no comparison basis, a chart with no non-visual equivalent, a widget with no data source, or a widget missing any of the nine data states will fail the gate. These are not stylistic preferences — each prevents a specific, common defect.

## 4.4 `SCREEN_SPECS.md`

Short by design. Widgets carry the detail; screens carry the composition.

```md
### SCR-DOMAIN-001 — Screen Name
**Wireframe:** WF-…  ·  **Implements:** FR-…  ·  **Route:** … | (Proposed)
**Roles:** per PERMISSIONS_MATRIX
**Widgets:** ordered, with grid position and span per breakpoint
**Screen chrome:** masthead, global filters, page-level actions
**Screen-level states:**
| State | Behavior |
| all widgets permission-denied | … |
| all widgets empty | … |
| partial failure (some widgets error) | screen stays usable; failures are local |
**Load strategy:** above-the-fold widgets, lazy widgets, request order
**Entry points and success exit:** from FLOW-…
**Accessibility:** heading hierarchy, landmarks, focus on entry, tab order across widgets
```

Partial failure deserves a real answer on every screen. It is the most common production state after "everything worked" and the least often designed.

## 4.5 `RESPONSIVE.md`

Only if more than one viewport class is in scope; rarely needed in Profile C, where size classes live in the widget specs.

Breakpoints with the reason for each (content-driven, not device-driven) · per-widget span and reflow · navigation transformation · table strategy at narrow widths, naming which columns survive · touch targets and touch equivalents for hover-dependent interactions · widgets deliberately out of scope for small viewports, with the reason.

## 4.6 Verification

```md
# Phase 4 Verification

## Mechanical
`python3 docs/ux/scripts/validate_ux_docs.py --phase 4` → [exit code]
[paste real output]

## Widgets
- Wireframe data-bound regions: N — specified as widgets: n/N; unaccounted: […]
- Referencing ≥1 requirement: n/N; orphans: […]
- With a data source: n/N; missing: […]
- All nine data states addressed: n/N; incomplete: [IDs + which states]
- Placed on ≥1 screen: n/N; orphans: […]
- Blocked: n — [IDs with the blocking Q]

## Widget rules
- Metrics without a comparison basis: […] — must be "none"
- Charts without a non-visual equivalent: […] — must be "none"
- Widgets without a stated time window where time-bounded: […]
- Auto-refreshing widgets that move focus or scroll: […] — must be "none"
- Truncating widgets that don't say so: […] — must be "none"

## Consistency with earlier phases
- Components used that Phase 3 did not define: […] — must be "none"
- Widgets whose hierarchy contradicts the wireframe priority order: […]
- Behaviors specified inline that an IX-* already covers: […]
- Screens whose widget set differs from the wireframe: […] with reasons

## Screens
- Screens with a partial-failure behavior: n/N; missing: […]
- Screens with a load strategy: n/N

## Discipline
- Raw hex, px, or ms values: […] — must be "none"
- Specifications not applicable to the declared profile: […] — must be "none"
- Widgets, fields, or actions with no requirement source: […] — must be "none"
```

## 4.7 Handoff

Write `PHASE_04_HANDOFF.md`. Under **must NOT re-decide**: the widget set and classes, every data-state behavior, the data contracts, and the per-breakpoint sizing.

List for Phase 5: the frame count the Figma manifest must produce (widgets × their states, plus screens × their variants), and the widget build order by dependency.

=== END PHASE 4 PROMPT ===

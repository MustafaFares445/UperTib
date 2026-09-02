# UX Phase 5 Implementation Contracts

**Phase:** UX 5 — Build and Handoff
**Sessions:** 3 of 7 (foundation contracts, build order 1–7, complete) and 4 of 7 (remaining platform
contracts, build order 8–14, complete).
**Input gates:** `docs/ux/05-build/PHASE_05_IMPLEMENTATION_PLAN.md` (Session 1, complete),
`docs/ux/05-build/figma/BUILD_MANIFEST.json` and `docs/ux/05-build/figma/NAMING.md` (Session 2, complete).
**Session 3 wrote:** the seven foundation contracts — `WGT-PLATFORM-001`, `-003`, `-002`, `-004`, `-005`,
`-010`, `-007` — in that build order.
**Session 4 wrote:** the remaining seven platform contracts — `WGT-PLATFORM-006`, `-014`, `-011`, `-008`,
`-013`, `-009`, `-012` — in that build order, completing all 14 platform-level contracts (build order
1–14). Contracts 15–30, the sixteen domain contracts, are not authored here; Session 5 writes them.

Every contract in this file is a complete, self-sufficient instruction set for the coding agent that
later builds the widget it describes. A contract explains **how** to implement behaviour Phases 1–4
already approved. It never states a second version of **what** that behaviour is — where a fact belongs
to a canonical source (`FR-*`, `NFR-*`, `API-*`, `SDC-*`, `ERR-*`, `TXT-*`, `A11Y-*`), this file
references that source by identifier and does not restate, paraphrase or fork it.

---

## 0. Shared preamble

The ten rules below bind every contract in this file, in every session that adds to it. They are
stated once, here, rather than 30 times.

### 0.1 Authority rule

Authority is a strict, one-directional chain. A lower link can be the defect; it can never overrule a
higher one.

```
canonical product and engineering behaviour     docs/PRD.md, docs/SDD.md, docs/domain/*, docs/api/*,
                                                docs/database/*, docs/architecture/*, docs/ops/*,
                                                docs/implementation/*
        v
Product Owner decisions                         .spec/decisions/*, .spec/functional-requirements/*,
                                                .spec/non-functional-requirements/*
        v
Phase 1   165 SCR-*, 103 FLOW-*                 docs/ux/01-foundation/*
        v
Phase 2   165 WF-*, archetypes                  docs/ux/02-wireframes/*
        v
Phase 3   tokens, 22 CMP-*, 26 IX-*, 60 TXT-*, 40 A11Y-*, 18 lifecycle machines, 82 statuses
        v
Phase 4   30 WGT-*, 165 per-screen specifications
        v
Phase 5 implementation contract                 <- THIS FILE
        v
BUILD_MANIFEST.json / the rendered Figma file   <- lowest authority, generated from this chain
```

Two conflict rules, applied identically in every contract below:

1. **Contract vs. Figma.** Where `05-build/figma/BUILD_MANIFEST.json` (or a Figma file rendered from
   it) disagrees with a contract in this file, **the contract wins** and the manifest is the defect.
   The manifest is generated from the specifications; it is never read by a coding agent as a source of
   truth. See `NAMING.md` section 1.
2. **Contract vs. canonical requirement.** Where a contract in this file disagrees with a canonical
   requirement (`FR-*`, `NFR-*`, an `API-*`/`SDC-*` projection, an `ERR-*` message, a Phase 1–4 decision
   listed in `PHASE_03_HANDOFF.md` section 17 or `PHASE_04_HANDOFF.md` section 17), **the requirement
   wins and the contract is the defect.** Report the conflict against the canonical owner; do not
   silently resolve it in the contract's favour.

Nothing is designed in this file. If realizing a widget's approved behaviour would require a new design
or product decision, the contract stops and names the phase that owns the missing decision (section
0.11 restates this as a standing stop condition).

### 0.2 Coding-agent reading order

A coding agent implementing one `WGT-*` reads, in this order, and needs nothing else from
`docs/ux/` to start:

1. This preamble (section 0), once.
2. The one contract for the widget it is building, start to finish.
3. The canonical sources that contract references by identifier — `docs/api/API_CONTRACTS.md` or
   `docs/domain/STAFF_INTERACTION_CONTRACTS.md` for its data/action contract, `docs/api/ERROR_CATALOG.md`
   for any `ERR-*` it surfaces, `docs/database/ERD.md` for the tables it names, and the `TASK-*` item(s)
   it names from `docs/IMPLEMENTATION_PLAN.md` / `docs/implementation/*.md`.
4. Its mandatory `CMP-*` core, in `docs/ux/03-system/COMPONENT_INVENTORY_PLATFORM.md` (or `_DOMAIN.md`),
   for the exact anatomy, variant and token mapping the contract points at rather than restates.

A contract does not require reading any other `WGT-*` contract, any `SCR-*` screen specification, or
any `IX-*`/`TXT-*`/`A11Y-*` block in full — each is cited by identifier at the point the contract relies
on it, with enough of the obligation restated as an implementation assertion to act on (schema section
8, 22) without forking the source text.

### 0.3 Token-only rule

No contract in this file, and no code written from one, names a raw colour, pixel, rem, millisecond or
raw duration value. Every visual or timing value is a semantic or component token reference from
`docs/ux/03-system/design_tokens/*.json` (`primitive` is never referenced directly — Phase 3's own rule,
carried forward unchanged). A component token used by a contract already resolves to the semantic layer;
the contract cites the component token (`component.<cmp-id-slug>.<property>`), not the semantic value
behind it, unless the point being made is specifically about which semantic role is bound.

### 0.4 Build-order rule

Contracts are ordered by the dependency-and-scheduling order `PHASE_05_IMPLEMENTATION_PLAN.md` section
6.5 fixed, never by domain or convenience. Build order 1–7, the scope of this session:

| Order | Widget | Depends on (build order) | Platforms | Profile A realization |
|---:|---|---|---|---|
| 1 | `WGT-PLATFORM-001` | none | C, A | `Extended` |
| 2 | `WGT-PLATFORM-003` | 1 | C, A | `Extended` |
| 3 | `WGT-PLATFORM-002` | 1 | C, A | `Custom` |
| 4 | `WGT-PLATFORM-004` | 1 | C, A | `Stock` |
| 5 | `WGT-PLATFORM-005` | 1, 4 | C, A | `Extended` |
| 6 | `WGT-PLATFORM-010` | 1 | C, A | `Stock` |
| 7 | `WGT-PLATFORM-007` | 1, 2 | C, A | `Extended` |

A coding agent building order *N* may assume every lower build-order contract already exists and is
implemented; it must not assume any higher one exists, including one placed on the same screen. Order
is a dependency floor, not a claim that the two widgets are otherwise related — section 0.4.1.

#### 0.4.1 Build order is not a dependency edge

`PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2 measured exactly six cross-widget edges, quoted from a
Phase 4 statement each time, and no others. Of those six, three touch this session's seven widgets and
are restated in the affected contracts rather than only here:

- `WGT-PLATFORM-001` precedes all other widgets (`WIDGET_SPECS.md` section 3) — every widget in this
  file names this as its sole hard predecessor.
- `WGT-PLATFORM-003` precedes `WGT-PLATFORM-007` — `WGT-PLATFORM-003` **hosts the trigger** for the
  confirmation `WGT-PLATFORM-007` owns; they are one action role in two moments, never two roles
  (`WIDGET_SPECS.md` section 3).
- `WGT-PLATFORM-004` precedes `WGT-PLATFORM-005` — `WGT-PLATFORM-005`'s `empty-filtered` state renders
  "with the applied filter still visible in `WGT-PLATFORM-004`" (its own Phase 4 block).

No other pair among `WGT-PLATFORM-002`, `-004`, `-005`, `-010` carries a build dependency on each other,
even where they co-occur on the same screen. Composing components in common, or appearing on the same
`SCR-*`, is not a dependency (`WIDGET_SPECS.md` section 3: widgets compose components; they do not
compose each other, with only the two named exceptions above).

### 0.5 Figma-derived-not-canonical rule

`05-build/figma/BUILD_MANIFEST.json` is generated from Phases 1–4 and from this file; it is never a
source of truth for code, and a coding agent never reads it or a Figma file rendered from it except as
a visual reference. Where the manifest's `03 · Widgets` frames for a widget in this file disagree with
that widget's contract, the manifest is the defect and is reported against Session 2 rather than
silently reconciled here (`NAMING.md` section 1; `PHASE_05_IMPLEMENTATION_PLAN.md` section 11).

### 0.6 API-\* vs. SDC-\* platform rule

A Patient (Profile C, React Native, `/api/v1`) surface binds only `API-*` contracts from
`docs/api/API_CONTRACTS.md`. A Clinic or Admin (Profile A, Filament panel, in-process) surface binds
only `SDC-*` contracts from `docs/domain/STAFF_INTERACTION_CONTRACTS.md`. This is measured as an
invariant, not a preference — `PHASE_04_HANDOFF.md` section 4: "No Patient screen binds an `SDC-*`
contract and no staff screen binds an `API-*` contract." No contract in this file invents a REST
endpoint for a Filament surface, and none invents an in-process command for the Patient app, even where
one would be convenient to specify (`PHASE_04_HANDOFF.md` section 17).

### 0.7 Zero-money-movement boundary

No V1 surface, endpoint, job, Filament action or contract described in this file authorizes, captures,
holds, transfers, settles or refunds money. Where a widget renders or commits a financial fact, that
fact is an externally performed event being recorded, confirmed, disputed or reported on — never a
platform-executed money movement. Canonical statement (`docs/PRD.md`, `FR-FINANCE-007`): "UberTib V1 is
a financial-management record system only; it has no gateway, wallet, escrow, card/bank credential
storage, automated settlement, or custody of funds," and "the zero-money-movement boundary is
code-and-domain enforced and is not a configuration toggle." No contract in this file introduces a pay,
wallet, balance, top-up, withdraw or platform-refund affordance, and none permits wording that implies
UberTib held, paid, insured or refunded money.

### 0.8 Open `Q-*` handling

Seven `Q-*` are open at the start of this session, unchanged since Session 1 and Session 2, and none is
closed by any contract in this file:

| ID | Effect on this file |
|---|---|
| `Q-PLATFORM-001` | No effect on any contract's content. |
| `Q-CATALOG-001` | No contract in this session touches catalog content directly; none asserts approved medical/catalog content. |
| `Q-ELIG-001` | `WGT-PLATFORM-004`'s Patient discovery example references `API-ELIG-001`, whose response is already specified to carry no internal `S`/`P`/`H`/`I`, calibration, comparison or confidence value — this file adds no eligibility content and repeats none of those values. |
| `Q-PLATFORM-002` | No effect. |
| `Q-OPS-001` | No contract in this file names a storage, scanning, one-time-code or notification vendor. |
| `Q-PLATFORM-004` | No effect. |
| `Q-PLATFORM-008` | Every contract references semantic and component tokens only; none names a colour. |

A contract that appeared to require closing one of these to be written would be a stop condition
(section 0.11), not a contract decision. None of the seven forced a stop in this session.

### 0.9 Existing-vs-Proposed target-path rule

Every target file or target area named in section 12 of a contract carries one of exactly three tags,
transcribed from `PHASE_05_IMPLEMENTATION_PLAN.md` section 7 and re-verified against the live repository
at the start of this session (`app/Filament`, `app/Policies` and `app/Providers/Filament` were inspected
directly; findings in section 0.9.1):

- **Existing** — the path is present in the repository right now.
- **Proposed** — the path does not exist yet, but a canonical engineering document (an `ADMIN_`,
  `CLINIC_` or `USER_IMPLEMENTATION_PLAN.md` `TASK-*`, or `docs/IMPLEMENTATION_PLAN.md`) already names
  it as the area that `TASK-*` will create.
- **Proposed, path unverified** — the Patient React Native project itself. `TASK-PLATFORM-008` records
  that no React Native project, path, or build/test/lint command exists or is verified anywhere in this
  repository. No contract in this file, or in any future session, invents a concrete `.tsx` path,
  package script, or test command for it; each names the Proposed target **area** only (`RN shared`,
  `RN chrome`, etc., per `PHASE_05_IMPLEMENTATION_PLAN.md` section 5.3) and defers the concrete path and
  every verification command to `TASK-PLATFORM-008`.

No contract invents a fourth category, and no contract upgrades a Proposed path to Existing because the
path would be conventional (`PHASE_05_IMPLEMENTATION_PLAN.md` section 3.2: "Phase 5 does not create a
third category for the Patient client").

#### 0.9.1 Repository state re-verified for this session

Re-inspected directly (not carried forward from Session 1's text) immediately before authoring:

| Path | Status | Evidence |
|---|---|---|
| `app/Providers/Filament/AdminPanelProvider.php` | **Existing** | Only file under `app/Providers/Filament/`. |
| `app/Filament/` | **Does not exist** | Directory absent; `find app/Filament` returns nothing. |
| `app/Policies/` | **Does not exist** | Directory absent. |
| `routes/api.php` | **Existing**, one route | `GET /api/v1/catalog/service-groups` only. |
| `app/Providers/Filament/ClinicPanelProvider.php` | **Does not exist** | Not present anywhere in `app/`. |
| React Native project (any `metro.config.js`, RN `app.json`, `.tsx` source) | **Not found** | No such file anywhere in the repository. |
| `filament/filament` | `5.7.6` installed (`composer show --direct`) | Confirms the Admin panel runtime is real Filament v5, not a placeholder. |
| `spatie/laravel-permission` | `8.3.0` installed | Available for the coarse role/capability layer `PERMISSIONS_MATRIX.md` section 20 names; resource/relationship scope still requires policies, which do not exist yet. |

Nothing in this re-verification contradicts `PHASE_05_IMPLEMENTATION_PLAN.md` section 7.

### 0.10 Verification-tier rule

Every "Verification" section in this file (schema item 29) is split into exactly three tiers, and a
Tier C item is never reported as passing, inferred from a green Tier A gate, or softened into "expected
to pass":

- **Tier A — mechanically verifiable in this repository, today.** Documentation and referential gates:
  `python docs/scripts/validate_docs.py`, `python docs/ux/scripts/validate_ux_docs.py --phase 1` through
  `--phase 5`, `python docs/ux/scripts/validate_ux_tokens.py`, `python scripts/check_no_emoji.py` (root
  and `docs`), plus the contract-level extensions this session adds (section 0.12).
- **Tier B — rendered design QA.** Needs a rendered artifact (a Figma frame, a static HTML harness) but
  not a running application: `measure_render.mjs`, `verify_states.mjs`, `axe_audit.mjs`,
  `taste_audit.mjs`, `lint_hardcodes.py`, `validate_theme_refs.py`, `verify_responsive.mjs`.
- **Tier C — runtime QA, after implementation.** Cannot run in Phase 5 at all. Enumerated per obligation
  in `docs/ux/03-system/ACCESSIBILITY.md` section 25 ("Requires rendered UI in Phase 5") and restated,
  per contract, only for the obligations that widget actually carries. Every Tier C line in this file is
  written as `not run — requires implementation`, never as passing.

### 0.11 Stop condition

If realizing any obligation below required a new design or product decision, this session stops and
names: the widget, the affected `SCR-*`, the missing decision, its authoritative upstream source, and
the phase that owns it — rather than inventing the decision. No stop was required while authoring
contracts 1–7; every obligation resolved against an existing Phase 1–4 statement or a canonical
engineering document.

### 0.12 Contract schema and field-label conventions

Every contract in this file uses the identical 29-section schema (`PHASE_05_IMPLEMENTATION_PLAN.md`
section 10.2, with the repository-specific additions that section defines). Field labels inside
"Identity" are fixed strings so a mechanical check can find them:

```
- **WGT ID:** WGT-<DOMAIN>-<NNN>
- **Name:** <name>
- **Build order:** <integer>
- **Platforms:** C, A | C | A
- **Runtime:** <RN(RN target) + Filament(panel(s))>
- **Phase 4 realization:** Profile C `<Native|n/a>`; Profile A `<Stock|Extended|Custom|n/a>`
- **Screen reach:** <n> of 165
- **Source specification:** docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md, `WGT-<ID>` block
```

A "Target files" row (schema item 12) always ends its **Status** cell with exactly one of `Existing`,
`Proposed` or `Proposed, path unverified` (section 0.9). A "Verification" section (schema item 29)
always contains the three headings `Tier A`, `Tier B`, `Tier C` in that order, and every Tier C line
ends with the literal phrase `not run — requires implementation`.

---

### WGT-PLATFORM-001 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-001
- **Name:** Structural state region
- **Build order:** 1
- **Platforms:** C, A
- **Runtime:** RN shared component (Proposed, path unverified) + Filament `app/Filament/Support` (Proposed) — usable from the existing `admin` panel and the Proposed `clinic` panel alike
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 165 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-001` block

#### 2. Implements

- `FR-PLATFORM-001`
- `NFR-PLATFORM-006`

No other requirement is attached. This widget's obligation is exactly the nine-data-state resolution
and rendering `FR-PLATFORM-001`/`NFR-PLATFORM-006` cover; it does not acquire a requirement that belongs
to the host surface's own data or command.

#### 3. Used by

**All 165 screens — every documented `SCR-*`, on every platform.** `WGT-PLATFORM-001` is the one widget
with no exclusion: `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`'s own block states "Placed on: all 165
screens, all 165 `WF-*`," and this is independently confirmed against every row of
`docs/ux/04-specs/SCREEN_SPEC_MAP.md` (Session 3 re-verification: 47/47 Patient, 56/56 Clinic, 62/62
Admin bind `WGT-PLATFORM-001`; zero exceptions in any of the three platform tables). The full 165-ID
list is therefore the complete `SCR-*` inventory in `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md`
and every row of `SCREEN_SPEC_MAP.md`; it is not reproduced here because there is no subset to name —
naming an exclusion list, as contracts 2 and 3 below do, would misstate this widget as having one.

#### 4. Widget dependencies

- **Required predecessor:** none. Build order 1 — this is the widget every other widget in the product
  depends on.
- **Not a build dependency, but a standing precedence relationship every other widget assumes:**
  `WGT-PLATFORM-001` is resolved **before** any other widget renders content on a surface
  (`docs/ux/04-specs/WIDGET_SPECS.md` section 3: "is resolved BEFORE any other widget renders content.
  Every other block states what it does under each state rather than re-implementing the precedence.").
  This is a rendering-order contract every widget honours, not an edge in the build graph — no other
  widget's *code* must exist before this one builds; every other widget's *behaviour spec* assumes this
  one already governs the surface's structural state when it is read.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here | Key anatomy this widget relies on |
|---|---|---|
| `CMP-PLATFORM-009` — Empty state | Renders `empty-no-data` and `empty-filtered` | `icon` (optional) → `statement` → `why` (optional) → exactly one `action`. Variants used: `no-data`, `filtered-empty`. Never renders during a read (its own "error" row states an empty state during loading is a false statement) and never as a substitute for a failed read. |
| `CMP-PLATFORM-010` — Recovery state | Renders `stale`, `error-fetch`, `error-permission`, and (Profile C offline) the client-side stale condition | Variants used: `fetch-failure`, `stale`, `permission-denied`; `unknown-outcome`/`authentication-required`/`not-retryable` are out of this widget's own state vocabulary and belong to the widgets that own commits (`WGT-PLATFORM-003`, `-007`, `-010`). Anatomy: `icon` + `what failed` → `what is still true` → `what to do now` → at most one `action`. **No start-edge accent strip in any variant.** |

**Conditional (composed only where the row states):**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | The owning surface has an in-flight mutation concurrently with a structural read (e.g. a page whose action bar is committing while this region also governs the page's own read) |
| `CMP-PLATFORM-003` — Subject context header | Preserving safe context under an `error-permission`/`stale`/`error-fetch` resolution, so the actor is never shown a denial or a failure with no record identity attached |

Every identifier above resolves in `docs/ux/03-system/COMPONENT_INVENTORY_PLATFORM.md`. This contract
does not restate their token tables; implement against the component's own anatomy, variant and
`component.platform-00{9,10,11,3}.*` token mapping there.

#### 6. Interaction dependencies

- **`IX-PLATFORM-017` (owner) — Structural state resolution.** This is the algorithm this widget *is*.
  Quoted in full because every other section of this contract depends on it and no coding agent may
  re-derive or approximate it:

  1. **`error-permission` wins over everything.** An actor outside scope is told that, not that the set
     is empty.
  2. **`error-fetch` next, unless a previous good projection exists, in which case `stale` is
     preferred** — labelled, with its as-of time. Stale and labelled beats blank.
  3. **`loading-initial`** while no content exists; **`loading-refresh`** while content does.
  4. **`empty-filtered`** where a filter is applied; **`empty-no-data`** only where none is.
  5. **`partial`** where some of the surface loaded and some did not, naming which part failed.
  6. **`success`.**

  This precedence is fixed and is never a per-surface choice, never reordered, and never re-implemented
  inside a screen. The two failure modes it exists to prevent: an empty state shown during a read (a
  false statement), and an error shown as an empty state (which tells the actor nothing is wrong).

- **`IX-PLATFORM-003` — Authoritative read refresh and staleness disclosure.** Governs *when* the host
  surface re-reads (entry, refocus, explicit refresh, post-mutation) — this widget renders the outcome
  of that re-read through the precedence above; it does not itself decide when to re-read.
- **`IX-PLATFORM-007` — Authorization loss and permission denial.** Governs what happens once
  `error-permission` is resolved: stale actions removed structurally (never disabled), `CMP-PLATFORM-003`
  reflects the changed scope, no retry offered, the actor is told what scope they do hold.
- **`IX-PLATFORM-013` — Reduced-motion parity.** Governs the transition between two resolved structural
  states: travel removed under reduced motion, the feedback (a state actually changed) preserved.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-007` — Empty states | Canonical, audience-neutral formula | The four-way distinction: no-data / filtered-empty / partial / stale, each with its own sentence formula. Governs `CMP-PLATFORM-009` copy and the `partial`/`stale` half of `CMP-PLATFORM-010`. |
| `TXT-PLATFORM-008` — Loading states | Canonical formula | `loading-initial` (skeleton, no mandatory text) and `loading-refresh` (existing content marked "updating") wording. |
| `TXT-PLATFORM-009` — Offline and weak network | Canonical formula | The offline/unstable-connectivity condition: stated plainly, last-known data kept visible and timestamped, a retryable transfer failure never worded as a rejection. |
| `TXT-PLATFORM-016` — Permissions | Canonical formula | `error-permission` wording: never names an internal permission key, never implies an override, states the legitimate path to the right scope where one exists. |
| `TXT-PLATFORM-019` — Structural state and archetype copy | Canonical, per-archetype extension of the two rules above | Per-archetype application (`dashboard`, `list-and-detail`, `form`, `workspace`, `detail`) of the empty/loading formulas this widget renders. |

This widget owns no copy of its own; every string it renders resolves to one of the five `TXT-*` rules
above, applied per component and per archetype. No canonical `ERR-*` message is restated here —
`docs/api/ERROR_CATALOG.md` owns those strings; this widget (through `CMP-PLATFORM-010`) owns only what
the actor does next.

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-033` (owner) — Data-state accessibility matrix | Every one of the 9 states plus offline maps to a defined Meaning / Existing-content / Screen-reader / Focus / Recovery behaviour (WCAG 4.1.3). `error-permission` **takes precedence over every other state, including an otherwise-empty result** — a permission failure must never read as a quiet, empty queue. `stale`/offline: last known data stays visible marked as-of; resume from the point of interruption, never a restart from zero. |
| `A11Y-PLATFORM-006` — Focus movement after mutation, error, and structural-state replacement | When this region **replaces** content the actor was reading, focus moves to the new block and is announced (WCAG 2.4.3, 4.1.3). A refresh that does not replace a focused element's container never moves focus. |
| `A11Y-PLATFORM-011` — Live-region announcement policy | `error-fetch` and `error-permission` announce **assertively**; `stale`, `empty-*` and `partial` announce **politely**; `loading-*` never announce (WCAG 4.1.3). An individual skeleton cell appearing during initial load is never announced. |
| `A11Y-PLATFORM-015` — No colour-alone communication | The resolved state consumes its full tone/icon/emphasis triple from `semantic.state.json`; a rendering that shows only the tone (a coloured surface with no icon and no label) is a defect, not a variant (WCAG 1.4.1). |
| `A11Y-PLATFORM-024` — Reduced-motion parity | The transition between two resolved structural states has a defined reduced-motion equivalent (`design_tokens/motion.json` `reduced-motion`): travel removed, the fact that content changed still confirmed (WCAG 2.3.3, 2.2.2). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*` or `SDC-*` of its own.** Its Phase 4 data source is "the owning
surface's own contract... The region reads no data of its own; it renders the outcome of the surface's
read." Two representative examples Phase 4 names, referenced by ID only (their projections are the
hosting widget's concern, not restated here):

- **`API-PLATFORM-002`** (Patient Notification Center, `docs/api/API_CONTRACTS.md`) — on the Patient
  attention-and-notification surface, this widget resolves state from that endpoint's own read.
- **`SDC-OPS-001`** (Staff Work Queue, `docs/domain/STAFF_INTERACTION_CONTRACTS.md`) — on a panel work
  surface, this widget resolves state from that command's own read.

On every other one of the 165 screens, this widget resolves state from **that screen's own declared
`API-*` (Profile C) or `SDC-*` (Profile A) contract**, per the platform rule in section 0.6. A coding
agent implementing this widget on a given surface reads that surface's own screen specification
(`docs/ux/04-specs/SCREEN_SPECS_*.md`) for which contract applies there; this contract never invents one.

#### 10. Shared application-layer prerequisites

This widget owns no data model, so it has no data-layer `TASK-*` prerequisite of its own — the read it
renders the outcome of is supplied by whichever `TASK-*` builds the **host** surface's own contract,
which is out of this contract's scope (named per-screen, per section 9).

The prerequisite this contract does own is the **shared rendering primitive existing in each runtime's
own code area**:

- **Profile A (Filament):** `TASK-PLATFORM-001` — "Harden the Existing Admin Panel Boundary." Its
  `Expected Files / Areas` already names `app/Filament/*` (Proposed) as the area a shared Filament
  support class belongs in. `app/Providers/Filament/AdminPanelProvider.php` (Existing) is the panel this
  primitive is first usable from; `TASK-PLATFORM-005` ("Create the Separate Clinic Filament Panel")
  is the prerequisite for the same primitive to be reachable from the `clinic` panel.
- **Profile C (React Native):** `TASK-PLATFORM-008` — "Bootstrap and Baseline the React Native Patient
  Application." Its scaffolding (`src/` feature/shared areas, Proposed, path unverified) is the
  prerequisite for a shared structural-state component to exist at all on Profile C.

#### 11. Data model prerequisites

**n/a.** This widget's own Phase 4 block states plainly: "The region reads no data of its own; it
renders the outcome of the surface's read." It binds no ERD table. Each host surface's own data model
prerequisite (named in that surface's own screen specification) is what actually backs the read this
widget renders the resolved outcome of.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN shared component | Patient React Native project — exact path not yet determined | Proposed, path unverified |
| Filament shared support class | `app/Filament/Support/` (a structural-state Blade/PHP helper usable from any panel resource, page or widget) | Proposed |
| Existing panel this becomes usable from first | `app/Providers/Filament/AdminPanelProvider.php` | Existing |
| Second panel this becomes usable from once it exists | `app/Providers/Filament/ClinicPanelProvider.php` | Proposed |

No concrete class name, file name or React Native import path is specified beyond the target area, per
section 0.9: the Patient path is unverified, and no Filament resource/page/widget yet exists to attach
the support class to.

#### 13. Data/view-model mapping

This widget consumes a **resolved structural state**, not a projection field. The view-model
responsibility it needs from every host surface, regardless of that surface's own `API-*`/`SDC-*`
shape, is a small value object the host's own data-fetch layer already needs to track for other reasons:

| Canonical concept (host's own read) | View-model field this widget consumes |
|---|---|
| Read in flight, no prior content | `phase: "loading-initial"` |
| Read in flight, prior content held | `phase: "loading-refresh"` |
| Read succeeded, result set size | `phase: "empty-no-data" \| "empty-filtered" \| "success"`, plus `filterApplied: boolean` (drives which empty variant) |
| Read succeeded, some sub-regions failed | `phase: "partial"`, plus `failedRegions: string[]` naming which part |
| Read failed, prior good projection held | `phase: "stale"`, plus `asOf: timestamp` (the prior read's own timestamp, not "now") |
| Read failed, no prior projection | `phase: "error-fetch"` |
| Read failed on authorization | `phase: "error-permission"` |

No new response field is invented on any `API-*`/`SDC-*` contract — every value above is derived
client-side from the host's own existing fetch/query state (loading flag, error type, whether a filter
is active, whether a prior successful read exists), which every client already tracks to drive its own
network layer. This widget's implementation is a pure function from that state to one of the nine
resolved phases via the `IX-PLATFORM-017` precedence in section 6, not a second data fetch.

#### 14. Refresh / caching / polling

Event-driven only, per `IX-PLATFORM-003`: entry to the surface, refocus after backgrounding, an
explicit refresh the actor triggers, and completion of the surface's own mutation. **No polling
interval, cache TTL, or retry count is specified here or invented** — none is supported upstream for a
generic structural region. Where a host surface's own contract specifies a polling or refresh cadence,
that cadence belongs to that surface's own contract, not to this widget.

#### 15. Idempotency / correlation

**Not applicable.** This widget issues no command. Its one interactive control — retry, in the
`stale`/`error-fetch` variants — re-invokes the host surface's own **read**, which is naturally
idempotent (a `GET`/read-side command carries no idempotency-key contract under `NFR-AUDIT-002`, which
applies to mutations). Any commit this widget's host surface performs is that surface's own action
region's concern (`WGT-PLATFORM-003`, `WGT-PLATFORM-007` or `WGT-PLATFORM-010`), not this one's.

#### 16. Permission gate

This widget **enforces no permission itself.** It renders the visual and accessibility-tree consequence
of a permission failure that the **host surface's own server-side check already produced** — hiding a
control or region here is never the authorization decision. The canonical enforcement point is
whichever policy/gate protects the host's own `API-*` or `SDC-*` read (named per-screen, section 9);
`docs/domain/PERMISSIONS_MATRIX.md` section 19 requires that decision be enforced identically across
`/api/v1`, both Filament panels, jobs, work queues, reports and notifications — this widget never
substitutes for that. UI consequence on denial: `CMP-PLATFORM-010`'s `permission-denied` variant
renders in place of the surface, per `IX-PLATFORM-007`; stale actions elsewhere on the surface are
removed structurally (never disabled), and no retry control is offered.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `phase` | one of the 9 states + `offline` | Yes | none | Host surface's fetch/query state, resolved via `IX-PLATFORM-017` | The only required input; everything else conditions on it |
| `asOf` | timestamp | Only for `stale`/offline | none | Host's last successful read | Must be the prior read's timestamp, never "now" |
| `failedRegions` | string[] | Only for `partial` | `[]` | Host's own per-region fetch outcome | Names which part failed; never left implicit |
| `filterApplied` | boolean | Only for `empty-*` | `false` | Host's own applied-filter state (from `WGT-PLATFORM-004` where present) | Selects `empty-no-data` vs `empty-filtered` |
| `onRetry` | callback | Only for `stale`/`error-fetch` | none | Host's own re-read function | Absent (not disabled) on `error-permission` and on any `not-retryable` condition |
| `inFlightMutation` | boolean | No | `false` | Host's own commit state | Drives whether `CMP-PLATFORM-011` composes alongside this region |

No configurable value beyond the above is accepted — a polling interval, retry count, or cache TTL prop
would contradict section 14 and is not offered.

#### 18. State rendering

| State | Renders |
|---|---|
| `loading-initial` | `CMP-PLATFORM-009`/`-010` absent; skeleton at content height (`CMP-PLATFORM-001`'s own `content` region substitute). No empty state, no error state, no recovery action. Marked busy once, not narrated cell by cell. |
| `loading-refresh` | Existing content stays fully visible and interactive; focus never stolen. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data`, with the one action that creates a first record. Announced only when it replaces a previously populated set. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`, applied filter still visible (in the host's own `WGT-PLATFORM-004` where present), distinct wording and recovery from the row above. |
| `partial` | The loaded region renders; the failed region names which part failed and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale`. Previous good projection, marked with its as-of time, plus retry. Preferred over `error-fetch` whenever a prior projection exists. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved (composing `CMP-PLATFORM-003` where applicable), retry in place. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state. No retry. Stale actions removed structurally, not disabled. |
| `success` | Content — this region is transparent. |
| Offline / unstable | Treated as `stale` with a client-side cause: last known data, as-of time, and a clear statement of the condition per `TXT-PLATFORM-009`. Resumes without requiring the actor to notice. |

#### 19. Lifecycle/state semantics

**This widget does not own lifecycle status.** The nine states above are a *structural / fetch*
vocabulary (`IX-PLATFORM-017`), a different axis from the *lifecycle status* vocabulary (the 18 machines
and 82 statuses in `semantic.state.json`, rendered by `CMP-PLATFORM-001` and owned by
`WGT-PLATFORM-005`/`-006`). Where this widget's conditional `CMP-PLATFORM-003` composition shows a
record's lifecycle status alongside a preserved-context header, that binding belongs to
`CMP-PLATFORM-003`'s own contract, not to this widget — this widget only decides *whether* to compose
it, under `error-fetch`/`error-permission`/`stale`.

#### 20. Tokens

Component tokens only, resolved to the semantic layer by their own component's token mapping (section 5
— not reproduced here): `component.platform-009.*` (empty states), `component.platform-010.*` (recovery
states, tone-parameterised per variant — `fetch-failure`/`stale` → `tone.warning`; `permission-denied` →
`tone.restricted`), `component.platform-011.*` (conditional, submission indicator), `component.platform-003.*`
(conditional, context header). No raw colour, dimension or duration value appears in this widget's
implementation.

#### 21. Content

All copy resolves to `TXT-PLATFORM-007`, `-008`, `-009`, `-016`, `-019` (section 7) — canonical,
audience-neutral formulas applied per state and per archetype. No `ERR-*` message string is duplicated
here; `CMP-PLATFORM-010` references the catalog entry by ID and this widget adds no wording of its own
beyond selecting which recovery guidance the resolved variant calls for.

#### 22. Accessibility contract

- **Role/name:** the resolved block is a labelled region; its accessible name states the resolved
  condition ("no results," "couldn't load," "you don't have access to this"), never a bare icon.
- **Focus:** when this region **replaces** content the actor was reading, focus moves into the new
  block and it is announced (`A11Y-PLATFORM-006`). The recovery action, where present, is the first
  control inside the block, reachable without traversing it.
- **Keyboard:** each structural state's action is reachable without traversing the whole block; no
  action is offered for `permission-denied` or `not-retryable`, so none is present to reach.
- **Screen reader:** `error-fetch`/`error-permission` announce assertively; `stale`/`empty-*`/`partial`
  announce politely; `loading-*` never announce (`A11Y-PLATFORM-011`).
- **Announcement behaviour:** exactly one announcement per resolved transition, at the state's own
  politeness level; no unlisted transition produces one.
- **No-colour-only:** every resolved state consumes its full tone/icon/emphasis triple; a tone rendered
  without its icon and label is a defect (`A11Y-PLATFORM-015`).
- **Text scaling:** headline and explanation wrap; neither truncates at any text size; the recovery
  action stays reachable without horizontal scrolling at the largest supported size.
- Profile A and Profile C carry identical obligations above; no split is required for this widget.

#### 23. RTL / bidi

- Blocks are start-aligned or centred by logical property and mirror without change — no physical
  `left`/`right` positioning anywhere in this widget.
- **Bidi isolation class: `date`/`time`.** The as-of timestamp inside Arabic text (`stale`, offline) is
  bidirectionally isolated so it cannot be reordered.
- No directional icon is used by this widget's own anatomy (its icons — empty-state icon, recovery
  icon — are non-directional per `A11Y-PLATFORM-031` and do not mirror).

#### 24. Responsive behavior

- **Profile C:** occupies the reading column at every size class (`compact`, `medium`, `expanded`).
- **Profile A:** occupies exactly the content region it replaced, so replacing a table's body does not
  collapse the page's own grid; content width follows the host surface's own `contentWidth`.
- Text scaling: at 200% platform text size / browser zoom, the recovery action stays reachable without
  horizontal scrolling (`IX-PLATFORM-011`).

#### 25. Immutability / historical safety

**n/a.** This widget renders no record — it renders the resolved condition of a read. It has no rows,
snapshots or events of its own to protect from a generic edit or delete affordance; that protection
belongs to the host widgets (`WGT-PLATFORM-005`, `-006`) that do render one of the nine immutable or
append-only entities (`UX_FOUNDATION.md` section 5.1).

#### 26. Framework defaults to disable

Profile A, `Extended`:

- Filament's default "no records" empty-state copy and icon are **replaced**, not merely relabelled, so
  the `no-data`/`filtered-empty` distinction this widget exists to hold is not collapsed back into one
  generic string by the framework default.
- Filament's default failure handling (a toast/flash notification only, with the page left in its prior
  state) is **not** relied on for `stale`/`error-fetch` — this widget renders the recovery block in
  place, inside the surface, because a toast that disappears does not satisfy `A11Y-PLATFORM-011`'s
  persistent-block requirement.
- Filament ships no `permission-denied` or `unknown-outcome` in-place block; its default response to an
  authorization failure (a redirect, an HTTP 403 page) is **not used** while a surface is already open —
  `permission-denied` renders in place, per `IX-PLATFORM-007`, so the actor sees the denial in context
  rather than being redirected out of the surface they were reading.

#### 27. Prohibitions

Restated from the widget's own Phase 4 block, as testable negatives:

1. An empty state must never render while a read is in flight.
2. An error must never render as an empty set.
3. A spinner must never be the only feedback for a mutation (that is `CMP-PLATFORM-011`'s obligation,
   composed conditionally by this widget, never substituted with a bare spinner here).
4. A permission failure must never render as a quiet empty queue.
5. A partial read must never be presented as complete.
6. A retry control must never appear on `permission-denied` or on a `not-retryable` failure.

#### 28. Definition of Done

- [ ] All nine data states plus offline render exactly per section 18, via the `IX-PLATFORM-017`
      precedence in section 6, with no per-surface reordering.
- [ ] No two structural states render simultaneously on one surface.
- [ ] `CMP-PLATFORM-009`/`-010` compose per their own token mapping; no raw value anywhere.
- [ ] `error-permission` never renders as empty; `partial` never renders as complete.
- [ ] Focus moves into a replacing structural-state block and is announced, per `A11Y-PLATFORM-006`.
- [ ] Every state's copy resolves to `TXT-PLATFORM-007/-008/-009/-016/-019`; no invented wording.
- [ ] RTL: blocks mirror by logical property; the as-of timestamp is bidi-isolated.
- [ ] Responsive: Profile C reading column at every size class; Profile A content region unchanged.
- [ ] None of the six prohibitions in section 27 is violated on any surface this widget governs.
- [ ] No regression to `WGT-PLATFORM-003`/`-005`/`-007`/`-010` on a surface where this region and one of
      them coexist (this widget resolves first, per section 4; the others must still resolve their own
      state correctly once it has).

#### 29. Verification

**Tier A — mechanically verifiable in this repository, today:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — this contract exists, names its build order,
  its mandatory `CMP-*` core resolves, its path status is declared.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B — rendered design QA (needs a rendered harness, not a running app):**
- `node scripts/verify_states.mjs <file>` — real computed contrast for the `CMP-PLATFORM-009`/`-010`
  tone/icon/emphasis triples in default/hover/focus, light mode (V1 is light-only).
- `node scripts/measure_render.mjs <file>` — rendered WCAG contrast on the resolved block.
- `node scripts/verify_responsive.mjs <file>` — no horizontal overflow at the narrow verification
  widths (280, 320 and 414 CSS pixels).
- `node scripts/axe_audit.mjs <file>` — ARIA role/name/live-region structure.

**Tier C — runtime QA, after implementation (all: not run — requires implementation):**
- Focus actually moves into a replacing block and is announced by a real screen reader — not run —
  requires implementation.
- `error-fetch`/`error-permission` announce assertively and `stale`/`empty-*`/`partial` announce
  politely, verified with VoiceOver and TalkBack in Arabic — not run — requires implementation.
- The nine-state precedence resolves correctly on real network transitions (a live read that fails
  after a prior success actually renders `stale`, not `error-fetch`) — not run — requires implementation.
- Reduced-motion branching actually verified on a real device/browser — not run — requires
  implementation.
- Real accessibility-tree behaviour for `permission-denied` (no retry control present, not merely
  hidden by CSS) — not run — requires implementation.

---

### WGT-PLATFORM-003 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-003
- **Name:** State-gated action region
- **Build order:** 2
- **Platforms:** C, A
- **Runtime:** RN shared component (Proposed, path unverified) + Filament page and table actions (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 161 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-003` block

#### 2. Implements

- `FR-AUDIT-003`
- `FR-BOOKING-003`
- `NFR-AUDIT-002`

#### 3. Used by

**161 of 165 screens.** Absent from exactly 4, confirmed against every row of `SCREEN_SPEC_MAP.md`:

- `SCR-CATALOG-001` (Service groups) and `SCR-CATALOG-002` (Service detail) — Patient app; pre-identity
  reading surfaces whose only affordance is navigation.
- `SCR-AUDIT-002` (Audit event detail) — Admin; an immutable audit fact with no command.
- `SCR-PLATFORM-008` (Operational health) — Admin; a signal board whose every route is navigation into
  an owning surface.

All other screens (45 of 47 Patient, all 56 Clinic, 60 of 62 Admin) bind this widget. The full 161-ID
list is the complete `SCR-*` inventory minus these four; it is not reproduced in full because the
canonical, exact and complete way to name a 161-of-165 set is its 4-item complement, per source
`SCREEN_SPEC_MAP.md`.

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1). This widget's `loading-initial`,
  `stale`, `error-fetch` and `error-permission` rows exist only because `WGT-PLATFORM-001` has already
  resolved which structural state the surface is in; this widget then further gates *actions* within
  the `success`/`partial` structural states.
- **This widget is itself a required predecessor of `WGT-PLATFORM-007` (build order 7)** —
  `WGT-PLATFORM-003` **hosts the trigger** for the sensitive-decision confirmation
  `WGT-PLATFORM-007` owns. Trigger and confirmation are one action role in two moments, never two roles
  (`WIDGET_SPECS.md` section 3). See `WGT-PLATFORM-007` contract section 4.
- **Not a build dependency:** co-occurrence with `WGT-PLATFORM-004`, `-005`, `-010` on the same screen
  (e.g. a row action inside `WGT-PLATFORM-005`'s `row` variant reuses this widget's own `row` variant —
  a compositional reuse of `CMP-PLATFORM-004`, not a widget-to-widget build edge).

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-004` — Action bar | The whole widget. Variants used: `page`, `row`, `sticky` (Profile C), `readonly` (over one of the nine immutable entities — reads/exports only). Anatomy: `primary` → `secondary`(s) → `destructive` (separated, at `end`) → `absent-action explanation` (one line per removed action) → `submission state` (`CMP-PLATFORM-011` inline). |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | An action on this region is in flight (the `inline` variant, beside the invoked action) |
| `CMP-PLATFORM-014` — Sensitive confirmation | An action is sensitive/irreversible/destructive/authoritative. **The confirmation itself is `WGT-PLATFORM-007`**, not this widget — this widget only hosts the trigger that opens it. |
| `CMP-PLATFORM-005` — Deadline indicator | An action is deadline-bearing (e.g. "respond before X") |

#### 6. Interaction dependencies

- **`IX-PLATFORM-001` (owner) — Server-committed mutation.** Governs the commit contract this widget's
  trigger enters: request sent with its idempotency key, interface renders **submitting** not
  **submitted**, no re-submission of the same intent while in flight, on a committed response the
  surface **re-reads authoritative state** rather than rendering a client prediction.
- **`IX-PLATFORM-002` — Idempotent retry.** A retryable failure's retry reuses the **original**
  idempotency key; a new key is never issued automatically. Zero duplicate outcomes on a network retry
  of an already-committed command.
- **`IX-PLATFORM-007` — Authorization loss and permission denial.** Stale actions are **removed**, not
  disabled, the moment a grant is revoked or narrowed while the surface is open.
- **`IX-PLATFORM-004` — Resume and reconcile an unknown outcome.** Where the result of a submitted
  action is unknown, **no new command of the same intent is offered** until reconciliation completes.
- **`IX-ELIG-001` — Revalidation at commit.** Where an action's validity depends on eligibility or slot
  state, the server **revalidates at commit**; the client's earlier read is never treated as sufficient.
  Carries the **eligibility fail-closed** non-negotiable: `ELIGIBILITY_REVIEW` removes attendance/start/
  completion actions structurally, with no override control designed on any surface for any role.

Note on sourcing: the widget's own Phase 4 block states the hidden/unavailable/disabled resolution
directly (quoted in section 22 below) — that specific rule is a `WGT-PLATFORM-003` obligation, not a
restatement of `IX-PLATFORM-001`'s own text, which is about the commit contract, not the resolution
vocabulary. Both are cited because the widget's own block lists `IX-PLATFORM-001` among its governing
patterns.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-002` — Action-role labels | Canonical, one label per role across all three platforms including inside its own confirmation | Every action label this widget renders. Button rule: label is a verb starting the sentence ("Save," not "The Save"), no closing punctuation. |
| `TXT-PLATFORM-011` — Warnings | Canonical | An informational (non-critical) warning shown beside an action, distinct from an irreversible-action warning. |
| `TXT-PLATFORM-012` — Irreversible actions | Canonical, `IX-AUDIT-001`'s fixed formula | Where this widget's trigger opens `WGT-PLATFORM-007`, the trigger's own label is what the confirmation restates verbatim — this widget must not invent a second phrasing. |
| `TXT-PLATFORM-016` — Permissions | Canonical | The `UNAVAILABLE` explained-absence text: never names an internal permission key, never implies an override; states the legitimate path to the right scope where one exists. |
| `TXT-PLATFORM-018` — Prohibitions master list | Canonical, 16-item list | Items 10 (no override implication) and 13 (irreversibility never colour/tone-only) bind this widget directly. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-013` — Target size floor | Every action clears `semantic.size.target-floor`; the primary and any deadline-bearing action clear `semantic.size.target-primary`, on every platform, in every density mode, hit area counted (WCAG 2.5.8). |
| `A11Y-PLATFORM-014` — Adjacent destructive/primary separation | The destructive action sits at the bar's `end`, separated from primary/secondary by at least the inline spacing token; never adjacent without a visible gap (WCAG 2.5.8; product rule). |
| `A11Y-PLATFORM-016` — Disabled vs unavailable vs hidden | **HIDDEN**: no node in the accessibility tree, not reachable by any input. **UNAVAILABLE**: a labelled, non-interactive explanatory statement — present in the tree, never a focusable-but-inert button. **DISABLED**: reserved narrowly for a control temporarily blocked inside an *active* interaction the same actor is completing, with the enabling condition visible on the same surface; remains in tab order with `aria-disabled`/platform equivalent (WCAG 1.3.1, 2.4.3). |
| `A11Y-PLATFORM-006` — Focus movement after mutation | After a commit, focus moves to the changed state summary, never back to the triggering action (WCAG 2.4.3, 4.1.3). |
| `A11Y-PLATFORM-011` — Live-region announcement policy | A submission-state transition (pending/retrying/failed/completed) announces politely via `CMP-PLATFORM-011` (WCAG 4.1.3). |
| `A11Y-PLATFORM-004` — Visible focus indicator | Every action renders the focus ring at `semantic.focus.width`/`offset`, surviving on top of primary, destructive and every status emphasis fill alike (WCAG 2.4.7, 2.4.11). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning record's
contract... Permitted next actions are **read from the server projection**, never inferred client-side
from the status label." Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-BOOKING-003` (booking detail — states, deadlines, allowed next actions),
  `API-CLINICAL-001` (case summary).
- **Profile A:** `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace), `SDC-BOOKING-001` (Clinic
  Booking Inbox and Response).

On every other screen, the applicable `API-*`/`SDC-*` is that screen's own declared contract (section
0.6), named in its own screen specification — never invented here.

#### 10. Shared application-layer prerequisites

- **Server-side action-availability computation** (the mechanism that produces the permitted-next-action
  set this widget only renders) depends on **`TASK-IDENTITY-002`** — "Implement Scoped Staff Grants and
  Resource Authorization" (`app/Policies/*`, Proposed) for Profile A, and the equivalent per-endpoint
  authorization check on each Patient `API-*` route for Profile C. Without this, an "available" action
  in this widget would be a client-side guess, which the widget's own Phase 4 block forbids.
- **Idempotency infrastructure**: `TASK-AUDIT-002` — "Implement Idempotency and Integrity-Exception
  Operations" and `TASK-AUDIT-003` — "Implement Patient API Idempotency, Correlation, and Stable Error
  Envelope" are prerequisites for the commit contract in section 6 (`IX-PLATFORM-001`/`-002`) to hold.
- **Shared rendering primitive code area**, as `WGT-PLATFORM-001`: `TASK-PLATFORM-001` (`app/Filament/*`,
  admin panel existing) and `TASK-PLATFORM-005` (clinic panel) for Profile A; `TASK-PLATFORM-008` for
  Profile C.

#### 11. Data model prerequisites

**n/a for a fixed projection** — this widget renders the permitted-action set of whichever record the
host screen owns; that record's own ERD entities are that screen's own prerequisite (named in its own
specification). The one data-model concept this widget's mechanism itself depends on is the
**idempotency record** — `idempotency_records` (Proposed, `docs/database/ERD.md` section 12) — which
`TASK-AUDIT-002`/`-003` create and which backs the "same key replays the original outcome" guarantee in
section 15.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN shared component | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament page actions | `app/Filament/Support/` (shared action-bar helper) plus each Resource/Page's own action registration under `app/Filament/Resources/` and `app/Filament/Pages/` | Proposed |
| Filament table row actions | Each Resource table's action column under `app/Filament/Resources/` | Proposed |
| Existing panel | `app/Providers/Filament/AdminPanelProvider.php` | Existing |
| Second panel | `app/Providers/Filament/ClinicPanelProvider.php` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host record's own contract) | View-model responsibility this widget consumes |
|---|---|
| The record's permitted-next-action set, server-computed | `actions: Array<{ role, label, availability: HIDDEN\|UNAVAILABLE\|DISABLED, reason?, isSensitive, isDeadlineBearing, deadlineAt? }>` — `HIDDEN` entries are never sent to the client at all, consistent with section 22 |
| The record's own idempotency key for a given commit intent | `idempotencyKey: string`, fixed at first submission, unchanged across retries of the same intent (`IX-PLATFORM-002`) |
| The commit's in-flight/outcome state | `submissionState: "idle" \| "pending" \| "retrying" \| "failed" \| "completed" \| "unknown-outcome"`, feeding `CMP-PLATFORM-011` |

No new response field is invented — `HIDDEN`/`UNAVAILABLE`/`DISABLED` is exactly the vocabulary the
widget's own Phase 4 "Availability resolution" table already fixes; this section only names where each
value comes from.

#### 14. Refresh / caching / polling

None invented. The action set re-reads whenever `WGT-PLATFORM-001`'s host surface re-reads
(`IX-PLATFORM-003`: entry, refocus, explicit refresh, post-mutation). No polling interval or cache TTL
is specified for this widget.

#### 15. Idempotency / correlation

**Applies — this is a committing widget.**

- **Key derivation:** `{actor, operation, resource/scope, client-supplied idempotency key}` plus a
  server-computed request fingerprint of the payload (`docs/SDD.md` section 20; `NFR-AUDIT-002`).
- **Key reuse on retry:** the retry control reuses the **original** key (`IX-PLATFORM-002`); a new key
  is issued only when the actor deliberately starts a new, different action from the action bar.
- **Unknown-outcome reconciliation:** `IX-PLATFORM-004` — no new command of the same intent is offered
  until the surface re-reads authoritative state and the outcome is known to have committed, not
  committed, or still be unknown.
- **Correlation/audit requirement:** `FR-AUDIT-003`. Same key + materially different request →
  `ERR-AUDIT-001`, no side effect. Concurrent duplicates collapse to at most one committed outcome
  (`NFR-AUDIT-002`).

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** the named policy/authorization check on the record's own
  `API-*`/`SDC-*` contract — for Profile A, the Proposed `app/Policies/*` classes `TASK-IDENTITY-002`
  creates (one per protected resource/action, per `PERMISSIONS_MATRIX.md` section 20's "Laravel
  policies/application authorization services should enforce resource and relationship scope");
  Filament resource visibility callbacks are **not** the enforcement point, only a UI convenience.
- **UI consequence:** exactly the `HIDDEN`/`UNAVAILABLE`/`DISABLED` resolution in section 22 — never a
  disabled control standing in for a denial (`A11Y-PLATFORM-016`).

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `actions` | `Action[]` (see section 13) | Yes | `[]` | Host record's own server projection | `HIDDEN` entries never included client-side at all |
| `variant` | `page \| row \| sticky \| readonly` | Yes | none | Host screen's own archetype | `readonly` forced whenever the record is one of the nine immutable/append-only entities |
| `onCommit` | callback, per action | Yes for any non-`HIDDEN`/`UNAVAILABLE` action | none | Host record's own command | Invokes `IX-PLATFORM-001`; never optimistic |
| `submissionState` | see section 13 | No | `"idle"` | Host's own commit state | Drives `CMP-PLATFORM-011` composition |

No configurable value beyond the above (e.g. no client-side "which actions are allowed" rule) is
accepted, because that would reintroduce exactly the client-side inference the widget's Phase 4 block
prohibits.

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | No action offered until the permitted-action set is known. An action rendered before the projection resolves is a guess. |
| `loading-refresh` | Actions stay usable; a refresh that changes the permitted set replaces the region and announces. |
| `empty-no-data` | The region carries only the one creating action, matching `CMP-PLATFORM-009`'s recovery. |
| `empty-filtered` | n/a for a `page` region; on a `row` variant the region does not render because there is no row. |
| `partial` | Actions whose preconditions did not load are `UNAVAILABLE` with the reason stated, never offered optimistically. |
| `stale` | Read actions stay; **committing actions are withdrawn** while the projection is known stale. |
| `error-fetch` | Committing actions withdrawn; retry offered by `WGT-PLATFORM-001`, not duplicated here. |
| `error-permission` | All affected actions removed structurally (`HIDDEN`). Never `DISABLED`, which would imply an override. |
| `success` | The permitted set, exactly as the server projection states it. |
| Offline / unstable | An idempotent-resumable command may be queued and shown pending by `CMP-PLATFORM-011`; any other command is withdrawn with the condition stated. |

#### 19. Lifecycle/state semantics

**This widget does not own lifecycle status rendering.** It gates *actions* on the record's lifecycle
state (via the server projection), but the status itself is rendered by `CMP-PLATFORM-001`/
`WGT-PLATFORM-005`/`-006` elsewhere on the same surface. This widget's own contribution to lifecycle
correctness is structural: `ELIGIBILITY_REVIEW` and any other suspending status removes the affected
actions **structurally** (`IX-ELIG-001`'s fail-closed rule), never merely disabling them.

#### 20. Tokens

`component.platform-004.*` (mandatory — primary/secondary/destructive fills, focus ring, absent-reason
text), conditional `component.platform-011.*`, `component.platform-014.*`, `component.platform-005.*`.
`component.platform-014.confirm-destructive-bg` and `component.platform-004.destructive-bg` resolve to
the identical semantic role by design — this is the mechanism that keeps a destructive trigger from
producing a non-destructive confirm, or vice versa.

#### 21. Content

All labels resolve to `TXT-PLATFORM-002` (one label per role, across all three platforms, including
inside `WGT-PLATFORM-007`'s confirmation). `UNAVAILABLE` explanation text resolves to `TXT-PLATFORM-016`.
No canonical `ERR-*` string is restated by this widget.

#### 22. Accessibility contract

- **HIDDEN / UNAVAILABLE / DISABLED**, verbatim from the widget's own Phase 4 block:

  | Outcome | When | Accessibility-tree consequence |
  |---|---|---|
  | HIDDEN | The actor is outside the scope that would make the action meaningful | Absent |
  | UNAVAILABLE | The action exists for this actor but the lifecycle forecloses it | Present as an explained absence, not as a control |
  | DISABLED | The same actor on the same record will be able to act once they complete something visible here | Present, disabled, with the reason bound to it |

- **Role/name:** every action exposes an accessible name stating the effect, not only the verb, for any
  destructive or irreversible action.
- **Focus:** after a commit, focus moves to the changed state summary, not back to the action
  (`A11Y-PLATFORM-006`). An action's disabled reason is programmatically associated with it.
- **Keyboard:** every action reachable and completable by keyboard alone on Profile A; no hover-only
  reveal on Profile C (`IX-PLATFORM-012`).
- **Screen reader:** the submission-state transition announces politely (`A11Y-PLATFORM-011`).
- **Target size:** `A11Y-PLATFORM-013` floors apply to every action in every density mode.
- **No colour-only:** destructive/primary distinction is never colour alone — role, position (at `end`,
  separated) and label together carry the meaning.

#### 23. RTL / bidi

- The primary action sits at the logical `start` of the group in both directions; the destructive action
  sits at `end`, separated. Directional icons mirror; status icons do not (`A11Y-PLATFORM-031`).
- No bidi-isolation class applies to this widget's own anatomy directly (its labels are short verbs);
  where an action's absent-reason text names a record identifier, that identifier is isolated per the
  host record's own contract.

#### 24. Responsive behavior

- **Profile C:** the `sticky` variant is used where the surface scrolls; the primary action never falls
  below `target-primary` at any density.
- **Profile A:** the region stays visible without obscuring a focused element; at
  `profile-a.content-width.narrow`, secondary actions collapse into an overflow while the primary and
  any destructive action stay visible.
- Text scaling: action labels wrap rather than truncate; at the largest supported size the group stacks
  with the primary first. A verb is never abbreviated to fit.

#### 25. Immutability / historical safety

**This widget is the primary enforcement point for the "no generic edit or delete over an immutable
entity" rule.** Where the host record is one of the nine immutable or append-only entities
(`UX_FOUNDATION.md` section 5.1: `eligibility_decisions`, `accepted_treatment_snapshots`,
`financial_terms_snapshots`, `financial_events`, `booking_events`, `claim_decisions`,
`claim_deadline_events`, `audit_events`, `service_launch_gates`), the widget renders **only** the
`readonly` variant: reads and exports, never a generic edit, delete, or bulk action. This is a required
composition choice, not an option left to the implementing screen.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- Filament's default resource `EditAction`/`DeleteAction` (and any bulk-delete action) must **not be
  registered** on any Resource/Page bound to one of the nine immutable entities — not hidden by a
  visibility callback, **not registered at all**, per the widget's own "an unauthorized action is not
  registered at all rather than registered and hidden by a visibility callback" rule.
- The framework's default action-visibility mechanism (a `visible()` closure) is **not** the
  authorization boundary for any action anywhere this widget renders — it is, at most, a UI convenience
  layered on top of the server-side check in section 16.
- Filament's default confirmation dialog (a stock "Are you sure?" modal) is **not used** for any
  sensitive/irreversible/destructive/authoritative action — the trigger opens `WGT-PLATFORM-007`
  instead, whose contract owns the modal's actual content.

#### 27. Prohibitions

1. More than one primary action must never appear.
2. A destructive action must never be styled as primary.
3. The same destructive action must never read as a different role in the trigger and its confirmation.
4. A disabled control must never stand in for an authorization denial.
5. An optimistic success state must never be rendered before the server confirms it.
6. A new command must never be offered while a prior outcome is unknown.
7. A generic edit or delete affordance must never appear over any of the nine immutable entities.

#### 28. Definition of Done

- [ ] Every action resolves to exactly one of HIDDEN, UNAVAILABLE or DISABLED, per section 22, sourced
      from the server projection only.
- [ ] No authorization denial is ever expressed as a disabled control.
- [ ] A commit in flight blocks a second identical command; retry reuses the original idempotency key.
- [ ] An unknown outcome offers no new command until reconciled.
- [ ] A stale projection withdraws committing actions while read actions remain.
- [ ] After a successful commit, focus moves to the changed state and the change is announced.
- [ ] `readonly` variant enforced on all nine immutable entities; no edit/delete/bulk action registered.
- [ ] Destructive action uses `action.destructive` identically in trigger and (via `WGT-PLATFORM-007`)
      confirmation.
- [ ] None of the seven prohibitions in section 27 is violated on any surface.
- [ ] No regression to `WGT-PLATFORM-001` (this widget assumes it has already resolved structural
      state) or to `WGT-PLATFORM-007` (this widget's trigger must open it correctly, never bypass it).

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 2, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-004` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — primary/secondary/destructive contrast in default/hover/
  focus/disabled, light mode.
- `node scripts/axe_audit.mjs <file>` — role/name/state for every action, including the `UNAVAILABLE`
  explained-absence text as a labelled non-interactive statement rather than an inert button.
- `node scripts/verify_responsive.mjs <file>` — narrow content-width overflow collapse behaviour.

**Tier C (all: not run — requires implementation):**
- Real accessibility-tree inspection confirming HIDDEN produces no node, UNAVAILABLE produces a
  non-interactive labelled statement, and DISABLED is never used for an authorization denial — not run
  — requires implementation.
- Keyboard completion of every action end to end on Profile A — not run — requires implementation.
- A live network retry of a committed command producing zero duplicate business outcomes, under
  contention — not run — requires implementation.
- Focus movement to the changed-state summary after a real commit, verified with a screen reader — not
  run — requires implementation.
- Server-side authorization enforcement proven by Pest feature tests exercising each Policy directly
  (not inferred from the UI hiding a control) — not run — requires implementation.

---

### WGT-PLATFORM-002 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-002
- **Name:** Subject context bar
- **Build order:** 3
- **Platforms:** C, A
- **Runtime:** RN persistent chrome (Proposed, path unverified) + Filament panel-global render hook (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Custom`
- **Screen reach:** 156 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-002` block

#### 2. Implements

- `FR-IDENTITY-003`
- `FR-AUDIT-001`
- `NFR-IDENTITY-001`

#### 3. Used by

**156 of 165 screens.** Absent from exactly 9, all pre-authentication surfaces with no subject,
confirmed against every row of `SCREEN_SPEC_MAP.md` (44 of 47 Patient, 51 of 56 Clinic, 61 of 62 Admin):

- `SCR-IDENTITY-001` (Patient entry), `SCR-IDENTITY-002` (Phone entry and code request),
  `SCR-IDENTITY-003` (Code verification) — Patient app.
- `SCR-IDENTITY-009` (Join UberTib), `SCR-IDENTITY-010` (Provider type), `SCR-IDENTITY-011` (Applicant
  contact verification), `SCR-IDENTITY-019` (Clinic sign-in), `SCR-IDENTITY-025` (Invitation acceptance)
  — Clinic panel.
- `SCR-PLATFORM-005` (Privileged sign-in) — Admin panel.

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only.
- **Not a build dependency:** `WGT-PLATFORM-009` (Attention and notification feed, build order 13, not
  in this session's scope) is scoped *by* this widget rather than filtered — a placement fact recorded
  in `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2 (E4), not something this contract or its coding agent
  needs to act on now.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-003` — Subject context header | The whole widget. Variants: `self`, `representation`, `provider-scope`, `case-subject`, `staff-scope` — the bar never invents a sixth. Anatomy: `subject identity` → `relationship/authority` (present only under representation or a staff grant, absent — not empty — otherwise) → `scope: provider · branch` → `switch` (only where more than one scope exists). |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | The subject carries a lifecycle status (e.g. an application-in-review subject) |
| `CMP-PLATFORM-013` — Human attribution | The authority was granted by a named person (e.g. "acting under a grant from Dr. X") |

#### 6. Interaction dependencies

- **`IX-PLATFORM-007` (owner) — Authorization loss and permission denial.** The moment a grant is
  revoked or narrowed while the surface is open: stale actions removed (not disabled — that is
  `WGT-PLATFORM-003`'s job elsewhere on the surface), and **`CMP-PLATFORM-003` reflects the changed
  scope, because the header is the safety context.** On Profile C the common case is a guardian grant
  revoked/expired while the app is open, and the represented subject must disappear from the context
  switcher as well as from the surface. On Profile A the common case is a staff scope grant revoked
  mid-shift.
- **`IX-PLATFORM-010` — Bidirectional and mixed-direction content.** Every mixed-direction run this
  widget shows — a Latin clinic legal name, a branch code, a grant identifier — is isolated at render
  time, not styled after the fact; a reordered identifier is a **wrong** identifier, not a visual defect.
- **`IX-PLATFORM-015` — List to detail and back.** `CMP-PLATFORM-003` states the subject on the detail
  surface, because the list's context does not travel with the actor when entering a detail view this
  widget also renders on.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-016` — Permissions | Canonical | Authority-loss wording: never names an internal permission key, never implies an override; states the legitimate path where one exists. |
| `TXT-PLATFORM-017` — Audience translation families | Canonical, 13-term table | Where the context bar names a canonical term with a per-audience display (e.g. a role or scope label), the audience-specific wording from this table applies, never the internal term. |
| `TXT-PLATFORM-020` — Arabic mechanics | Canonical | Numerals (Western/tabular), bidi isolation for any service code/version number/amount/Latin clinic name inside this bar, filename truncation rules where relevant. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-009` — Accessible name, role and state | The bar's subject/scope/authority region exposes a coherent accessible name; a status chip it composes announces as one unit — name, role, state together (WCAG 4.1.2). |
| `A11Y-PLATFORM-016` — Disabled vs unavailable vs hidden | The scope switch is **absent**, not disabled, when only one scope exists — an absent switch implies nothing; a disabled one would imply an override (WCAG 1.3.1, 2.4.3). |
| `A11Y-PLATFORM-030` — Bidirectional content: AT reading order and isolation | A Latin clinic name/branch code/grant identifier inside this bar is isolated in a way that also produces correct **screen-reader pronunciation order**, not only correct visual order (WCAG 1.3.2). |
| `A11Y-PLATFORM-032` — Visual RTL vs content direction | The bar's overall layout is right-to-left; embedded Latin content (clinic name, branch code, ID) keeps its own internal left-to-right order via isolation, never a manually reversed string. |
| `A11Y-PLATFORM-023` — Long content is sized-for | A long Arabic clinic legal name wraps; **the subject identity itself never truncates**, at any text size, in any density mode, on either profile (WCAG 1.4.10 informative extension). |

#### 9. Canonical data/action contracts

Unlike `WGT-PLATFORM-001`/`-003`, this widget has a **fixed** data source per profile:

- **`API-IDENTITY-003`** (Profile C) — `GET /api/v1/me`. Returns safe identity/profile fields and the
  active representation context if one is explicitly selected; sensitive authorization internals are
  not exposed. Errors: `ERR-IDENTITY-001`, `ERR-PLATFORM-004`. Read-only.
- **`SDC-IDENTITY-004`** (Profile A) — Clinic Access and Context Bootstrap. Projection: current
  identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending
  onboarding checklist/work counts. Command: **switch active authorized provider/branch context; no
  authorization is created by switching.** Scope: only active grants. Errors: `ERR-IDENTITY-001`,
  `ERR-IDENTITY-002` (in-process, but the same error semantics apply).

Both are quoted at the level needed to build the view-model in section 13; neither is paraphrased beyond
what is already public in their own canonical blocks.

#### 10. Shared application-layer prerequisites

- **`TASK-IDENTITY-006`** — "Implement Mobile Authentication Transport and Current-Identity Bootstrap" —
  the direct backend prerequisite for `API-IDENTITY-003` to exist.
- **`TASK-IDENTITY-001`** — "Implement Staff Roles and Coarse Capabilities" and **`TASK-IDENTITY-004`** —
  "Enforce Clinic Panel Access and Provider/Branch Scope" — the direct prerequisites for
  `SDC-IDENTITY-004`'s projection (accessible provider/clinic contexts, effective capabilities) to be
  computable at all.
- **`TASK-IDENTITY-007`** — "Implement Guardian Grant APIs and Represented-Patient Context" — required
  before the `representation` variant can render a real represented-subject context on Profile C.
- **`TASK-IDENTITY-002`** — "Implement Scoped Staff Grants and Resource Authorization" — required before
  the `staff-scope` variant's "effective capabilities" can be more than a placeholder.

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `users` | **Existing** | Base identity row for `self`/every variant. |
| `identity_contacts` | Proposed | Contact identity backing `API-IDENTITY-003`. |
| `guardian_grants` | Proposed | Backs the `representation` variant and its revocation. |
| `staff_scope_grants` | Proposed | Backs the `staff-scope` variant and `SDC-IDENTITY-004`'s "active grants" scope. |
| `providers`, `branches`, `clinics`, `provider_branch_assignments` | Proposed | Backs the `provider-scope` variant's scope slot. |

All five are Proposed; none exists in the repository today. A coding agent building this widget cannot
bind it to a real read until the owning `TASK-*` in section 10 lands.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN persistent chrome | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament panel-global render-hook registration | `app/Providers/Filament/AdminPanelProvider.php` | Existing |
| Shared context component the hook renders | `app/Filament/Support/` | Proposed |
| Second panel's render hook registration | `app/Providers/Filament/ClinicPanelProvider.php` | Proposed |

#### 13. Data/view-model mapping

| Canonical field (`API-IDENTITY-003` / `SDC-IDENTITY-004`) | View-model responsibility |
|---|---|
| Safe identity/profile fields (`API-IDENTITY-003`); current identity (`SDC-IDENTITY-004`) | `subjectIdentity: { displayName, ... }` — the `self` slot |
| Active representation context, if explicitly selected (`API-IDENTITY-003`) | `authority: { kind: "representation", relationship, grantedBy? } \| absent` |
| Accessible provider/clinic contexts, accessible branches (`SDC-IDENTITY-004`) | `scope: { provider, branch } \| absent`, plus the switch's option list |
| Effective capabilities (`SDC-IDENTITY-004`) | Not rendered directly by this widget — consumed by `WGT-PLATFORM-003` elsewhere on the surface, kept out of this widget's own view-model to avoid duplicating the authorization boundary |
| Pending onboarding checklist/work counts (`SDC-IDENTITY-004`) | Out of scope for this widget — belongs to `WGT-PLATFORM-009`/`WGT-OPS-001` |

No field is invented; `effective capabilities` and the checklist/work counts exist in the canonical
projection but are deliberately **not** consumed here, because rendering them from this widget would
duplicate the authorization/queue-summary responsibility other widgets already own.

#### 14. Refresh / caching / polling

Event-driven only: resolves before the surface body on entry (`loading-initial` — "context is what makes
the body safe to read"), re-reads on the moments `IX-PLATFORM-003` fixes, and re-reads immediately on
authorization loss (`IX-PLATFORM-007`). No polling interval or cache TTL is specified or invented.

#### 15. Idempotency / correlation

**Applies narrowly, to the switch command only, and the answer is that no idempotency key is required.**
Switching active scope is a pure context-selection state set — "no authorization is created by
switching" — not a business-record mutation. Repeating the same switch is a no-op by construction, so it
is naturally idempotent without `NFR-AUDIT-002`'s retry-prone-command protocol, and `SDC-IDENTITY-004`
does not appear in `docs/api/API_CONTRACTS.md`/`STAFF_INTERACTION_CONTRACTS.md`'s "idempotency key
required" set. Every subsequent request after a switch is still re-evaluated server-side on its own
terms (section 22) — the switch never itself grants anything a key could need to protect.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** the same Proposed `app/Policies/*` (`TASK-IDENTITY-002`) plus
  `TASK-IDENTITY-004`'s provider/branch scope enforcement — this widget **never** performs an
  authorization check itself; it only **displays** the scope the server already computed and reacts to a
  server-reported loss of it.
- **UI consequence:** on loss, the bar states the loss and reflects the new (possibly absent) scope
  immediately; it never leaves a stale scope visually authoritative after the server has revoked it.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `self \| representation \| provider-scope \| case-subject \| staff-scope` | Yes | none | Resolved from `API-IDENTITY-003`/`SDC-IDENTITY-004`'s own projection | Never a sixth value |
| `subjectIdentity` | object | Yes | none | See section 13 | Never truncated |
| `authority` | object \| absent | No | absent | See section 13 | Absent (not empty) when acting for oneself |
| `scope` | object \| absent | No | absent | See section 13 | Absent triggers `partial`-equivalent handling, section 18 |
| `lifecycleStatus` | `CMP-PLATFORM-001` props \| absent | No | absent | Host record, where the subject carries a status | Conditional composition only |
| `onSwitch` | callback | No | none | `SDC-IDENTITY-004`'s switch command | Present only where more than one scope exists |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The bar renders before the surface body. Identity resolves first; scope may resolve after. |
| `loading-refresh` | Context stays visible; a scope re-read never blanks it. |
| `empty-no-data` | n/a for the bar itself — a pre-authentication surface has no subject and the bar is absent (the 9 exclusions in section 3). |
| `empty-filtered` | n/a — the bar is not a filtered projection. |
| `partial` | Subject known, scope not yet resolved: the scope slot **states that** rather than rendering as unscoped, because an unscoped panel reads as full authority. |
| `stale` | Context is never rendered stale without saying so — a stale grant is a security statement, not a caching detail. |
| `error-fetch` | The surface keeps the last known safe context and offers retry; no action that depends on scope is offered while scope is unknown. |
| `error-permission` | Authorization loss. The bar states the loss, the surface removes stale actions structurally, and the route to a scope the actor does hold is the first control. |
| `success` | The resolved bar. |
| Offline / unstable | Context persists from the last good read with its as-of time. No mutation is offered against an unverifiable scope. |

#### 19. Lifecycle/state semantics

This widget renders lifecycle status **only conditionally**, through composed `CMP-PLATFORM-001` (where
the subject itself carries a status) and `CMP-PLATFORM-013` (where the authority was granted by a named
person, e.g. `decided-by-person`/`assigned-to-person`). Both bindings resolve their own tone/icon/
emphasis triple from `semantic.state.json` through their own component contracts; this widget only
decides **whether** to compose them, based on whether the subject/authority actually carries a status or
a named grantor — it invents no new status vocabulary of its own.

#### 20. Tokens

`component.platform-003.*` (mandatory — surface, border, text-subject, text-authority, icon, selected
fill/border for the switch, inset, inline). Conditional `component.platform-001.*`,
`component.platform-013.*` (deliberately achromatic — an attribution is not a status and takes no tone).

#### 21. Content

Resolves to `TXT-PLATFORM-016`, `-017`, `-020`. No canonical `ERR-*` message is restated; a
`permission-denied` state's wording is `WGT-PLATFORM-001`'s `CMP-PLATFORM-010` obligation elsewhere on
the surface — this widget's own contribution is limited to reflecting the changed scope, not authoring
the denial message.

#### 22. Accessibility contract

- **Role/name:** the bar is the first landmark in the reading order and is announced before the surface
  body. It is not a focus stop unless it hosts a switch control.
- **Focus:** on authorization loss, focus moves to the denial block assertively (owned by
  `WGT-PLATFORM-001`'s recovery rendering elsewhere on the surface; this widget's own change is
  reflected in the same moment).
- **Keyboard:** the scope switcher, where present, is reachable by keyboard on Profile A and by an
  explicit control on Profile C (never a hover-only reveal).
- **Screen reader:** the bar's subject+scope+authority reads as a coherent unit; a composed status chip
  announces name+role+state together.
- **Bidi/pronunciation:** a Latin clinic name/branch code/grant identifier isolated in this bar produces
  correct **spoken** order for a screen reader, not merely correct visual order (`A11Y-PLATFORM-030`).
- **No truncation of subject identity**, at any text size, per `A11Y-PLATFORM-023`.

#### 23. RTL / bidi

- Subject at logical `start`, scope at `end`, authority on its own line beneath, in both directions.
- **Bidi isolation classes carried by this widget: `latin-name` (clinic legal name), `code` (branch
  code), `id` (grant identifier).** Each isolated so its internal left-to-right structure survives
  inside right-to-left flow without visually reversing.
- No directional icon is part of this widget's own anatomy; any status/attribution icon it composes
  follows that component's own non-mirroring rule (`A11Y-PLATFORM-031`).

#### 24. Responsive behavior

- **Profile C:** persistent chrome, not confined to one screen — "a wrong-subject action is a clinical
  and authorization failure," so the bar is always present once a subject exists, at every size class.
- **Profile A:** provider/branch scope stays **panel-global**, not per-page — a deliberate deviation
  from stock Filament, because per-page duplication would let two pages disagree about scope. This
  applies at every `contentWidth`.
- At the largest supported text size, the three slots (subject, scope, authority) stack in the same
  order rather than eliding any of them.

#### 25. Immutability / historical safety

**n/a for this widget's own rendering** — it displays current authority context, not a historical
record. It does not render one of the nine immutable/append-only entities itself. Its correctness
obligation is the inverse of immutability: it must reflect a **change** (grant revocation, scope switch)
immediately, never continue showing a superseded context as if it were still current.

#### 26. Framework defaults to disable

Profile A, `Custom`:

- Filament ships **no** panel-global context region — there is no default to configure here, only a
  default *tendency* to avoid: implementing this as a per-page Blade partial duplicated across each
  Resource/Page. That tendency is explicitly rejected — "per-page duplication would let two pages
  disagree about scope." The implementation registers **one** render hook at the panel level
  (`AdminPanelProvider`/`ClinicPanelProvider`), never a per-Resource copy.
- Filament's default logged-in-user menu (avatar + name only) is **not** treated as satisfying this
  widget's obligation — it carries no scope, no authority slot, and no revocation-reflecting behaviour.

#### 27. Prohibitions

1. An empty authority slot must never render as "no authority" — it is absent, not empty, when the
   actor acts for themselves.
2. A scope switch must never appear to grant authority — every request re-evaluates server-side.
3. The bar must never masquerade as the represented subject.
4. The representation context must never be hidden anywhere the actor can commit.
5. Nothing may imply that switching context changes what the actor is allowed to do.

#### 28. Definition of Done

- [ ] Given representation, both the acting identity and the subject identity are visible on every
      surface where the actor can commit.
- [ ] Given a grant revoked mid-session, the surface removes affected actions structurally and announces
      the loss assertively; this bar reflects the new scope in the same moment.
- [ ] Given an unresolved scope, no scope-dependent action is offered anywhere on the surface.
- [ ] A Latin identifier inside the bar keeps its character order in both directions, visually and in
      screen-reader pronunciation order.
- [ ] Switching subject or scope issues no authority; every subsequent request is re-evaluated
      server-side.
- [ ] Implemented once, panel-global, on Profile A — no per-page duplicate.
- [ ] None of the five prohibitions in section 27 is violated on any surface.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 3, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-003` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — subject/scope/authority text contrast in default/hover
  (switch)/focus, light mode.
- `node scripts/axe_audit.mjs <file>` — landmark role, switch control's accessible name/state.
- `node scripts/verify_rtl.mjs <file>` — Latin clinic name/branch code/grant ID isolation, no logical-
  property breakage.

**Tier C (all: not run — requires implementation):**
- A grant revoked mid-session actually removes the represented subject from a live context switcher and
  announces the loss, verified on a real device — not run — requires implementation.
- Screen-reader pronunciation order of an isolated Latin clinic name, verified with VoiceOver/TalkBack in
  Arabic — not run — requires implementation.
- Single-registration proof that no per-page duplicate context region exists across the real panel
  navigation — not run — requires implementation.
- Server re-evaluation on every request after a switch, proven by a Pest test that revokes a grant
  mid-session and asserts the very next protected request fails — not run — requires implementation.

---

### WGT-PLATFORM-004 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-004
- **Name:** Filter and result toolbar
- **Build order:** 4
- **Platforms:** C, A
- **Runtime:** RN shared component (Proposed, path unverified) + Filament table filters (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Stock`
- **Screen reach:** 39 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-004` block

#### 2. Implements

- `FR-ELIG-001`
- `FR-OPS-001`
- `FR-AUDIT-002`

#### 3. Used by

**39 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (9 Patient, 13 Clinic, 17 Admin):

- **Patient app (9):** `SCR-ELIG-001` (Provider search), `SCR-BOOKING-003` (My bookings),
  `SCR-CLINICAL-001` (My cases), `SCR-CLINICAL-005` (Case timeline), `SCR-CLINICAL-007` (Follow-ups),
  `SCR-FINANCE-002` (Financial timeline), `SCR-CLAIMS-001` (My claims), `SCR-PLATFORM-009`
  (Notification centre), `SCR-BOOKING-016` (Reschedule request).
- **Clinic panel (13):** `SCR-IDENTITY-021` (Onboarding checklist), `SCR-OPS-001` (Clinic work feed),
  `SCR-ELIG-011` (Eligibility status), `SCR-BOOKING-008` (Booking inbox), `SCR-BOOKING-011` (Clinic
  schedule), `SCR-CLINICAL-008` (Clinic cases), `SCR-CLINICAL-010` (Plan authoring), `SCR-CLINICAL-011`
  (Stages and pricing), `SCR-CLINICAL-017` (Clinic follow-ups), `SCR-REVIEWS-005` (Provider reviews),
  `SCR-CLAIMS-006` (Clinic claims), `SCR-BOOKING-017` (Reschedule proposals), `SCR-ELIG-021` (Bookings
  on eligibility hold).
- **Admin panel (17):** `SCR-IDENTITY-027` (Application queue), `SCR-IDENTITY-036` (Providers and
  branches), `SCR-CATALOG-003` (Groups and services), `SCR-CATALOG-004` (Definition versions),
  `SCR-CATALOG-010` (Procedure catalog and family mapping), `SCR-BOOKING-014` (Booking operations),
  `SCR-CLINICAL-019` (Case oversight detail), `SCR-FINANCE-010` (Records operations), `SCR-REVIEWS-007`
  (Integrity queue), `SCR-CLAIMS-009` (Claims queue), `SCR-CLAIMS-010` (Claim review), `SCR-OPS-002`
  (Work queue), `SCR-OPS-004` (Operational reports), `SCR-OPS-005` (Drill-down and export),
  `SCR-POLICY-001` (Policy versions), `SCR-AUDIT-001` (Audit explorer), `SCR-ELIG-023` (Market
  observations and calibration).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only.
- **This widget is itself a required predecessor of `WGT-PLATFORM-005` (build order 5)** —
  `WGT-PLATFORM-005`'s `empty-filtered` state renders "with the applied filter still visible in
  `WGT-PLATFORM-004`," per `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2 (E3). See `WGT-PLATFORM-005`
  contract section 4.
- **Not a build dependency:** no edge to `WGT-PLATFORM-002`, `-010` — co-occurrence on a screen (e.g.
  both this toolbar and the context bar on `SCR-OPS-002`) is not a build dependency
  (`PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2: no other pair is documented, and section 0.4.1
  above forbids inferring one).

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-007` — Filter and search bar | The whole toolbar. Variants: `discovery` (Patient provider search), `queue` (persists across visits), `management`, `history` (never reorders history), `authoring` (procedure search inside plan authoring). Anatomy: `search input` → `filter`(s) → `active filter summary` (always visible) → `clear all`; `result count` on its own line beneath. |
| `CMP-PLATFORM-009` — Empty state | Renders `empty-no-data` (`no-data` variant, no filter applied) and `empty-filtered` (`filtered-empty` variant, applied filter still visible) — the two-way distinction this widget exists to hold. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | A lifecycle status is offered as a filter facet |
| `CMP-PLATFORM-005` — Deadline indicator | A deadline is offered as a filter facet |

#### 6. Interaction dependencies

- **`IX-PLATFORM-014` (owner) — Search, filter and filter persistence.** The applied filter **stays
  visible always**, in `CMP-PLATFORM-007`'s active summary. Filtering is **server-side** — a row the
  actor may not see must not be filtered out client-side, because its existence can itself be
  information. On return to the surface, a `queue`/`management` filter is **restored**; a `discovery`
  query is **not**, because a stale search is a worse default than an empty one. Clearing is one
  reachable control, not only per-chip removal.
- **`IX-PLATFORM-016` — Bounded reads over unbounded history.** Where this widget scopes a `history`
  variant (an append-only projection), **the bound is stated** — a silent cap reads as complete
  coverage — and **ordering is stable across pages**, because it is a property of the record, not the
  view.
- **`IX-PLATFORM-012` — Input model per profile.** Profile C: press/long-press/swipe only, no hover, no
  tooltip carrying information. Profile A: keyboard-complete; hover is an enhancement, never the only
  way to reveal a facet.
- **`IX-PLATFORM-015` — List to detail and back.** Returning from a detail surface restores this
  toolbar's filter, sort, scroll position and selection — the state the actor built, not a default view.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-003` — Field labels | Canonical | The search input's persistent visible label; never a placeholder acting as one. |
| `TXT-PLATFORM-004` — Helper text | Canonical | Any format hint on a facet input, preceding an error rather than following it. |
| `TXT-PLATFORM-007` — Empty states | Canonical, four-way formula | `empty-no-data` vs `empty-filtered` — the two different sentences and two different recoveries this widget exists to keep distinct. |
| `TXT-PLATFORM-019` — Structural state and archetype copy | Canonical | `list-and-detail` rule: "a real empty state vs a filter-caused empty state are always distinguished"; a maximum-rows cap on a result set is stated explicitly, never hidden as if it were the total. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-009` — Accessible name, role and state | Every filter control exposes name/role/state (expanded, selected); the applied summary announces as one unit (WCAG 4.1.2). |
| `A11Y-PLATFORM-026` — Persistent visible labels; no placeholder-as-label | The search input's label is always visible, never only a placeholder (WCAG 3.3.2, 1.3.1). |
| `A11Y-PLATFORM-011` — Live-region announcement policy | A filtered result-count change is announced **politely** when it changes (WCAG 4.1.3). |
| `A11Y-PLATFORM-012` — Native structural semantics | Each facet declares its expanded/collapsed state where it discloses; the Profile A `narrow` disclosure uses a real disclosure control, not a styled div (WCAG 1.3.1). |
| `A11Y-PLATFORM-013` — Target size floor | Every facet control and the clear-all control clear `semantic.size.target-floor` (WCAG 2.5.8). |
| `A11Y-PLATFORM-019` — Text scaling without loss of content or function | At 200% text size, all facets remain reachable and the applied summary still wraps rather than clipping (WCAG 1.4.4). |

#### 9. Canonical data/action contracts

This widget's data source is **partly fixed** by Phase 4:

- **`API-ELIG-001`** (Patient discovery path) — `GET /api/v1/providers`. Query: `service_code` required,
  `area`/appointment-availability filters optional. Response: provider-service-branch decision cards
  with practical eligibility state, price presentation, funded-protection availability, verified-review
  rating, nearest availability, assessment timestamp. Business rule this toolbar must not violate: the
  response (and therefore any facet built over it) carries **no** `P`, no service risk level, no
  comparison value, no sample count, no confidence figure, no market-average label (`Q-ELIG-001`
  discipline, section 0.8).
- **`SDC-OPS-001`** (panel work path) — Staff Work Queue. Projection carries `escalated`/`overdue` as
  **flags, not states** — a facet on either must be able to select on them independently of the work
  item's own lifecycle state.
- **`SDC-AUDIT-001`** (`history` variant, Admin audit explorer) — Audit Explorer and Historical
  Reproduction. Commands include **scoped search**; audit records are never editable or deletable, which
  binds directly to the "never reorders history" rule in section 6.
- **"The owning management contract"** — on `management`-variant surfaces not covered by the three
  above (e.g. `SCR-CATALOG-003`, `SCR-IDENTITY-036`), the toolbar filters that screen's own declared
  `SDC-*`, named in its own screen specification, never invented here.

#### 10. Shared application-layer prerequisites

- **`TASK-CATALOG-002`** — Patient-facing catalog consumption — and the `TASK-ELIG-*` sequence's
  patient-discovery item (`docs/implementation/USER_IMPLEMENTATION_PLAN.md`) are the prerequisites for
  `API-ELIG-001`'s `discovery` variant.
- **`TASK-OPS-002`** — "Implement Unified Operational Work Items" — the prerequisite for `SDC-OPS-001`'s
  `queue` variant. Per `docs/IMPLEMENTATION_PLAN.md`, this task is explicitly "moved forward in master
  sequencing because downstream booking/claims tasks depend on it."
- **`TASK-AUDIT-001`** — "Implement Sensitive Audit and Provenance Foundation" — the prerequisite for the
  `history` variant over `SDC-AUDIT-001`.

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `services`, `service_groups` | **Existing** | Back the `discovery` variant's search-by-service-family entry point. |
| `providers`, `branches`, `clinics` | Proposed | Back `API-ELIG-001`'s response cards and any provider/branch facet. |
| `eligibility_decisions` | Proposed | Backs practical-eligibility filtering on discovery; **one of the nine immutable/append-only entities** once decided — a facet may narrow on it but never edit it. |
| `work_items` | Proposed | Backs the `queue` variant and its `escalated`/`overdue` facets. |
| `audit_events` | Proposed, append-only | Backs the `history` variant; **immutable** (section 25). |

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN compact persistent filter set | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament table filters/search configuration | Each Resource table's `table()` method under `app/Filament/Resources/` (and `app/Filament/Clinic/Resources/` once the clinic panel exists) | Proposed |
| Shared per-actor/per-surface persistence helper | `app/Filament/Support/` | Proposed |

#### 13. Data/view-model mapping

| Canonical field | View-model responsibility |
|---|---|
| `API-ELIG-001` query params (`service_code`, `area`, availability) | `appliedFilters: Record<facetKey, value>`, persisted per Patient session for `discovery`? **No** — `discovery` queries are explicitly **not** restored on return (section 6); only `queue`/`management` variants persist. |
| `SDC-OPS-001` projection's `escalated`/`overdue` flags | Two independent boolean facets, never merged into the work item's own `state` facet |
| Result set + any stated bound (page size, top-N, date window) | `resultCount`, `totalCount` (where knowable), `boundStatement: string \| null` — a silent cap is never rendered as complete coverage (`IX-PLATFORM-016`) |
| Facet option sets that fail to load | `facets[i].unavailable: { reason: string }` — the facet renders unavailable with its reason, the rest of the toolbar stays usable |

No field beyond what `API-ELIG-001`, `SDC-OPS-001` and `SDC-AUDIT-001` already declare is invented.

#### 14. Refresh / caching / polling

The toolbar renders and is usable before results arrive (`loading-initial` does not block filtering).
A refresh keeps the applied set visible and editable while the new result set loads. No polling interval
or cache TTL is specified or invented; refresh follows the same event-driven moments as
`WGT-PLATFORM-001`'s host surface.

#### 15. Idempotency / correlation

**Not applicable.** Search and filter are read-side queries; they carry no idempotency-key contract
(`NFR-AUDIT-002` targets retry-prone **commit** commands). Re-issuing the same query twice is naturally
idempotent by virtue of being a read.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** scope-aware query builders/read models — quoted directly from
  `PERMISSIONS_MATRIX.md` section 20: **"query builders/read models must be scope-aware so unauthorized
  rows are not fetched and merely hidden later."** This widget's own filtering is client-visible
  narrowing on top of an already-scoped result set; it is never the scope boundary itself.
- **UI consequence:** a facet outside the actor's scope is not offered at all (not present-and-disabled).
  A scope failure on the result set itself renders as denial (`WGT-PLATFORM-001`'s `error-permission`),
  **never as `empty-filtered`** — collapsing the two would tell a scope-restricted actor their query
  simply matched nothing.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `discovery \| queue \| management \| history \| authoring` | Yes | none | Host screen's archetype | Never a sixth value |
| `facets` | `Facet[]` | Yes | `[]` | Host's own `API-*`/`SDC-*` filterable fields | A facet outside scope is never included |
| `appliedFilters` | `Record<string, value>` | No | `{}` | Actor's own selections, persisted per section 13 | Restored on return except for `discovery` |
| `searchQuery` | string | No | `""` | Actor's own input | Isolated where it contains Latin characters |
| `resultCount` / `totalCount` | number | Yes / No | — | Host's own read | `totalCount` only where knowable |
| `boundStatement` | string \| null | No | `null` | Host's own read, where a page size/top-N/window was applied | Never silently omitted when a bound is in force |
| `onApply` / `onClear` | callback | Yes | — | — | `onClear` is a single reachable control for the whole set |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The toolbar renders and is usable before results arrive; a filter is not blocked on the result set. |
| `loading-refresh` | The applied set stays visible and editable while the new result set loads. |
| `empty-no-data` | Only when **no filter is applied**. Wording and recovery are about creating a first record. |
| `empty-filtered` | The applied set stays visible, wording names the filter as the cause, recovery relaxes or clears it. |
| `partial` | A facet whose option set failed to load renders unavailable with its reason; the rest of the toolbar stays usable. |
| `stale` | Results marked stale with their as-of time; the applied set is not cleared by a failed refresh. |
| `error-fetch` | The applied set survives the failure so retry does not mean re-entering the query. |
| `error-permission` | A facet outside the actor's scope is not offered; a scope failure on the result set renders as denial, never as `empty-filtered`. |
| `success` | Results, with the count. |
| Offline / unstable | The last result set stays readable with its as-of time; a new query states that it cannot run yet rather than returning zero. |

#### 19. Lifecycle/state semantics

This widget does not own lifecycle status; where a status is offered as a filter facet
(`CMP-PLATFORM-001`, conditional), the facet's option labels resolve to the real status labels the
governing machine already defines in `semantic.state.json`/`CONTENT_GUIDE_STATES.md` — this widget
never invents a facet label that does not correspond to a real governed status.

#### 20. Tokens

`component.platform-007.*` (mandatory — input surface/border, chip fill/border/text, count text, radius,
inline spacing), `component.platform-009.*` (mandatory — empty-state rendering), conditional
`component.platform-001.*`, `component.platform-005.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-003`, `-004`, `-007`, `-019`. No canonical `ERR-*` string is restated; a
rejected filter value's error surfaces through `WGT-PLATFORM-010` (`IX-PLATFORM-018`), not authored here.

#### 22. Accessibility contract

- **Role/name:** the search input carries a persistent visible label; each facet announces its applied
  value.
- **Focus:** stays in the control the actor used; it never jumps to the results, which would prevent
  refining a query.
- **Keyboard:** the input is early in the tab order on a list surface; facets are reachable without
  entering a hover-revealed menu; clear-all is reachable.
- **Screen reader:** the result count announces politely when it changes.
- **No colour-only:** an applied facet is marked by its chip's fill+border+text together (from
  `state.selected.*`), never fill alone.
- **Text scaling:** at 200%, no facet or the clear-all control is lost; the applied summary wraps.

#### 23. RTL / bidi

- Facets flow start to end and mirror. Clear-all sits at the group's `end`.
- **Bidi isolation class: `code`.** A search term containing Latin characters is isolated in the applied-
  set chip so the actor can see exactly what they searched for, without reordering.
- The input's own text direction follows its content — a Latin code typed into an Arabic interface does
  not reverse.

#### 24. Responsive behavior

- **Profile C:** a small persistent filter set in the reading column, **never a hidden drawer** — the
  filter that caused an empty result must be visibly present.
- **Profile A:** facets inline at `profile-a.content-width.wide`; collapse into a labelled disclosure at
  `narrow`, with the applied set remaining visible **outside** the disclosure.
- At the largest supported text size, a long Arabic facet label wraps within its chip; the applied set
  wraps to multiple rows rather than scrolling sideways.

#### 25. Immutability / historical safety

**Applies to the `history` variant.** Where this toolbar filters over `audit_events` (via `SDC-AUDIT-001`)
or another append-only projection, filtering **only narrows the visible set** — it never reorders,
edits, or removes a historical row, and clearing a filter restores the same stable order the underlying
record already has (`IX-PLATFORM-016`: "ordering is a property of the record rather than of the view").

#### 26. Framework defaults to disable

Profile A, `Stock` — the framework's own filtering and search machinery is used as shipped; this
contract configures it rather than rebuilding it:

- Filament's default filter state (reset on navigation) must be **turned on to persist** per actor and
  surface for `queue`/`management`/`history` variants — the opposite of Filament's out-of-the-box
  behaviour, which does not persist filters across visits by default.
- Filament's default single empty-state string (one "no records" message regardless of cause) must be
  **configured with two distinct messages** — `no-data` vs `filtered-empty` — rather than left as one
  generic string, because the framework default does not distinguish them.
- Filament's default table search does **not** by itself render an "applied filter summary" chip row or
  a stated result count against total — both must be configured explicitly; leaving them at the default
  (a bare input with no visible applied-state echo) fails `IX-PLATFORM-014`.
- The underlying filter/search **input controls themselves are not rebuilt** — this is the `Stock`
  boundary: configuration plus the permission gate, not a parallel implementation.

#### 27. Prohibitions

1. A filtered-empty result must never be worded as an empty data set.
2. A hidden filter drawer must never appear on Profile C.
3. A filter must never silently persist without being visible.
4. An append-only projection's order must never change because of a filter.
5. A facet must never expose a scope the actor does not hold.

#### 28. Definition of Done

- [ ] Given an applied filter and no results, the surface renders `empty-filtered` with the filter
      visible.
- [ ] Given no filter and no results, the surface renders `empty-no-data`.
- [ ] A filter set survives navigation away and back (except `discovery`), and survives a failed refresh.
- [ ] The result count is announced when it changes and is present in the accessibility tree.
- [ ] On a `history` variant, no filter changes the order of events.
- [ ] None of the five prohibitions in section 27 is violated on any surface.
- [ ] No regression to `WGT-PLATFORM-005`, whose `empty-filtered` state depends on this widget's applied
      set staying visible.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 4, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-007`/`-009` resolve.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — input/chip/count contrast in default/hover/focus, light
  mode.
- `node scripts/axe_audit.mjs <file>` — facet expanded/collapsed state, disclosure semantics at `narrow`.
- `node scripts/verify_responsive.mjs <file>` — no horizontal overflow at the narrow verification
  widths (280, 320 and 414 CSS pixels) with the disclosure collapsed.

**Tier C (all: not run — requires implementation):**
- Filter persistence actually surviving navigation and a killed/backgrounded app on Profile C — not run
  — requires implementation.
- Real query-side authorization proof that an out-of-scope row is never fetched, not merely filtered
  client-side — not run — requires implementation.
- Screen-reader announcement of a live result-count change, verified with a real screen reader — not run
  — requires implementation.
- `history` variant ordering stability under real pagination, verified against `audit_events` — not run
  — requires implementation.

---

### WGT-PLATFORM-005 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-005
- **Name:** Lifecycle record list
- **Build order:** 5
- **Platforms:** C, A
- **Runtime:** RN virtualized reading list (Proposed, path unverified) + Filament table (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 85 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-005` block

#### 2. Implements

- `FR-BOOKING-001`
- `FR-CLAIMS-003`
- `FR-OPS-001`
- `NFR-PLATFORM-001`

#### 3. Used by

**85 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (19 Patient, 26 Clinic, 40 Admin):

- **Patient app (19):** `SCR-PLATFORM-001` (Needs attention), `SCR-PLATFORM-002` (Pending submissions),
  `SCR-BOOKING-003` (My bookings), `SCR-BOOKING-004` (Booking detail), `SCR-CLINICAL-001` (My cases),
  `SCR-CLINICAL-002` (Case summary), `SCR-CLINICAL-005` (Case timeline), `SCR-CLINICAL-006` (Stage
  detail), `SCR-CLINICAL-007` (Follow-ups), `SCR-FINANCE-001` (Accepted financial terms),
  `SCR-FINANCE-002` (Financial timeline), `SCR-REVIEWS-003` (My review), `SCR-CLAIMS-001` (My claims),
  `SCR-CLAIMS-003` (Protection claim), `SCR-CLAIMS-004` (Claim detail), `SCR-IDENTITY-005` (Family and
  representation), `SCR-IDENTITY-008` (Active patient context), `SCR-PLATFORM-009` (Notification
  centre), `SCR-BOOKING-016` (Reschedule request).
- **Clinic panel (26):** `SCR-IDENTITY-012` (Application workspace), `SCR-IDENTITY-015` (Application
  evidence), `SCR-PLATFORM-003` (Clinic dashboard), `SCR-IDENTITY-021` (Onboarding checklist),
  `SCR-IDENTITY-022` (People and grants), `SCR-OPS-001` (Clinic work feed), `SCR-ELIG-006` (Provider
  and branch facts), `SCR-ELIG-009` (Activation evidence), `SCR-ELIG-011` (Eligibility status),
  `SCR-ELIG-012` (Blocker detail), `SCR-ELIG-013` (Suspension notice), `SCR-BOOKING-008` (Booking
  inbox), `SCR-BOOKING-011` (Clinic schedule), `SCR-CLINICAL-008` (Clinic cases), `SCR-CLINICAL-009`
  (Case workspace), `SCR-CLINICAL-010` (Plan authoring), `SCR-CLINICAL-011` (Stages and pricing),
  `SCR-CLINICAL-013` (Plan version history), `SCR-CLINICAL-014` (Stage execution and evidence),
  `SCR-CLINICAL-017` (Clinic follow-ups), `SCR-FINANCE-006` (Case financial workspace), `SCR-REVIEWS-005`
  (Provider reviews), `SCR-CLAIMS-006` (Clinic claims), `SCR-CLAIMS-007` (Claim response and evidence),
  `SCR-BOOKING-017` (Reschedule proposals), `SCR-ELIG-021` (Bookings on eligibility hold).
- **Admin panel (40):** `SCR-PLATFORM-004` (Admin dashboard), `SCR-IDENTITY-027` (Application queue),
  `SCR-IDENTITY-029` (Fact and evidence verification), `SCR-IDENTITY-033` (Staff accounts and roles),
  `SCR-IDENTITY-036` (Providers and branches), `SCR-CATALOG-003` (Groups and services), `SCR-CATALOG-004`
  (Definition versions), `SCR-CATALOG-006` (Launch gates), `SCR-CATALOG-009` (Reviewer credentials),
  `SCR-CATALOG-010` (Procedure catalog and family mapping), `SCR-CATALOG-011` (Commercial rules and
  modifiers), `SCR-ELIG-016` (Source fact verification), `SCR-ELIG-017` (Evidence verification),
  `SCR-ELIG-018` (Decision inspector), `SCR-ELIG-020` (Suspension operations), `SCR-BOOKING-014`
  (Booking operations), `SCR-BOOKING-015` (Booking oversight), `SCR-CLINICAL-019` (Case oversight
  detail), `SCR-FINANCE-010` (Records operations), `SCR-FINANCE-011` (Dispute review), `SCR-FINANCE-012`
  (External execution tracking), `SCR-REVIEWS-007` (Integrity queue), `SCR-CLAIMS-009` (Claims queue),
  `SCR-CLAIMS-010` (Claim review), `SCR-CLAIMS-011` (Evidence and deadlines), `SCR-OPS-002` (Work queue),
  `SCR-OPS-004` (Operational reports), `SCR-OPS-005` (Drill-down and export), `SCR-OPS-006` (Launch
  readiness overview), `SCR-POLICY-001` (Policy versions), `SCR-POLICY-003` (Review and scheduling),
  `SCR-POLICY-004` (Historical reproduction), `SCR-AUDIT-001` (Audit explorer), `SCR-AUDIT-002` (Audit
  event detail), `SCR-AUDIT-003` (Integrity exceptions), `SCR-AUDIT-004` (Idempotency conflicts),
  `SCR-PLATFORM-006` (Evidence access log), `SCR-PLATFORM-007` (Retention and legal hold),
  `SCR-PLATFORM-008` (Operational health), `SCR-ELIG-023` (Market observations and calibration).

#### 4. Widget dependencies

- **Required predecessors:** `WGT-PLATFORM-001` (build order 1) and `WGT-PLATFORM-004` (build order 4).
  The dependency on `WGT-PLATFORM-004` is a **stated content dependency**, not a mere co-occurrence:
  this widget's own `empty-filtered` row renders "with the applied filter still visible in
  `WGT-PLATFORM-004`" (`PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2, E3). A surface using this widget's
  `empty-filtered` state without `WGT-PLATFORM-004` present is a defect.
- **Not a build dependency:** the `row` variant of this widget reuses `CMP-PLATFORM-004`'s own `row`
  variant (a component-level reuse, not a `WGT-PLATFORM-003` build edge — `WGT-PLATFORM-003` need not be
  built first for this widget's rows to render their own action affordance, though in practice both
  exist by build order 5 since `WGT-PLATFORM-003` is build order 2).

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-006` — Record list | The whole widget. Variants: `reading-list` (Profile C, whole row is the target), `table` (Profile A), `embedded` (inside a detail surface), `immutable` (read/export only — **no create, edit, delete or bulk action**), `selectable` (comparison candidates, assignment targets). Anatomy: `header row` (table only) → `status` → `subject` → `facts` → `when` → `flag`(s) (own slot, never recolouring the status chip) → `row actions`. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | Per row, where the record carries a lifecycle status (the common case) |
| `CMP-PLATFORM-005` — Deadline indicator | Per row, where the record is deadline-bearing |
| `CMP-PLATFORM-004` — Action bar | `row` variant, same HIDDEN/UNAVAILABLE/DISABLED availability rules as `WGT-PLATFORM-003` |
| `CMP-ELIG-002` — Price display | Per row, where the record carries an amount |

#### 6. Interaction dependencies

- **`IX-PLATFORM-015` (owner) — List to detail and back.** The detail surface reads **authoritative
  state for that record**, never the row's own projection (a row is a summary and may be stale).
  Returning restores the list's **filter, sort, scroll position and selection**. **Focus returns to the
  row the actor came from** — "the single most commonly missed half of this pattern."
- **`IX-PLATFORM-016` — Bounded reads over unbounded history.** Where the projection is unbounded, the
  bound is stated, ordering is stable across pages, and a truncated history is never rendered as
  complete.
- **`IX-PLATFORM-011` — Text scaling and reflow.** At the largest supported text size, the `table`
  variant degrades to `reading-list` rather than relying on horizontal scroll indefinitely.
- **`IX-PLATFORM-012` — Input model per profile.** No hover-revealed row action on Profile C; Profile A
  is keyboard-complete for row selection and row actions.
- **`IX-PLATFORM-010` — Bidirectional and mixed-direction content.** Amounts, codes, dates and
  identifiers per cell are isolated; numeric columns keep their own internal direction.
- **`IX-PLATFORM-003` — Authoritative read refresh and staleness disclosure.** Initial load renders row
  skeletons; a refresh keeps rows visible and marks staleness rather than blanking the list.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-003` — Field labels | Canonical | Column header labels on the `table` variant. |
| `TXT-PLATFORM-007` — Empty states | Canonical | `empty-no-data` vs `empty-filtered` for the whole list. |
| `TXT-PLATFORM-019` — Structural state and archetype copy | Canonical | `list-and-detail` rule: "a hard cap on displayed rows is stated explicitly, never hidden as if it were the total." |
| `TXT-PLATFORM-020` — Arabic mechanics | Canonical | Western/tabular digits for every numeric/date/amount cell; bidi isolation per cell; filename truncation rule where a row shows a file. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-012` — Native structural semantics | `table` variant is a real table with header-cell association; `reading-list` is a real list with one accessible name per row (WCAG 1.3.1). |
| `A11Y-PLATFORM-008` — Focus restoration, list-to-detail-and-back | On return from a detail surface, focus returns to the row the actor came from, **and** the list's scroll/filter/sort/selection are restored together (WCAG 2.4.3) — "no Filament or React Native default restores both together." |
| `A11Y-PLATFORM-013` — Target size floor | Every row clears `semantic.size.target-floor`; `reading-list` rows on Profile C use the whole row as the tap target (WCAG 2.5.8). |
| `A11Y-PLATFORM-015` — No colour-alone communication | Every row status consumes the full tone/icon/emphasis triple; a flag (`escalated`, `overdue`) is additive in its own slot, never a recolour of the status (WCAG 1.4.1). |
| `A11Y-PLATFORM-023` — Long content is sized-for | A long Arabic subject name wraps or the row stacks; a status label, deadline, amount and controlling reason **never** truncate, at any size, in any density mode (WCAG 1.4.10 informative extension). |
| `A11Y-PLATFORM-030` — Bidirectional content: AT reading order and isolation | Correct **screen-reader pronunciation order** for every isolated cell value, not only correct visual order (WCAG 1.3.2). |
| `A11Y-PLATFORM-036` — Responsive/reflow, operational panel | A `table` variant's own body **may** scroll horizontally within its own bounded container only where column count genuinely requires it, and only where the table still degrades to `reading-list` at the largest text sizes; **the page itself never scrolls horizontally** at any content width down to the narrow verification widths (WCAG 1.4.10). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning projection."
Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-BOOKING-002` (patient's own bookings), `API-CLAIMS-003` (case claims/refund
  requests), `API-CLINICAL-004` (unified case timeline).
- **Profile A:** `SDC-OPS-001` (Staff Work Queue — projection carries `escalated`/`overdue` as
  independent **flags**, never merged into the item's own `state`), `SDC-BOOKING-001` (Clinic Booking
  Inbox and Response), `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace), `SDC-FINANCE-001`
  (Financial Record Workspace).

On every other screen, the applicable contract is that screen's own declared `API-*`/`SDC-*` (section
0.6), never invented here.

#### 10. Shared application-layer prerequisites

- Same shared rendering-primitive prerequisite as `WGT-PLATFORM-001`/`-003`: **`TASK-PLATFORM-001`**
  (Filament `app/*`, admin existing) and **`TASK-PLATFORM-005`** (clinic panel) for Profile A;
  **`TASK-PLATFORM-008`** for Profile C.
- **`TASK-OPS-002`** — "Implement Unified Operational Work Items" — the prerequisite for any surface
  hosting this widget over `SDC-OPS-001`, which is the single most common Profile A host
  (`SCR-OPS-001`/`-002` and every clinic/admin queue surface in section 3).
- Every other host projection's own `TASK-*` (e.g. booking, claims, clinical) is that host's own
  prerequisite, named in its own screen specification — out of scope here, consistent with this widget
  owning no fixed data model.

#### 11. Data model prerequisites

**No single fixed entity** — depends on the host projection, named per-screen. The one cross-cutting
concern this widget's own contract does own: wherever a host projection is one of the nine immutable or
append-only entities (`UX_FOUNDATION.md` section 5.1 — `eligibility_decisions`,
`accepted_treatment_snapshots`, `financial_terms_snapshots`, `financial_events`, `booking_events`,
`claim_decisions`, `claim_deadline_events`, `audit_events`, `service_launch_gates`), the widget **must**
render the `immutable` variant (section 25). All nine are Proposed.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN virtualized reading list | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament table configuration | Each Resource's `table()` method under `app/Filament/Resources/` (and `app/Filament/Clinic/Resources/` once the clinic panel exists) | Proposed |
| Shared bulk-action/immutable-guard helper | `app/Filament/Support/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host's own projection) | View-model responsibility |
|---|---|
| Row's own status field | `rows[i].status` → resolved through `CMP-PLATFORM-001`'s own tone/icon/emphasis binding, never a bare string |
| Independent flags (e.g. `SDC-OPS-001`'s `escalated`/`overdue`) | `rows[i].flags: string[]` — a separate array, never merged into `status` |
| Deadline field, where present | `rows[i].deadline: { at, variant }` — feeds `CMP-PLATFORM-005`; a deadline that failed to load is `rows[i].deadline: "unavailable"`, never silently `undefined` (rendered as "no deadline" is prohibited, section 27) |
| Amount field, where present | `rows[i].amount` → `CMP-ELIG-002` |
| Applied bound (page size/top-N/window) | `boundStatement: string \| null`, shared with `WGT-PLATFORM-004`'s own field where both are present |

No field is invented beyond what the host's own `API-*`/`SDC-*` already projects.

#### 14. Refresh / caching / polling

Event-driven, per `IX-PLATFORM-003`: initial load renders row skeletons; a refresh never scrolls the
list and keeps rows interactive while the new read completes. No polling interval or cache TTL is
specified or invented.

#### 15. Idempotency / correlation

**Not applicable to the list itself.** This widget issues no command — it is a read-side projection.
Any row action it composes conditionally (`CMP-PLATFORM-004`, `row` variant) is `WGT-PLATFORM-003`'s own
idempotency concern (that contract's section 15), not this widget's.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** scope-aware query builders/read models — "unauthorized rows are not
  fetched and merely hidden later" (`PERMISSIONS_MATRIX.md` section 20).
- **UI consequence:** `error-permission` replaces the whole list with the denial block. **A scope
  failure must never render as an empty list** — collapsing the two would make a permission failure
  indistinguishable from a genuinely quiet queue.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `reading-list \| table \| embedded \| immutable \| selectable` | Yes | none | Host archetype; forced to `immutable` over one of the nine entities | Never a sixth value |
| `rows` | `Row[]` (section 13) | Yes | `[]` | Host's own projection | — |
| `columns` | `Column[]` | Only for `table` | — | Host's own projection field set | Header labels resolve to `TXT-PLATFORM-003` |
| `sortState` | object | No | Host's own default | Host's own projection | Never applies to `history`-bound rows (immutable order) |
| `boundStatement` | string \| null | No | `null` | Host's own read | See section 13 |
| `onRowSelect` | callback | Yes for `reading-list`/`table`/`selectable` | none | Navigates to `WGT-PLATFORM-003`'s host detail surface | Drives `IX-PLATFORM-015` |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | Row skeletons at row height, so completion causes no shift. Row count is not implied by the skeleton count. |
| `loading-refresh` | Rows stay visible and interactive; a refresh never scrolls the list. |
| `empty-no-data` | The list is replaced by `CMP-PLATFORM-009` `no-data` with the one creating action. |
| `empty-filtered` | Replaced by `filtered-empty`, with the applied filter still visible in `WGT-PLATFORM-004`. |
| `partial` | A row whose secondary projection failed renders with that field named as unavailable rather than blank. A deadline that did not load is never rendered as no deadline. |
| `stale` | Rows shown with the list's as-of time; row actions that commit are withdrawn. |
| `error-fetch` | Last known rows preserved where they exist, retry in place. |
| `error-permission` | The list is replaced by the denial block. A scope failure never renders as an empty list. |
| `success` | Rows. |
| Offline / unstable | Last known rows with their as-of time; row actions that commit are withdrawn unless idempotent-resumable. |

#### 19. Lifecycle/state semantics

**This widget owns lifecycle status rendering — the majority of its purpose.** Every row's status binds
to the governing status machine through `CMP-PLATFORM-001`, which resolves `state.<machine>.<STATUS>.
{tone, icon, emphasis}` from `design_tokens/semantic.state.json` and the Arabic chip label from the
matching `TXT-STATE-*` entry in `CONTENT_GUIDE_STATES.md` — this widget never renders a status by colour
alone, and never invents a status label outside the governing machine. **Flags render beside the status,
in their own slot, never by recolouring the status chip** — a row can be simultaneously `IN_PROGRESS`,
`escalated` and `overdue`, and the projection must expose all three independently.

#### 20. Tokens

`component.platform-006.*` (mandatory — row surface/hover/selected, header text, divider, radius,
numeric feature), conditional `component.platform-001.*`, `component.platform-005.*`,
`component.platform-004.*` (row variant), `component.elig-002.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-003`, `-007`, `-019`, `-020`. Status labels resolve to `CONTENT_GUIDE_STATES.md`
per section 19; no `ERR-*` string is restated.

#### 22. Accessibility contract

- **Role/name:** `table` variant exposes real header-cell association; `reading-list` exposes one
  accessible name per row including its status.
- **Focus:** returning from a detail surface restores focus to the row the actor opened, **together
  with** scroll/filter/sort/selection (`A11Y-PLATFORM-008`) — both halves are required, not either alone.
- **Keyboard:** every row action is keyboard reachable on Profile A; sorting is operable without a
  pointer; row flags are announced as part of the row, distinct from the status.
- **Screen reader:** row count and column headers are exposed where the variant has them.
- **No colour-only:** status = tone + icon + label together; a flag never recolours the status chip.
- **Text scaling:** at the largest text sizes, `table` degrades to `reading-list` rather than relying on
  horizontal scroll indefinitely.

#### 23. RTL / bidi

- Column order mirrors. Numeric columns align by **logical** property, never physical side.
- **Bidi isolation classes: `amount`, `date`, `id`, `code`.** Every amount, code, date and identifier
  cell is isolated per cell — a reordered code is a **wrong** code (`IX-PLATFORM-010`).

#### 24. Responsive behavior

- **Profile C:** always `reading-list`.
- **Profile A:** `table` at `profile-a.content-width.wide`; at `narrow`, either a **bounded internal
  horizontal scroll** (permitted for a data table under `A11Y-PLATFORM-036`) or degradation to
  `reading-list` — each host screen spec states which. **The page itself never scrolls horizontally.**

#### 25. Immutability / historical safety

**This is the widget's core structural obligation.** Where the rendered projection is one of the nine
immutable or append-only entities, the widget **must** render the `immutable` variant: read and export
only. **Prohibited on that variant:** create, edit, delete, and any bulk action. This applies regardless
of what the underlying Filament table's own default configuration would otherwise offer.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- **Bulk actions are removed by default on every table this widget renders** — not only on `immutable`
  ones — because Filament ships bulk actions (including bulk delete) by default on every table resource,
  and this is the single hard configuration rule `WIDGET_SPECS.md` section 6 calls out by name: "the
  real risk is Filament shipping bulk actions including delete by default, which is a hard configuration
  rule on `WGT-PLATFORM-005`."
- **The delete row action is not registered** (not hidden — **not registered**) over any of the nine
  immutable entities.
- Filament's default `BadgeColumn` (colour value only, one string label) is **not** used as-is for a
  status column — it is configured (or a custom column substituted) so the rendered cell carries the
  full tone/icon/emphasis triple, never a colour-only badge.

#### 27. Prohibitions

1. A generic edit or delete affordance must never appear over an immutable or append-only entity.
2. A bulk action must never be registered by framework default.
3. A flag must never be rendered by recolouring the status chip.
4. A status must never be rendered as a colour with no icon and no label.
5. A filtered-empty result must never be worded as an empty set.
6. A page must never scroll horizontally because a table did.

#### 28. Definition of Done

- [ ] No list over any of the nine immutable entities exposes create, edit, delete or bulk actions.
- [ ] Every row status renders as tone, icon and label together; removing colour loses no meaning.
- [ ] Escalated and overdue render in their own slot and can both be true while the status is a third
      thing.
- [ ] Returning from a row detail restores focus to that row, together with scroll/filter/sort/selection.
- [ ] At the narrow verification widths the page does not scroll horizontally, whether or not a table
      does.
- [ ] A row whose deadline failed to load says so and is not rendered as having none.
- [ ] None of the six prohibitions in section 27 is violated on any surface.
- [ ] No regression to `WGT-PLATFORM-004`'s applied-filter visibility on `empty-filtered`.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 5, predecessors
  `WGT-PLATFORM-001`/`-004` declared, mandatory `CMP-PLATFORM-006` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — row/status/flag contrast in default/hover/selected, light
  mode.
- `node scripts/axe_audit.mjs <file>` — table header association, list role, row accessible names.
- `node scripts/verify_responsive.mjs <file>` — no page-level horizontal overflow at the narrow
  verification widths (280, 320 and 414 CSS pixels); a table's own bounded scroll (where used)
  contained within its own container.

**Tier C (all: not run — requires implementation):**
- Live proof that no bulk-delete action reaches the UI over any of the nine immutable entities, verified
  against the real Filament configuration — not run — requires implementation.
- Focus-plus-scroll-plus-filter-plus-sort restoration together on a real return-from-detail navigation —
  not run — requires implementation.
- Real query-side scope enforcement proving an out-of-scope row is never fetched — not run — requires
  implementation.
- Text-scaling degrade from `table` to `reading-list` verified at the platform's real maximum text size
  — not run — requires implementation.

---

### WGT-PLATFORM-010 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-010
- **Name:** Validation and correction region
- **Build order:** 6
- **Platforms:** C, A
- **Runtime:** RN shared component (Proposed, path unverified) + Filament validation display (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Stock`
- **Screen reach:** 62 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-010` block

#### 2. Implements

- `FR-IDENTITY-001`
- `FR-CLINICAL-006`
- `FR-CLAIMS-001`
- `NFR-PLATFORM-006`

#### 3. Used by

**62 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (13 Patient, 31 Clinic, 18 Admin):

- **Patient app (13):** `SCR-IDENTITY-002` (Phone entry and code request), `SCR-IDENTITY-003` (Code
  verification), `SCR-BOOKING-002` (Request review and submit), `SCR-BOOKING-005` (Alternative
  appointment decision), `SCR-BOOKING-006` (Cancel booking), `SCR-FINANCE-003` (Report external
  payment), `SCR-FINANCE-004` (Financial event response), `SCR-FINANCE-005` (Report refund execution),
  `SCR-REVIEWS-002` (Submit review), `SCR-CLAIMS-002` (Refund request), `SCR-IDENTITY-006` (Create
  grant), `SCR-IDENTITY-007` (Grant detail), `SCR-IDENTITY-037` (Add dependent).
- **Clinic panel (31):** `SCR-IDENTITY-011` (Applicant contact verification), `SCR-IDENTITY-012`
  (Application workspace), `SCR-IDENTITY-013` (Applicant and provider facts), `SCR-IDENTITY-014`
  (Primary branch facts), `SCR-IDENTITY-016` (Review and submit), `SCR-IDENTITY-017` (Status and
  requested changes), `SCR-IDENTITY-019` (Clinic sign-in), `SCR-IDENTITY-022` (People and grants),
  `SCR-IDENTITY-023` (Create invitation), `SCR-IDENTITY-024` (Invitation detail), `SCR-IDENTITY-025`
  (Invitation acceptance), `SCR-IDENTITY-026` (Staff grant detail), `SCR-ELIG-006` (Provider and branch
  facts), `SCR-ELIG-007` (Activation requests), `SCR-ELIG-008` (Activation questionnaire), `SCR-ELIG-010`
  (Service price), `SCR-BOOKING-009` (Request response), `SCR-BOOKING-010` (Propose alternative),
  `SCR-BOOKING-012` (Provider cancellation), `SCR-BOOKING-013` (Record no-show), `SCR-CLINICAL-009`
  (Case workspace), `SCR-CLINICAL-010` (Plan authoring), `SCR-CLINICAL-011` (Stages and pricing),
  `SCR-CLINICAL-012` (Propose plan), `SCR-CLINICAL-015` (Stage completion), `SCR-CLINICAL-016` (Stage
  reopening), `SCR-FINANCE-006` (Case financial workspace), `SCR-FINANCE-007` (Report payment),
  `SCR-FINANCE-008` (Event response), `SCR-FINANCE-009` (Report refund execution), `SCR-CLAIMS-007`
  (Claim response and evidence).
- **Admin panel (18):** `SCR-PLATFORM-005` (Privileged sign-in), `SCR-IDENTITY-029` (Fact and evidence
  verification), `SCR-IDENTITY-030` (Request changes), `SCR-IDENTITY-034` (Staff scope grant),
  `SCR-IDENTITY-035` (Guardian grant oversight), `SCR-CATALOG-005` (Definition editor), `SCR-CATALOG-007`
  (Record gate decision), `SCR-ELIG-014` (Verification workbench), `SCR-ELIG-015` (Activation request
  review), `SCR-ELIG-016` (Source fact verification), `SCR-ELIG-017` (Evidence verification),
  `SCR-ELIG-018` (Decision inspector), `SCR-REVIEWS-008` (Integrity decision), `SCR-REVIEWS-009` (Appeal
  decision), `SCR-CLAIMS-012` (Sensitive decision), `SCR-CLAIMS-013` (Appeal decision), `SCR-POLICY-002`
  (Version editor), `SCR-IDENTITY-038` (Legal representation verification).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only.
- **Not a build dependency:** despite composing `CMP-PLATFORM-004` conditionally (for the submit
  control) and `CMP-CLINICAL-002` conditionally (`requested-changes` variant), this widget carries no
  documented edge to `WGT-PLATFORM-003` or any domain widget — those are component reuses, not widget
  build dependencies, and section 0.4.1 forbids inferring one that Session 1's measured edge set does
  not name.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | The submit control's own committing/failed/completed state, `inline` variant, beside the submit action. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-004` — Action bar | The submit control itself (a `page`-variant action) |
| `CMP-CLINICAL-002` — Change disclosure | A reviewer returned an itemised set of requested changes (`requested-changes` variant — "only the flagged items are editable; everything else is visibly locked") |
| `CMP-PLATFORM-010` — Recovery state | The failure is **not field-attributable** — a domain precondition failure with no single responsible field |

#### 6. Interaction dependencies

- **`IX-PLATFORM-018` (owner) — Field-bound validation and correction.** Full sequence: validation is
  **server-authoritative**; client-side checks are a courtesy, never the contract. **Every error is
  bound to the field it concerns**, not collected only in a summary. A summary additionally lists errors
  with links to each field, for a long form. Each message states **what is wrong and how to fix it**.
  **The actor's input survives entirely — nothing is cleared.** **Correcting a field clears its own
  error without re-submitting the form.**
- **`IX-PLATFORM-001` — Server-committed mutation.** Governs the submit control once validation passes:
  idempotency key fixed at first submission, no re-submission while in flight, re-read authoritative
  state after commit.
- **`IX-PLATFORM-002` — Idempotent retry.** The correction retry **reuses the original idempotency
  key** where the original submission never reached the server; a new key is issued only where the
  actor's intent genuinely changed — which correcting a field does **not** count as.
- **`IX-PLATFORM-005` — Draft save and resume without a submitted record.** On a long authoring surface,
  the draft persists across the validation cycle; a save failure is reported while the actor can still
  act, never discovered only on return.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-003` — Field labels | Canonical | Every field's persistent visible label; required-field text marker, not colour/asterisk alone; financial field labels name the currency inside the label itself. |
| `TXT-PLATFORM-004` — Helper text | Canonical | Format hint preceding an error, staying visible alongside the error once one appears (never replaced by it). |
| `TXT-PLATFORM-005` — Validation | Canonical, fixed formula | **[what is wrong] + [how to fix it]**, no "why" paragraph unless non-obvious. Prohibited: "Error: invalid input" with no detail; a bare internal error code; "something went wrong" with no next step. The field-boundary rule: where validation cannot attribute the error to one field, `ERR-PLATFORM-001`'s generic message is used, **referenced, never re-worded** — see `TXT-ERR-PLATFORM-001`. |
| `TXT-PLATFORM-006` — System error copy | Canonical | Two-layer rule: the catalog's official message (`docs/api/ERROR_CATALOG.md`, never re-worded) plus this widget's own recovery guidance. No internal technical detail (stack trace, SQL error, internal class name, provider credential) ever reaches the user. |
| `TXT-ERR-PLATFORM-001` — `ERR-PLATFORM-001` · Validation failed | Canonical, quoted below | The generic non-field-attributable message. |

**`TXT-ERR-PLATFORM-001` in full:** canonical Arabic message (`ERROR_CATALOG.md` §4):
"تعذر إكمال الطلب. يرجى مراجعة البيانات المدخلة." ("The request could not be completed. Please review
the entered data.") Shown **only** when the failure cannot be attributed to one field — never the only
thing the actor sees when a field is at fault. Retry: not allowed until the actor corrects first
(`ERROR_CATALOG.md` §13 retry matrix). No escalation route; user-correctable within the form.

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-027` (owner) — Field-bound error association, summary, and input preservation | Every field-level error is **programmatically associated** with its field (the error text's identifier referenced by the field's description/error attribute), in addition to being visually bound. A summary additionally links to each field on a long form. The actor's input **survives entirely** — nothing is cleared on a failed submission (WCAG 3.3.1, 3.3.3, 4.1.2). |
| `A11Y-PLATFORM-026` — Persistent visible labels; no placeholder-as-label | Every field's label is always visible, never only placeholder text; required marked with text, not colour alone (WCAG 3.3.2, 1.3.1). |
| `A11Y-PLATFORM-006` — Focus movement after mutation, error, structural-state replacement | On failure, focus moves to the **first field in error**, never to a summary alone and never to the top of the form (WCAG 2.4.3, 4.1.3). |
| `A11Y-PLATFORM-019` — Text scaling without loss of content or function | At 200% text size / platform maximum, every field label, message and the submit control remains present and functional (WCAG 1.4.4). |
| `A11Y-PLATFORM-021` — Text-spacing survival | No content or function is lost under the WCAG text-spacing override multipliers (WCAG 1.4.12) — this product's zero letter-spacing baseline means it starts spacing-safe rather than fighting an existing tracking value. |
| `A11Y-PLATFORM-011` — Live-region announcement policy | The error count is announced **once**, not per field, when validation completes (WCAG 4.1.3). |
| `A11Y-PLATFORM-015` — No colour-alone communication | An error is never indicated by colour alone — border, icon and message text together (WCAG 1.4.1). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning command's
contract." Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-BOOKING-001` (create booking request), `API-FINANCE-002` (report external
  payment), `API-CLAIMS-001` (submit refund request), `API-REVIEWS-001` (submit verified review).
- **Profile A:** `SDC-IDENTITY-001` (Clinic Onboarding Applicant Workspace), `SDC-ELIG-001` (Clinic
  Service Activation Workspace — provider submits source facts/evidence; no manual grade/eligibility
  inputs), `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace), `SDC-CLAIMS-001` (Claim/Dispute
  Participation and Review Workspace).

On every other screen, the applicable command is that screen's own declared `API-*`/`SDC-*` (section
0.6), never invented here.

#### 10. Shared application-layer prerequisites

Each host command's own field-level validation rules are that command's own `TASK-*` prerequisite,
named in its own screen specification (out of scope here, since this widget owns no fixed command). The
prerequisite this contract does own is the shared configuration layer:

- **`TASK-PLATFORM-001`** (`app/Filament/*`, admin panel existing) and **`TASK-PLATFORM-005`** (clinic
  panel) for the shared Filament validation-summary/first-error-focus helper.
- **`TASK-PLATFORM-008`** for the equivalent Profile C shared component.
- **`TASK-AUDIT-003`** — "Implement Patient API Idempotency, Correlation, and Stable Error Envelope" —
  the prerequisite for `ERR-PLATFORM-001`'s field-attributable error shape to actually reach the client
  in the structure this widget needs (per-field messages, not a flat string).

#### 11. Data model prerequisites

**n/a.** This widget renders the validation outcome of whichever command the host screen submits; it
binds no ERD table of its own. The `requested-changes` itemised variant additionally depends on whatever
entity the reviewer's change-request record itself belongs to (e.g. an onboarding application or an
activation request) — that entity is the host command's own prerequisite, not this widget's.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN shared component | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament validation display configuration | `app/Filament/Support/` (summary + first-error-focus helper), applied per form field set under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host command's own response) | View-model responsibility |
|---|---|
| `ERR-PLATFORM-001`'s field-level violations (where the host command returns them) | `fieldErrors: Record<fieldName, { message, howToFix }>` |
| `ERR-PLATFORM-001`'s non-field-attributable case | `formError: string \| null` — routes to `TXT-ERR-PLATFORM-001`'s referenced message, never re-worded |
| The actor's current input, across a failed submission | `values: Record<fieldName, value>` — **never reset** on failure |
| Reviewer's itemised requested-change set (`requested-changes` variant) | `editableFields: string[]`, everything else locked read-only |

No field is invented — this is exactly `ERR-PLATFORM-001`'s own shape (field-bound where attributable,
generic where not), consumed rather than re-specified.

#### 14. Refresh / caching / polling

None beyond `IX-PLATFORM-003`'s standing rule for the host surface. A governed option-set field that
changes on refresh **states the change** rather than silently replacing a chosen value — no polling
interval is specified.

#### 15. Idempotency / correlation

**Applies — this widget hosts a committing submit control.**

- **Idempotency applies:** yes, once validation passes and the command actually submits (`NFR-AUDIT-002`).
- **Key reuse on retry:** the correction retry reuses the **original** idempotency key where the original
  submission never reached the server; correcting a field is never treated as a changed intent
  (`IX-PLATFORM-018`, `IX-PLATFORM-002`).
- **Unknown-outcome reconciliation:** `IX-PLATFORM-004`, inherited from the host surface — this widget
  itself only guarantees the input is preserved while reconciliation runs.
- **Correlation/audit requirement:** `FR-AUDIT-003` on the underlying command, same as `WGT-PLATFORM-003`.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** the host command's own policy (Proposed `app/Policies/*`,
  `TASK-IDENTITY-002`) — this widget performs no authorization check of its own.
- **UI consequence:** on `error-permission`, the form is **replaced by the denial block**, and the
  actor's input is **not silently discarded** where they could still use it elsewhere (e.g. copy it into
  a different, permitted surface) — never cleared as a side effect of the denial.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `inline \| summary \| itemised` | Yes | `inline` | Host screen's form length | `summary` for long forms/workspaces; `itemised` for requested changes |
| `fields` | `Field[]` | Yes | `[]` | Host command's own field set | Each carries its own `helperText`, `error?`, `value` |
| `fieldErrors` | `Record<string, {message, howToFix}>` | No | `{}` | Host command's response, per section 13 | Bound per field, never collected only in a summary |
| `formError` | string \| null | No | `null` | Host command's response | Non-field-attributable only |
| `submissionState` | see `WGT-PLATFORM-003` section 13 | No | `"idle"` | Host's own commit state | Feeds `CMP-PLATFORM-011` |
| `onSubmit` | callback | Yes | — | Host's own command | Reuses idempotency key per section 15 |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | Fields render with their governed option sets loaded; a select whose options have not loaded is not offered as empty. |
| `loading-refresh` | A re-read that changes a governed option set states the change rather than silently replacing a chosen value. |
| `empty-no-data` | n/a for the form itself; applies to an embedded governed list with no options, which states that rather than rendering an empty select. |
| `empty-filtered` | n/a. A form is not a filtered projection. |
| `partial` | A field whose governed options failed to load is unavailable with the reason, and submission is blocked with that reason named. |
| `stale` | Submission is withdrawn against a stale precondition; the form re-reads first and the actor's input is preserved across the re-read. |
| `error-fetch` | Input preserved entirely. Retry offered. Nothing is cleared. |
| `error-permission` | The form is replaced by the denial block and the input is not silently discarded where the actor could still use it elsewhere. |
| `success` | The commit proceeds under `IX-PLATFORM-001` and the surface re-reads authoritative state. |
| Offline / unstable | The submit control states the condition; where the command is idempotent-resumable it queues and shows pending, never done. |

#### 19. Lifecycle/state semantics

**This widget does not own lifecycle status rendering.** It renders the validation outcome of a
command, not a record's status. Where its `itemised` variant composes `CMP-CLINICAL-002`
`requested-changes`, any attribution or status shown there belongs to that component's own contract
(and, where placed elsewhere, `WGT-PLATFORM-002`/`-005`) — this widget only decides which fields are
editable, per the reviewer's itemised set.

#### 20. Tokens

`component.platform-011.*` (mandatory), conditional `component.platform-004.*`,
`component.clinical-002.*`, `component.platform-010.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-003`, `-004`, `-005`, `-006`, and `TXT-ERR-PLATFORM-001`. The canonical
`ERR-PLATFORM-001` message is referenced, never re-worded, per `TXT-PLATFORM-006`'s two-layer rule.

#### 22. Accessibility contract

- **Role/name:** every field carries a persistent visible label; a placeholder is never the label.
- **Focus:** on failure, focus moves to the **first field in error** — not the summary, not the top of
  the form. Each summary entry is a link that moves focus to its own field. Correcting the last error
  does **not** move focus to submit.
- **Keyboard:** the form is completable and correctable by keyboard alone on Profile A.
- **Screen reader:** the error count is announced once, not per field.
- **Association:** every message is programmatically associated with its field.
- **No colour-only:** an error is border + icon + message together, never colour alone.
- **Text scaling / spacing:** at 200% text size and under text-spacing overrides, no label, message or
  control is lost.

#### 23. RTL / bidi

- The message sits **below** its field in the block direction, which is direction-neutral — no
  left/right positioning logic needed for this relationship.
- **Bidi isolation class: `code`.** A rejected value containing a Latin code is echoed back
  bidirectionally isolated, so the actor sees exactly what was rejected.

#### 24. Responsive behavior

- **Profile C:** the message stays visible without scrolling away from the field; the on-screen keyboard
  must not cover it.
- **Profile A:** the summary is the primary navigation between errors on a long form; at
  `profile-a.content-width.narrow`, a two-column form collapses to one and the field order is unchanged.

#### 25. Immutability / historical safety

**n/a.** This widget renders the correction surface for a command in progress, not a historical or
immutable record. The `itemised` variant's "everything else is visibly locked" behaviour is a **scope
restriction on this correction**, not the nine-immutable-entities rule — it is not to be confused with,
or implemented via, the immutability guard `WGT-PLATFORM-005`/`-003` apply to historical records.

#### 26. Framework defaults to disable

Profile A, `Stock` — Filament's own validation display renders as shipped; this contract configures it
rather than replacing it:

- Filament's default validation error rendering (message under the field) is **kept as-is** — this is
  the `Stock` boundary.
- **Added, because Filament does not do this by default:** a summary component for long forms/workspaces
  (`summary` variant) that lists every error with a link to its field, and **first-field-in-error focus
  behaviour on submission failure** — Filament does not auto-focus the first invalid field by default,
  and this contract requires that behaviour to be added rather than left absent.
- Filament's Livewire-bound forms already preserve field values across a failed submission by default
  (the form component's own state is not reset); this contract requires that this default behaviour is
  **not accidentally overridden** by a full-page reload or a component re-mount on failure.

#### 27. Prohibitions

1. Client-side validation must never be treated as the contract.
2. No failure may clear any input.
3. A generic message must never appear where a field is at fault.
4. An error must never be indicated by colour alone.
5. A placeholder must never be used as a label.
6. A domain precondition failure must never be worded as invalid input.
7. A retry must never mint a new idempotency key when the actor's intent has not changed.

#### 28. Definition of Done

- [ ] Every validation error is bound to a field where a field is at fault, and to the action where none
      is.
- [ ] No failure clears any input, on either profile.
- [ ] Focus moves to the first field in error on failure.
- [ ] Correcting a field clears its own error without resubmitting.
- [ ] At 200% text scaling and with text-spacing overrides applied, no label, message or control is
      lost.
- [ ] A correction retry reuses the original idempotency key.
- [ ] None of the seven prohibitions in section 27 is violated on any surface.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 6, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-011` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — field/error/helper-text contrast in default/hover/focus/
  error, light mode.
- `node scripts/axe_audit.mjs <file>` — field/error programmatic association, label presence.
- `node scripts/verify_responsive.mjs <file>` — two-column-to-one collapse at narrow content width.

**Tier C (all: not run — requires implementation):**
- Real proof that no input is cleared across a failed submission, on a live form on both profiles — not
  run — requires implementation.
- Focus moving to the first field in error, verified with a real screen reader in Arabic — not run —
  requires implementation.
- A retry with the original idempotency key producing exactly one committed outcome under contention —
  not run — requires implementation.
- Text-spacing override survival at the WCAG-specified multipliers on a real rendered form — not run —
  requires implementation.

---

### WGT-PLATFORM-007 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-007
- **Name:** Sensitive decision confirmation
- **Build order:** 7
- **Platforms:** C, A
- **Runtime:** RN sheet (Proposed, path unverified) + Filament action modal (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 38 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-007` block

#### 2. Implements

- `FR-AUDIT-001`
- `FR-CLAIMS-004`
- `FR-BOOKING-002`

#### 3. Used by

**38 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (8 Patient, 10 Clinic, 20 Admin):

- **Patient app (8):** `SCR-BOOKING-006` (Cancel booking), `SCR-CLINICAL-004` (Plan acceptance),
  `SCR-FINANCE-004` (Financial event response), `SCR-FINANCE-005` (Report refund execution),
  `SCR-REVIEWS-002` (Submit review), `SCR-CLAIMS-002` (Refund request), `SCR-CLAIMS-005` (Claim appeal),
  `SCR-IDENTITY-007` (Grant detail).
- **Clinic panel (10):** `SCR-IDENTITY-016` (Review and submit), `SCR-IDENTITY-026` (Staff grant
  detail), `SCR-BOOKING-009` (Request response), `SCR-BOOKING-012` (Provider cancellation),
  `SCR-BOOKING-013` (Record no-show), `SCR-CLINICAL-012` (Propose plan), `SCR-CLINICAL-015` (Stage
  completion), `SCR-CLINICAL-016` (Stage reopening), `SCR-FINANCE-008` (Event response),
  `SCR-FINANCE-009` (Report refund execution).
- **Admin panel (20):** `SCR-IDENTITY-030` (Request changes), `SCR-IDENTITY-031` (Approve application),
  `SCR-IDENTITY-032` (Reject application), `SCR-IDENTITY-034` (Staff scope grant), `SCR-IDENTITY-035`
  (Guardian grant oversight), `SCR-CATALOG-007` (Record gate decision), `SCR-CATALOG-008` (Publish
  definition), `SCR-ELIG-015` (Activation request review), `SCR-ELIG-016` (Source fact verification),
  `SCR-ELIG-017` (Evidence verification), `SCR-ELIG-020` (Suspension operations), `SCR-REVIEWS-008`
  (Integrity decision), `SCR-REVIEWS-009` (Appeal decision), `SCR-CLAIMS-012` (Sensitive decision),
  `SCR-CLAIMS-013` (Appeal decision), `SCR-OPS-005` (Drill-down and export), `SCR-POLICY-002` (Version
  editor), `SCR-POLICY-003` (Review and scheduling), `SCR-PLATFORM-007` (Retention and legal hold),
  `SCR-IDENTITY-038` (Legal representation verification).

#### 4. Widget dependencies

- **Required predecessors:** `WGT-PLATFORM-001` (build order 1) and **`WGT-PLATFORM-003`** (build order
  2). The `WGT-PLATFORM-003` dependency is a **stated hosting relationship**, not a mere co-occurrence:
  `WGT-PLATFORM-003` "HOSTS the trigger for `WGT-PLATFORM-007`, which owns the confirmation. Trigger and
  confirmation are one action role in two moments, never two roles" (`WIDGET_SPECS.md` section 3;
  `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2, E2). This widget cannot be built meaningfully without
  `WGT-PLATFORM-003` already existing to host its trigger.
- **Not a build dependency:** the conditional composition of `CMP-CLINICAL-002` (where the effect is a
  change set) does not require any `WGT-CLINICAL-*` domain widget to exist first — it is a direct
  component reuse.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-014` — Sensitive confirmation | The whole dialog. Variants: `reversible` (reason optional), `irreversible` (reason required, says so in words), `destructive` (uses `action.destructive` in **both** trigger and confirm), `authoritative-decision` (reason becomes the recorded basis in `CMP-PLATFORM-013`). Anatomy: `what this action is` (same label as trigger) → `what it will do` → `whether it can be undone` (stated in words) → `what it affects` → `[reason]` (required for irreversible/destructive/authoritative-decision) → `cancel` / `confirm` (confirm carries the **same action role** as the trigger). |
| `CMP-PLATFORM-004` — Action bar | Cancel/confirm row itself follows the action-bar's own role/position rules (confirm at logical `end`, cancel at `start`, in this widget's specific ordering — section 23). |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | The confirm control is committing |
| `CMP-PLATFORM-013` — Human attribution | The decision becomes a recorded human basis (`authoritative-decision` variant) — rendered **after** commit, on the record elsewhere, not inside this dialog itself |
| `CMP-CLINICAL-002` — Change disclosure | The effect is itself a change set (e.g. a proposed plan amendment) |

#### 6. Interaction dependencies

- **`IX-AUDIT-001` (owner) — Sensitive decision capture and irreversibility.** Full sequence, quoted
  because it is this widget's entire reason to exist:

  1. `CMP-PLATFORM-014` intervenes before the command reaches the server.
  2. States **what this action is** (the trigger's own label), **what it will do**, **whether it can be
     undone**, and **what it affects**.
  3. A **reason is required** for every irreversible, destructive and authoritative-decision variant.
  4. Confirm uses **the same action role** as the trigger — a destructive trigger produces a destructive
     confirm.
  5. On commit, the decision, its reason, its actor and its time are recorded, and the reason becomes the
     recorded **basis** shown by `CMP-PLATFORM-013`.

  Focus: trapped, lands on the first meaningful element and **never on confirm**, returns to the trigger
  on cancel/close. Failure: confirmation stays open, reason intact, reports failure against the action.
  `ERR-AUDIT-001` (a key conflict) is **not** resolved by another confirm. **Non-negotiable carried
  behaviour: one action role keeps one label across all three platforms, including inside its own
  confirmation; the same destructive action uses the same danger variant in trigger and confirm;
  irreversibility is stated in words, not by tone alone; no confirmation states or implies money moved,
  was held, or was returned.**
- **`IX-PLATFORM-001` — Server-committed mutation.** The commit contract this dialog's confirm control
  enters: idempotency key fixed at first submission, no re-submission while in flight, authoritative
  re-read after commit.
- **`IX-PLATFORM-002` — Idempotent retry.** A retryable failure's retry reuses the original key; the
  confirmation stays open with the typed reason intact.
- **`IX-PLATFORM-018` — Field-bound validation and correction.** Governs the required reason field's own
  validation: error bound to the field, input preserved, correcting clears its own error.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-002` — Action-role labels | Canonical | The confirm label — **identical** to the trigger's own label, including inside this dialog. |
| `TXT-PLATFORM-011` — Warnings | Canonical | Any non-critical informational note inside the dialog, distinct from the irreversibility statement itself. |
| `TXT-PLATFORM-012` — Irreversible actions | Canonical, fixed 6-part formula, quoted in full: (1) what this action is — the trigger's own label; (2) what it will do, concretely; (3) whether it can be undone — **in words**; (4) what is affected, concretely; (5) a reason required for every sensitive/destructive/authoritative-decision classification; (6) the confirm label matches the trigger label exactly, including its colour/role classification. |
| `TXT-PLATFORM-015` — Claims and disputes copy | Canonical | Where the decision is a claims/dispute outcome: neutral tone before a decision is made; protection is always conditional, never guaranteed; a decision's outcome lives in the recorded reason, not in the status colour alone. |
| `TXT-PLATFORM-018` — Prohibitions master list | Canonical, 16-item list | Items 3 (no money-movement implication), 10 (no override implication), 13 (irreversibility never colour/tone-only) bind this widget directly. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-002` — No keyboard trap; controlled overlay entry and exit | The dialog is dismissible by the platform's cancel key or an equivalent reachable control; dismissal never leaves focus stranded outside the document (WCAG 2.1.2, 2.4.3). |
| `A11Y-PLATFORM-007` — Dialog initial focus and return-to-trigger focus | Initial focus lands on the first meaningful element — **never on Confirm**. Focus returns to the trigger on cancel/close, **including** when Confirm becomes enabled by completing the reason field — focus is not moved onto Confirm as a side effect of that (WCAG 2.4.3). |
| `A11Y-PLATFORM-014` — Adjacent destructive/primary separation and ceremony | Any irreversible/destructive command requires `CMP-PLATFORM-014` before commit — the ceremony that makes a mis-tap recoverable even where target separation alone would not be (WCAG 2.5.8). |
| `A11Y-PLATFORM-027` — Field-bound error association, summary, input preservation | The required reason field's validation error is bound to it exactly as `WGT-PLATFORM-010` requires (WCAG 3.3.1, 3.3.3, 4.1.2). |
| `A11Y-PLATFORM-006` — Focus movement after mutation | After a commit, focus moves to the changed-state summary on the surface behind the (now closed) dialog (WCAG 2.4.3, 4.1.3). |
| `A11Y-AUDIT-001` — Sensitive decision capture accessibility | The dialog exposes an accessible name **and a description tied directly to the effect statement** — not a generic "confirm" role with the effect text floating unassociated. Irreversibility is stated in words **inside that accessible description**, never by tone/icon alone. The required-reason field's error is bound (`A11Y-PLATFORM-027`); Confirm remains genuinely blocked and exposed as such via state until a reason is present — **the one legitimate case in this whole system where a blocked control is correct** (`A11Y-PLATFORM-016`). **The confirm control's accessible name states the effect, not only the verb** — "Confirm" alone is never what a screen-reader user hears immediately before an irreversible action (WCAG 3.3.4, extended by product decision to every irreversible action). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning command's
contract." Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-BOOKING-005` (cancel booking — audited, no-penalty state transition),
  `API-CLINICAL-003` (accept a proposed treatment plan version, producing immutable accepted snapshots),
  `API-IDENTITY-005` (revoke a guardian/family grant — always immediate, never blocked by booking
  state), `API-CLAIMS-005` (submit an appeal, subject to separation-of-duties review).
- **Profile A:** `SDC-CLAIMS-001` (Claim/Dispute Participation and Review Workspace), `SDC-IDENTITY-002`
  (Admin Clinic Onboarding Review Workspace — approve/reject, creates provider/branch/grant on
  approval), `SDC-POLICY-001` (Policy Lifecycle Workspace — draft/review/approve/schedule/retire),
  `SDC-BOOKING-001` (Clinic Booking Inbox and Response).

On every other screen, the applicable command is that screen's own declared `API-*`/`SDC-*` (section
0.6), never invented here.

#### 10. Shared application-layer prerequisites

- **`TASK-AUDIT-001`** — "Implement Sensitive Audit and Provenance Foundation" — **the single most
  important prerequisite for this widget.** Its own goal statement: "Provide one attributable,
  privacy-safe audit/provenance mechanism used by every later Admin workflow." Without it, the "recorded
  reason, actor and time" this widget's whole purpose depends on (`IX-AUDIT-001` step 5) has nowhere to
  commit to.
- **`TASK-AUDIT-002`** — "Implement Idempotency and Integrity-Exception Operations" — the `ERR-AUDIT-001`
  key-conflict path this widget's failure state depends on.
- **`TASK-AUDIT-003`** — "Implement Patient API Idempotency, Correlation, and Stable Error Envelope" —
  the Profile C equivalent.
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001`/`-005`
  (Filament), `TASK-PLATFORM-008` (React Native).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `audit_events` | Proposed, **append-only** | The canonical destination for "the decision, its reason, its actor and its time" — one of the nine immutable/append-only entities (section 25). |
| `idempotency_records` | Proposed | Backs the commit-once guarantee (section 15). |
| Whichever host entity the decision itself lands on (e.g. `claim_decisions`, `service_launch_gates`) | Proposed (all such entities are Proposed) | Named per host command, out of this widget's own fixed scope, but every one of Phase 4's named examples above resolves to a Proposed table today. |

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN sheet (full-height, focus-trapped) | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament action modal, required reason field | `app/Filament/Support/` (shared sensitive-confirmation helper) applied per action under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host command's own contract) | View-model responsibility |
|---|---|
| The command's own stated effect (what it does, what it affects) | `effectStatement: { action, affects: NamedRecord[] }` — **named records, never a bare count** (prohibited, section 27) |
| Whether the command is reversible | `undoable: boolean`, plus `undoDescription?: string` where reversible |
| The command's classification | `variant: reversible \| irreversible \| destructive \| authoritative-decision`, resolved from the host command's own declared sensitivity, never invented per-screen |
| The command's idempotency key | `idempotencyKey: string`, fixed at first submission |
| The reason, once submitted | Becomes the recorded **basis**, later rendered by `CMP-PLATFORM-013` on the record — this widget hands it off, it does not render the attribution itself |

No field is invented — the effect statement is assembled from data the host command's own read already
resolved (per section 18, `loading-initial`: "the confirmation does not open until the effect is known").

#### 14. Refresh / caching / polling

The confirmation **does not open** until the effect is known (no client-side guess). If the underlying
record changes while the confirmation is open, **the confirmation closes and the surface re-reads**
rather than committing against a changed record. No polling interval is specified.

#### 15. Idempotency / correlation

**Applies — this is the archetypal committing widget.**

- **Idempotency applies:** yes, to every variant's confirm command.
- **Key fixed at first submission**, unchanged across a retry of the same intent.
- **Key reuse on retry:** `IX-PLATFORM-002` — a retryable failure's retry reuses the original key; the
  confirmation reopens (or stays open) with the typed reason preserved.
- **Unknown-outcome path:** offline/unstable — confirm is withdrawn unless the command is
  idempotent-resumable; a queued command shows pending, **never done**, until reconciled
  (`IX-PLATFORM-004`, on the host surface).
- **Correlation/audit requirement:** `FR-AUDIT-001`/`-003`. On commit, actor, time, reason and outcome
  are recorded together as one append-only event (section 11). `ERR-AUDIT-001` (key reused for a
  different intent) is **not** resolved by a second confirm — it means the key was misused, which the
  implementation must not do in the first place.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** the host command's own policy (Proposed `app/Policies/*`,
  `TASK-IDENTITY-002`).
- **UI consequence:** on `error-permission`, **the confirmation closes**, the action is removed
  structurally (from `WGT-PLATFORM-003`'s own region, not merely disabled here), and the denial is
  announced assertively. Confirmation is never itself an authorization mechanism (section 27) — it
  gates *how* a permitted action is committed, never *whether* it is permitted.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `reversible \| irreversible \| destructive \| authoritative-decision` | Yes | none | Host command's own declared classification | Never inferred client-side |
| `triggerLabel` | string | Yes | — | The `WGT-PLATFORM-003` trigger that opened this dialog | Confirm's label **must equal** this value exactly |
| `effectStatement` | see section 13 | Yes | — | Host command's own read | Never opens until this is known |
| `undoable` | boolean (+ description) | Yes | — | Host command's own declaration | Stated in words, never by tone |
| `reasonRequired` | boolean | Yes | derived from `variant` | — | `true` for `irreversible`/`destructive`/`authoritative-decision` |
| `reasonValue` | string | No | `""` | Actor's own input | Preserved across a failed commit |
| `idempotencyKey` | string | Yes | — | Fixed at first submission | See section 15 |
| `onConfirm` / `onCancel` | callback | Yes | — | — | `onCancel` returns focus to the trigger |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The confirmation does not open until the effect is known. An effect statement assembled client-side from a guess is the failure this prevents. |
| `loading-refresh` | If the underlying record changes while the confirmation is open, the confirmation closes and the surface re-reads rather than committing against a changed record. |
| `empty-no-data` | n/a. A confirmation always concerns a specific record. |
| `empty-filtered` | n/a. A confirmation is not a projection. |
| `partial` | If any part of the effect statement failed to load, the confirmation does not open and the trigger reports that it cannot state the effect yet. |
| `stale` | The confirm control is withdrawn against a stale record; the surface re-reads first. |
| `error-fetch` | The confirmation closes and the surface offers retry; the reason text the actor typed is preserved. |
| `error-permission` | The confirmation closes, the action is removed structurally, and the denial is announced assertively. |
| `success` | The confirmation closes, the surface re-reads authoritative state, and the outcome is announced. |
| Offline / unstable | Confirm is withdrawn unless the command is idempotent-resumable; a queued command shows as pending and never as done. |

#### 19. Lifecycle/state semantics

This widget does not render a lifecycle status vocabulary of its own. Where its `authoritative-decision`
variant fires, the submitted reason becomes the recorded **basis** for a decision that `CMP-PLATFORM-013`
renders elsewhere, on the record itself, **after** this dialog has closed — this widget hands off the
data, it does not perform that binding. It carries no tone/icon/emphasis rendering itself beyond
`CMP-PLATFORM-014`'s own variant styling (which is a confirmation-severity signal, not a lifecycle
status).

#### 20. Tokens

`component.platform-014.*` (mandatory — `confirm-destructive-bg` resolves to the **identical** semantic
role as `component.platform-004.destructive-bg`, by design, so a red trigger can never produce a blue
confirm), `component.platform-004.*` (mandatory, cancel/confirm row), conditional
`component.platform-011.*`, `component.platform-013.*`, `component.clinical-002.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-002`, `-011`, `-012`, `-015`, `-018`. No canonical `ERR-*` string is restated;
`ERR-AUDIT-001` is referenced by ID where a key conflict occurs.

#### 22. Accessibility contract

- **Role/name:** modal dialog with an accessible name **and description tied to the effect statement**
  (`A11Y-AUDIT-001`).
- **Focus:** trapped while open; lands on the first descriptive element, **never on confirm**; Escape
  (or platform equivalent) cancels; returns to the trigger on close, including when the reason field's
  completion enables confirm.
- **Keyboard:** cancel and confirm both reachable; the required reason field carries a persistent
  visible label with its error bound to it.
- **Screen reader:** the outcome is announced after the surface re-reads (post-close, on the host
  surface).
- **Confirm's accessible name states the effect**, not only the verb — never a bare "Confirm."
- **No colour-only:** irreversibility is stated in words inside the accessible description, never by
  tone/icon alone.

#### 23. RTL / bidi

- **Cancel at logical `start`, confirm at logical `end`, in both directions** — "so the irreversible
  choice never sits where the eye lands first" (`CMP-PLATFORM-014`'s own anatomy rule).
- **Bidi isolation class: `id`.** A record identifier inside the effect statement is bidirectionally
  isolated.

#### 24. Responsive behavior

- **Profile C:** a full-height sheet in the reading column, with confirm reachable **without scrolling
  past the reason field**.
- **Profile A:** the framework modal, sized so the effect statement is visible without scrolling at
  `profile-a.content-width.wide`.
- At the largest supported text size, the effect statement wraps in full and is never truncated,
  collapsed behind a disclosure, or shortened — the dialog scrolls instead. **Density never compresses a
  confirmation on either profile.**

#### 25. Immutability / historical safety

**This widget is the authoring point of an immutable record, not a reader of one.** On a successful
commit, the decision, its reason, its actor and its time are written to an append-only entity
(`audit_events` or the host command's own decision table — section 11); once written, **that row can
never be edited or deleted through any interface**. A later correction to the same matter is a **new**
decision (a new confirmation, a new event), never a mutation of this one. This widget itself renders no
history — `WGT-PLATFORM-006` does — but its correctness obligation is that what it commits becomes
permanently unmodifiable the instant it commits.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- Filament's default confirm-only action modal (a generic "Are you sure?" with no reason field) is
  **insufficient wherever a reason is mandatory** and is **replaced**, never merely relabelled, with the
  required-reason variant — the framework's default confirmation text is not reused with the blanks
  filled in.
- Filament's default action-confirmation copy ("Are you sure you want to do this?") is **not used** for
  any variant of this widget — every dialog states the actual effect, in the actor's terms, per
  `TXT-PLATFORM-012`.
- Filament's default modal does not distinguish action-role colour between trigger and confirm by
  default (a destructive action can default to a neutral confirm button) — this default is **overridden**
  so confirm always inherits the trigger's own role (section 20).

#### 27. Prohibitions

1. A generic "are you sure" must never appear.
2. Irreversibility must never be conveyed by tone or colour instead of words.
3. The confirm control's action role must never differ from its trigger's.
4. Focus must never land on confirm on dialog open.
5. The reason field must never be optional on an irreversible action.
6. The effect must never be stated as a count instead of named records.
7. No confirmation may imply money movement.

#### 28. Definition of Done

- [ ] For every irreversible, destructive and authoritative-decision action, a reason is required and
      the dialog says in words that it cannot be undone.
- [ ] The trigger and the confirm control carry the same action role on every surface, in every domain.
- [ ] Focus enters the dialog on a descriptive element, is trapped, and returns to the trigger on close.
- [ ] Escape cancels without committing, on both profiles.
- [ ] A commit whose outcome is unknown leaves the surface offering reconciliation, not a second confirm.
- [ ] The typed reason survives a failed commit.
- [ ] None of the seven prohibitions in section 27 is violated on any surface.
- [ ] No regression to `WGT-PLATFORM-003` (this widget's trigger must remain hosted there, never
      duplicated as a second independent trigger).

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 7, predecessors
  `WGT-PLATFORM-001`/`-003` declared, mandatory `CMP-PLATFORM-014`/`-004` resolve.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — cancel/confirm contrast in default/hover/focus/disabled
  (confirm blocked pending reason), light mode.
- `node scripts/axe_audit.mjs <file>` — dialog role, accessible description bound to the effect
  statement, reason field association.
- `node scripts/verify_focustrap.mjs <file>` — Tab stays inside, Escape closes, focus returns to trigger.

**Tier C (all: not run — requires implementation):**
- Real focus-trap and return-to-trigger behaviour verified with a keyboard-only pass on both profiles —
  not run — requires implementation.
- Screen-reader announcement of the confirm control's effect-stating accessible name, verified with
  VoiceOver/TalkBack in Arabic — not run — requires implementation.
- A live retry with the original idempotency key producing exactly one committed decision under
  contention — not run — requires implementation.
- Proof that the committed decision row is genuinely unmodifiable through every interface (no edit/
  delete path reachable anywhere), verified against the real Filament and API surfaces — not run —
  requires implementation.

---

### WGT-PLATFORM-006 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-006
- **Name:** Decision-bearing event timeline
- **Build order:** 8
- **Platforms:** C, A
- **Runtime:** RN list (Proposed, path unverified) + Filament custom view (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Custom`
- **Screen reach:** 33 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-006` block

#### 2. Implements

- `FR-AUDIT-001`
- `FR-CLINICAL-005`
- `FR-FINANCE-004`
- `NFR-AUDIT-001`

#### 3. Used by

**33 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (6 Patient, 6 Clinic, 21 Admin):

- **Patient app (6):** `SCR-BOOKING-004` (Booking detail), `SCR-CLINICAL-002` (Case summary),
  `SCR-CLINICAL-005` (Case timeline), `SCR-FINANCE-002` (Financial timeline), `SCR-REVIEWS-003` (My
  review), `SCR-CLAIMS-004` (Claim detail).
- **Clinic panel (6):** `SCR-IDENTITY-017` (Status and requested changes), `SCR-CLINICAL-009` (Case
  workspace), `SCR-CLINICAL-013` (Plan version history), `SCR-FINANCE-006` (Case financial
  workspace), `SCR-REVIEWS-005` (Provider reviews), `SCR-CLAIMS-007` (Claim response and evidence).
- **Admin panel (21):** `SCR-IDENTITY-028` (Application review), `SCR-CATALOG-006` (Launch gates),
  `SCR-CATALOG-007` (Record gate decision), `SCR-ELIG-018` (Decision inspector), `SCR-ELIG-020`
  (Suspension operations), `SCR-BOOKING-014` (Booking operations), `SCR-BOOKING-015` (Booking
  oversight), `SCR-CLINICAL-019` (Case oversight detail), `SCR-FINANCE-010` (Records operations),
  `SCR-FINANCE-011` (Dispute review), `SCR-FINANCE-012` (External execution tracking), `SCR-CLAIMS-010`
  (Claim review), `SCR-CLAIMS-011` (Evidence and deadlines), `SCR-OPS-003` (Work item detail),
  `SCR-POLICY-003` (Review and scheduling), `SCR-POLICY-004` (Historical reproduction), `SCR-AUDIT-001`
  (Audit explorer), `SCR-AUDIT-002` (Audit event detail), `SCR-AUDIT-003` (Integrity exceptions),
  `SCR-AUDIT-004` (Idempotency conflicts), `SCR-PLATFORM-006` (Evidence access log).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only, per **E1** — "`WGT-PLATFORM-001`
  precedes all 29 others" (`WIDGET_SPECS.md` section 3; `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.5,
  build order 8, "Depends on: 1"). The measured edge set (section 6.2 of the same plan, six edge groups,
  thirty-four edges) contains **no other edge** naming `WGT-PLATFORM-006` as either source or target — it
  is not a stated predecessor of, or successor to, any other widget.
- **Not a build dependency:** screens that place both `WGT-PLATFORM-005` and this widget together
  (list-and-detail archetypes) do so by co-occurrence only; `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.1
  explicitly instructs that widget-level edges are derived **only** from statements Phase 4 actually
  makes, never from screen co-occurrence, and no such statement exists between these two widgets.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-008` — Event timeline | The whole widget. Variants: `case` (booking, stage, follow-up, financial, review and claim events on one case), `record` (one record's own events), `financial` (append-only external financial events, carrying the money-boundary obligation), `governance` (append-only launch-gate and policy decisions), `audit` (audit events, correlation identifiers in the identifier type style, Admin only). Anatomy: `ordering statement` → per event: `when` → `CMP-PLATFORM-001` (what happened) → `CMP-PLATFORM-013` (who, where a human owns it) → `[ disclosure: the event's own detail ]` → `[ load older ]` (bounded, explicit boundary — never infinite scroll). No decorative connector rail is drawn; order is carried by position and the stated time, which is what survives right-to-left, reflow and a screen reader. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | Per event, where the event carries a lifecycle status |
| `CMP-PLATFORM-013` — Human attribution | Per event, only where a person decided (`decided-by-person`, `reviewed-by-licensed`) — a computed event uses `computed-by-system` and names no person |
| `CMP-ELIG-002` — Price display | Per event, where the event carries an amount (the `financial` variant's primary content) |

#### 6. Interaction dependencies

- **`IX-PLATFORM-016` (owner) — Bounded reads over unbounded history.** The first page is read and
  rendered; **the bound is stated** — a page size, a top-N or a date window is named, never left silent;
  further pages are requested explicitly on Profile A or incrementally on Profile C; **ordering is stable
  across pages**, because it is a property of the record, not the view — an unstable sort over append-only
  history misrepresents the order of events, which for an audit or financial log is a correctness
  failure. Appending a page never moves what the actor has already read and never resets scroll position.
  A failed append keeps the loaded pages, states that older entries could not be read, and offers retry
  for that page — **a truncated history is never rendered as complete.** Load-more is a real, keyboard-
  reachable control; infinite scrolling with no reachable load-more control is prohibited on Profile A.
- **`IX-PLATFORM-008` — Progressive disclosure.** An event's own detail sits behind an explicit in-place
  disclosure, never a second screen; opening it never moves what the actor was already reading; the
  disclosure control keeps focus on open and the revealed content is the next tab stop.
- **`IX-PLATFORM-010` — Bidirectional and mixed-direction content.** Timestamps, correlation identifiers,
  amounts with currency and Latin clinic/doctor names inside an event are each isolated at render time; a
  reordered identifier or amount is a **wrong** identifier or amount, not a cosmetic defect.
- **`IX-PLATFORM-003` — Authoritative read refresh and staleness disclosure.** A financial or clinical
  timeline read as current when it is stale is a correctness failure (section 18); the timeline marks
  itself stale with its as-of time and offers retry rather than silently presenting old events as current.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-013` — Financial transparency | Canonical, 5-rule list | The `financial` variant's every event: no text states or implies the platform held, paid, insured or refunded money — each financial event is a **record of an external occurrence**, never a transaction the platform executed. |
| `TXT-PLATFORM-014` — Version and amendment communication | Canonical | Where an appended event is itself a version acceptance or amendment (e.g. a plan-acceptance event on the `case` variant): the prior version stays reachable and unmodified: the event states what changed, never restates a full document. |
| `TXT-PLATFORM-017` — Audience translation families | Canonical, per-term table | Structurally hides internal-only terms (scientific grade, pricing class, protection level, risk profile, calibration state) from any Patient-facing event text — the timeline never surfaces an internal classification by any disclosure depth. |
| `TXT-PLATFORM-020` — Arabic mechanics | Canonical | Western/tabular digits for every event timestamp and amount; bidi isolation per identifier, amount and date; the ordering statement itself is real text, never inferred from layout. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-012` — Native structural semantics | The timeline is a real list, not a sequence of headings, so it does not pollute the document outline (WCAG 1.3.1); each disclosure declares its expanded/collapsed state. |
| `A11Y-PLATFORM-023` — Long content is sized-for; critical values never truncate | An event's reason, a decider's name and a financial amount never truncate at any text size or density mode — `CMP-PLATFORM-013` and `CMP-ELIG-002` are two of the four named critical-value carriers this obligation binds (WCAG 1.4.10 informative extension). |
| `A11Y-PLATFORM-030` — Bidirectional content: AT reading order and isolation | Correct **screen-reader pronunciation order**, not only visual order, for every isolated timestamp, correlation identifier and amount inside an event (WCAG 1.3.2) — `CMP-PLATFORM-008` is named explicitly as a carrier. |
| `A11Y-PLATFORM-015` — No colour-alone communication | Every event's status consumes the full tone/icon/emphasis triple; a computed outcome is distinguishable from a human decision by wording and icon, never by tone alone (WCAG 1.4.1). |
| `A11Y-AUDIT-001` — Sensitive decision capture accessibility | Where an appended event **is** a sensitive decision rendered after the fact (a claim decision, an integrity finding), its accessible attribution states the role and the basis together as one unit, never a bare "decided" with the reason floating unassociated — the same accountability guarantee `IX-AUDIT-001` requires at the moment of decision extends to this widget's later, read-only rendering of it. |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning record's own
history projection." Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-CLINICAL-004` (unified case timeline), `API-FINANCE-005` (case financial timeline).
- **Profile A:** `SDC-AUDIT-001` (Audit Explorer and Historical Reproduction), `SDC-FINANCE-001`
  (Clinic/Admin Financial Record Workspace), `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace).

On every other screen, the applicable projection is that screen's own declared `API-*`/`SDC-*` (section
0.6), never invented here.

#### 10. Shared application-layer prerequisites

- **`TASK-CLINICAL-007`** — "Implement Patient Case Summary and Unified Timeline APIs" — the direct
  prerequisite implementing `API-CLINICAL-004`; its own implementation note: "compose role-filtered
  timeline from authoritative domain records; do not create a mutable timeline table as alternate truth."
- **`TASK-AUDIT-001`** — "Implement Sensitive Audit and Provenance Foundation" — the prerequisite for the
  `audit`/`governance` variants and for every human-attributed event this widget renders.
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001`/`-005`
  (Filament), `TASK-PLATFORM-008` (React Native).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `audit_events` | Proposed logical table, append-only | The `audit` variant's source; correlation identifiers rendered in the identifier type style (Admin only). |
| `financial_events` | Proposed, append-only | The `financial` variant's source; contains no gateway transaction, wallet balance, capture or settlement field — facts about external activity only. |
| `booking_events` | Proposed, append-only | Backs booking-domain entries composed into the `case` variant. |
| `claim_decisions` | Proposed, immutable | Backs claim-decision entries; human-attributed via `CMP-PLATFORM-013`. |
| `claim_deadline_events` | Proposed, append-only | Backs deadline-history entries; extensions/pauses never erase the original deadline. |
| `accepted_treatment_snapshots` | Proposed, immutable | Backs clinical plan-acceptance entries on the `case` variant. |

Five of the nine immutable or append-only entities (section 25) are event or decision logs, and this
widget is what renders them — this is its stated reason to exist (`WIDGET_SPECS_PLATFORM.md` line 502).
**Gap, flagged and not resolved here:** the ERD defines no dedicated append-only "clinical stage event"
table — `case_treatment_stages` (Proposed) carries a mutable `current_state` column rather than an event
log, so a case timeline's clinical-stage entries are derived from `accepted_treatment_snapshots` and the
stage's own state transitions rather than from a sixth append-only source; this is a data-model gap for
the relevant `TASK-CLINICAL-*` owner, not a defect in this contract.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN list, virtualized, in-place disclosure | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament custom view (shared timeline partial) | `app/Filament/Support/` (shared timeline component) applied per `Resource` under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host projection) | View-model responsibility |
|---|---|
| Ordering axis and its time field | `orderingStatement: string` — real text, stated, never inferred from layout |
| Each event's own facts | `events[i]: { at, summary, status?, decider?, amount?, detail? }` |
| Event's lifecycle status, where it carries one | `events[i].status` → `CMP-PLATFORM-001`'s own triple, never a bare string |
| Event's decider, where a human decided | `events[i].decider` → `CMP-PLATFORM-013`, `decided-by-person`/`reviewed-by-licensed`; absent (not guessed) where the event was computed |
| Event's amount, where present | `events[i].amount` → `CMP-ELIG-002`, in its governed mode |
| Applied read bound | `boundStatement: string` — always present where the set is unbounded, per `IX-PLATFORM-016` |

No field is invented beyond what the host's own `API-*`/`SDC-*` projection already carries.

#### 14. Refresh / caching / polling

Event-driven, per `IX-PLATFORM-003`: initial load renders event skeletons with no count implied; a
refresh appends a new event without disturbing events already read, and announces politely if the actor
is viewing the record. No polling interval or cache TTL is specified or invented.

#### 15. Idempotency / correlation

**Not applicable.** This widget issues no command — it is a pure read-side history projection. It never
mutates, edits, corrects or deletes an event by construction (section 25); a correction is always a **new**
appended event, authored elsewhere, that this widget simply renders in its place in the order.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` — "View own case summary/timeline"
  (Patient, own case, role-safe fields), "View case financial timeline" (authorized case party / scoped
  finance staff, fields filtered by role), "View sensitive audit trail" (authorized audit/compliance/
  operations actor, explicit purpose and target scope, protected payloads minimized).
- **Server-side enforcement point:** the host projection's own scope-aware query (`API-CLINICAL-004`,
  `API-FINANCE-005`, `SDC-AUDIT-001`) — events outside the actor's purpose scope are not fetched, never
  filtered client-side after the fact.
- **UI consequence:** `error-permission` — events outside the actor's purpose scope are not returned, and
  the surface states that **the view is scope-limited**, never presenting a shorter history as if it were
  complete. A scope-limited history reading as a complete one is the exact failure this widget's own
  acceptance criterion 5 prohibits.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `case \| record \| financial \| governance \| audit` | Yes | none | Host archetype | Never a sixth value |
| `events` | `Event[]` (section 13) | Yes | `[]` | Host's own projection | Order is the host's own order, never re-sorted client-side |
| `orderingStatement` | string | Yes | — | Host's own read | Real text, never omitted |
| `boundStatement` | string \| null | No | `null` | Host's own read | See section 13; states what could not be read on a partial page |
| `onDisclose` | callback | No | — | — | Opens an event's own detail in place, per `IX-PLATFORM-008` |
| `onLoadOlder` | callback | Yes where the set is unbounded | — | — | Drives `IX-PLATFORM-016`; focus returns to the boundary control on completion, never to the top |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | Event skeletons; the count is not implied. |
| `loading-refresh` | Existing events stay; a new event appends and is announced politely if the actor is viewing the record. |
| `empty-no-data` | A record with no events yet says so plainly. It is not an error and offers no action. |
| `empty-filtered` | Where the surface filters history, the filter is named as the cause and history order is never changed by it. |
| `partial` | A bounded page loaded and the next did not: the boundary states that older events exist and could not be read, never that history ends here. |
| `stale` | Timeline shown with its as-of time. A financial or clinical timeline read as current when it is stale is a correctness failure. |
| `error-fetch` | Loaded events preserved, retry at the boundary. |
| `error-permission` | Events outside the actor's purpose scope are not returned, and the surface says the view is scope-limited rather than showing a shorter history as if complete. |
| `success` | Events in order. |
| Offline / unstable | Last read events with as-of time; the boundary control states that older events need a connection. |

#### 19. Lifecycle/state semantics

This widget renders lifecycle status **per event**, not as a single machine of its own — each event's own
status resolves through `CMP-PLATFORM-001` from whichever status machine that event's own domain owns
(`design_tokens/semantic.state.json`), never a status invented by this widget. Its own, additional
obligation is the **decision-vs-computation distinction**: where a person decided, `CMP-PLATFORM-013`
names the decider and the basis they recorded at the time; where the system evaluated, the event is
labelled as computed and names no person — conflating the two, in either direction, breaks the appeal
paths `FR-REVIEWS-002` and `FR-CLAIMS-005` depend on. A correction never rewrites an earlier event's
status; it appears as its own, later event, and the earlier one remains exactly as it was recorded.

#### 20. Tokens

`component.platform-008.*` (mandatory — surface, divider, time-text, event-text, identifier, disclosure
motion), conditional `component.platform-001.*`, `component.platform-013.*`, `component.elig-002.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-013`, `-014`, `-017`, `-020`. No canonical `ERR-*` string is restated by this
widget; a failed read cites its `ERR-*` by ID only, on the boundary or structural-state control that
carries it.

#### 22. Accessibility contract

- **Role/name:** a real list, not headings; each event's accessible name carries its time, its status (or
  computed/decided label) and its actor together.
- **Focus:** the load-older control is the last item; returning from it restores focus to the boundary,
  not to the top of the list. Opening a disclosure keeps focus on the disclosure control; the revealed
  detail is the next tab stop.
- **Keyboard:** every disclosure and every load-older control is keyboard reachable; the list is
  traversable without a pointer.
- **Screen reader:** a new event appended while the actor is viewing the record is announced politely;
  the ordering statement is exposed as real text so order need not be inferred from layout.
- **No colour-only:** a computed outcome is distinguishable from a decided one by wording and icon, not
  tone alone; a financial event's confirmed/disputed distinction likewise never rests on colour alone.

#### 23. RTL / bidi

- **The timeline runs top to bottom in both directions; the ordering axis is vertical, so no reversal
  applies** — this is the one widget in the build so far whose primary axis is unaffected by direction.
- **Bidi isolation classes: `amount`, `date`, `id`.** Correlation identifiers, amounts and timestamps
  inside every event are bidirectionally isolated, per `IX-PLATFORM-010`.

#### 24. Responsive behavior

- **Profile C:** one event per reading-column block.
- **Profile A:** the timeline stays in the primary region; at `profile-a.content-width.narrow` the
  who-and-basis line (`CMP-PLATFORM-013`) stacks beneath the event rather than moving into a tooltip.

#### 25. Immutability / historical safety

**This widget is the archetypal reader of an immutable record, not an author of one.** By construction it
composes **no** edit, delete or correct affordance in any variant, over any of the five immutable or
append-only entities named in section 11 (or any other event/decision log a host projection points it
at). A correction is always a **new** appended event, a new version, or a state transition — never a
mutation of what this widget already rendered. This is the structural counterpart to `WGT-PLATFORM-007`
(section 25 there): that contract is the **authoring** point of an immutable record; this one is
permanently and only its **reader**.

#### 26. Framework defaults to disable

Profile A, `Custom`:

- Filament's stock table row actions (edit, delete, and any bulk action) are **not attached** to the
  custom view this widget renders — this is precisely why the realization is `Custom` rather than
  `Extended`: a stock table would offer sort and row actions this widget's own purpose prohibits by
  construction, and there is no "remove the defaults" step because the defaults are never wired in the
  first place.
- Filament's default infinite-scroll or auto-loading table behaviour (where enabled by a package) is not
  used; the load-older boundary is an explicit, keyboard-reachable control, per `IX-PLATFORM-016`.

#### 27. Prohibitions

1. No control reachable from the timeline may mutate an existing event.
2. A correction must never appear by modifying an earlier event; it appears only as a later one.
3. A computed outcome must never be rendered as a human judgement, or the reverse.
4. Infinite scroll with no stated, reachable boundary must never appear on Profile A.
5. An event's reason, decider name or amount must never truncate, at any size or density.
6. A scope-limited history must never render as if it were complete.

#### 28. Definition of Done

- [ ] No control reachable from the timeline mutates an existing event.
- [ ] A correction appears as a later event and the earlier event is still readable, unmodified.
- [ ] Where a person decided, the decider and the basis are shown; where the system evaluated, it is
      labelled as computed.
- [ ] The read boundary is explicit and states that older events exist, on both profiles.
- [ ] A scope-limited history says it is scope-limited rather than appearing complete.
- [ ] None of the six prohibitions in section 27 is violated on any of the 33 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 8, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-008` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — event chip/attribution contrast in default/hover/focus, light
  mode.
- `node scripts/axe_audit.mjs <file>` — list (not headings) role, disclosure expand state, event
  accessible names.
- `node scripts/verify_responsive.mjs <file>` — who-and-basis stacking at the narrow verification widths.

**Tier C (all: not run — requires implementation):**
- A live scope-limited read (revoked purpose grant mid-session) proving the surface states "scope-
  limited" rather than a shorter but silently complete history — not run — requires implementation.
- Real load-older focus restoration to the boundary control, verified keyboard-only, on both profiles —
  not run — requires implementation.
- Screen-reader pronunciation-order pass over a mixed-direction event (Arabic summary, Latin identifier,
  amount) — not run — requires implementation.
- Proof that no edit/delete path reaches any of the five immutable/append-only entity types this widget
  renders, verified against the real Filament and API surfaces — not run — requires implementation.

---

### WGT-PLATFORM-014 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-014
- **Name:** Before-and-after disclosure block
- **Build order:** 9
- **Platforms:** C, A
- **Runtime:** RN shared component (Proposed, path unverified) + Filament custom infolist view (Proposed,
  both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Custom`
- **Screen reach:** 15 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-014` block

#### 2. Implements

- `FR-CLINICAL-007`
- `FR-POLICY-002`
- `FR-CATALOG-002`
- `NFR-AUDIT-003`

#### 3. Used by

**15 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (2 Patient, 3 Clinic, 10 Admin):

- **Patient app (2):** `SCR-CLINICAL-003` (Treatment plan), `SCR-CLINICAL-004` (Plan acceptance).
- **Clinic panel (3):** `SCR-CLINICAL-013` (Plan version history), `SCR-IDENTITY-017` (Status and
  requested changes), `SCR-CLAIMS-007` (Claim response and evidence).
- **Admin panel (10):** `SCR-CLINICAL-019` (Case oversight detail), `SCR-CLAIMS-011` (Evidence and
  deadlines), `SCR-CATALOG-004` (Definition versions), `SCR-CATALOG-008` (Publish definition),
  `SCR-CATALOG-010` (Procedure catalog and family mapping), `SCR-ELIG-019` (Eligibility policy inputs),
  `SCR-FINANCE-011` (Dispute review), `SCR-POLICY-001` (Policy versions), `SCR-POLICY-003` (Review and
  scheduling), `SCR-POLICY-004` (Historical reproduction).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only, per **E1** (`PHASE_05_
  IMPLEMENTATION_PLAN.md` section 6.5, build order 9, "Depends on: 1"). The measured edge set (section
  6.2) names no other edge involving `WGT-PLATFORM-014`.
- **Not a build dependency:** this widget shares no stated hosting or content relationship with
  `WGT-PLATFORM-006`, `-007` or `-013` despite frequent screen co-occurrence (a decision that changed
  something is often shown both as a timeline entry and as a before/after disclosure) — section 6.1's
  no-co-occurrence rule applies identically here.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-CLINICAL-002` — Change disclosure | The whole widget. Six variants: `amendment` (patient-facing, disclosed before acceptance is possible), `version` (governed catalog, procedure, commercial option and policy versions), `requested-changes` (a reviewer's itemised requests against what was submitted), `deadline-history` (original against effective, with the appended events that moved it), `resolution` (the disputed record against the projection after the appended resolution), `reproduction` (reproduced outcome against recorded, verdict is match or mismatch). Anatomy: `what changed, in one sentence` → `prior` / `new` aligned rows in logical order → `unchanged, stated as unchanged` → `why, and on whose authority` (`CMP-PLATFORM-013`) → `effect` (what this governs, from when, and what it does not). Rendered **stacked, prior first,** on Profile C in every mode; side-by-side only on Profile A at `wide`. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | Per version, where the compared record carries a lifecycle status |
| `CMP-PLATFORM-013` — Human attribution | For who changed it, or `computed-by-system` for a reproduction's own re-evaluation |
| `CMP-CLINICAL-001` — Treatment line | Where the changed unit is a treatment plan line |
| `CMP-ELIG-002` — Price display | Where the change moves an amount, each side in its own governed mode |
| `CMP-POLICY-001` — Governed version header | Where the change is a governed catalog/procedure/policy version (Admin only; `CMP-POLICY-001` is itself `n/a` on Profile C) |

#### 6. Interaction dependencies

- **`IX-CLINICAL-001` — Amendment disclosure and re-acceptance.** The `amendment` variant's owning
  sequence: the clinician proposes a new plan version while the prior accepted version is untouched; the
  patient is shown **what changed**, itemised — never two complete plans to compare by eye; **acceptance
  is not available until the change set has been disclosed** (the one legitimate blocked-control case:
  the same actor becomes able to act by doing something visible on this surface); **both sides of the
  comparison load together** — a one-sided render is prohibited, because a change set with the prior side
  missing reads as the whole truth; on acceptance a **new** snapshot is created and the prior one remains
  reachable and immutable; focus lands on the change set, never on accept, and accept is not moved onto by
  focus as a side effect of becoming enabled.
- **`IX-POLICY-002` — Version comparison and historical reproduction.** The `version`/`reproduction`
  variants' owning sequence, **Admin only**: both sides render through `CMP-POLICY-001` with their
  effective period and gate state; for a `reproduction`, the recorded decision is re-evaluated under its
  **then-effective** policy version and compared against the recorded outcome; **the verdict is match or
  mismatch, stated explicitly** — a mismatch is a **result, not an error**, routed to the integrity-
  exception surface rather than to a retry, because treating it as a failed read would hide exactly what
  the reproduction exists to find. Where the then-effective policy cannot be determined, the reproduction
  does not run under the current policy as a substitute — that would produce a confident wrong answer.
- **`IX-PLATFORM-008` — Progressive disclosure.** History, full evaluation detail and advanced options sit
  behind an explicit disclosure that states what it contains before opening; opening never moves what the
  actor was already reading.
- **`IX-PLATFORM-016` — Bounded reads over unbounded history.** Applies to the `version` variant's own
  history list of prior versions: the bound is stated, ordering is stable across pages, and a truncated
  history is never rendered as complete.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-013` — Financial transparency | Canonical, 5-rule list | Where a changed line moves an amount: no text states or implies money moved because terms changed; each treatment line names its category, reason and what it covers. |
| `TXT-PLATFORM-014` — Version and amendment communication | Canonical, owner for this widget | Fixed formula: the prior version stays visible and unmodifiable, full contrast, never dimmed; what changed is disclosed before acceptance is possible; the two regions are named explicitly "as it was" / "as it is", never ambiguous "old/new"; the accept control names the **amended terms specifically**, not bare "accept"; no text states or implies money moved merely because terms changed. |
| `TXT-PLATFORM-018` — Prohibitions master list | Canonical, 16-item list | Items 3 (no money-movement implication), 5 (no plan line without category and reason), 13 (irreversibility never colour/tone-only) bind this widget wherever its comparison touches a treatment line, an amount, or an irreversible acceptance. |
| `TXT-STATE-CLINICAL-001` — Treatment plan and accepted terms | Canonical | The `amendment` variant's own status vocabulary (`PROPOSED`/`ACCEPTED`/`EXPIRED`); `PROPOSED` requires viewing any material change before acceptance, per `IX-CLINICAL-001`. |
| `TXT-STATE-POLICY-001` — Policy version | Canonical | The `version`/`reproduction` variants' own status vocabulary (`draft`/`reviewed`/`scheduled`/`active`/`retired`/`superseded`); a `retired`/`superseded` version never renders as still governing anything. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-CLINICAL-001` — Treatment/plan change accessibility | The two sides are labelled regions ("as it was," "as it is") a screen reader can enter directly; each changed item announces as changed, with both values, in one unit; the accept control's accessible name states that it accepts the **amended** terms specifically — this is the one accept control in the system where a generic label would be actively misleading (WCAG 1.3.1, 1.4.1, 2.4.3). |
| `A11Y-POLICY-001` — Governed version and comparison accessibility | The governed-version header is announced **before** the content it frames; `expired` is distinguishable from `approved` in the announcement, the status most likely to be misread as still valid; both sides of a comparison load and announce together, never partial-as-verdict; a mismatch announces as a distinct result type, never folded into routine version drift (WCAG 1.3.1, 2.4.3) — Profile A only, `n/a` on Profile C by design. |
| `A11Y-PLATFORM-012` — Native structural semantics | The version-history list carries real list/table semantics, not a visually-styled grid with no underlying structure (WCAG 1.3.1). |
| `A11Y-PLATFORM-015` — No colour-alone communication | A changed value is marked by icon and label as well as fill, never by colour alone (WCAG 1.4.1). |
| `A11Y-FINANCE-001` — Financial value accessibility | A before/after financial comparison announces both values in one unit, labelled "as it was" / "as it is," never as two independently-announced numbers the listener must remember and compare (WCAG 1.3.1, 1.3.2, 4.1.2). |
| `A11Y-PLATFORM-030` — Bidirectional content: AT reading order and isolation | Version identifiers, effective dates and amounts on both sides are isolated with correct **screen-reader pronunciation order**, not only visual order (WCAG 1.3.2). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning comparison's own
contract." Representative examples Phase 4 names, by ID only:

- **Profile C:** `API-CLINICAL-002` (get proposed/accepted treatment plan — carries the `amendment`
  block with `supersedes_version_id`, `changed_lines[]`, `reason_per_change` and `price_difference` per
  `FR-CLINICAL-007`).
- **Profile A:** `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace), `SDC-POLICY-001` (Policy
  Lifecycle Workspace), `SDC-CATALOG-001` (Admin Catalog Governance Workspace), `SDC-CLAIMS-001` (Claim /
  Dispute Participation and Review Workspace), `SDC-FINANCE-001` (Clinic/Admin Financial Record
  Workspace), `SDC-IDENTITY-001` (Clinic Onboarding Applicant Workspace — the `requested-changes`
  variant), `SDC-AUDIT-001` (Audit Explorer and Historical Reproduction — the `reproduction` variant).

On every other screen, the applicable contract is that screen's own declared `API-*`/`SDC-*` (section
0.6), never invented here.

#### 10. Shared application-layer prerequisites

- **`TASK-CLINICAL-011`** — "Implement Disclosed Treatment Amendments" — the direct prerequisite for the
  `amendment` variant: "compute the summary from the line and modifier diff against the superseded
  version and persist it on the new version; refuse to propose a superseding version without it."
- **`TASK-CLINICAL-003`** — "Implement Dentist-Authored Treatment Plan Versioning" — the versioning
  foundation `TASK-CLINICAL-011` itself depends on.
- **`TASK-POLICY-001`** — "Implement the General Versioned Policy Foundation" — the prerequisite for the
  `version`/`reproduction` variants over `policy_versions`: draft → reviewed → scheduled → active →
  retired/superseded lifecycle with content hash, provenance, and historical lookup.
- **`TASK-CATALOG-003`** — "Build the Two-Layer Catalog and Mapping Governance" — the catalog-version
  prerequisite over `procedure_item_versions`.
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001`/`-005`
  (Filament), `TASK-PLATFORM-008` (React Native).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `treatment_plan_versions` | Proposed | Backs the `amendment` variant directly — `supersedes_version_id` plus `amendment_summary_json` carry the disclosed amendment `FR-CLINICAL-007` requires; a separate amendment table is deliberately avoided (the version chain **is** the amendment history). |
| `accepted_treatment_snapshots` | Proposed, immutable | The prior side of an accepted amendment; amendments create a new linked snapshot and never rewrite this one. |
| `policy_versions` | Proposed / Governed | Backs the `version`/`reproduction` variants for price-band, market-calibration, commercial-option, proposal-validity and currency-normalization policy. |
| `procedure_item_versions` | Proposed / Governed | Backs the `version` variant for the catalog/procedure layer; activated, retired and superseded versions are immutable, only a draft is deletable. |
| `commercial_options` | Proposed / Governed | Backs an amount-moving modifier shown on either side of a plan-line comparison. |

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN shared comparison component (stacked, prior first) | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament custom infolist view | `app/Filament/Support/` (shared change-disclosure partial) applied per `Resource` under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host command's own contract) | View-model responsibility |
|---|---|
| The one-sentence change summary | `summary: string` — rendered before the detail, always |
| Each changed element | `changes[i]: { label, prior, next }` — aligned pair, one row per changed element, in logical order |
| Unchanged elements | `unchanged: string[]` — stated explicitly, so absence of a row is never read as absence of a change |
| Recorded reason and authority | `{ reason, attribution }` → `CMP-PLATFORM-013` |
| The effect | `effect: { governs, from, doesNotGovern }` |
| Reproduction verdict, where the variant is `reproduction` | `verdict: match \| mismatch`, plus both compared outcomes |

No field is invented — every value is assembled from data the host command's own read already resolved
(per section 18, `loading-initial`: "both sides load before either renders").

#### 14. Refresh / caching / polling

Both sides load together and render together; a newer version arriving while the block is open **states
that** rather than swapping the comparison underneath the reader (section 18, `loading-refresh`). No
polling interval is specified.

#### 15. Idempotency / correlation

**Not applicable to the disclosure itself.** This widget renders a comparison; it issues no command of
its own. Where the `amendment` variant's accept control commits, that commit is the owning `IX-PLATFORM-
001` server-committed mutation's concern (with its own idempotency key, fixed at first submission) — this
widget hands off to it rather than duplicating it.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md`.
- **Server-side enforcement point:** the host command's own policy — a version outside the actor's purpose
  scope is not returned by the read.
- **UI consequence:** on `error-permission`, the block states the comparison is **scope-limited**, never
  rendering one side alone as if it were the whole comparison. The `reproduction` variant additionally
  never substitutes the current policy for an undeterminable then-effective one (section 6).

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `amendment \| version \| requested-changes \| deadline-history \| resolution \| reproduction` | Yes | none | Host's own declared comparison kind | Never inferred client-side |
| `summary` | string | Yes | — | Host's own read | Rendered first, always |
| `changes` | `Change[]` (section 13) | Yes | `[]` | Host's own read | Both sides load together; `null` on either side blocks render (section 18) |
| `unchanged` | `string[]` | No | `[]` | Host's own read | Stated, never omitted |
| `attribution` | object | No | — | `CMP-PLATFORM-013` | Absent (not guessed) where the read failed |
| `verdict` | `match \| mismatch \| null` | Only for `reproduction` | `null` | Host's own re-evaluation | `mismatch` routes to the integrity-exception surface, never to a retry |
| `onAccept` | callback | Only for `amendment` | — | — | Unavailable until the change set has been disclosed; never moved onto by focus |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | Both sides load before either renders. A one-sided diff is a misleading diff. |
| `loading-refresh` | A newer version arriving while the block is open states that rather than swapping the comparison underneath the reader. |
| `empty-no-data` | No change exists: stated plainly. On the `amendment` variant this means the current version is the accepted one. |
| `empty-filtered` | n/a. A comparison is not filtered. |
| `partial` | If one side failed to load, the block does **not** render a diff. It states which side is missing, because a partial diff reads as a complete one. |
| `stale` | Comparison carries its as-of time; acceptance is never offered against a stale comparison. |
| `error-fetch` | Retry in place; neither side is rendered alone. |
| `error-permission` | A version outside the actor's purpose scope is not returned and the block says the comparison is scope-limited. |
| `success` | The aligned comparison. |
| Offline / unstable | Last read comparison with as-of time; acceptance is withdrawn. |

#### 19. Lifecycle/state semantics

Where the compared record carries a lifecycle status of its own (a plan version's `PROPOSED`/`ACCEPTED`/
`EXPIRED`, or a policy version's `draft`/`reviewed`/`scheduled`/`active`/`retired`/`superseded`), each
side's status renders through `CMP-PLATFORM-001` from that record's own governing machine — this widget
never invents a comparison-specific status vocabulary. The `reproduction` variant's verdict
(`match`/`mismatch`) is a distinct result type from a lifecycle status and is never rendered through
`CMP-PLATFORM-001`; a `mismatch` is an integrity finding, not a state, and changes no stored history
(section 25).

#### 20. Tokens

`component.clinical-002.*` (mandatory — prior/new surfaces and text at full contrast for the prior side,
changed-marker, disclosure motion), conditional `component.platform-001.*`, `component.platform-013.*`,
`component.clinical-001.*`, `component.elig-002.*`, `component.policy-001.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-013`, `-014`, `-018`, `TXT-STATE-CLINICAL-001`, `TXT-STATE-POLICY-001`. No
canonical `ERR-*` string is restated; `ERR-CLINICAL-001` is referenced by ID where a plan cannot be
accepted.

#### 22. Accessibility contract

- **Role/name:** two labelled regions, "as it was" / "as it is", entered directly rather than inferred
  from position.
- **Focus:** on the `amendment` variant, focus moves to the change set when it first becomes viewable and
  **deliberately not onto the accept control**, so an in-flight keystroke cannot commit an irreversible
  acceptance; on Profile A the comparison is keyboard traversable row by row.
- **Keyboard:** each changed element is a distinct stop, not one undifferentiated region.
- **Screen reader:** each changed element announces as a pair — element, prior value, new value — so the
  association survives without the visual layout; the accept control's accessible name states it accepts
  the amended terms specifically.
- **No colour-only:** a changed value is marked by icon and label as well as fill; a reproduction mismatch
  is announced as a distinct result type, never folded into ordinary version drift.

#### 23. RTL / bidi

- **Prior and new sit in logical order and mirror together**, so the reader's before is always at the
  logical `start`; the stacked Profile C treatment keeps prior first in reading order regardless of
  direction.
- **Bidi isolation classes: `id`, `date`, `amount`.** Version identifiers, content hashes, amounts and
  effective dates are bidirectionally isolated.

#### 24. Responsive behavior

- **Profile C:** stacks prior and new vertically per changed element **at every size class** — a
  side-by-side diff does not fit a reading column and splitting it would break the pairing.
- **Profile A:** two columns at `profile-a.content-width.wide`, stacked per row at `narrow`.
- At the largest supported text size, a changed value never truncates on either side; the two sides stack
  with each row's pair kept adjacent.

#### 25. Immutability / historical safety

**The prior side of every comparison is a read of an immutable or governed-immutable record, never a
mutable one this widget could accidentally edit.** An accepted treatment snapshot, an activated policy
version and an activated procedure-item version are all immutable once reached; a superseding version
never removes its predecessor from reach, and this widget renders the predecessor at **full contrast**,
never dimmed (`A11Y-CLINICAL-001`, `TXT-PLATFORM-014`). A `reproduction` mismatch is an integrity
exception, escalated for review — it **never** triggers a silent correction of the recorded outcome, and
the widget itself performs no repair.

#### 26. Framework defaults to disable

Profile A, `Custom`:

- Filament ships no aligned before-and-after comparison with an authority slot and an "unchanged is
  stated" rule, so there is no stock default to disable — the `Custom` realization exists precisely
  because the comparison, the itemisation and the immutable-prior-side guarantee have no Filament
  equivalent to configure.
- Filament's default infolist section rendering (which would show only the current version's fields) is
  not used as the comparison surface; the two-sided anatomy is built explicitly rather than approximated
  from a single-record view.

#### 27. Prohibitions

1. A diff must never render when one side did not load.
2. An unaccepted amendment must never be presented as governing anything.
3. A change must never be disclosed only after acceptance is already possible.
4. The prior version must never be overwritten anywhere in the rendering.
5. A reproduction mismatch must never be treated as a correction rather than an integrity exception.
6. A diff must never be colour-only.

#### 28. Definition of Done

- [ ] On the `amendment` variant, the change set is disclosed and reachable before acceptance is offered.
- [ ] A partial read renders no diff and names the missing side.
- [ ] Unchanged elements are stated as unchanged rather than omitted.
- [ ] Each changed element announces as element, prior value, new value.
- [ ] Focus never lands on the accept control as a side effect of disclosure.
- [ ] A reproduction mismatch raises an integrity exception and changes no stored history.
- [ ] None of the six prohibitions in section 27 is violated on any of the 15 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 9, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-CLINICAL-002` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — prior-side full-contrast (never dimmed) vs new-side contrast,
  default/hover/focus, light mode.
- `node scripts/axe_audit.mjs <file>` — labelled-region role for both sides, changed-item pair
  announcement, accept control accessible name.
- `node scripts/verify_responsive.mjs <file>` — Profile C stacking at every size class; no page-level
  horizontal overflow at the narrow verification widths.

**Tier C (all: not run — requires implementation):**
- Real focus behaviour on the `amendment` variant proving focus never lands on accept as a side effect of
  disclosure, verified keyboard-only — not run — requires implementation.
- Screen-reader pass confirming each changed element announces as element/prior/new in one unit, in
  Arabic, on both profiles — not run — requires implementation.
- A live `reproduction` mismatch proving it routes to the integrity-exception surface and writes no
  correction to the recorded decision — not run — requires implementation.
- Real then-effective policy resolution proving a reproduction never silently substitutes the current
  policy when the historical one cannot be determined — not run — requires implementation.

---

### WGT-PLATFORM-011 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-011
- **Name:** Draft continuity bar
- **Build order:** 10
- **Platforms:** A
- **Runtime:** Filament panel region (Proposed, both panels)
- **Phase 4 realization:** Profile C `n/a`; Profile A `Custom`
- **Screen reach:** 10 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-011` block

**Known Phase 4 header inconsistency, not corrected here:** `docs/ux/04-specs/WIDGET_SPECS.md` section 3
lists this widget's `Platforms` column as `C, A`, while its own dedicated block in
`WIDGET_SPECS_PLATFORM.md` line 962, its Realization table, and its measured 10-screen placement (all
Profile A) agree it is Profile A only. `PHASE_05_IMPLEMENTATION_PLAN.md` section 8 (item 4) records this
exact discrepancy and states plainly that "correcting it is a Phase 4 edit" — this contract follows the
three agreeing sources (Profile A only) and does not attempt the Phase 4 correction.

#### 2. Implements

- `FR-IDENTITY-001`
- `FR-CLINICAL-001`
- `FR-CATALOG-003`
- `NFR-PLATFORM-006`

#### 3. Used by

**10 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (0 Patient, 8 Clinic, 2 Admin):

- **Clinic panel (8):** `SCR-IDENTITY-012` (Application workspace), `SCR-IDENTITY-013` (Applicant source
  facts), `SCR-IDENTITY-014` (Branch source facts), `SCR-IDENTITY-017` (Status and requested changes),
  `SCR-ELIG-008` (Activation request), `SCR-CLINICAL-010` (Plan authoring), `SCR-CLINICAL-011` (Stages and
  pricing), `SCR-CLAIMS-007` (Claim response and evidence).
- **Admin panel (2):** `SCR-CATALOG-005` (Family and definition editor), `SCR-POLICY-002` (Version
  editor).

On the Patient side the equivalent obligation is carried by `API-PLATFORM-002` reconciliation rather than
by a draft (section 9), so this widget has no Patient placement.

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only, per **E1** (`PHASE_05_
  IMPLEMENTATION_PLAN.md` section 6.5, build order 10, "Depends on: 1"). The measured edge set (section
  6.2) names no other edge involving `WGT-PLATFORM-011` as a build dependency.
- **Not a build dependency:** this widget's own block names `WGT-PLATFORM-012` **only** to explain why it
  is `n/a` on Profile C — "on the Patient side the equivalent obligation is carried by `API-PLATFORM-002`
  reconciliation rather than by a draft." `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2 explicitly
  examines and **rejects** this exact mention as an edge: "neither is a build dependency and neither is
  drawn as one."

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | The `inline` variant, reused for the draft's own save cycle rather than a committing action: `pending`/`retrying` resolve to "saving," `completed` resolves to a saved time left standing (never "saving..." shown after the server confirmed), `failed` states plainly that the last save did not land, with local edits preserved. This is a **content reuse** of the same honest-state contract `IX-PLATFORM-001`/`-002` already define — a draft save is a server-committed mutation like any other, evaluated under the identical never-optimistic rule. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | For the draft's own lifecycle status, where the host machine carries a `DRAFT` value distinct from a submitted one |
| `CMP-PLATFORM-006` — Record list | `embedded` variant, for the section-completeness list on the `sectioned` variant |
| `CMP-PLATFORM-013` — Human attribution | Where the draft is owned by a named person distinct from the current actor (e.g. a co-authored application) |

#### 6. Interaction dependencies

- **`IX-PLATFORM-005` (owner) — Draft save and resume without a submitted record.** In-progress data is
  saved as a draft, with its last-saved time visible; **the draft creates no submitted business record**
  — `DRAFT` is a real lifecycle status in six of the eighteen machines and is not a submission; on return,
  the draft is offered with what it contains and when it was saved; submission is a separate, deliberate
  act with its own confirmation where the action is sensitive. If the draft cannot be saved, the actor is
  told **while they can still act**, not on return — a save failure never silently discards input. On
  resume, focus lands on the first incomplete required field, not at the top of the form; on a long
  workspace, focus returns to the section the actor left.
- **`IX-PLATFORM-008` — Progressive disclosure.** At `profile-a.content-width.narrow`, the section-
  completeness list collapses into a labelled disclosure while the draft status and last-saved time
  remain visible outside it.
- **`IX-PLATFORM-001` — Server-committed mutation.** The underlying save call this widget's own status
  indicator reflects: an idempotency key fixed at first submission, submitting rendered honestly, no
  re-submission while a save is in flight, an authoritative re-read (the saved time) after commit.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-008` — Loading states | Canonical | "Saving" names the act in progress; the bar never shows a generic "loading" for a save-in-flight, and never shows saved before the server confirms. |
| `TXT-PLATFORM-010` — Pending and review states | Canonical | Where the draft's own host record carries a pending/under-review status distinct from `DRAFT` itself (e.g. a submitted-then-returned application), the same non-accusatory formula applies. |
| `TXT-PLATFORM-014` — Version and amendment communication | Canonical | Where resuming a draft surfaces a change made elsewhere since the actor last edited it (`stale`, section 18): the actor is told rather than having one version silently win. |
| `TXT-PLATFORM-019` — Structural state and archetype copy | Canonical | The `form` archetype rule this widget is the canonical carrier of: "حفظ كمسودة متاح لأي نموذج طويل" (save-as-draft is available for any long form). |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-028` — Multi-step and draft-form progress is accessible and resumable (owner) | Per-section completeness is exposed as a real, announceable state, not colour alone; on resume, focus lands on the first incomplete required field or, on a long workspace, the section the actor left — never at the top of the form by default (WCAG 1.3.1, 2.4.3). |
| `A11Y-PLATFORM-011` — Live-region announcement policy | The draft status is announced when it changes from saving to saved, **once, politely** — not on every keystroke (WCAG 4.1.3). |
| `A11Y-PLATFORM-009` — Accessible name, role and state for every interactive element and status | Every section-completeness entry and the submit control's unavailability reason are exposed with an explicit accessible name/role/state, not left to default DOM-adjacent text (WCAG 4.1.2). |
| `A11Y-PLATFORM-005` — Focus not obscured by sticky chrome | The bar stays visible while the actor scrolls the form, without covering a focused element (WCAG 2.4.11). |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own.** Its data source is "the owning workspace's own
contract." Phase 4 names six `SDC-*`, by ID only:

- **Profile A:** `SDC-IDENTITY-001` (Clinic Onboarding Applicant Workspace), `SDC-ELIG-001` (Clinic
  Service Activation Workspace), `SDC-CLINICAL-001` (Clinic Case and Treatment Workspace), `SDC-CLAIMS-001`
  (Claim / Dispute Participation and Review Workspace), `SDC-CATALOG-001` (Admin Catalog Governance
  Workspace), `SDC-POLICY-001` (Policy Lifecycle Workspace).

**Profile C has no placement.** `API-PLATFORM-002` (Patient Notification Center) carries the analogous
Patient-side obligation through reconciliation against the authoritative resource rather than through a
resumable draft record — a structural difference the widget's own block names explicitly (section 3), not
a gap in this contract.

On every other screen, the applicable contract is that screen's own declared `SDC-*` (section 0.6), never
invented here.

#### 10. Shared application-layer prerequisites

**No dedicated Filament draft/autosave `TASK-*` currently exists in `docs/implementation/*.md`.** Searched
against every `ADMIN_IMPLEMENTATION_PLAN.md` and `CLINIC_IMPLEMENTATION_PLAN.md` task for "draft" or
"autosave" by name: none is found. This is a genuine gap in the implementation plan, flagged and **not**
resolved here — no such task is invented. The closest applicable prerequisites are the same
shared-rendering-primitive tasks every widget above depends on:

- **`TASK-PLATFORM-001`** — "Harden the Existing Admin Panel Boundary" — the Admin panel shell this
  widget's Admin-panel placements (`SCR-CATALOG-005`, `SCR-POLICY-002`) build inside.
- **`TASK-PLATFORM-005`** — "Create the Separate Clinic Filament Panel" — the Clinic panel shell this
  widget's eight Clinic-panel placements build inside.

Whichever `TASK-*` eventually implements each host `SDC-*` workspace's own draft/save mechanism (e.g. the
`TASK-IDENTITY-*`, `TASK-CLINICAL-*`, `TASK-CATALOG-*` or `TASK-POLICY-*` owning the relevant Filament
resource) is this widget's true functional prerequisite per-screen; none is named generically here because
no cross-cutting draft-persistence task exists to name.

#### 11. Data model prerequisites

**No generic "drafts" table exists in `docs/database/ERD.md`.** Two distinct gaps, both flagged and
neither resolved here:

| Host `SDC-*` | Draft persistence found | Status |
|---|---|---|
| `SDC-CLINICAL-001` | `treatment_plan_versions.state` — an in-progress lifecycle value on the plan version's own row, not a separate draft entity | Proposed |
| `SDC-POLICY-001`, `SDC-CATALOG-001` | `policy_versions.status` / `procedure_item_versions.status` — the same pattern, an in-progress status on the governed version's own row | Proposed / Governed |
| `SDC-IDENTITY-001` | **No table of any kind identified.** `docs/database/ERD.md` defines no clinic-onboarding-application table at all, despite `SDC-IDENTITY-001` stating full `DRAFT`/`SUBMITTED`/`CHANGES_REQUESTED`/`RESUBMITTED`/`APPROVED`/`REJECTED` states and draft/submit/resubmit commands over it | Not modelled |
| `SDC-ELIG-001`, `SDC-CLAIMS-001` | No dedicated draft table identified; presumed to follow the same in-progress-status-on-own-row pattern pending the owning `TASK-ELIG-*`/`TASK-CLAIMS-*` | Proposed |

This contract does not invent a drafts table or a clinic-onboarding-application table to close either gap
— it records the gap so the owning `TASK-IDENTITY-*` prerequisite addresses it when authored.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| Filament panel region, sticky while scrolling | `app/Filament/Support/` (shared draft-continuity helper) applied per `Resource` under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host workspace's own contract) | View-model responsibility |
|---|---|
| The draft's own lifecycle status | `draftStatus: DRAFT \| saving \| saved`, resolved from the host's own machine, never invented |
| Last successful save | `lastSavedAt: string \| null` — a time, never "saving..." left standing after it finished |
| Section completeness (`sectioned` variant) | `sections: { name, complete: boolean }[]` — sections complete in any order; only submission is gated on completeness |
| Outstanding items | `outstanding: string[]` — named, not only counted |
| Draft owner, where distinct from the current actor | `owner?: Attribution` → `CMP-PLATFORM-013` |

No field is invented — the draft loads before any editable field is offered (section 18,
`loading-initial`), so the view-model is assembled from data already resolved.

#### 14. Refresh / caching / polling

Event-driven: a save in flight shows as saving and resolves to a saved time; it never shows saved before
the server confirms (section 18, `loading-refresh`). No polling interval or autosave cadence is specified
or invented — the autosave trigger (on blur, on interval, on navigation) is the host workspace's own
implementation detail, out of this widget's fixed scope.

#### 15. Idempotency / correlation

**Applies to the underlying save call, not to the bar's own rendering.** Each save is a server-committed
mutation under `IX-PLATFORM-001`, with its own idempotency key fixed at first submission; a retry of a
failed save reuses the original key, per `IX-PLATFORM-002` (composed by reference, not restated). This
widget's own responsibility is honest display of that call's outcome — saving, saved, or "the last save
did not land" — never inventing a saved state the server has not confirmed.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` — revocation or expiry of a
  grant/scope "takes effect immediately" (general rule, section 21), applied here to draft-editing
  authority specifically.
- **Server-side enforcement point:** the host workspace's own policy check on each save/read.
- **UI consequence:** on `error-permission`, "authority to edit this draft was lost: editing is removed
  structurally and the actor is told what scope they now hold" — never left to discover the loss through a
  failed save.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `sectioned \| single` | Yes | none | Host archetype — `sectioned` for application/authoring workspaces, `single` for one-form drafts | Never inferred client-side |
| `draftStatus` | `DRAFT \| saving \| saved` | Yes | — | Host's own machine | See section 13 |
| `lastSavedAt` | string \| null | Yes | `null` | Host's own read | Never a fabricated time |
| `sections` | `Section[]` | Only for `sectioned` | `[]` | Host's own read | Sections complete in any order |
| `submitDisabledReason` | string \| null | Yes | — | Host's own read, from `sections` | Bound to the submit control programmatically |
| `onSaveAndClose` | callback | Yes | — | — | A reachable, keyboard-activatable control, not only an implicit behaviour |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The draft loads before any editable field is offered, so the actor never types into a form that is about to be replaced. |
| `loading-refresh` | A save in flight shows as saving and resolves to a saved time; it never shows saved before the server confirms. |
| `empty-no-data` | No draft exists yet: the bar states that starting creates one, and that a draft is not a submission. |
| `empty-filtered` | n/a. |
| `partial` | A section whose completeness could not be computed says so; submission is blocked with that named rather than allowed optimistically. |
| `stale` | A draft edited elsewhere is detected on re-read; the actor is told rather than having one version silently win. |
| `error-fetch` | Local edits are preserved and the bar states that the last save did not land. Nothing is discarded. |
| `error-permission` | Authority to edit this draft was lost: editing is removed structurally and the actor is told what scope they now hold. |
| `success` | Saved, with its time. |
| Offline / unstable | Edits are held and the bar states plainly that the last save has not landed. It never shows a saved time it did not receive. |

#### 19. Lifecycle/state semantics

`DRAFT` is a real, governed lifecycle status in six of the host machines, resolved through `CMP-PLATFORM-
001` exactly like any other status where the host record carries one — this widget never treats "draft" as
a UI-only concept distinct from the record's own machine. **A draft is never visible to the counterparty
and is never described as submitted, on any surface, at any disclosure depth** — this is the widget's
central correctness obligation, carried in every variant.

#### 20. Tokens

`component.platform-011.*` (mandatory, `inline` variant), conditional `component.platform-001.*`,
`component.platform-006.*` (`embedded`), `component.platform-013.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-008`, `-010`, `-014`, `-019`. No canonical `ERR-*` string is restated by this
widget.

#### 22. Accessibility contract

- **Role/name:** the draft status is a real, announceable region; each section-completeness entry has an
  explicit accessible name/role/state.
- **Focus:** on resume, focus lands on the first incomplete required field or the section the actor left —
  never the top of the form by default; focus is never moved by an autosave.
- **Keyboard:** each section is reachable by keyboard; save-and-close is a real, activatable control.
- **Screen reader:** the draft status announces once, politely, on the saving-to-saved transition — never
  per keystroke; the submit control's unavailability reason is programmatically associated with it.
- **No colour-only:** section completeness is exposed as a real state, not colour alone.

#### 23. RTL / bidi

- The bar mirrors as a whole.
- **Bidi isolation class: `date`.** The saved timestamp is bidirectionally isolated.

#### 24. Responsive behavior

- **Profile A only.** The bar stays visible while the actor scrolls the form, without obscuring a focused
  element (`A11Y-PLATFORM-005`). At `profile-a.content-width.narrow` the section completeness collapses
  into a labelled disclosure while the draft status and last-saved time remain visible.
- At the largest supported text size, the bar stacks above the form rather than becoming an icon; section
  names wrap; the outstanding-items list never truncates.

#### 25. Immutability / historical safety

**A draft is, by definition, not yet a governed or immutable record** — it is the pre-submission state a
later, immutable snapshot or version is created from. This widget's own immutability obligation runs the
other way: it must never present a draft **as** a submitted or accepted record on any surface, at any
disclosure depth, and it must never let a draft become visible to the counterparty before the actor
deliberately submits. Once the host workspace's own submission creates the governed record (a
`treatment_plan_version`, a `policy_version`), that record's own immutability is `WGT-PLATFORM-014`'s and
its host contract's concern, not this widget's.

#### 26. Framework defaults to disable

Profile A, `Custom`:

- Filament ships no draft-continuity contract with section completeness and a not-yet-submitted guarantee,
  so there is no stock default to disable — the `Custom` realization exists because this behaviour has no
  Filament equivalent to configure.
- Filament's default form-dirty-state indicator (where present via a package) is not substituted for this
  widget's own honest saving/saved/failed states, because the default does not distinguish "saving" from
  "saved" as two named, server-confirmed states.

#### 27. Prohibitions

1. A draft must never show as saved before the server confirms.
2. A draft must never be visible to the counterparty.
3. A submit control must never be available while required items are outstanding.
4. A linear wizard must never hide the shape of the task.
5. An autosave must never move focus or steal a keystroke.
6. A draft must never be presented as a submitted record anywhere.

#### 28. Definition of Done

- [ ] A draft is never visible to the counterparty and is never described as submitted.
- [ ] Saved state is shown only after the server confirms.
- [ ] Sections complete in any order; only submission is gated on completeness, and what remains is named.
- [ ] An interrupted session resumes with every field intact.
- [ ] Autosave never moves focus and never announces per keystroke.
- [ ] None of the six prohibitions in section 27 is violated on any of the 10 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 10, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-011` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — draft-status/section-completeness contrast in default/hover/
  focus, light mode.
- `node scripts/axe_audit.mjs <file>` — draft-status live region, section-completeness accessible names,
  submit-unavailability association.
- `node scripts/verify_responsive.mjs <file>` — sticky-bar-never-obscures-focus at the narrow verification
  widths; disclosure collapse at `narrow`.

**Tier C (all: not run — requires implementation):**
- Real interrupted-session resume proving every field is intact and focus lands on the first incomplete
  required field, keyboard-only — not run — requires implementation.
- Live proof that an autosave never moves focus or announces per keystroke, verified with a screen reader
  during active typing — not run — requires implementation.
- Real authority-loss mid-edit proving editing is removed structurally rather than surfaced as a failed
  save — not run — requires implementation.
- Live proof, once the owning `TASK-IDENTITY-*` closes the gap in section 11, that a clinic-onboarding
  draft persists correctly — not run — requires implementation and the data-model gap to close first.

---

### WGT-PLATFORM-008 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-008
- **Name:** Evidence transfer panel
- **Build order:** 11
- **Platforms:** C, A
- **Runtime:** RN resumable transfer (Proposed, path unverified) + Filament file field, configured
  (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 9 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-008` block

#### 2. Implements

- `FR-CLAIMS-002`
- `FR-ELIG-008`
- `FR-IDENTITY-001`
- `NFR-PLATFORM-003`

#### 3. Used by

**9 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (1 Patient, 4 Clinic, 4 Admin):

- **Patient app (1):** `SCR-CLAIMS-003` (Protection claim).
- **Clinic panel (4):** `SCR-IDENTITY-015` (Application evidence), `SCR-ELIG-009` (Activation evidence),
  `SCR-CLINICAL-014` (Stage execution and evidence), `SCR-CLAIMS-007` (Claim response and evidence).
- **Admin panel (4):** `SCR-IDENTITY-029` (Fact and evidence verification), `SCR-ELIG-017` (Evidence
  verification), `SCR-CLAIMS-011` (Evidence and deadlines), `SCR-PLATFORM-006` (Evidence access log).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only, per **E1** (`PHASE_05_
  IMPLEMENTATION_PLAN.md` section 6.5, build order 11, "Depends on: 1").
- **Stated successor (not a predecessor of this widget):** **E6** — "`WGT-PLATFORM-008` precedes
  `WGT-CLAIMS-001`" (`WGT-CLAIMS-001`'s own offline row: supplying evidence "resumes from its interruption
  point under `WGT-PLATFORM-008`"). This is an outgoing edge from this widget, recorded here for
  completeness; it places no dependency obligation on WGT-PLATFORM-008 itself, and `WGT-CLAIMS-001` is a
  Session 5 domain contract, out of scope for this session.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-012` — Evidence transfer item | The whole widget, one item per row. Variants: `intake` (the actor supplies), `review` (an authorised reviewer verifies or rejects), `access-log` (state plus access and download events, no transfer action). The eight fixed session states — `SELECTED`, `UPLOADING`, `PAUSED`, `FAILED_RETRYABLE`, `UPLOADED`, `VALIDATING_SCANNING`, `ACCEPTED`, `REJECTED` — are the component's primary axis, fixed by `PO-UX-17`. **The structural separation between `FAILED_RETRYABLE` (a transfer failure, offering resume/retry, never worded as a rejection) and `REJECTED` (an authoritative outcome, reachable only from validation or review, naming a specific correctable requirement) is the whole point of this widget.** `UPLOADED` is not `ACCEPTED`: an item that transferred successfully is still quarantined until the required scan succeeds and still unverified until a reviewer accepts it — three separate facts, three separate states, never collapsed. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-006` — Record list | `embedded` variant, for the requirement list the item set is bound to |
| `CMP-PLATFORM-005` — Deadline indicator | Where an item carries an expiry (e.g. a credential document) |
| `CMP-PLATFORM-013` — Human attribution | Where a reviewer accepted or rejected the item, naming the reviewer and the recorded basis |

#### 6. Interaction dependencies

- **`IX-PLATFORM-006` (owner) — Resumable evidence transfer.** The eight fixed session states in order,
  with two exits: `ACCEPTED` (cleared for use) and `REJECTED` (refused, with the specific correctable
  requirement named). **The structural separation is the whole pattern:** `FAILED_RETRYABLE` is reachable
  only from transfer; `REJECTED` only from validation or review; a dropped connection can never route to
  `ERR-PLATFORM-005`, and `ERR-PLATFORM-005` guidance can never be reachable from a transfer failure. An
  interrupted transfer **resumes from where it stopped** where the session supports it, rather than
  restarting. Focus stays in the evidence region across state changes; on rejection, focus moves to the
  rejected item's own stated requirement, because that is the only place the actor can act.
- **`IX-PLATFORM-009` — Long read with progress.** `UPLOADING` and `VALIDATING_SCANNING` are the loading
  states; progress is determinate while transferring, and `VALIDATING_SCANNING` is explicitly
  indeterminate **with a stated reason**, never a bare spinner.
- **`IX-PLATFORM-002` — Idempotent retry.** A retryable transfer failure's retry resumes or retries the
  **same item**, never minting a new evidence record; a repeated retryable failure states how many times
  it has been tried and stops offering an unbounded loop.
- **`IX-PLATFORM-018` — Field-bound validation and correction.** A `REJECTED` outcome's stated requirement
  is bound to the specific item, with the actor's remaining valid items preserved; correcting replaces the
  named item without re-entering the rest of the form.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-009` — Offline and weak network | Canonical | "A transfer failure caused by a weak network is never phrased as a rejection" — copy obligation 3, the most important rule in this widget's whole content surface; resume from the point of interruption is the default path. |
| `TXT-PLATFORM-010` — Pending and review states | Canonical | Where an item's own state is `VALIDATING_SCANNING`, the same non-accusatory pending formula applies. |
| `TXT-PLATFORM-011` — Warnings | Canonical | A non-critical informational note about an item, distinct from a rejection or a deadline warning. |
| `TXT-ERR-PLATFORM-005` — Evidence rejected or failed validation | Canonical, fires only from `REJECTED` | Never reachable from `FAILED_RETRYABLE`; where the specific failed check is known, names it instead of repeating the generic sentence alone; recovery is always replacement with a different file, never resubmission of the same one. |
| `TXT-STATE-PLATFORM-001` — Evidence transfer session | Canonical, fixed 8-state table | The chip label, triple and meaning for every one of the eight session states, in Arabic; the structural separation rule closing the table binds this widget directly. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-034` — Evidence-transfer accessibility (owner) | The eight session states are distinguishable by wording and icon, not tone alone; `FAILED_RETRYABLE` announces politely and moves focus to the item's resume control; `REJECTED` announces politely with distinct wording and moves focus to the stated correctable requirement, never to a retry control. |
| `A11Y-PLATFORM-011` — Live-region announcement policy | Progress is announced at intervals, never continuously; `UPLOADED` announces once (WCAG 4.1.3). |
| `A11Y-PLATFORM-027` — Field-bound error association, summary, input preservation | A `REJECTED` item's stated requirement is programmatically bound to the item, not merely visually adjacent (WCAG 3.3.1, 3.3.3). |
| `A11Y-PLATFORM-015` — No colour-alone communication | `FAILED_RETRYABLE` and `REJECTED` differ by icon and wording as well as tone (WCAG 1.4.1). |
| `A11Y-PLATFORM-013` — Target size floor and comfortable floor | The resume/retry/replace/remove controls each clear `semantic.size.target-floor` (WCAG 2.5.8). |

#### 9. Canonical data/action contracts

- **Profile C:** `API-PLATFORM-001` — Private Evidence Transfer. Status: **Proposed.** `POST /api/v1/
  evidence-sessions` (open), `PUT .../content` (transfer, resumable by byte-range offset), `POST .../
  finalize`. Idempotency key required on open and finalize; repeated finalize returns the original
  terminal outcome. **Deliberately provider-neutral** — no presigned URL, vendor SDK or vendor-specific
  multipart protocol is named, so the concrete storage and scanner can be selected later without a
  contract change (`PO-UX-17`). Private evidence is never returned as a raw storage path, a public URL, or
  a signed URL in this or any other contract.
- **Profile A:** `SDC-IDENTITY-001` (Clinic Onboarding Applicant Workspace), `SDC-ELIG-001` (Clinic
  Service Activation Workspace — "no manual A/B/C/D/F/P/H/I/final eligibility inputs"), `SDC-ELIG-002`
  (Admin Verification Workbench), `SDC-CLAIMS-001` (Claim / Dispute Participation and Review Workspace),
  `SDC-AUDIT-001` (Audit Explorer and Historical Reproduction — the `access-log` variant).

#### 10. Shared application-layer prerequisites

- **`TASK-PLATFORM-002`** — "Implement Private Evidence Intake, Quarantine, and Authorized Download" —
  **the single most important prerequisite for this widget**, establishing the shared private evidence
  service every one of the nine screens depends on: "validate extension + magic + MIME + decodability;
  enforce configured size/count limits; opaque UUID/object identity; SHA-256; quarantine until scan
  passes; fresh authorization for download; signed access ≤60 seconds when used; audit every sensitive
  download. Provider remains unresolved." Its own dependencies: `TASK-AUDIT-001`, `TASK-IDENTITY-002`.
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001`/`-005`
  (Filament), `TASK-PLATFORM-008` (React Native).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `evidence_items` | Proposed | The canonical destination for a transferred item: `object_key`, `mime_type`, `sha256`, `scan_state`, `scan_completed_at`. Business use is blocked until the required scan/validation state passes. |
| `evidence_bindings` | Proposed | Binds one `evidence_item` to exactly one parent record (`service_activation_request_id`, `case_treatment_stage_id`, `financial_event_id`, `claim_id`, `claim_appeal_id`, `review_appeal_id`) and a `purpose`; a database CHECK requires exactly one parent per row. |

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN resumable transfer, session state per item | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament file field, configured against the requirement set | `app/Filament/Support/` (shared evidence-item field) applied per `Resource` under `app/Filament/Resources/` / `app/Filament/Clinic/Resources/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host requirement's own contract) | View-model responsibility |
|---|---|
| The governing requirement, from the host definition | `requirement: { description, why }` — loads before any item control is offered |
| Item's own session state | `items[i].sessionState: SELECTED \| UPLOADING \| PAUSED \| FAILED_RETRYABLE \| UPLOADED \| VALIDATING_SCANNING \| ACCEPTED \| REJECTED` |
| What to do next per item | `items[i].nextAction: resume \| retry \| correct-and-resupply \| none` — differs per exit, never a uniform "retry" |
| File identity shown to the actor | `items[i].displayName` — **never** the opaque storage identifier |
| Reviewer's outcome, where the `review` variant applies | `items[i].reviewedBy?: Attribution` → `CMP-PLATFORM-013` |

No storage path, signed link, or scanner-internal value is ever placed in the view-model (section 27).

#### 14. Refresh / caching / polling

Item states refresh without interrupting an in-flight transfer (section 18, `loading-refresh`). No
polling interval is specified; `VALIDATING_SCANNING`'s resolution is event-driven from the scan service.

#### 15. Idempotency / correlation

**Applies at the session level, per item.** `API-PLATFORM-001` requires an idempotency key on open and
finalize; a transient transfer failure is retried on the **same** session, never as a new evidence record
(`API-PLATFORM-001` Business Rules). A retryable failure's retry reuses the item's own session; it never
mints a second `evidence_items` row for the same intent.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` §15 "Private Evidence and Files" —
  "Fresh authorization for exact evidence purpose/resource; audit required" (upload); "Quarantine remains
  effective until required scan succeeds" (use before scan is a **Deny**); "Fresh authorization for exact
  evidence/resource/purpose; download audited" (view/download); "Reuse signed/private file URL after
  authorization expiry" is a **Deny**.
- **Server-side enforcement point:** the evidence service `TASK-PLATFORM-002` establishes.
- **UI consequence:** on `error-permission`, "viewing or downloading requires fresh authorization for the
  exact purpose; a denial states that rather than showing an empty item set."

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `intake \| review \| access-log` | Yes | none | Host archetype | `access-log` offers no transfer action |
| `requirement` | `{ description, why }` | Yes | — | Host's own governing definition | Loads before any add-item control |
| `items` | `Item[]` (section 13) | Yes | `[]` | Host's own read | One row per item |
| `onAddItem` | callback | Only for `intake` | — | — | Subject to the requirement, never a free upload |
| `onResume` / `onRetry` | callback | Yes where `FAILED_RETRYABLE`/`PAUSED` items exist | — | — | Reuses the item's own session, never a new one |
| `onReplace` | callback | Only for `intake`, on a `REJECTED` item | — | — | Correcting the named requirement, never retrying the same file |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The requirement list loads before any item control is offered, because a free upload with no requirement is not a thing this product has. |
| `loading-refresh` | Item states refresh without interrupting an in-flight transfer. |
| `empty-no-data` | No requirement applies: stated plainly, with no add control. |
| `empty-filtered` | n/a. The requirement set is governed, not filtered. |
| `partial` | Some item states resolved and some did not; an unresolved item is never rendered as satisfied. |
| `stale` | Item states shown with their as-of time; acceptance is never inferred from a stale read. |
| `error-fetch` | Requirement list preserved; retry in place; an in-flight transfer is not cancelled by a failed status read. |
| `error-permission` | Viewing or downloading requires fresh authorization for the exact purpose; a denial states that rather than showing an empty item set. |
| `success` | Items with their current states. |
| Offline / unstable | The load-bearing condition. A transfer resumes from the point of interruption rather than restarting, and the panel says the connection is unavailable rather than reporting a failure. |

#### 19. Lifecycle/state semantics

The eight fixed session states are the widget's entire lifecycle vocabulary and are **not** rendered
through `CMP-PLATFORM-001`'s general status-machine mechanism — they are `CMP-PLATFORM-012`'s own
dedicated triple, fixed by `PO-UX-17`, deliberately distinct so the transfer-vs-rejection separation
cannot be diluted by reuse with an unrelated machine. Where the host record's own lifecycle status is
separately relevant (e.g. the claim itself is `UNDER_REVIEW` while its evidence items transfer), that
status renders through `CMP-PLATFORM-001` on the host surface, never inside this widget.

#### 20. Tokens

`component.platform-012.*` (mandatory — `FAILED_RETRYABLE` resolves to `tone.warning`, `REJECTED` to
`tone.danger`, with different icons and emphases, enforced by the token gate), conditional
`component.platform-006.*` (`embedded`), `component.platform-005.*`, `component.platform-013.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-009`, `-010`, `-011`, `TXT-ERR-PLATFORM-005`, `TXT-STATE-PLATFORM-001`.
`ERR-PLATFORM-005` is referenced by ID only, on the `REJECTED` exit; it is never reachable from
`FAILED_RETRYABLE`.

#### 22. Accessibility contract

- **Role/name:** each item's accessible name carries its file identity and its current session state
  together.
- **Focus:** `FAILED_RETRYABLE` moves focus to the item's resume control; `REJECTED` moves focus to the
  stated correctable requirement, never to a retry control.
- **Keyboard:** the file control is keyboard operable on Profile A; resume, retry, replace and remove are
  all reachable by keyboard.
- **Screen reader:** progress announces at intervals, never continuously; `UPLOADED` announces once;
  `VALIDATING_SCANNING`'s transition into `ACCEPTED` or `REJECTED` is announced, because it happens
  without user action.
- **No colour-only:** the eight session states are distinguishable by wording and icon; no state is
  conveyed by colour alone.

#### 23. RTL / bidi

- Progress fills from the logical `start` in both directions; a progress bar filling physically
  left-to-right in a right-to-left interface is a directional defect.
- **Bidi isolation classes: `id`, `date`.** Filenames, content hashes and item identifiers are
  bidirectionally isolated; directional icons mirror, state icons do not.

#### 24. Responsive behavior

- **Profile C:** item rows stack in the reading column with the state and the next action always
  together.
- **Profile A:** requirement and items sit in one region; at `profile-a.content-width.narrow` each item's
  state and next action stack rather than moving off-screen.

#### 25. Immutability / historical safety

Once an item reaches `ACCEPTED` and is bound to one of the nine immutable entities (via `evidence_
bindings`), it is read-only at full contrast in every later rendering — the `access-log` variant is the
canonical read of that history, offering no transfer action. A rejection is never retried as the same
file; it is corrected by replacement, which creates a **new** `evidence_items` row rather than mutating
the rejected one, so the rejected item's own record (and the reviewer's basis for rejecting it) remains
readable.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- Filament's own upload states (a generic "uploading"/"uploaded"/"failed") **do not distinguish the two
  exits** — `FAILED_RETRYABLE` from `REJECTED` — and are **replaced**, not relabelled, by the eight-state
  machine rendered as a custom item row.
- Filament's default file-field preview, where it would expose a raw storage path or filename, is
  **not** used as-is; the displayed identity is the actor-recognisable name, never the opaque object key.

#### 27. Prohibitions

1. Transfer success must never collapse into evidence acceptance.
2. A single failure state must never cover both `FAILED_RETRYABLE` and `REJECTED`.
3. A storage path, opaque filename, signed link or scanner internal must never be exposed on any surface.
4. A quarantined item must never be treated as satisfying a requirement.
5. A public or long-lived link to any evidence must never exist.
6. A transfer vendor must never be named.

#### 28. Definition of Done

- [ ] `FAILED_RETRYABLE` and `REJECTED` differ in tone, icon, wording, next action and focus destination.
- [ ] `UPLOADED` never renders as accepted, and a quarantined item never satisfies a requirement.
- [ ] An interrupted transfer resumes from its interruption point rather than restarting.
- [ ] No surface exposes a storage path, a raw filename, a signed link or a scanner internal.
- [ ] Progress announces at intervals, not continuously.
- [ ] Every viewing or download action requires fresh purpose-bound authorization and is audited.
- [ ] None of the six prohibitions in section 27 is violated on any of the 9 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 11, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-012` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — `FAILED_RETRYABLE` vs `REJECTED` contrast in default/hover/
  focus, light mode.
- `node scripts/axe_audit.mjs <file>` — item accessible names, focus-destination assertions for the two
  exits, resume/retry/replace/remove reachability.
- `node scripts/verify_responsive.mjs <file>` — item state/next-action stacking at the narrow verification
  widths.

**Tier C (all: not run — requires implementation):**
- Real resumable transfer proof: an interrupted upload resumes from its byte offset rather than
  restarting, on the actual React Native client — not run — requires implementation.
- Live proof that no storage path, filename, signed link or scanner internal is ever reachable on any
  surface, verified against the real API responses — not run — requires implementation.
- Screen-reader pass confirming `FAILED_RETRYABLE` and `REJECTED` announce with distinct wording and move
  focus to their correct respective destinations — not run — requires implementation.
- A live repeated-retry proving the same idempotency-keyed session, never a new evidence record, under
  contention — not run — requires implementation.

---

### WGT-PLATFORM-013 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-013
- **Name:** Itemized verification list
- **Build order:** 12
- **Platforms:** A
- **Runtime:** Filament repeater or table, configured (Proposed, Admin panel only)
- **Phase 4 realization:** Profile C `n/a`; Profile A `Extended`
- **Screen reach:** 6 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-013` block

#### 2. Implements

- `FR-IDENTITY-001`
- `FR-ELIG-007`
- `FR-AUDIT-001`

#### 3. Used by

**6 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (0 Patient, 0 Clinic, 6 Admin —
verification is a staff activity, per the widget's own Realization table):

- **Admin panel (6):** `SCR-IDENTITY-029` (Fact and evidence verification), `SCR-IDENTITY-030` (Request
  changes), `SCR-IDENTITY-038` (Legal representation verification), `SCR-ELIG-015` (Activation request
  review), `SCR-ELIG-016` (Source fact verification), `SCR-ELIG-017` (Evidence verification).

#### 4. Widget dependencies

- **Required predecessor:** `WGT-PLATFORM-001` (build order 1) only, per **E1** (`PHASE_05_
  IMPLEMENTATION_PLAN.md` section 6.5, build order 12, "Depends on: 1"). The measured edge set (section
  6.2) names no other edge involving `WGT-PLATFORM-013`.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-013` — Human attribution | Per-item provenance and, once decided, the reviewer's own attribution. Anatomy per item: `item` → `submitted value` → `provenance` → `outcome` → `[ reason ]` (required on reject and on request-change; becomes the applicant's blocker text) → `outstanding count`. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-006` — Record list | `embedded` variant, for the item set itself |
| `CMP-PLATFORM-012` — Evidence transfer item | `review` variant, where the item is evidence rather than a source fact — purpose-bound access, every view audited |
| `CMP-PLATFORM-014` — Sensitive confirmation | Where the item decision is authoritative (the `facts` variant's approve/reject, which creates or activates governed truth) |
| `CMP-PLATFORM-001` — State chip | Per item, for its own outcome state |

#### 6. Interaction dependencies

- **`IX-PLATFORM-018` — Field-bound validation and correction.** Every error, and every required reason on
  reject/request-change, is bound to the specific item it concerns, not collected only in a summary; the
  reviewer's own input survives entirely across a failed commit.
- **`IX-PLATFORM-008` — Progressive disclosure.** An item's full submitted detail and its provenance sit
  behind an explicit disclosure where the row itself would otherwise be too dense to scan.
- **`IX-PLATFORM-001` — Server-committed mutation.** Each per-item outcome is its own server-committed
  mutation: an idempotency key fixed at first submission, no re-submission of the same item's outcome
  while in flight, an authoritative re-read of the item's own state after commit.
- **`IX-AUDIT-001` — Sensitive decision capture and irreversibility.** Where the item's decision is
  authoritative (the `facts` variant), `CMP-PLATFORM-014` intervenes before the command reaches the
  server: states what this action is, what it will do, whether it can be undone, and what it affects; a
  reason is required; on commit, the decision, its reason, its actor and its time are recorded and the
  reason becomes the recorded **basis** `CMP-PLATFORM-013` later shows.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-005` — Validation | Canonical | The fixed formula for every field-level validation message: what is wrong, plus how to fix it, bound directly to the item's own field. |
| `TXT-PLATFORM-010` — Pending and review states | Canonical | Items awaiting verification carry the same non-accusatory pending formula; a positive-direction pending outcome and a negative one never share any visual element. |
| `TXT-PLATFORM-011` — Warnings | Canonical | A non-critical note on an item, distinct from a rejection reason. |
| `TXT-PLATFORM-016` — Permissions | Canonical | A denial for a reviewer outside their competence or assignment never names an internal permission key and never implies an override exists; a removed decision control is absent and explained, never merely disabled. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-001` — Complete keyboard operability, Profile A | The whole list is operable by keyboard, item by item, without a pointer (WCAG 2.1.1). |
| `A11Y-PLATFORM-012` — Native structural semantics | The item set carries real list/table structure, and an item's provenance is part of its accessible name, not a hover-only detail (WCAG 1.3.1). |
| `A11Y-PLATFORM-027` — Field-bound error association, summary, input preservation | The reason field carries a persistent visible label and its error is bound to it (WCAG 3.3.1, 3.3.3). |
| `A11Y-PLATFORM-011` — Live-region announcement policy | Recording an outcome keeps focus on the item and announces the outstanding count politely (WCAG 4.1.3). |
| `A11Y-PLATFORM-015` — No colour-alone communication | An item's outcome consumes the full tone/icon/emphasis triple (WCAG 1.4.1). |
| `A11Y-AUDIT-001` — Sensitive decision capture accessibility | On the `facts` variant, `CMP-PLATFORM-014`'s accessible description ties directly to the effect statement; the required reason field's error is bound; the confirm control's accessible name states the effect, not only the verb. |

#### 9. Canonical data/action contracts

This widget **owns no fixed `API-*`/`SDC-*` of its own** — Profile A only, so no `API-*` applies. Its data
source is "the owning review workspace's own contract." Phase 4 names three `SDC-*`, by ID only:

- **Profile A:** `SDC-IDENTITY-002` (Admin Clinic Onboarding Review Workspace — approve/reject, creates
  provider/branch/grant on approval; "approval must not activate services, assign scientific grade,
  directly set P/H/I, or publish the provider"), `SDC-IDENTITY-005` (Admin Legal-Basis Representation
  Verification — "approval is the **only** path that creates the grant"), `SDC-ELIG-002` (Admin
  Verification Workbench — "no direct editing of computed final S/P/H/I/eligibility").

#### 10. Shared application-layer prerequisites

- **`TASK-IDENTITY-002`** — "Implement Scoped Staff Grants and Resource Authorization" — the
  competence/assignment scope enforcement this widget's own `error-permission` state depends on: "policies
  must re-check active grants on each protected action."
- **`TASK-ELIG-001`** — "Implement Provider/Branch Verification Work Context" — a dependency of
  `TASK-ELIG-002`, giving verification staff a scoped operational context.
- **`TASK-ELIG-002`** — "Implement Approved Facts and Activation Evidence Decisions" — the most directly
  relevant prerequisite: "convert submitted evidence/source facts into governed approved/rejected fact
  records that can safely drive eligibility. Decision must record source, actor, reason, evidence,
  effective/expiry metadata, and affected scopes."
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001` (Admin panel).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `approved_facts` | Proposed | The `facts` variant's own destination: source, actor, reason, effective/expiry and a `supersedes_fact_id` link — once used in an immutable decision, a correction is a **new** fact, never a rewrite. |
| `evidence_items` / `evidence_bindings` | Proposed | The `evidence` variant's source, shared with `WGT-PLATFORM-008` (section 11 there). |
| `service_activation_requests` | Proposed | The upstream record `approved_facts` verify against; "no column accepts final S/P/H/I outcome entry." |
| `guardian_grants` | Proposed | The legal-basis grant table `SDC-IDENTITY-005`'s approval creates; the widget itself never writes to it directly — approval does, through the host command. |

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| Filament repeater or table, per-row outcome, required reason, custom provenance slot | `app/Filament/Resources/` (each owning review resource) | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host workspace's own contract) | View-model responsibility |
|---|---|
| Each item's submitted value and provenance | `items[i]: { value, provenance, outcome?, reason? }` — an item with unknown provenance is never offered for approval |
| Item outcome | `items[i].outcome: pending \| verified \| rejected \| change-requested` |
| Required reason on a negative outcome | `items[i].reason: string` — required for `rejected`/`change-requested`, becomes the applicant's own blocker text |
| Outstanding count | `outstandingCount: number`, derived — never counts an item whose state failed to load as verified |
| Reviewer competence/assignment | Resolved server-side; the view-model never receives an item outside the reviewer's own scope (section 16) |

No field is invented beyond what the host `SDC-*` workspace's own projection already carries.

#### 14. Refresh / caching / polling

Item outcomes refresh without losing an in-progress reason (section 18, `loading-refresh`). No polling
interval is specified or invented.

#### 15. Idempotency / correlation

**Applies per item.** Each item's outcome commit carries its own idempotency key, fixed at first
submission, under `IX-PLATFORM-001`; a retry of a failed per-item commit reuses that item's original key,
never a new one, under `IX-PLATFORM-002` (composed by reference). On the `facts` variant, `IX-AUDIT-001`'s
own correlation/audit requirement applies additionally: actor, time, reason and outcome are recorded
together as one append-only event per decided item.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` — the ten-dimension authorization
  model (section "1–10"), of which dimensions 6 ("workflow responsibility"), 7 ("subject-matter scope")
  and the "Verify source facts/evidence" row (assigned work item, organization/subject competence, no
  prohibited conflict) govern this widget directly; the pattern is stated at its clearest in the row
  denying a medically sensitive decision "without required clinical competence."
- **Server-side enforcement point:** the host workspace's own scoped query and policy check.
- **UI consequence:** "items outside the reviewer's competence or assignment are not offered, and a scope
  loss removes decision controls structurally" — never merely disabled.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `facts \| evidence \| changes` | Yes | none | Host archetype — `facts` (source-fact verification, creates governed truth), `evidence` (composes `CMP-PLATFORM-012` `review`), `changes` (itemised requests, one reason per item) | Never a fourth value |
| `items` | `Item[]` (section 13) | Yes | `[]` | Host's own read | An item with unknown provenance is never offered for approval |
| `outstandingCount` | number | Yes | derived | — | See section 13 |
| `onDecide` | callback | Yes | — | — | Per item; `facts` routes through `CMP-PLATFORM-014` first |
| `reasonRequired` | boolean | Yes | derived from outcome | — | `true` for `rejected`/`change-requested` |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The item set and its provenance load together; an item with unknown provenance is not offered for approval. |
| `loading-refresh` | Item outcomes refresh without losing an in-progress reason. |
| `empty-no-data` | Nothing assigned: stated plainly, with no decision control. |
| `empty-filtered` | Where the reviewer filters by competence or outcome, the filter is named as the cause. |
| `partial` | Some item states loaded and some did not; an unloaded item is never counted as verified and the completion count says so. |
| `stale` | Item outcomes with their as-of time; a decision is not committed against a stale item set. |
| `error-fetch` | Reviewer input preserved; retry in place. |
| `error-permission` | Items outside the reviewer's competence or assignment are not offered, and a scope loss removes decision controls structurally. |
| `success` | Item outcomes, with the outstanding count. |
| Offline / unstable | Rare on this profile; the same rule applies rather than a degraded one. Decision controls are withdrawn. |

#### 19. Lifecycle/state semantics

Each item's own outcome (`pending`/`verified`/`rejected`/`change-requested`) is a lifecycle status
resolved through `CMP-PLATFORM-001`, never invented per-screen. Where the `facts` variant's decision is
authoritative, the recorded reason becomes the **basis** `CMP-PLATFORM-013` renders on the resulting
record thereafter — this widget hands the data off; it does not itself perform that later binding, matching
`WGT-PLATFORM-007`'s own equivalent hand-off (its section 19).

#### 20. Tokens

`component.platform-013.*` (mandatory), conditional `component.platform-006.*` (`embedded`),
`component.platform-012.*` (`review`), `component.platform-014.*`, `component.platform-001.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-005`, `-010`, `-011`, `-016`. No canonical `ERR-*` string is restated.

#### 22. Accessibility contract

- **Role/name:** each item's accessible name carries its provenance and its current outcome together.
- **Focus:** recording an outcome keeps focus on the item; the outstanding count announces politely
  after.
- **Keyboard:** the whole list is operable item by item without a pointer.
- **Screen reader:** the reason field's error is bound to it; the outstanding count is announced as it
  changes.
- **No colour-only:** an item's outcome is never carried by tone alone.

#### 23. RTL / bidi

- Columns mirror.
- **Bidi isolation class: `id`.** Submitted values containing Latin identifiers, licence numbers and
  registration codes are bidirectionally isolated — a reordered licence number is a **wrong** licence
  number.

#### 24. Responsive behavior

- **Profile A only.** At `profile-a.content-width.wide` the item, value, provenance and outcome sit in one
  row; at `narrow` each item stacks with its value directly above its outcome, and the table's own bounded
  scroll is permitted while the page's is not.
- The submitted value and the reason wrap in full at any text size; neither truncates, because a reviewer
  comparing a truncated value is comparing the wrong thing.

#### 25. Immutability / historical safety

Once an item's decision commits, the resulting `approved_facts` row (or equivalent governed record) is
append-only: a later correction to the same fact creates a **new**, linked row via `supersedes_fact_id`,
never a rewrite of the decided one. This widget itself renders the **current** decision state per item; a
full decision history for one item, where needed, is `WGT-PLATFORM-006`'s concern, not this widget's.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- **Filament's own bulk approve is not registered.** This is the widget's own hard prohibition (section
  27, item 1) restated as a configuration rule: the framework's stock bulk-action affordance is never
  wired onto this list, for any variant.
- Filament's default confirm-only action modal is insufficient for the `facts` variant's required-reason
  decisions and is replaced by `CMP-PLATFORM-014`'s required-reason variant, matching the same
  configuration rule `WGT-PLATFORM-007` (section 26) already establishes.

#### 27. Prohibitions

1. A bulk approve or bulk reject control must never exist.
2. A global reject with no itemisation must never appear, forcing the applicant to redo the whole form.
3. An item whose provenance did not load must never be approved.
4. Evidence must never be used before its required scan succeeds.
5. A storage path, filename or scanner internal must never be exposed.
6. A rejection reason must never omit what the counterparty must do.

#### 28. Definition of Done

- [ ] Every outcome is recorded per item with its provenance and a reason where the outcome is negative.
- [ ] No bulk approve or bulk reject control exists on any of the six surfaces.
- [ ] A requested change is itemised, and the applicant surface locks everything that was not flagged.
- [ ] Evidence cannot be marked usable before its required scan succeeds.
- [ ] The outstanding count is accurate under a partial read and says so when it is not.
- [ ] None of the six prohibitions in section 27 is violated on any of the 6 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 12, predecessor
  `WGT-PLATFORM-001` declared, mandatory `CMP-PLATFORM-013` resolves.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — per-item outcome contrast in default/hover/focus, light mode.
- `node scripts/axe_audit.mjs <file>` — item accessible names including provenance, reason-field
  association, outstanding-count live region.
- `node scripts/verify_responsive.mjs <file>` — item stacking at `narrow`; bounded table scroll contained
  within its own container.

**Tier C (all: not run — requires implementation):**
- Live proof that no bulk approve/reject control is reachable through any interface, verified against the
  real Filament configuration — not run — requires implementation.
- Real competence/assignment scope enforcement proving an out-of-scope item is never offered for decision
  — not run — requires implementation.
- Screen-reader pass confirming the outstanding count announces correctly under a partial read — not run
  — requires implementation.
- A live retry with the original idempotency key producing exactly one committed per-item decision under
  contention — not run — requires implementation.

---

### WGT-PLATFORM-009 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-009
- **Name:** Attention and notification feed
- **Build order:** 13
- **Platforms:** C, A
- **Runtime:** RN feed (Proposed, path unverified) + Filament dashboard widget (Proposed, both panels)
- **Phase 4 realization:** Profile C `Native`; Profile A `Extended`
- **Screen reach:** 4 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-009` block

#### 2. Implements

- `FR-PLATFORM-001`
- `FR-BOOKING-003`
- `FR-CLINICAL-005`

#### 3. Used by

**4 screens**, confirmed against every row of `SCREEN_SPEC_MAP.md` (2 Patient, 1 Clinic, 1 Admin — not
"4 Patient dashboards": two placements are Profile A):

- **Patient app (2):** `SCR-PLATFORM-001` (Needs attention), `SCR-PLATFORM-009` (Notification centre).
- **Clinic panel (1):** `SCR-PLATFORM-003` (Clinic dashboard).
- **Admin panel (1):** `SCR-PLATFORM-004` (Admin dashboard).

#### 4. Widget dependencies

- **Required predecessors:** `WGT-PLATFORM-001` (build order 1, per **E1**) and `WGT-PLATFORM-002` (build
  order 3, per **E4** — "`WGT-PLATFORM-002` precedes `WGT-PLATFORM-009`": "the Profile A feed is scoped by
  `WGT-PLATFORM-002` rather than filtered," `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.5, build order 13,
  "Depends on: 1, 3"). The `WGT-PLATFORM-002` dependency is a **stated scoping relationship**, not a mere
  co-occurrence: the `panel-attention` variant's own scope comes from `WGT-PLATFORM-002`'s subject context,
  never from a filter this widget owns itself.
- **Not a build dependency:** the widget's own composition of `CMP-PLATFORM-006` for the list frame is a
  direct component reuse and does not require `WGT-PLATFORM-005` (which also composes `CMP-PLATFORM-006`)
  to exist first.

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-015` — Attention item | The whole widget. Variants: `attention` (the landing surface, ordered by what the case needs now, not recency), `notification` (the notification centre, chronological with read/unread, owning no business status of its own), `panel-attention` (Profile A dashboards, scoped by `WGT-PLATFORM-002` rather than filtered). Anatomy: `[ what needs you ][ status ][ remaining time ]` → `[ which record ]` — the link is always to the authoritative record. **The same obligation appears in `attention` and `notification` at the same time** — neither is a copy of the other, and neither may be the only place it appears, because no delivery transport may be relied on for correctness. |
| `CMP-PLATFORM-001` — State chip | Mandatory core alongside `CMP-PLATFORM-015` — every attention item's own status is rendered through the shared triple, never a status invented by the feed itself. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-005` — Deadline indicator | Where the item carries a deadline |
| `CMP-PLATFORM-006` — Record list | The list frame the feed's items sit inside |

#### 6. Interaction dependencies

- **`IX-BOOKING-001` — Deadline approach and expiry.** `CMP-PLATFORM-015` on the attention surface **and**
  the notification centre carries a running deadline; the duplication is deliberate — no delivery
  transport may be relied on for correctness, so the obligation must be discoverable without a message
  arriving. On closure while the surface is open, dependent actions are removed and focus moves to the
  statement of what happened. **A non-confirmation is never a punitive cancellation** — a booking closed
  because an alternative was declined or expired reads as an appointment that was not confirmed, with no
  penalty language.
- **`IX-PLATFORM-003` — Authoritative read refresh and staleness disclosure.** An entry created hours ago
  cannot be trusted about a deadline, so opening one **re-reads the authoritative record** before
  rendering its state, rather than trusting the cached feed entry.
- **`IX-PLATFORM-015` — List to detail and back.** Opening an item and returning restores focus to it; the
  detail surface reads authoritative state for that record, never the feed row's own projection.
- **`IX-PLATFORM-013` — Reduced-motion parity.** A newly arrived item's entrance and any value-change tick
  on `CMP-PLATFORM-005` both have a defined reduced-motion equivalent: travel removed, feedback preserved.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-001` — Voice and tone | Canonical | "An approaching deadline" row: clear about the remaining time, without provoking unwarranted panic — the governing tone rule, applied to this feed's highest-tension content. |
| `TXT-PLATFORM-007` — Empty states | Canonical | The Patient `between-cases` empty attention surface: near-empty, stated plainly, never manufacturing activity. |
| `TXT-PLATFORM-010` — Pending and review states | Canonical | Where an item's own status is pending/under-review, the same non-accusatory formula applies. |
| `TXT-PLATFORM-019` — Structural state and archetype copy | Canonical, `dashboard` row | "Any metric with no comparison basis is never shown alone; the last refresh always states its time" — the `panel-attention` variant's own dashboard-archetype obligation. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-011` — Live-region announcement policy | A newly arrived item is not announced merely for arriving; an item that changes what the actor can currently do is (WCAG 4.1.3). |
| `A11Y-PLATFORM-012` — Native structural semantics | The feed is exposed as a real list, one accessible name per item (WCAG 1.3.1). |
| `A11Y-PLATFORM-013` — Target size floor and comfortable floor | Every deadline-bearing item clears `semantic.size.target-primary`, the floor for every Patient primary action and every deadline-bearing action on any platform (WCAG 2.5.8). |
| `A11Y-PLATFORM-015` — No colour-alone communication | Remaining time and status are never carried by colour alone (WCAG 1.4.1). |
| `A11Y-PLATFORM-024` — Reduced-motion parity | The value-change tick on a running deadline has a defined reduced-motion equivalent (WCAG 2.3.3 informative extension). |

#### 9. Canonical data/action contracts

- **Profile C:** `API-PLATFORM-002` — Patient Notification Center. Status: **Proposed.** `GET /api/v1/
  notifications`, `POST /api/v1/notifications/{notification}/read`. **Entries are durable in-system
  records, independent of push/SMS/email delivery**, which remain optional adapters (`PO-UX-09`).
  **Reading or dismissing a notification never changes business state.** Every entry links to the
  authoritative resource rather than restating business state, "because an entry created hours ago cannot
  be trusted to describe a current deadline or eligibility state." Guardian access is filtered to the
  active grant scope.
- **Profile A:** `SDC-OPS-001` — Staff Work Queue. "Escalated and overdue are **flags, not states** — an
  item can be `IN_PROGRESS`, escalated and overdue at once, and the projection must expose all three
  independently."

#### 10. Shared application-layer prerequisites

- **`TASK-PLATFORM-013`** — "Implement Patient Notification and Attention Center" — the direct prerequisite
  implementing `API-PLATFORM-002` and the durable Patient surface: "entries are durable records
  independent of push/SMS/email adapters; mark-read touches only the read flag and must not be reachable
  as a business acknowledgement; store a reference to the authoritative resource rather than a copy of
  business state." Its own note: **"do not add a fifth primary navigation tab."** Dependencies:
  `TASK-PLATFORM-008`, `TASK-IDENTITY-007`, and the emitting domain tasks that create each notification
  intent.
- Same shared rendering-primitive prerequisite as every widget above: `TASK-PLATFORM-001`/`-005`
  (Filament), `TASK-PLATFORM-008` (React Native).

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `notification_intents` | Proposed | The **delivery-channel** tracking table only (push/SMS/email attempt state) — the optional adapter, never the source of correctness. |
| `work_items` | Proposed | Backs `SDC-OPS-001`'s projection for the `panel-attention` variant. |

**Gap, flagged and not resolved here:** `docs/database/ERD.md` defines **no dedicated table for the
durable in-app notification/attention record itself** — only its delivery-channel cousin
(`notification_intents`). `TASK-PLATFORM-013`'s own Data/Migration Impact line calls for a "new
notification entry table with read state" as still to be created. This contract does not invent that
table; it records the gap for `TASK-PLATFORM-013`'s own author to close.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| RN landing feed and notification centre, one shared item component | Patient React Native project — path not yet determined | Proposed, path unverified |
| Filament dashboard widget over the scoped work projection | `app/Filament/Widgets/` (Admin) / `app/Filament/Clinic/Widgets/` | Proposed |

#### 13. Data/view-model mapping

| Canonical concept (host projection) | View-model responsibility |
|---|---|
| The obligation itself | `items[i].obligation: string` — states the obligation, not the raw event ("a different time was offered and you have until X to decide", never "your booking changed") |
| Item's own status, where it carries one | `items[i].status` → `CMP-PLATFORM-001` |
| Deadline, where present | `items[i].deadline?: { at, variant }` → `CMP-PLATFORM-005` |
| Read state (`notification` variant only) | `items[i].read: boolean` — owns no business status |
| Linked authoritative record | `items[i].recordRef` — the link is always to the authoritative record, never a copy of its state |
| Represented subject, where the actor represents someone | `items[i].subject: string` — named in the item itself, not only in the header |

No field is invented — an item's deadline that failed to load is `items[i].deadline: "unavailable"`,
never a fabricated one (section 18, `partial`).

#### 14. Refresh / caching / polling

Items stay and a new item appends (section 18, `loading-refresh`); on the Patient surface, returning to
the app is itself a refresh trigger, per `IX-PLATFORM-003`. No polling interval is specified or invented.

#### 15. Idempotency / correlation

**Not applicable to the feed's own read.** Marking an entry read is naturally idempotent — repeated calls
create no additional effect (`API-PLATFORM-002` Idempotency/Concurrency) — and changes no business state.
The feed issues no other command of its own.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` — revocation/expiry "takes effect
  immediately" (general rule); `API-PLATFORM-002`'s own rule, "guardian access is filtered to the active
  grant scope."
- **Server-side enforcement point:** the notification/attention read query itself, scoped at read time —
  never filtered client-side after fetch.
- **UI consequence:** on `error-permission`, "items outside a revoked grant disappear with the scope change
  stated; never rendered as a quiet empty feed" — a scope loss is distinguishable from a genuinely empty
  feed.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `variant` | `attention \| notification \| panel-attention` | Yes | none | Host archetype | `panel-attention` is scoped by `WGT-PLATFORM-002`, never filtered |
| `items` | `Item[]` (section 13) | Yes | `[]` | Host's own read | `attention` orders by what the case needs now; `notification` orders chronologically |
| `onOpen` | callback | Yes | — | — | Re-reads the authoritative record before rendering the item's state |
| `onMarkRead` | callback | Only for `notification` | — | — | Changes only the read flag; never a business acknowledgement |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | Item skeletons; no count implied. |
| `loading-refresh` | Items stay; a new item appends. On the Patient surface, returning to the app is a refresh trigger. |
| `empty-no-data` | `CMP-PLATFORM-009` `between-cases` on Profile C: near-empty, says so plainly, and never manufactures activity. |
| `empty-filtered` | n/a on `attention`, which is scoped rather than filtered. Applies on `notification` where a read filter is offered. |
| `partial` | An item whose deadline did not load is shown without a fabricated one and says the remaining time is unavailable. |
| `stale` | The feed carries its as-of time. An entry written hours ago cannot be trusted about a deadline, so opening one re-reads the authoritative record. |
| `error-fetch` | Last known items preserved with retry. |
| `error-permission` | Items outside a revoked grant disappear with the scope change stated; never rendered as a quiet empty feed. |
| `success` | Items in the variant's order. |
| Offline / unstable | Last known items with as-of time. Opening an item states that the authoritative re-read needs a connection rather than showing the cached entry as current. |

#### 19. Lifecycle/state semantics

**The `notification` variant owns no business status of its own** — its read/unread flag is entirely
distinct from, and never merged with, the status shown by `CMP-PLATFORM-001` on the referenced record.
The `attention` and `panel-attention` variants render whichever status the linked record's own machine
carries, unmodified. A deadline's closure is never rendered as a punitive cancellation (`IX-BOOKING-001`);
where the underlying booking status resolves to `CANCELLED` for a no-penalty reason, that status's own
tone (`tone.restricted`, not `tone.danger`) is preserved, never overridden by this widget.

#### 20. Tokens

`component.platform-015.*` (mandatory), `component.platform-001.*` (mandatory), conditional
`component.platform-005.*`, `component.platform-006.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-001`, `-007`, `-010`, `-019`. No canonical `ERR-*` string is restated.

#### 22. Accessibility contract

- **Role/name:** each item is one link or button whose accessible name carries the obligation, the status
  and the deadline together, so a screen reader user does not have to enter the item to know whether it is
  urgent.
- **Focus:** opening an item and returning restores focus to it.
- **Keyboard:** the feed is exposed and traversable as a list.
- **Screen reader:** unread is announced, not only tinted; marking read announces nothing and changes no
  business state; a newly arrived item that changes what the actor can currently do is announced, one that
  merely arrived is not.
- **No colour-only:** remaining time and status are legible without colour.

#### 23. RTL / bidi

- Items flow start to end and mirror.
- **Bidi isolation classes: `date`, `id`.** Remaining time and record identifiers are bidirectionally
  isolated.

#### 24. Responsive behavior

- **Profile C:** one item per reading-column block.
- **Profile A:** the feed is a dashboard region that keeps its full item text at
  `profile-a.content-width.narrow` rather than compressing to an icon and a count.

#### 25. Immutability / historical safety

This widget renders no immutable or append-only entity directly — its items are **references** to the
authoritative record, never a copy of its state (section 13). Marking an entry read is the widget's only
own write, and it changes read state alone, never the referenced record's own history.

#### 26. Framework defaults to disable

Profile A, `Extended`:

- Filament's notification centre is used to hold the **duplicate** entry for anything deadline-bearing —
  it is not treated as the sole source, consistent with `CMP-PLATFORM-015`'s own "duplication is
  deliberate" rule; a dashboard widget that surfaces only Filament's own toast history, with no durable
  backing record, is insufficient.

#### 27. Prohibitions

1. A control here must never read as accepting, acknowledging or deciding anything.
2. A business status must never be owned by the feed rather than by the referenced record.
3. A deadline must never be rendered by colour alone.
4. A remaining time must never be fabricated.
5. Activity must never be manufactured on an empty attention surface.
6. Delivery must never be treated as the mechanism a deadline's correctness depends on.

#### 28. Definition of Done

- [ ] Every deadline-bearing item appears on both the attention surface and the notification centre.
- [ ] Marking an entry read changes no business state and no control here implies otherwise.
- [ ] Opening an entry re-reads the authoritative record before rendering its state.
- [ ] Remaining time is legible without colour.
- [ ] With nothing pending, the Patient surface is near-empty and says so.
- [ ] None of the six prohibitions in section 27 is violated on any of the 4 surfaces.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 13, predecessors
  `WGT-PLATFORM-001`/`-002` declared, mandatory `CMP-PLATFORM-015`/`-001` resolve.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — item/status/deadline contrast in default/hover/focus, light
  mode.
- `node scripts/axe_audit.mjs <file>` — list role, item accessible names, unread announcement.
- `node scripts/verify_responsive.mjs <file>` — full item text retained (no icon-and-count compression) at
  `profile-a.content-width.narrow`.

**Tier C (all: not run — requires implementation):**
- Real duplication proof: every deadline-bearing intent produces an entry on both the attention surface
  and the notification centre, verified against a live emitting domain task — not run — requires
  implementation.
- Live proof that mark-read changes no business state, verified against the real API — not run — requires
  implementation.
- Screen-reader pass confirming a newly arrived item that changes the actor's available actions is
  announced, and one that merely arrived is not — not run — requires implementation.
- Real revoked-grant filtering proving items disappear with the scope change stated, not as a quiet empty
  feed — not run — requires implementation.

---

### WGT-PLATFORM-012 — Implementation Contract

#### 1. Identity

- **WGT ID:** WGT-PLATFORM-012
- **Name:** Submission reconciliation panel
- **Build order:** 14
- **Platforms:** C
- **Runtime:** React Native, patient project root (Proposed, path unverified)
- **Phase 4 realization:** Profile C `Native`; Profile A `n/a`
- **Screen reach:** 1 of 165
- **Source specification:** `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`, `WGT-PLATFORM-012` block

**Allocation note, carried from Phase 4 and not re-derived here:** this widget is allocated under the
second clause of criterion 1 — "one context, high consequence, substantial complexity." It composes four
components, implements two interaction patterns end to end, spans three domains, and encodes the rule
that a retry reuses its original key while a new intent does not; left unspecified it would be
re-derived per domain, which is how the duplicate this product exists to prevent gets created.

#### 2. Implements

- `FR-PLATFORM-001`
- `FR-BOOKING-001`
- `FR-FINANCE-002`
- `NFR-AUDIT-002`

#### 3. Used by

**1 screen** — `SCR-PLATFORM-002` (Pending submissions), `WF-PLATFORM-002`, Patient app.

#### 4. Widget dependencies

- **Required predecessors:** `WGT-PLATFORM-001` (build order 1, per **E1**) and `WGT-PLATFORM-003` (build
  order 2, per **E5** — "`WGT-PLATFORM-003` precedes `WGT-PLATFORM-012`": its `inline` and `banner`
  variants "belong to `WGT-PLATFORM-003`," and Profile A "reconciles in place through
  `WGT-PLATFORM-003`," `PHASE_05_IMPLEMENTATION_PLAN.md` section 6.5, build order 14, "Depends on: 1, 2").
- **Examined and rejected as an edge:** `WGT-PLATFORM-011` names this widget only to explain why
  `WGT-PLATFORM-011` itself is `n/a` on Profile C — "`PHASE_05_IMPLEMENTATION_PLAN.md` section 6.2
  explicitly rejects this exact mention: "neither is a build dependency and neither is drawn as one."

#### 5. Component dependencies

**Mandatory core:**

| `CMP-*` | Role here |
|---|---|
| `CMP-PLATFORM-011` — Submission state indicator | The `queue` variant — "the Patient pending-submissions surface, listing every outstanding mutation." This **is** the surface the `queue` variant exists for; no second variant applies here, because `inline` and `banner` belong to `WGT-PLATFORM-003`. |
| `CMP-PLATFORM-006` — Record list | The list frame, one row per outstanding command. |

**Conditional:**

| `CMP-*` | Composed when |
|---|---|
| `CMP-PLATFORM-001` — State chip | Per reconciled record, once its authoritative state is known |
| `CMP-PLATFORM-010` — Recovery state | `unknown-outcome` variant — "no new command is offered until the outcome is reconciled" |
| `CMP-PLATFORM-002` — State summary | For the reconciled state, once resolved |

#### 6. Interaction dependencies

- **`IX-PLATFORM-004` (owner) — Resume and reconcile an unknown outcome.** The surface renders
  `CMP-PLATFORM-010`'s `unknown-outcome` variant; **no new command of the same intent is offered** — not a
  retry labelled as a new submission, not the original action re-enabled; reconciliation reads
  authoritative state for the affected record; the outcome is one of three — committed, did not commit, or
  still unknown — each stated plainly; only once the outcome is known does the surface restore its normal
  action set. If reconciliation itself fails, the submission stays outstanding and visible rather than
  being quietly dropped. Focus moves to the unknown-outcome block when it replaces the action region,
  because leaving focus on a control that no longer acts is how a keyboard user submits twice.
- **`IX-PLATFORM-002` — Idempotent retry.** Retry reuses **the original key**; a new key is a new intent
  and is never issued automatically; where the server replays a prior outcome, the interface says the
  submission had already been received rather than implying the retry caused it.
- **`IX-PLATFORM-001` — Server-committed mutation.** Each outstanding entry is itself the record of a
  server-committed mutation whose idempotency key was fixed at first submission; this panel is that
  contract's durable, cross-session home.
- **`IX-PLATFORM-003` — Authoritative read refresh and staleness disclosure.** The panel **never** reports
  from its local queue alone — every reconciliation is an authoritative read, on entry, on refocus, and on
  explicit refresh.

#### 7. Content dependencies

| `TXT-*` | Ownership | Applies to |
|---|---|---|
| `TXT-PLATFORM-008` — Loading states | Canonical | Reconciliation in progress is named as reconciliation, never a generic "loading," and never presented as unknown or as failed while genuinely in progress. |
| `TXT-PLATFORM-009` — Offline and weak network | Canonical | Outstanding commands persist across app restarts and reconcile on reconnection — "stale and labelled is better than empty"; a retry never presents an attempt count as a penalty. |
| `TXT-PLATFORM-010` — Pending and review states | Canonical | An outstanding, not-yet-reconciled entry uses the same non-accusatory pending formula, distinct in tone and icon from a genuinely failed one. |
| `TXT-ERR-AUDIT-001` — ERR-AUDIT-001 · Idempotency key conflict | Canonical | Not user-recoverable by another retry; the supporting copy directs the actor to refresh and confirm current state before deciding whether the original action still stands — never resolved by re-submitting under the same key. |

#### 8. Accessibility dependencies

| `A11Y-*` | Implementation assertion |
|---|---|
| `A11Y-PLATFORM-011` — Live-region announcement policy | A reconciled outcome is announced politely; an unknown outcome is announced as unknown, never as failed (WCAG 4.1.3). |
| `A11Y-PLATFORM-006` — Focus movement after mutation | Focus moves to the resolved row once reconciliation completes (WCAG 2.4.3). |
| `A11Y-PLATFORM-012` — Native structural semantics | The panel is exposed as a real list (WCAG 1.3.1). |
| `A11Y-PLATFORM-015` — No colour-alone communication | Unknown, failed and completed are three distinct states carried by wording and icon as well as tone, never colour alone (WCAG 1.4.1). |

#### 9. Canonical data/action contracts

This widget **owns no contract of its own, deliberately** — a client-side queue that was its own source
of truth would be a second source of truth. It reconciles against the authoritative reads its outstanding
commands themselves belong to, by ID only:

- `API-BOOKING-002` (List My Bookings — read-only, scoped, state/date filters).
- `API-CLAIMS-003` (List Case Claims/Refund Requests — read-only, scoped, states/deadlines).
- `API-FINANCE-005` (Get Case Financial Timeline — read-only; "wording must not imply platform custody or
  settlement").

No document allocates an `API-PLATFORM-*` (or similar) endpoint dedicated to this widget; a check of
`docs/api/API_CONTRACTS.md` and `docs/TRACEABILITY_MATRIX.md` confirms zero direct references to
`WGT-PLATFORM-012` anywhere outside this contract and the Phase 4/5 planning documents themselves.

#### 10. Shared application-layer prerequisites

- **`TASK-PLATFORM-008`** — "Bootstrap and Baseline the React Native Patient Application" — the RN project
  itself does not yet exist; this is a hard precondition for any of this widget's own code.
- **`TASK-AUDIT-003`** — "Implement Patient API Idempotency, Correlation, and Stable Error Envelope" —
  "same idempotency key + same command returns original committed outcome; materially different reuse
  returns `ERR-AUDIT-001`" — the exact contract this widget's own reconciliation and retry logic depends
  on.
- **`TASK-PLATFORM-009`** — "Build the Shared Mobile API, Cache, and Network-Recovery Layer" — "on
  mutation timeout, fetch authoritative resource before issuing a new command" — the direct mechanism this
  widget's owning `IX-PLATFORM-004` sequence is built on. Dependencies: `TASK-PLATFORM-008`,
  `TASK-IDENTITY-006`, `TASK-AUDIT-003`.

#### 11. Data model prerequisites

| Entity | Status | Relevance |
|---|---|---|
| `idempotency_records` | Proposed | The server-side backing for the idempotency contract this widget's reconciliation logic depends on; unique on (`actor_user_id`, `operation`, `scope_key`, `idempotency_key`); a different payload fingerprint on the same key is rejected. |

`NFR-AUDIT-002` (Concurrency and Idempotency) is the governing non-functional requirement: "identical
actor/operation/scope/key/payload produces exactly one committed side effect and original response; same
key/different payload is deterministically rejected; zero overbooking, duplicate acceptances, duplicate
financial events... under tested contention." This widget's entire purpose is to make that guarantee
**visible and actionable** to the Patient actor, never to implement it itself — implementation is
server-side, in `idempotency_records` and its owning services.

#### 12. Target files

| Target area | Path | Status |
|---|---|---|
| Durable outstanding-command store, reconciled on resume | Patient React Native project — path not yet determined | Proposed, path unverified |

**Confirmed:** no React Native Patient project exists anywhere in the repository at the time of this
contract — the only `package.json` in the tree is `UberTip-Backend/package.json` (Laravel/Filament
front-end build tooling), consistent with `PHASE_05_IMPLEMENTATION_PLAN.md`'s own statement that
"`TASK-PLATFORM-008` owns that bootstrap and must record the real commands before downstream mobile tasks
use them."

#### 13. Data/view-model mapping

| Canonical concept (the outstanding command itself) | View-model responsibility |
|---|---|
| What was asked for | `entries[i].description: string` — wraps in full, never truncated |
| When it was issued | `entries[i].issuedAt: string` |
| Current state | `entries[i].state: pending \| reconciling \| unknown \| completed \| failed` |
| Reconciled outcome, once resolved | `entries[i].outcome?: AuthoritativeRecord` → the authoritative record, never the local queue's own guess |
| Original idempotency key | `entries[i].idempotencyKey: string` — fixed at first submission, reused on retry |

No field is invented — the panel reads authoritative state before rendering any outcome (section 18,
`loading-initial`).

#### 14. Refresh / caching / polling

Reconciliation in progress is shown as in progress, not as unknown and not as failed (section 18,
`loading-refresh`). Outstanding commands persist across app restarts and reconcile on reconnection
without the actor having to remember (section 18, offline/unstable — the load-bearing condition). No
polling interval is specified; reconciliation is triggered by `IX-PLATFORM-003`'s four moments (entry,
refocus, explicit refresh, post-mutation).

#### 15. Idempotency / correlation

**This widget is the archetypal committing-adjacent surface — the visible face of the idempotency
contract itself**, though the panel issues no *new* command of its own until an outcome is known.

- **Idempotency applies:** yes, to every retry of an outstanding entry.
- **Key fixed at first submission**, unchanged across a retry of the same intent — never regenerated by
  this panel.
- **Key reuse on retry:** `IX-PLATFORM-002` — reuses the original key; a materially different retry is
  rejected under `ERR-AUDIT-001`, never silently accepted as a correction.
- **Unknown-outcome path:** `IX-PLATFORM-004` — no new command is offered until reconciled.
- **Correlation/audit requirement:** `FR-AUDIT-003`/`NFR-AUDIT-002`. Exactly one committed side effect per
  actor/operation/scope/key/payload, verified server-side by `idempotency_records`; this widget's own
  obligation is honest display of that guarantee's outcome, never a second implementation of it.

#### 16. Permission gate

- **Canonical permission source:** `docs/domain/PERMISSIONS_MATRIX.md` — revocation/expiry "takes effect
  immediately" (general rule).
- **Server-side enforcement point:** each reconciled read's own authorization check (`API-BOOKING-002`,
  `API-CLAIMS-003`, `API-FINANCE-005`).
- **UI consequence:** "scope lost since the command was issued: the panel states that and offers no
  retry" — a permission loss is distinguished from an unknown outcome, never conflated with it.

#### 17. Props / configuration

| Name | Type | Required | Default | Source | Notes |
|---|---|---|---|---|---|
| `entries` | `Entry[]` (section 13) | Yes | `[]` | Durable local store, reconciled against authoritative reads | Never the sole source of truth |
| `onReconcile` | callback | Yes | — | — | An authoritative read, never a client-side guess |
| `onRetry` | callback | Yes, per unresolved entry | — | — | Reuses the entry's own original idempotency key |

#### 18. State rendering

| State | Behaviour |
|---|---|
| `loading-initial` | The panel reads authoritative state before rendering any outcome. It never reports from its local queue alone. |
| `loading-refresh` | Reconciliation in progress is shown as in progress, not as unknown and not as failed. |
| `empty-no-data` | Nothing outstanding: stated plainly. This is the normal case and is not an error. |
| `empty-filtered` | n/a. The panel is not filtered. |
| `partial` | Some commands reconciled and some did not; the unreconciled ones stay unknown and offer no new command. |
| `stale` | A reconciliation read that failed leaves the command unknown with its as-of time. Unknown is a designed state, not an absence of information. |
| `error-fetch` | Retry the reconciliation read, not the command. The distinction is the whole point. |
| `error-permission` | Scope lost since the command was issued: the panel states that and offers no retry. |
| `success` | The authoritative record, reachable, with the local entry cleared. |
| Offline / unstable | The load-bearing condition. Outstanding commands persist across app restarts and reconcile on reconnection without the actor having to remember. |

#### 19. Lifecycle/state semantics

An entry's own `pending`/`reconciling`/`unknown`/`completed`/`failed` state is `CMP-PLATFORM-011`'s own
submission-state vocabulary, not a business lifecycle status — once an entry's outcome resolves, the
**reconciled record's own** status (a booking, claim or financial event's own machine) takes over,
rendered through `CMP-PLATFORM-001`/`-002`. This widget never invents a business status of its own for
what a reconciled record has become; it renders the queue state up to the point of resolution and then
hands off entirely.

#### 20. Tokens

`component.platform-011.*` (mandatory, `queue` variant), `component.platform-006.*` (mandatory),
conditional `component.platform-001.*`, `component.platform-010.*` (`unknown-outcome`),
`component.platform-002.*`.

#### 21. Content

Resolves to `TXT-PLATFORM-008`, `-009`, `-010`, `TXT-ERR-AUDIT-001`. No other canonical `ERR-*` string is
restated; each reconciled record's own error surface is that record's own owning contract's concern.

#### 22. Accessibility contract

- **Role/name:** the panel is exposed as a real list; each row's accessible name carries what was asked
  for and its current state.
- **Focus:** a reconciled outcome moves focus to the resolved row; an unknown-outcome block, when it
  replaces the action region, receives focus directly.
- **Keyboard:** reconcile and retry are both real, reachable controls.
- **Screen reader:** a reconciled outcome is announced politely; an unknown outcome is announced as
  unknown, never as failed.
- **No colour-only:** unknown, failed and completed are three distinct announced states, never carried by
  tone alone.

#### 23. RTL / bidi

- Rows mirror.
- **Bidi isolation classes: `date`, `id`.** Timestamps and record identifiers are bidirectionally
  isolated.

#### 24. Responsive behavior

- **Profile C only**, one row per reading-column block; the retry control never falls below
  `semantic.size.target-floor`, the comfortable target floor.
- The description of what was asked for wraps in full at any text size; the outcome is never truncated.

#### 25. Immutability / historical safety

This widget's own local entries are transient by design — cleared once reconciled (section 18, `success`)
— and carry no immutability obligation of their own. What they reconcile **against** may itself be one of
the nine immutable/append-only entities (a `booking_events` row, a `financial_events` row); this widget
never writes to those directly and never presents an unreconciled local guess as if it were that
authoritative record.

#### 26. Framework defaults to disable

**Not applicable — Profile A `n/a`.** This widget has no Filament realization and therefore no framework
default to configure or disable; its only runtime is React Native, where no comparable stock default
exists to override.

#### 27. Prohibitions

1. A new command must never be offered while an outcome is unknown.
2. A retry must never mint a new idempotency key.
3. An outcome must never be reported from the local queue without an authoritative read.
4. An unknown outcome must never be presented as a failure.
5. An entry that has not reconciled must never be cleared.

#### 28. Definition of Done

- [ ] No new command is offered against a record whose prior outcome is unknown.
- [ ] A retry carries the original idempotency key; a changed intent carries a new one.
- [ ] Outstanding entries survive an app restart and reconcile on reconnection.
- [ ] An outcome is reported only after an authoritative read, never from the local queue.
- [ ] Unknown, failed and completed are three distinct announced states.
- [ ] None of the five prohibitions in section 27 is violated on the single surface this widget occupies.

#### 29. Verification

**Tier A:**
- `python docs/ux/scripts/validate_ux_docs.py --phase 5` — contract exists, build order 14, predecessors
  `WGT-PLATFORM-001`/`-003` declared, mandatory `CMP-PLATFORM-011`/`-006` resolve.
- `python docs/scripts/validate_docs.py`, `python scripts/check_no_emoji.py` (root and `docs`).

**Tier B:**
- `node scripts/verify_states.mjs <file>` — unknown/failed/completed contrast in default/hover/focus,
  light mode.
- `node scripts/axe_audit.mjs <file>` — list role, row accessible names, unknown-outcome announcement.
- `node scripts/verify_responsive.mjs <file>` — retry-control target-floor compliance at the narrow
  verification widths.

**Tier C (all: not run — requires implementation, and blocked on `TASK-PLATFORM-008`'s RN bootstrap):**
- Real app-restart persistence and reconnection reconciliation, verified on the actual React Native client
  once it exists — not run — requires implementation.
- Live proof that a retry under contention with the original idempotency key produces exactly one
  committed record, never a duplicate — not run — requires implementation.
- Screen-reader pass confirming unknown/failed/completed announce as three genuinely distinct states —
  not run — requires implementation.
- Real scope-loss-mid-flight proof that the panel states the loss and offers no retry, rather than
  presenting it as an unknown outcome — not run — requires implementation.

---


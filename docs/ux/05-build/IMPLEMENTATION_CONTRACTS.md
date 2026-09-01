# UX Phase 5 Implementation Contracts

**Phase:** UX 5 — Build and Handoff
**Session:** 3 of 7 — foundation implementation contracts, build order 1–7
**Input gates:** `docs/ux/05-build/PHASE_05_IMPLEMENTATION_PLAN.md` (Session 1, complete),
`docs/ux/05-build/figma/BUILD_MANIFEST.json` and `docs/ux/05-build/figma/NAMING.md` (Session 2, complete).
**This session writes:** the seven foundation contracts — `WGT-PLATFORM-001`, `-003`, `-002`, `-004`,
`-005`, `-010`, `-007` — in that build order. Contracts 8–30 are not authored here; Session 4 writes
build order 8–14 and Session 5 writes the sixteen domain contracts, 15–30.

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


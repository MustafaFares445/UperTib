# UberTib Widget Inventory

**Phase:** UX 4 — Widget and Screen Specifications
**Owns:** which widgets exist, the rule that allocated them, their measured reach, and the candidates
that were considered and refused.
**Blocks live in:** `WIDGET_SPECS_PLATFORM.md` (the 14 cross-cutting blocks) and
`WIDGET_SPECS_DOMAIN.md` (the 16 domain blocks).
**Placement:** `SCREEN_SPEC_MAP.md` is the authoritative `SCR-*` to `WGT-*` relation, one row per screen,
all 165.

Authority is unchanged. Phase 3 owns the component taxonomy, the interaction patterns, the content
system, the tokens and the accessibility obligations. This file owns nothing they own.

---

## 1. What a `WGT-*` is

**A `WGT-*` is an implementation-facing composition, not a component.** A `CMP-*` answers *what is this
thing and what must it never do*. A `WGT-*` answers *what is actually built here, out of which
components, driven by which interaction pattern, over which data contract, behaving how in each of the
nine data states*.

The one-line test applied to every block below: **if it could be written without naming another
component, it is a component and does not belong in this file.**

| | `CMP-PLATFORM-007` | `WGT-PLATFORM-004` |
|---|---|---|
| Kind | Semantic component | Implementation composition |
| Says | A filter and search bar exists, has five variants, and a filtered-empty result is not an empty set | The toolbar as built: search control, persisted filter set, applied-filter summary, result count, and the wiring that makes the two empty states actually differ |
| Owns | Anatomy, variants, required states, token mapping, per-profile realization | Placement, sequence, data dependency, per-state behaviour, per-profile realization detail, acceptance criteria |

### 1.1 The allocation rule

All four must hold.

1. **Two meaningful contexts**, or **one high-consequence context whose implementation complexity is
   substantial enough that leaving it unspecified guarantees divergence.**
2. It **composes multiple `CMP-*`**, or carries screen-level behaviour no single component owns.
3. Independent re-implementation per screen would create **drift with a named consequence**.
4. It has a **stable semantic purpose**.

Two widgets are allocated under the second clause of criterion 1 and both say so in their own blocks:
`WGT-PLATFORM-012` and `WGT-POLICY-002`. Neither is a screen wearing a widget identifier; both are
compositions whose behaviour is fixed by canonical rules that would otherwise live only in prose.

### 1.2 Identifier convention

`WGT-<DOMAIN>-<NNN>`, append-only, over the same twelve product domains as every other family. No
thirteenth domain. `PLATFORM` is used for cross-cutting compositions; a domain key is used only where
the widget owns domain-specific behaviour. **No screen number is encoded into any widget identifier.**

### 1.3 The composed-component core, and why it is verified rather than asserted

Every block declares a **mandatory core** of `CMP-*` it always composes, plus components it composes
*where the surface binds them*. The mandatory core of every widget was checked against
`WIREFRAME_COMPONENT_MAP.md` on **every screen the widget is placed on**: 30 widgets, zero mismatches.

This matters because a widget that composes a component the Phase 3 map does not bind on that wireframe
would be a silent extension of a completed gate. Six such mismatches were found during the audit and all
six were resolved by **correcting the Phase 4 placement**, never by editing the Phase 3 binding. The six
are recorded in section 6.

---

## 2. Allocation registry — 30 widgets

Reach is **measured from `SCREEN_SPEC_MAP.md`**, not estimated. It counts screens on which the widget is
placed, out of 165.

### 2.1 Cross-cutting

| ID | Name | Reach | Platforms | The problem it exists to solve once |
|---|---|---:|---|---|
| `WGT-PLATFORM-001` | Structural state region | 165 | C, A | Nine data states, one fixed precedence. Resolving it per screen would produce 165 slightly different answers to "is this empty or broken". |
| `WGT-PLATFORM-002` | Subject context bar | 156 | C, A | Whose record, on whose authority — and the mid-session loss of that authority, which is a server truth arriving at an arbitrary moment. |
| `WGT-PLATFORM-003` | State-gated action region | 161 | C, A | The hidden / unavailable / disabled resolution, plus the commit contract. A forbidden action rendered as a disabled control implies an override that does not exist. |
| `WGT-PLATFORM-004` | Filter and result toolbar | 39 | C, A | Filter persistence and the two empty states, wired together so a surface cannot filter without them. |
| `WGT-PLATFORM-005` | Lifecycle record list | 85 | C, A | Rows over governed projections, with no generic edit or delete over immutable entities, and flags that render beside the status instead of recolouring it. |
| `WGT-PLATFORM-006` | Decision-bearing event timeline | 33 | C, A | Append-only history with bounded reads and no edit affordance reachable from it, by construction. |
| `WGT-PLATFORM-007` | Sensitive decision confirmation | 38 | C, A | Reason capture, stated effect, stated irreversibility, and one action role reading the same way in the trigger and the confirmation. |
| `WGT-PLATFORM-008` | Evidence transfer panel | 9 | C, A | Eight session states with retryable transfer failure structurally separate from authoritative rejection, and a hard stop at the vendor boundary. |
| `WGT-PLATFORM-009` | Attention and notification feed | 4 | C, A | The duplication rule that makes push, SMS and email optional adapters rather than load-bearing infrastructure. |
| `WGT-PLATFORM-010` | Validation and correction region | 62 | C, A | Field-bound server-authoritative validation that never destroys input, on the 62 committing form and workspace surfaces. |
| `WGT-PLATFORM-011` | Draft continuity bar | 10 | C, A | A resumable draft that is not a submitted record, on the ten surfaces where abandoning would cost the actor real work. |
| `WGT-PLATFORM-012` | Submission reconciliation panel | 1 | C | The user-visible face of the idempotency contract: why a timeout never becomes a duplicate booking. |
| `WGT-PLATFORM-013` | Itemized verification list | 6 | A | Per-item verify, reject and request-change with provenance, so a decision is the sum of verified items and not one global judgement. |
| `WGT-PLATFORM-014` | Before-and-after disclosure block | 15 | C, A | Original against amended, for a patient deciding whether to re-accept and an administrator inspecting a governed change. One composition, six audiences. |

### 2.2 Domain

| ID | Name | Reach | Platforms | The problem it exists to solve once |
|---|---|---:|---|---|
| `WGT-IDENTITY-001` | Verification challenge form | 6 | C, A | Send throttling, attempt exhaustion and expiry as three different recoveries, with accessible authentication and no cognitive test. |
| `WGT-IDENTITY-002` | Authorization grant panel | 13 | C, A | The exact scope being granted, made legible before it is granted, and revocation that stays reachable regardless of downstream state. |
| `WGT-ELIG-001` | Provider option set | 5 | C | One attribute set as a row, a card, a comparison column and a chosen echo — with no composite score in any of the four. |
| `WGT-ELIG-002` | Eligibility decision block | 13 | C, A | The controlling reason in the audience's terms, with pending evaluation visibly distinct from a negative outcome and no internal symbol reachable. |
| `WGT-BOOKING-001` | Slot and capacity selector | 4 | C, A | Advisory availability that is resolved atomically at commit, so a disappearing slot is a designed path and not an anomaly. |
| `WGT-BOOKING-002` | Proposal without displacement | 4 | C, A | The original confirmed appointment stays authoritative until acceptance commits. Showing the proposal as though it were the appointment is the failure this exists to prevent. |
| `WGT-CLINICAL-001` | Treatment plan authoring section | 2 | A | Required structure retained while repeated entry is reduced, with no free-text surcharge field anywhere in it. |
| `WGT-CLINICAL-002` | Treatment plan reader | 7 | C, A | Every amount naming its category, its reason and what it covers, in four audiences, at full contrast when historical. |
| `WGT-CLINICAL-003` | Stage execution panel | 4 | C, A | Per-stage requirements resolved from the accepted snapshot, and a reopening that reads as a recorded correction rather than an erasure. |
| `WGT-CATALOG-001` | Launch gate panel | 4 | A | Four gate types, four accountable owners, and `expired` reading as a lapse rather than a rejection. |
| `WGT-POLICY-001` | Governed version and lifecycle bar | 16 | A | Which version, effective when, past which review gate, with history readable. Configurable does not mean instant or unreviewed. |
| `WGT-POLICY-002` | Market observation entry grid | 1 | A | High-throughput append-only entry that keeps every provenance field, and a calibration state that never reaches a patient or a provider. |
| `WGT-OPS-001` | Work queue row and list | 8 | A | Five states plus two independent flags, on the row a supervisor most needs to find. |
| `WGT-OPS-002` | Operational metric and reporting block | 5 | A | Every metric declaring its population, window, freshness and comparison basis, with a non-visual equivalent that is not an afterthought. |
| `WGT-FINANCE-001` | External financial event ledger | 5 | C, A | Agreed, reported, confirmed, disputed, refunded and pending-external-execution as six visibly distinct things, and no implication of custody. |
| `WGT-CLAIMS-001` | Claim evidence and deadline panel | 4 | C, A | Per-requirement evidence states with reasons, and an effective deadline whose history is appended rather than replaced. |

**Total: 30.** 14 cross-cutting, 16 domain. Every widget is placed on at least one screen and every one
appears in `SCREEN_SPEC_MAP.md`, which closes the placement relation in both directions.

### 2.3 Distribution

| Widgets on one screen | Screens |
|---:|---:|
| 2 | 5 |
| 3 | 8 |
| 4 | 21 |
| 5 | 64 |
| 6 | 34 |
| 7 | 23 |
| 8 | 9 |
| 10 | 1 |

Minimum 2, maximum 10, mean 5.1. **No screen uses zero widgets**, because
`WGT-PLATFORM-001` is a required structural obligation on all 165 — the same reason
`CMP-PLATFORM-009` and `-010` reach 165 in Phase 3. The maximum is `SCR-CLAIMS-007`, clinic claim
response and evidence, which is simultaneously a claim panel, an evidence transfer surface, a
deadline-history disclosure, a draft-bearing form and a validation surface. That is the right shape for
the maximum to have.

---

## 3. Composition, so the set stays a system

Widgets compose components. They do **not** compose each other, with one deliberate exception recorded
here rather than left to be discovered:

```
WGT-PLATFORM-001   structural state region     is resolved BEFORE any other widget renders content.
                                               Every other block states what it does under each state
                                               rather than re-implementing the precedence.
WGT-PLATFORM-003   state-gated action region   HOSTS the trigger for WGT-PLATFORM-007, which owns the
                                               confirmation. Trigger and confirmation are one action
                                               role in two moments, never two roles.
```

Everything else is flat. A widget that needed to nest another widget would be a template, and templates
are a Phase 5 concern.

---

## 4. Required states

Every widget block declares behaviour for all nine data states plus the offline condition. A state that
cannot occur on that widget is declared with its reason, never omitted:

`loading-initial` · `loading-refresh` · `empty-no-data` · `empty-filtered` · `partial` · `stale` ·
`error-fetch` · `error-permission` · `success` · offline / unstable connectivity

The **precedence between them is not restated anywhere**. `IX-PLATFORM-017` owns it and Phase 4 inherits
the decision rather than making it 30 times.

---

## 5. The four candidates Phase 3 deferred here by name

`COMPONENT_INVENTORY.md` section 8 deferred exactly four things to Phase 4. All four are resolved.

| Phase 3 candidate | Phase 3 disposition | Phase 4 resolution |
|---|---|---|
| Comparison view | "Phase 4 widget" | **`WGT-ELIG-001`**, as the `column` variant. Not its own widget: it is the same attribute set in a third arrangement, and giving it a separate identifier would let the three arrangements drift apart, which is exactly what `PO-UX-04` fixes the attribute set to prevent. |
| Market-observation entry grid | "Phase 4 widget" | **`WGT-POLICY-002`**, allocated under the one-high-consequence-context clause. |
| Dashboard composition | "Phase 4 template" | **Not a widget.** The five dashboards compose `WGT-PLATFORM-009`, `WGT-OPS-001` and `WGT-OPS-002` over a scoped projection. What differs between them is scope and ordering, which is screen specification, not a widget. |
| Stat tile, metric card, chart | "Phase 4" | **`WGT-OPS-002`**, one widget with a tile, series and table representation rather than three. A metric with no comparison basis and a chart with no non-visual equivalent both fail the Phase 4 gate, so both obligations live inside one block. |

---

## 6. Candidates considered and not allocated

Each was a real candidate, from the wireframe audit or from an authoring session that wanted one.

| Candidate | Disposition | Reason |
|---|---|---|
| **State summary panel** | Not allocated | `CMP-PLATFORM-002` is already the composition of chip, deadline and attribution. Wrapping it would add an identifier and no contract. This is the clearest instance of the second-taxonomy failure and it was refused first. |
| **Price block** | Not allocated | `CMP-ELIG-002` already carries the four governed display modes, the provenance and the money-boundary prohibitions. Nothing composes with it that is not already `WGT-ELIG-001` or `WGT-CLINICAL-002`. |
| **Deadline banner** | Not allocated | `CMP-PLATFORM-005` with `IX-BOOKING-001`. A widget here would restate a component and a pattern under a third name. |
| **Audit record inspector** | Not allocated | The four audit surfaces resolve to `WGT-PLATFORM-004` over `WGT-PLATFORM-005`, with `WGT-PLATFORM-006` in the `audit` variant. Allocating an audit widget would duplicate three existing ones for one navigation group. |
| **Onboarding checklist** | Not allocated | `SCR-IDENTITY-021` derives its items from work items, so it is `WGT-OPS-001` in the `checklist` variant over a scoped projection. Phase 3 reached the same conclusion for `CMP-OPS-001`. |
| **Bulk action bar** | Not allocated, and a rule instead | One surface has a legitimate batch operation. Nine entities are immutable or append-only, so a general bulk widget would license an affordance the product prohibits. The real risk is Filament shipping bulk actions including delete by default, which is a hard configuration rule on `WGT-PLATFORM-005`. |
| **Export control** | Not allocated | Export appears on the immutable-list surfaces and is a framework action under `CMP-PLATFORM-006`'s `immutable` variant. Its authorization rule is a screen obligation on `SCR-OPS-005` and `SCR-AUDIT-001`, not a composition. |
| **Notification toast** | Not allocated | Framework-owned on both profiles, and `COMPONENT_INVENTORY.md` section 7 already excluded it. `CMP-PLATFORM-015`'s duplication rule is what keeps it from being load-bearing. |
| **Guardian context switcher** | Absorbed | A variant of `WGT-PLATFORM-002`, not a separate thing. Splitting it would let the representation case drift from the provider-scope case, and both are the same safety obligation. |
| **Requested-changes panel** | Absorbed | The `requested-changes` variant of `WGT-PLATFORM-014` on the applicant side and `WGT-PLATFORM-013` on the reviewer side. Two audiences of one governed correction, already modelled. |
| **Reproduction result** | Absorbed | The `reproduction` variant of `WGT-PLATFORM-014`. Phase 3 reached the same conclusion for the component. |
| **Suspension impact panel** | Absorbed | The `suspension` variant of `WGT-ELIG-002`, which is where the affected-scope precision already lives. |

### 6.1 The six placement corrections the core check forced

Recorded because each was a Phase 4 error that would have silently extended a completed Phase 3 gate.

| Widget | Screen | What the audit found | Correction |
|---|---|---|---|
| `WGT-PLATFORM-010` | `SCR-ELIG-003` | The decision card is archetype `form` but binds no submission indicator: it commits nothing | Placement narrowed to form and workspace screens that actually commit |
| `WGT-PLATFORM-011` | `SCR-ELIG-023` | Observations are append-only, so there is no draft to continue | Removed. Each observation commits on entry |
| `WGT-PLATFORM-013` | `SCR-CLAIMS-011` | Evidence and deadlines binds no attribution component: it is not a decision surface | Removed. `WGT-CLAIMS-001` and `WGT-PLATFORM-008` cover it |
| `WGT-ELIG-001` | `SCR-BOOKING-001` | Slot selection echoes the chosen option but binds no price display | Price moved out of the mandatory core into the conditional set |
| `WGT-CLINICAL-001` | `SCR-CLINICAL-012` | Propose plan binds no treatment line: it commits a plan authored elsewhere | Removed. The change summary reaches it as the confirmation's stated effect |
| `WGT-CATALOG-001` | `SCR-OPS-006` | Readiness overview binds no governed version header: it is a cross-scope roll-up, not one version | Removed. Gate state renders through `WGT-PLATFORM-005` and `WGT-OPS-002` |

---

## 7. Framework-owned, and therefore not widgets

Carried forward unchanged from `COMPONENT_INVENTORY.md` section 7 and **not re-admitted under a new
prefix**: button, input, select, checkbox, radio, toggle, date picker, textarea, file input, modal
shell, drawer, popover, toast, banner, notification, navigation chrome, panel shell, global user menu,
breadcrumb, tabs, avatar, badge, tag, card, progress bar, spinner.

Phase 4 supplies these the same three things Phase 3 did — the semantic tokens, the required states, and
the accessibility obligations — plus, now, the per-screen statement of which of them a surface uses and
what it must not do with them.

---

## 8. Traceability

Every block names, at minimum: its purpose; its platforms and archetypes; its mandatory composed `CMP-*`
core and its conditional set; its governing `IX-*`; its required `TXT-*` and `A11Y-*`; at least one
`FR-*` or `NFR-*`; a data source resolving to `docs/api/API_CONTRACTS.md` or
`docs/domain/STAFF_INTERACTION_CONTRACTS.md`; all nine data states plus offline; its right-to-left,
long-content, text-scaling and responsive behaviour; its keyboard, focus and screen-reader behaviour;
its realization per profile; its prohibitions; the `WF-*` and `SCR-*` it is placed on; and its acceptance
criteria.

## 9. What this file does not establish

**No conformance claim, accessibility or otherwise.** The target is WCAG 2.2 AA from
`NFR-PLATFORM-005`; these blocks specify obligations against it. Whether a rendered widget meets them is
a Phase 5 measurement and `ACCESSIBILITY.md` section 20 lists those obligations one by one.

**No claim that a widget reads well.** The mechanical checks establish that the composition is
consistent, that every reference resolves, that no widget composes a component its screens do not bind,
and that every data state is specified. They do not establish that the result is usable, beautiful or
correctly ordered on a real device. That needs a rendered interface.

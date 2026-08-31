# UberTib Component Inventory

**Phase:** UX 3 — Design System, Session 3 of 7
**Status:** Allocated. Session 4 binds copy; Sessions 5 to 7 bind accessibility, integration, and final-gate obligations to these identifiers
and do not reopen the taxonomy.
**Owns:** which components exist, their anatomy, variants, required states, token mapping,
per-profile realization, and traceability.
**Does not own:** token values (`DESIGN_TOKENS.md`), interaction behaviour
(`INTERACTION_PATTERNS.md`), final copy (Session 4), screen composition and widget placement
(Phase 4).

**Blocks live in:**

| File | Contents |
|---|---|
| `COMPONENT_INVENTORY.md` | this index — allocation rule, registry, states, coverage, dispositions |
| `COMPONENT_INVENTORY_PLATFORM.md` | the 15 cross-cutting `CMP-PLATFORM-*` blocks |
| `COMPONENT_INVENTORY_DOMAIN.md` | the 7 domain `CMP-*` blocks |
| `WIREFRAME_COMPONENT_MAP.md` | the `WF-*` to `CMP-*` binding, one row per wireframe, all 165 |

Authority is unchanged from `docs/ux/README.md`. The design kit at the repository root is a
**method, not an authority**. Where its generic guidance and a canonical UberTib requirement
disagree, the requirement wins — which is why this system defines no button, input, select,
modal, toast or navigation component. See section 7.

---

## 1. What a `CMP-*` is

**A `CMP-*` is a semantic component contract, not an implementation.** Patient is React Native,
Clinic and Admin are Filament panels, and Phase 1 forbids converging them. So a component is a
contract about anatomy, required states, token mapping, content obligations and accessibility
obligations, plus a **realization row per profile**.

| Profile | Realization vocabulary |
|---|---|
| C — Patient, React Native | `Native` — a React Native component; `n/a` — no Patient surface |
| A — Clinic and Admin, Filament | `Stock` — the framework component as shipped, configured; `Extended` — framework component plus configuration or a custom column/entry; `Custom` — a custom view; `n/a` |

This is the same vocabulary `UX_FOUNDATION.md` section 7.1 already fixes for Profile A. A
component classified `Stock` is a contract about **how the framework component is configured and
what it must not do** — not an instruction to rebuild it.

### 1.1 The allocation rule

A pattern earns a `CMP-*` only when all four hold.

1. It appears in at least **two genuinely distinct contexts**, not two instances of one context.
2. Its **anatomy is the same** in those contexts, even where its content differs.
3. Getting it wrong causes a **documented harm** — a requirement violation, a missed deadline, a
   wrong attribution, a misread price, an authorization leak.
4. It needs a **home for a rule** that would otherwise have to be remembered on every screen.

Criterion 4 is what separates a component from a convention. `CMP-PLATFORM-001` earns a component
not because a status repeats, but because `NFR-PLATFORM-005`'s no-colour-alone rule needs
somewhere structural to live across 82 statuses.

Two corollaries that were applied, not merely stated:

- **Appearing once is not enough.** The market-observation entry grid, the comparison view, the
  dashboard composition and the reproduction result are each one surface or one layout of another
  component. None was promoted. See section 8.
- **A wireframe region is not automatically a component.** The `form` archetype's primary content
  is 58 screens of framework-owned form controls, and Phase 3 supplies them tokens, states and
  accessibility obligations rather than an anatomy.

### 1.2 Domain keying and allocation

`CMP-*` uses the twelve product domains already in `docs/README.md`. Cross-cutting components use
`PLATFORM`, which that registry already defines as owning right-to-left, accessibility and
resilience. **No thirteenth domain is introduced.**

`CMP-*` is append-only on the same terms as every other prefix. The `docs/README.md` registry line
that records `CMP-*` and `IX-*` as not yet allocated is updated in Session 7 together with the
`WF-*` correction, inside that file's line budget. Nothing in this session edits a Phase 1 or
Phase 2 artifact.

---

## 2. Allocation registry — 22 components

Reach is **measured from `WIREFRAME_COMPONENT_MAP.md`**, not estimated. It counts wireframes on
which the component is bound, out of 165.

### 2.1 Cross-cutting

| ID | Name | Reach | Profiles | The rule it exists to hold |
|---|---|---:|---|---|
| `CMP-PLATFORM-001` | State chip | 155 | C, A | One lifecycle status rendered as the tone-icon-label triple. A status may never reach a surface as a colour. |
| `CMP-PLATFORM-002` | State summary | 68 | C, A | State, controlling reason, when it was assessed, what action is available. Principle 1 given an anatomy. |
| `CMP-PLATFORM-003` | Subject context header | 156 | C, A | Whose case, which provider, which branch, on whose authority. Acting on the wrong person's case is a named consequence of error for two actors. |
| `CMP-PLATFORM-004` | Action bar | 161 | C, A | An action removed for authorization or lifecycle reasons is **absent and explained**, never disabled. |
| `CMP-PLATFORM-005` | Deadline indicator | 58 | C, A | An unrecoverable deadline is visible as approaching, never merely reported as missed. |
| `CMP-PLATFORM-006` | Record list | 85 | C, A | No generic edit or delete affordance over the nine immutable entities; row flags render independently of lifecycle state. |
| `CMP-PLATFORM-007` | Filter and search bar | 39 | C, A | A filtered-empty result and a genuinely empty data set are two different answers and must read differently. |
| `CMP-PLATFORM-008` | Event timeline | 33 | C, A | Append-only history with no edit affordance reachable from it, by construction. |
| `CMP-PLATFORM-009` | Empty state | 165 | C, A | Required structural state on every screen. Never an illustration in place of a recovery action. |
| `CMP-PLATFORM-010` | Recovery state | 165 | C, A | Fetch failure, permission denial and unknown commit outcome are three designed states, not three accidents. |
| `CMP-PLATFORM-011` | Submission state indicator | 68 | C, A | The visible face of the idempotency contract: pending, failed, retrying, completed — never an optimistic guess. |
| `CMP-PLATFORM-012` | Evidence transfer item | 9 | C, A | The eight fixed session states, with retryable transfer failure structurally separate from authoritative rejection. |
| `CMP-PLATFORM-013` | Human attribution | 61 | C, A | Who decided, when, on what basis — and the inverse: a computed outcome is never dressed as a human judgement. |
| `CMP-PLATFORM-014` | Sensitive confirmation | 38 | C, A | Reason capture, stated effect, stated irreversibility, and one action role reading the same way in the trigger and in its own confirmation. |
| `CMP-PLATFORM-015` | Attention item | 4 | C, A | A durable deadline-bearing item appears on both the attention surface and the notification centre, which is what makes push, SMS and email optional adapters rather than load-bearing infrastructure. |

### 2.2 Domain

| ID | Name | Reach | Profiles | The rule it exists to hold |
|---|---|---:|---|---|
| `CMP-ELIG-001` | Provider decision card | 5 | C | The attribute set fixed by `PO-UX-04`, identical as a result row, a decision card and a comparison column. No composite score, ever. |
| `CMP-ELIG-002` | Price display | 24 | C, A | The four governed display modes with provenance. Never a market average, a city average, a tariff or a recommended price. Never an implication that the platform holds money. |
| `CMP-ELIG-003` | Eligibility explanation | 13 | C, A | The controlling reason in the audience's terms, with pending evaluation visibly distinct from a negative outcome, and no internal symbol reachable. |
| `CMP-CLINICAL-001` | Treatment line | 10 | C, A | Every amount names its category, its reason and what it covers. There is no surcharge, extra, adjustment or other. |
| `CMP-CLINICAL-002` | Change disclosure | 15 | C, A | Original against amended, for a patient deciding whether to re-accept and for an administrator inspecting a governed change. Variants, not two components. |
| `CMP-POLICY-001` | Governed version header | 16 | A | Version, effective period, review-gate status, and reachability of historical versions. Never reachable from a Patient surface. |
| `CMP-OPS-001` | Work item row | 8 | A | Five states plus two independent flags. The row a supervisor most needs is simultaneously in progress, escalated and overdue, so flags cannot be states. |

**Total: 22.** 15 cross-cutting, 7 domain. Every one is bound on at least four wireframes and
every one appears in `WIREFRAME_COMPONENT_MAP.md`, which closes the mechanical two-way component
check in both directions.

Two reach figures differ from the Phase 3 plan's estimates, and the measured values are the ones
carried forward. `CMP-PLATFORM-002` reaches 68 rather than 73, because five of the 68 `detail`
wireframes show no lifecycle status at all. `CMP-PLATFORM-012` reaches 9 rather than 8, because
evidence state is rendered on three read surfaces — admin fact-and-evidence verification, admin
evidence verification, and the evidence access log — as well as on the six intake surfaces, and the
`ACCEPTED` and `REJECTED` states belong to those read surfaces too.

### 2.3 Composition, so the set stays a system

Eight components are composed of others rather than duplicating them. This is the property that
keeps 22 from behaving like 40.

```
CMP-PLATFORM-002  state summary        composes 001 (chip) + 005 (deadline) + 013 (attribution)
                                       + 003 (subject, by reference not by nesting)
CMP-PLATFORM-006  record list          composes 001 per row, 005 where a row is deadline-bearing
CMP-PLATFORM-008  event timeline       composes 001 per event, 013 where an event has a decider
CMP-PLATFORM-015  attention item       composes 001 + 005, and links to the owning record
CMP-ELIG-003      eligibility expl.    composes 001 (chip) + 013 where a human decided
CMP-OPS-001       work item row        composes 001 (status) + 005 (due) + the flag slot
CMP-ELIG-001      decision card        composes 001 (chip) + ELIG-002 (price)
CMP-CLINICAL-002  change disclosure    composes 001 per version + 013 (who changed it)
```

`CMP-PLATFORM-009`, `010` and `011` are deliberately **not** composed into a single "structural
state" component. They answer three different questions — nothing is here, we could not tell you,
your command has not landed — and a reader who cannot tell them apart cannot act. Merging them is
the single most likely future simplification and it would be wrong.

---

## 3. Required states

Every interactive component declares which of these apply and what each resolves to. A state that
does not apply is declared `n/a` with a reason, not omitted.

| # | State | When required | Token source |
|---|---|---|---|
| 1 | default | always | the component's own group |
| 2 | hover | **Profile A only** | `semantic.color.action.*-hover`, `action.secondary-hover` |
| 3 | focus | always, both profiles | `semantic.color.focus.ring`, `focus.ring-contrast`, `semantic.focus.*` |
| 4 | active / pressed | always | `semantic.color.action.*-active`, `semantic.opacity.pressed` |
| 5 | disabled | only where the control is genuinely available but not yet usable | `semantic.color.state.disabled.*`, `semantic.opacity.disabled` |
| 6 | loading | any component whose content or commit is asynchronous | `motion.transition.progress`, `CMP-PLATFORM-011` |
| 7 | error | any component that accepts input or renders a failed read | `semantic.color.tone.danger.*` |
| 8 | selected | any selectable or comparable unit | `semantic.color.state.selected.*` |

Three product rules bind this table and are not negotiable per component.

**No hover state is ever emitted on Profile C.** `UX_FOUNDATION.md` section 7.1 forecloses it:
React Native has no hover, and press, long-press and swipe replace it. Every block below states
`hover: n/a (Profile C)` explicitly rather than leaving it to be inferred. A hover row emitted for
the Patient app is a defect caught at every verification gate.

**Disabled is narrow, and it is not an authorization control.** `PERMISSIONS_MATRIX` section 1
fixes that hiding an action is never an authorization control, and the corollary matters for
design: a disabled control **implies an override exists**. So an action removed because the actor
lacks authority, or because the record's lifecycle forbids it, is **absent and explained** — see
`CMP-PLATFORM-004`. Disabled is reserved for the case where the same actor on the same record
will be able to act once they complete something visible on this surface, such as a submit button
over an incomplete required field.

**Read-only is a ninth state and is not disabled.** The product has nine immutable or append-only
entities whose content is authoritative history. They render read-only at full contrast:
`semantic.color.state.readonly.text` is a full-contrast value and `semantic.opacity.disabled` may
not touch it. Dimming a financial snapshot because it cannot be edited would make the record that
matters most the hardest to read. `DESIGN_TOKENS.md` section 8.2 fixes this; every component that
can render one of the nine declares it.

---

## 4. Density and size

Density is a property of the **archetype and profile**, never of the platform
(`DESIGN_DIRECTION.md` section 3.8). Every block declares its behaviour in all three modes.

| Mode | Applies to | Control token |
|---|---|---|
| `reading` | all 47 Patient wireframes, every archetype | `semantic.size.control-lg` |
| `operational` | Profile A dashboard, detail, form, list-and-detail | `semantic.size.control-md` |
| `dense` | Profile A workspace (5 wireframes) and table bodies only | `semantic.size.control-sm` |

Two floors no component may cross in any mode:

- **`semantic.size.target-floor`** on any interactive target, once the hit area is counted. A
  `control-sm` control in dense mode carries an expanded hit area; a control whose hit area equals
  its visual box at that size is a defect.
- **`semantic.size.target-primary`** on every Patient primary action and every deadline-bearing
  action on any platform, in any mode.

The density multiplier applies to `semantic.space.*` only. It never applies to font size, line
height, the focus ring, border width or the target floors. A dense table has tighter rows and the
**same** Arabic text size as everywhere else.

---

## 5. Right-to-left and long content

These two bind every anatomy in the system, so they are stated once here and then only where a
component adds something specific.

**Every anatomy is defined in `start` and `end` terms, never left and right.** Logical properties
only. A physical left border, a physical left icon slot or a physical left-aligned numeric column
is a directional defect, not a cosmetic one. Direction rule 3.6 forbids colour-tinted start-edge
accent strips for the same reason plus a second one.

**Mixed-direction content is a correctness problem, not a layout problem.** Service codes, version
identifiers, amounts with currency, dates, correlation identifiers and Latin clinic names appear
inside Arabic text on the same line. A reordered code or amount is a **wrong** code or amount.
Every component that renders one isolates it; the behaviour is fixed once in `IX-PLATFORM-010`.

**Long content is sized for, not truncated.** `UX_FOUNDATION.md` section 5.1 names the worst cases:
Arabic service and group names at the largest supported text size, mixed Arabic and Latin codes,
long clinic legal names, amounts with thousands separators, eleven-word status explanations, and a
case timeline with dozens of ordered events. The rule every block applies: at the largest supported
text size, **critical regions stack rather than truncate**, and truncation is permitted only where
the full value is reachable in the same surface without a network read. An amount, a deadline, a
controlling reason and an attribution may never be truncated at all.

---

## 6. Coverage — measured, and honest about what it proves

Computed from `WIREFRAME_COMPONENT_MAP.md`. Each cell is the number of wireframes of that
archetype on which at least one component covers that Phase 2 region.

| Archetype | n | Context | Status and identity | Primary content | Filters | Supporting information | Decision / action bar | Timeline / history | Recovery |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| dashboard | 5 | 5 | 5 | 5 | 0 | 4 | 4 | 0 | 5 |
| list-and-detail | 29 | 29 | 28 | 29 | 29 | 21 | 29 | 8 | 29 |
| form | 58 | 52 | 54 | 12 | 0 | 42 | 58 | 4 | 58 |
| workspace | 5 | 5 | 5 | 5 | 2 | 4 | 5 | 2 | 5 |
| detail | 68 | 65 | 63 | 64 | 8 | 46 | 65 | 26 | 68 |
| **All** | **165** | **156** | **155** | **115** | **39** | **117** | **161** | **40** | **165** |

The zeros and the low cells are all deliberate, and each has a reason rather than a gap:

- **Filters on dashboard and form is 0.** An attention surface is scoped by
  `CMP-PLATFORM-003`, not filtered — Principle 3 says prominence follows the journey. A form has
  no result set to filter. Two of the five workspaces filter, because plan authoring searches
  procedures.
- **Primary content on form is 12 of 58.** The other 46 forms are framework-owned controls by
  design (section 7). The 12 are forms whose primary content is a governed list, an evidence set
  or a decision card.
- **Timeline on dashboard is 0.** A dashboard shows what needs attention now; history is one
  navigation away, which is `IX-PLATFORM-008`.
- **Context is 156, not 165.** The nine are pre-authentication: patient entry, phone and code
  entry, join, provider type, applicant contact verification, both panel sign-ins, invitation
  acceptance. There is no subject yet.
- **Status is 155, not 165.** Exactly the 10 wireframes whose screen catalog entry records no
  lifecycle status. The figure is derived from the same field the Phase 3 plan measured, so the two
  agree by construction rather than by coincidence.

**What this table proves and does not prove.** It is a coverage claim over **archetypes and
regions**, not over screens. It shows that no archetype has a structural region with nothing to
render it. It does **not** show that every screen's specific needs are met, because that cannot be
established until Phase 4 places widgets. The Phase 3 handoff must repeat this limitation rather
than let the table imply more.

Components per wireframe: minimum 3, maximum 13, mean 8.2. The minimum is the pre-authentication
screens, which resolve to an action bar plus the two structural states. The maximum is
`WF-CLINICAL-004` plan acceptance, `WF-CLAIMS-010` claim review and `WF-CLINICAL-019` case
oversight detail — the three highest-consequence composite surfaces in the product, which is the
right shape for the maximum to have.

---

## 7. Framework-owned, and therefore not components

Not an oversight. Defining these would be phase bleed into implementation and would contradict the
profile constraint that the framework supplies forms and notifications.

| Not a component | Why | What Phase 3 supplies instead |
|---|---|---|
| Button, input, select, checkbox, radio, toggle, date picker, textarea, file input | Profile A takes Filament as shipped; Profile C takes React Native primitives | The semantic token layer, the eight required states, the target floors, and the accessibility obligations |
| Modal shell, drawer, popover, toast, banner, notification | Same, and Filament owns notifications outright | `semantic.elevation.*`, `motion.transition.overlay-*`, and the focus obligations |
| Navigation chrome, panel shell, global user menu, breadcrumb, tabs | Framework-owned on Profile A; fixed by Phase 1 on Profile C | Tokens and the focus-not-obscured obligation, which matters because both panels use a shell with sticky chrome |
| Avatar, badge, tag | No product rule needs a home in them | Tokens. A lifecycle status uses `CMP-PLATFORM-001`, which is not a badge |
| Card | The archetype distribution is dominated by detail (68) and form (58), not by card grids | Direction rule 3.5: a card is a container decision made per surface in Phase 4, justified only for a selectable or comparable unit |
| Inline field error, action banner, unavailable state, full-page gate | `ERROR_CATALOG.md` section 3 already fixes the surface vocabulary | The panel-native extension and the routing from each `ERR-*` to a surface — content and behaviour, owned by Session 4 and by `INTERACTION_PATTERNS.md` |

No component tokens exist for any row in this table. `design_tokens/component.json` records that
exclusion as an enforced contract, not as a note.

---

## 8. Candidates considered and not promoted

This is the part of the taxonomy that keeps it a system rather than a catalogue. Each row was a
real candidate — from the Phase 2 handoff, the Phase 3 plan, or this session's own analysis.

| Candidate | Disposition | Reason |
|---|---|---|
| **External money boundary notice** (`CMP-FINANCE-001`, the plan's open candidate) | **Not allocated.** Resolved as a content obligation on `CMP-ELIG-002`, `CMP-PLATFORM-002`, `CMP-PLATFORM-008` and `CMP-CLINICAL-001`, plus a Session 4 prohibition. | The obligation from `FR-FINANCE-007` and `NFR-FINANCE-001` is real and its measurement method explicitly includes copy verification. But a notice component is a text block, which is framework-owned, and it would be actively harmful: a standing disclaimer invites the rest of the surface to imply custody and rely on the banner to correct it. The obligation belongs **inside** every component that renders an amount, not beside them. The plan required resolving one way and not allocating both; this is that resolution. |
| Comparison view | **Phase 4 widget** | It is `CMP-ELIG-001` repeated in a column layout over transient state. Promoting it would create a component whose anatomy is another component. |
| Dashboard composition | **Phase 4 template** | Five wireframes, three of them Admin. That is a template, not a component. |
| Market-observation entry grid | **Phase 4 widget** | Exactly one wireframe, `WF-ELIG-023`. Its rows are `CMP-PLATFORM-006` in dense mode plus framework table editing, and its calibration state is `CMP-POLICY-001`. Criterion 1 fails outright. |
| Bulk action set | **Not a component, and a rule instead** | One surface has a legitimate batch operation, the market-observation batch import. Meanwhile nine entities are immutable or append-only, so a general bulk pattern would license an affordance the product prohibits. The real risk is the opposite one: Filament tables ship bulk actions including delete by default. That is handled as a hard configuration rule on `CMP-PLATFORM-006`. |
| Separate Patient / Clinic / Admin variants of eligibility explanation, price, state summary and change disclosure | **Absorbed as variants** | One semantic component with an audience variant, in every case. Three near-identical components would be three places for the algorithm-hiding boundary to be got wrong, and the boundary is a field-filtering requirement rather than a screen-splitting one (`UX_FOUNDATION.md` section 5.1). |
| Timeline event detail | **Absorbed** | A disclosure state of `CMP-PLATFORM-008`, governed by `IX-PLATFORM-008`. |
| Reproduction result | **Absorbed** | A variant of `CMP-CLINICAL-002`: comparing a reproduced outcome against the recorded one is a change disclosure whose verdict is match or mismatch. One wireframe on its own would fail criterion 1. |
| Onboarding checklist | **Absorbed** | `SCR-IDENTITY-021` derives its items from work items, so it is `CMP-OPS-001` over a scoped projection. |
| Stat tile, metric card, chart | **Phase 4** | Only the operational reporting wireframes need them, the data-visualisation palette is deferred to Phase 4 on purpose, and a metric with no comparison basis already fails the Phase 4 gate. |
| Progress bar, spinner | **Not a component** | Framework-owned, and direction rule 3.9 prohibits an indeterminate spinner as the only feedback for a mutation. The rule lives in `CMP-PLATFORM-011` and `IX-PLATFORM-009`. |

Phase 2 proposed twelve candidates. Ten survive in some form, two are absorbed as variants, and
**five components Phase 2 did not list are allocated here**: deadline indicator, price display,
human attribution, submission state indicator, and attention item. Each carries a rule with a
documented failure consequence and had no structural home.

---

## 9. Non-negotiable behaviour, and where it now lives

The eight carried-forward behaviours from Phase 2 section 1 and the Phase 3 plan. Each now has a
structural carrier, which is the point of the exercise.

| Behaviour | Component carrier | Pattern carrier |
|---|---|---|
| Eligibility fail-closed: `ELIGIBILITY_REVIEW` removes attendance, start and completion actions structurally, with no override designed | `CMP-ELIG-003`, `CMP-PLATFORM-004` | `IX-ELIG-001`, `IX-PLATFORM-007` |
| Guardian authorization revocation stays reachable regardless of booking state | `CMP-PLATFORM-003`, `CMP-PLATFORM-004` | `IX-PLATFORM-007` |
| A pending reschedule never displaces the original confirmed appointment before acceptance and revalidation | `CMP-PLATFORM-002`, `CMP-PLATFORM-001` | `IX-BOOKING-002` |
| Accepted treatment and financial snapshots stay visibly historical and immutable | `CMP-PLATFORM-006`, `CMP-PLATFORM-008`, `CMP-CLINICAL-002` | `IX-CLINICAL-001` |
| Admin-editable clinical and commercial behaviour uses governed versions; configurable does not mean instant or unreviewed | `CMP-POLICY-001` | `IX-POLICY-001`, `IX-POLICY-002` |
| Treatment-plan compression keeps required structure while reducing repeated entry; no arbitrary surcharge field exists | `CMP-CLINICAL-001` | `IX-PLATFORM-005`, `IX-PLATFORM-008` |
| Market-observation compression keeps all required provenance; calibration output stays internal | `CMP-PLATFORM-006` (dense), `CMP-POLICY-001` | `IX-PLATFORM-005` |
| Retryable transfer failure and authoritative evidence rejection are separate structural states | `CMP-PLATFORM-012` | `IX-PLATFORM-006` |

Phase 3 invents no business rule. Where a rule was missing it was recorded as a question, not
decided; the only open dependency this session carries is `Q-PLATFORM-008` on palette
ratification, inherited from Session 2 and not affecting any anatomy.

---

## 10. Traceability

Every block names, at minimum:

- at least one of `FR-*`, `NFR-*` or `ERR-*`;
- the `WF-*` it is bound on, through `WIREFRAME_COMPONENT_MAP.md`;
- the `SCR-*` those wireframes cover;
- its profile realizations;
- its required states, with `n/a` reasoned where a state does not apply;
- its token mapping, resolving to the semantic layer only;
- its accessibility obligations, which Session 5 binds to `A11Y-*`.

`design_tokens/component.json` carries one group per allocated identifier, added in the same
change as this inventory so a component and its tokens are never allocated apart. Every component
token resolves to `semantic.*`; the token gate fails a component token that reaches a primitive
directly.

---

## 11. What this session did not verify

Stated because a green mechanical result here would prove very little and must not be reported as
if it proved a great deal.

**Verified mechanically:** the two-way `CMP-*` closure between this inventory and the binding map;
that every token named resolves; that no raw colour, size or timing literal appears in prose; that
no emoji appears anywhere under `docs/ux/`; and the reach and coverage figures in sections 2 and 6,
which are computed from the map rather than typed.

**Not verified, and not verifiable at this layer:** that a status is genuinely distinguishable
without colour to a real reader; screen-reader announcement, focus order and keyboard completeness;
forced-colours survival on Profile A; that Arabic diacritics clear at heading leading in the chosen
family; that the anatomies read as accountable rather than merely correct; and anything about
beauty. Those need a rendered interface and are Phase 5 obligations.

**No conformance claim is made.** The target is WCAG 2.2 AA from `NFR-PLATFORM-005`. This session
specifies obligations against that target.

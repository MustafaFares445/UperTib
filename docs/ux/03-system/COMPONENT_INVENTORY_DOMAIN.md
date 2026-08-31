# Component Inventory — Domain Components

**Phase:** UX 3 — Design System, Session 3 of 7
**Index, allocation rule and coverage:** `COMPONENT_INVENTORY.md`
**Cross-cutting blocks:** `COMPONENT_INVENTORY_PLATFORM.md`
**Binding:** `WIREFRAME_COMPONENT_MAP.md` is authoritative. Reach figures here are computed from it.

Seven components. Each one exists because a domain rule with a documented failure consequence
needed a structural home, and each one is a **single semantic component with audience variants**
rather than one component per platform. `UX_FOUNDATION.md` section 5.1 fixes that the same record
produces three materially different projections and calls it a field-filtering requirement, not a
screen-splitting one; three near-identical components would be three places for the
algorithm-hiding boundary to be got wrong.

The rules stated once in the index bind every block here: no hover on Profile C, `start` and `end`
never left and right, disabled is not an authorization control, read-only is not disabled, density
follows the archetype, and every component token resolves to `semantic.*`.

---

### CMP-ELIG-001 — Provider decision card

**Purpose:** give the patient everything needed to choose one provider, service and branch
combination — and nothing that reveals how the platform ranked it. The attribute set is fixed by
`PO-UX-04`, and the same anatomy serves a result row, a decision card and a comparison column.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `n/a`. Staff never read a patient-facing decision card. The Admin equivalent is the decision inspector, which is `CMP-ELIG-003` in its `reviewer` variant plus `CMP-POLICY-001`. |

**Traceability:** `FR-ELIG-016`; `FR-ELIG-009`; `FR-ELIG-010`; `FR-ELIG-018`; `FR-CATALOG-001`;
`ERR-ELIG-001`; `NFR-PLATFORM-005`.

**Anatomy**

```
[ provider identity ]                  <- doctor, clinic, branch, area
[ CMP-PLATFORM-001 ]                   <- practical availability meaning
[ CMP-ELIG-002 ]                       <- the provider's OWN price, in its governed mode
[ protection meaning ]                 <- documented conditional meaning, funded protection off
[ verified review summary ]            <- the verified rating and its count
[ assessed at ]                        <- when this was evaluated
[ action: choose a time ]              <- CMP-PLATFORM-004
```

Scoped to **one** doctor, service and branch. It is never a provider profile spanning services,
because eligibility is contextual per `BP-02`. That scoping is anatomy, not layout.

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `row` | Provider results | Compact. Carries the same attribute set — a result row already holds this data, which is why the full card deepens rather than gates. |
| `card` | Provider decision card | The full attribute set with the assessment time prominent |
| `column` | Provider comparison, two or three options side by side | One column per option. **Attributes align across columns so they can be compared honestly**, and no column is marked best. |
| `chosen` | Slot selection and request review | Read-only echo of the option already chosen, so the patient can confirm they are booking what they picked |

The comparison view itself is a Phase 4 widget, not a component: it is this component repeated in a
column layout over transient state.

**Density and size:** `reading` in all cases — this component exists only on Profile C. The action
clears `semantic.size.target-primary`. The `column` variant keeps the same type scale as `card`;
comparison compresses the space around values, never the values.

**States**

| State | Behaviour |
|---|---|
| default | the resolved option |
| hover | **n/a (Profile C).** Press and long-press replace it. |
| focus | the card as a target where the whole card opens the option, plus each internal control |
| active / pressed | `semantic.opacity.pressed` |
| disabled | **n/a.** A provider who is not currently eligible is **absent from bookable results** rather than shown greyed. `SCR-ELIG-002` shows `ELIGIBLE` only. A greyed provider would be an unactionable invitation. |
| loading | a skeleton at the card's own height. Provider search sits on the loosest latency budget in `NFR-PLATFORM-001`, so `IX-PLATFORM-009` governs the progress treatment and the card never appears stalled. |
| error | a failed read is `CMP-PLATFORM-010` at surface level; an option that has become ineligible between load and action is `IX-ELIG-001` revalidation, which explains rather than silently removing |
| selected | in the `column` variant, the option being carried forward. `semantic.color.state.selected.*` plus a stated selection. |
| read-only | the `chosen` variant |

**Token mapping**

```
component.elig-001.surface          {semantic.color.surface.default}
component.elig-001.border           {semantic.color.border.subtle}
component.elig-001.border-selected  {semantic.color.state.selected.border}
component.elig-001.fill-selected    {semantic.color.state.selected.surface}
component.elig-001.text-identity    {semantic.color.text.primary}
component.elig-001.text-meta        {semantic.color.text.secondary}
component.elig-001.radius           {semantic.radius.surface}
component.elig-001.elevation        {semantic.elevation.flat}
component.elig-001.inset            {semantic.space.inset-md}
component.elig-001.stack            {semantic.space.stack-sm}
```

Flat. Direction rule 3.5 makes a card a container of last resort, justified only for a selectable
or comparable unit. This is that case — and even here it does not lift, because it does not float.

**Content rules**

- **No composite score, ever.** No grade, no letter, no percentage, no star ranking derived from
  the platform's own computation, no "recommended" or "best value" marker. `FR-ELIG-016` and the
  `PO-UX-04` prohibitions are explicit, and the algorithm-hiding boundary in Principle 1 binds this
  surface hardest because it is the surface where a score would feel most helpful.
- **Internal `P`, `S`, `H`, `I`, confidence and calibration values are not reachable**, in any
  variant, in any disclosure, at any zoom level.
- The price is **the provider's own recorded price** in its governed display mode. Never a market
  average, a city average, a tariff or a recommended price — on any platform. See `CMP-ELIG-002`.
- Protection is stated as its documented conditional meaning. Never insurance, never reimbursement,
  never a guaranteed result.
- The verified review summary shows the rating and its count. It is never merged with, or presented
  as an input to, availability.
- No superlative about a doctor. The v2.1 writing register and `NFR-PLATFORM-005` agree here.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** identity at `start`; price and rating are bidirectionally isolated so the amount,
its currency and the rating count do not reorder inside Arabic text.

**Long content:** a long clinic legal name and a long Arabic doctor name wrap rather than truncate
in `card`; in `row` and `column` they wrap to two lines and then truncate with the full value
reachable in the card. **Price, availability meaning and assessment time never truncate.** At the
largest supported text size the `column` variant stacks into sequential `card` blocks rather than
compressing columns, and the task order is unchanged.

**Accessibility:** the card is one target with an accessible name carrying provider, service,
branch, availability meaning and price, so a screen reader user can triage without entering it;
availability is never carried by colour alone; in the `column` variant each attribute row is
labelled so a comparison is navigable by attribute rather than only by column; the assessment time
is text, not a tooltip.

**Bound on:** 5 of 165 wireframes.

`WF-*`: `WF-BOOKING-001`, `WF-BOOKING-002`, `WF-ELIG-002`, `WF-ELIG-003`, `WF-ELIG-005`

`SCR-*`: `SCR-BOOKING-001`, `SCR-BOOKING-002`, `SCR-ELIG-002`, `SCR-ELIG-003`, `SCR-ELIG-005`

Three of the five are the genuinely distinct contexts that earned the allocation — result row,
decision card, comparison column. The two booking wireframes carry the read-only `chosen` echo.

---

### CMP-ELIG-002 — Price display

**Purpose:** render an amount with its governed display mode and its provenance, and hold the
prohibitions that make a price in this product honest. This is also where the external money
boundary is enforced, rather than in a separate notice component.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Extended` — a Filament entry and column, configured. The mode and the provenance are not optional decorations, so a stock money column is insufficient. |

**Traceability:** `FR-ELIG-009`; `FR-ELIG-018`; `FR-POLICY-003`; `FR-FINANCE-001`;
`FR-FINANCE-007`; `FR-CLINICAL-006`; `NFR-FINANCE-001`; `ERR-CLINICAL-002`.

**Anatomy**

```
[ amount + currency ]      <- tabular lining figures, Western digits, isolated
[ mode statement ]         <- which of the governed modes this is
[ what it covers ]         <- scope of the amount, where scope is not obvious
[ provenance ]             <- effective period, and normalisation provenance where the
                              amount was normalised from another currency
```

The mode is **part of the anatomy, not a qualifier appended when convenient.** An amount rendered
without its mode is a different claim from the one the record makes.

**Variants**

The four governed display modes plus the two record kinds:

| Variant | Means | The failure it prevents |
|---|---|---|
| `fixed` | A settled price for this service at this provider and branch | none specific |
| `from` | A starting point; the final amount depends on what the examination finds | reading a starting point as a total |
| `range` | Bounded between two values | reading a lower bound as the price |
| `free` | Genuinely no charge | reading free as missing data, which `FR-ELIG-018` names explicitly |
| `requires-plan` | Only an examination can settle this | reading a disclosure limit as a refusal to disclose |
| `snapshot` | An amount inside one of the nine immutable records — accepted terms, a financial terms snapshot, a claim's governing amount | reading history as a current price, or editing it |

**Density and size:** `reading` renders the amount at `semantic.type.numeric-strong` with the mode
below it at `semantic.type.helper`; `operational` renders amount and mode on one line at
`semantic.type.numeric`; `dense` renders the amount as a column at `semantic.type.numeric` with the
mode as a compact marker whose full statement is reachable. The mode marker is **never** the only
carrier of the mode where the amount is the primary content of the surface.

**States**

| State | Behaviour |
|---|---|
| default | the amount with its mode |
| hover | **n/a on Profile C.** Profile A: only where the amount links to its governing record. |
| focus | the provenance disclosure and any link |
| active / pressed | the provenance disclosure |
| disabled | **n/a** |
| loading | absent until known. **A placeholder that could be read as an amount is prohibited**, and a zero is never rendered as a loading value. |
| error | if the amount cannot be read the surface says so and offers no action that depends on it. A price the surface cannot vouch for is worse than no price. |
| selected | **n/a** |
| read-only | the `snapshot` variant, at full contrast. `semantic.opacity.disabled` may not touch it. |

**Token mapping**

```
component.elig-002.amount-text     {semantic.color.text.primary}
component.elig-002.amount-type     {semantic.type.numeric-strong}
component.elig-002.mode-text       {semantic.color.text.secondary}
component.elig-002.mode-type       {semantic.type.helper}
component.elig-002.provenance-text {semantic.color.text.secondary}
component.elig-002.free-icon       {semantic.color.tone.success.icon}
component.elig-002.surface-snapshot {semantic.color.state.readonly.surface}
component.elig-002.text-snapshot   {semantic.color.state.readonly.text}
component.elig-002.numeric-features {semantic.type.numeric-features}
component.elig-002.inline          {semantic.space.inline-xs}
```

`semantic.type.numeric-features` requests tabular and lining figures, so a column of amounts aligns
and a changing amount does not reflow its column. The currency code, symbol, decimal places and the
exchange-rate source are **governed pricing policy, not tokens** — `DESIGN_TOKENS.md` section 9.

**Content rules**

The prohibitions here are the point of the component.

- **No price string may say market average, city average, tariff or recommended price**, on any
  platform, in any variant, for any audience. The product asserts the provider's own price and
  nothing else. This holds regardless of what the internal classification could compute and
  regardless of the calibration state.
- **A starting point reads as a starting point**, a range as a range, a free price as genuinely
  free, and an examination-dependent price as a price only an examination can settle.
- **No copy states or implies that the platform held, paid, insured or refunded money.** This is
  the obligation the Phase 3 plan proposed as a `CMP-FINANCE-001` notice component, resolved here
  as a content rule with **no component allocated** (`COMPONENT_INVENTORY.md` section 8).
  `NFR-FINANCE-001` makes UX copy verification part of its measurement method, so this is a
  testable rule and not a sentiment. No pay, wallet, balance, top-up, withdraw or platform-refund
  affordance appears beside any amount.
- An amount inside a `snapshot` is presented as **what was agreed at that time**, never as what is
  charged now.
- Where an amount was normalised from another currency, the normalisation provenance is reachable,
  because `currency_normalizations` is append-only and the record can be reproduced.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** the amount and its currency are one bidirectionally isolated unit, so a Latin
currency code inside Arabic text does not reorder and a thousands separator does not migrate.
Column alignment is logical, not physical.

**Long content:** an amount with currency and thousands separators is a sized-for case.
**An amount never truncates and never abbreviates to a compact notation.** The mode statement wraps
rather than truncating. At the largest supported text size amount, mode and provenance stack.

**Accessibility:** the accessible name is the amount **and** its mode, so a screen reader user never
hears a starting point as a total; free is announced as free, not as an empty value; the provenance
disclosure declares its expanded state; the mode is never carried by colour or by an unlabelled
marker alone.

**Bound on:** 24 of 165 wireframes.

`WF-*`: `WF-BOOKING-002`, `WF-CATALOG-002`, `WF-CATALOG-011`, `WF-CLAIMS-004`, `WF-CLAIMS-010`,
`WF-CLINICAL-003`, `WF-CLINICAL-004`, `WF-CLINICAL-010`, `WF-CLINICAL-011`, `WF-CLINICAL-013`,
`WF-CLINICAL-019`, `WF-ELIG-002`, `WF-ELIG-003`, `WF-ELIG-005`, `WF-ELIG-010`, `WF-ELIG-015`,
`WF-ELIG-018`, `WF-ELIG-023`, `WF-FINANCE-001`, `WF-FINANCE-002`, `WF-FINANCE-006`,
`WF-FINANCE-010`, `WF-FINANCE-011`, `WF-FINANCE-012`

`SCR-*`: the same 24 suffixes under `SCR-`. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

`WF-ELIG-023` is bound because the market-observation surface is precisely where an observed price
could be mistaken for a market average. The prohibition has to hold on the surface that produced
the data, not only on the surfaces that read it.

---

### CMP-ELIG-003 — Eligibility explanation

**Purpose:** state the controlling reason a provider, service and branch combination is or is not
currently available, in the audience's terms, with **pending evaluation visibly distinct from a
negative outcome** and no internal symbol reachable.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the `patient` variant only |
| A — Clinic, Admin | `Custom` — a Filament custom view. The gate-result projection and the authorised-only fields are not a stock entry. |

**Traceability:** `FR-ELIG-017`; `FR-ELIG-008`; `FR-ELIG-005`; `FR-ELIG-003`; `FR-ELIG-007`;
`FR-ELIG-013`; `ERR-ELIG-001`; `ERR-ELIG-002`; `NFR-PLATFORM-005`.

**Anatomy**

```
[ CMP-PLATFORM-001 ]              <- the eligibility outcome as its triple
[ controlling reason ]            <- ONE reason: the most restrictive gate's practical meaning
[ what changes it ]               <- what the audience can do, or who can
[ assessed at ]                   <- when, and by which policy version where authorised
[ affected scope ]                <- provider, service, branch. Which combinations are affected.
[ disclosure: evaluated gates ]   <- AUTHORISED AUDIENCES ONLY. Absent, not empty, otherwise.
```

**Variants**

| Variant | Audience | What is reachable |
|---|---|---|
| `patient` | Patient | The practical meaning and whether to wait or choose someone else. No gate list, no internal value, no policy version. |
| `provider` | Clinic | The controlling blocker and the remediation the provider owns — which fact, which evidence, which price, which credential. Still no control that selects a grade, `P`, `H` or `I`, because `FR-ELIG-007` forbids the activation interface itself from offering one. |
| `reviewer` | Admin, authorised roles | Every evaluated gate result, the controlling gate, the evaluation time and the governing policy version. Raw internal risk remains restricted to this explicitly authorised projection. |
| `suspension` | Clinic and Admin | A `SUSPENDED` scope with its invalid dependency and its recalculation state, plus the bookings the suspension holds |

Four variants, one component. The boundary between them is **field filtering**, which is exactly
what `UX_FOUNDATION.md` section 5.1 says it is. Splitting this into three components would put the
algorithm-hiding boundary in three places.

**Density and size:** `reading` for the `patient` variant, `operational` for the others. `dense` is
not offered: this is a reason to be read, not a value to be scanned.

**States**

| State | Behaviour |
|---|---|
| default | the resolved projection for the audience |
| hover | **n/a on Profile C.** Profile A: the gate disclosure. |
| focus | the disclosure and any remediation link |
| active / pressed | the disclosure and links |
| disabled | **n/a** |
| loading | `PENDING_EVALUATION` is a **real status**, not a loading state, and the two must never share a treatment. While the explanation itself is being read the block shows its skeleton; once read, a pending evaluation is rendered as the status it is. |
| error | a failed read is `CMP-PLATFORM-010`. Under `ERR-ELIG-002` no immediate retry is offered, because retry does not advance an evaluation waiting on evidence. |
| selected | **n/a** |
| read-only | eligibility decisions are immutable. Every variant is read-only at full contrast, and no edit affordance exists anywhere in the anatomy. |

**Token mapping**

```
component.elig-003.surface        {semantic.color.surface.default}
component.elig-003.border         {semantic.color.border.subtle}
component.elig-003.reason-text    {semantic.color.text.primary}
component.elig-003.meta-text      {semantic.color.text.secondary}
component.elig-003.icon           {semantic.color.tone.<tone>.icon}
component.elig-003.fill           {semantic.color.tone.<tone>.fill}
component.elig-003.surface-readonly {semantic.color.state.readonly.surface}
component.elig-003.radius         {semantic.radius.surface}
component.elig-003.elevation      {semantic.elevation.flat}
component.elig-003.inset          {semantic.space.inset-lg}
component.elig-003.disclosure     {semantic.motion.disclosure}
```

`PENDING_EVALUATION` resolves to `tone.info` and `NOT_ELIGIBLE` to `tone.restricted`, with
different icons. The separation is in the token source, so a component cannot collapse it without
failing the token gate.

**Content rules**

- **`ELIGIBILITY_REVIEW` requires neutral Patient wording.** It reads as a hold pending a check.
  Never a provider accusation, never an instruction to attend, never an implication of wrongdoing by
  anyone.
- **Pending evaluation is not a negative outcome.** Different tone, different icon, different
  wording. Conflating them violates `FR-ELIG-008`.
- **A clinical risk level is never abbreviated to a single letter** that already means the verified
  review rating. Only its practical consequences are ever worded.
- Internal classification, calibration and risk vocabulary is hidden or translated into practical
  meaning. This binds the **Clinic** panel as well as the Patient app.
- The `suspension` variant states the affected scope and the controlling dependency. It removes
  attendance, start and completion actions structurally and designs **no** override.
- No surface presents provisional catalog data as clinically production-approved.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** the reason reads start to end; the assessment time, the policy version and any
service code are bidirectionally isolated.

**Long content:** an eleven-word Arabic status explanation is the sized-for case. **The controlling
reason never truncates.** At the largest supported text size status, reason, remediation, time and
scope stack in that order.

**Accessibility:** the explanation is a labelled region so it can be reached directly; the
controlling reason is plain text, never a tooltip, because a tooltip is unreachable by touch and
transient for a screen reader; pending and negative outcomes are distinguishable in the
announcement, not only in tone; the gate disclosure declares its expanded state and is absent
rather than empty for unauthorised audiences, so its absence leaks nothing.

**Bound on:** 13 of 165 wireframes.

`WF-*`: `WF-BOOKING-014`, `WF-ELIG-004`, `WF-ELIG-007`, `WF-ELIG-008`, `WF-ELIG-011`,
`WF-ELIG-012`, `WF-ELIG-013`, `WF-ELIG-014`, `WF-ELIG-015`, `WF-ELIG-018`, `WF-ELIG-020`,
`WF-ELIG-021`, `WF-ELIG-022`

`SCR-*`: the same 13 suffixes under `SCR-`. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

One Patient wireframe, six Clinic, six Admin. That distribution is the argument for one component
with audience variants rather than three components: the same immutable decision is being explained
to three audiences with different authorisation.

---

### CMP-CLINICAL-001 — Treatment line

**Purpose:** render one line of a treatment plan so that **every amount names its category, its
reason and what it covers.** There is no surcharge, extra, adjustment or other, and that rule needs
a structural home or it will be papered over with a generic noun.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the `review` variant. Read as an understandable treatment line, never as a professional procedure code. |
| A — Clinic, Admin | `Extended` — a Filament repeater in authoring and a table in review, configured so a line cannot be saved without its category and reason |

**Traceability:** `FR-CLINICAL-001`; `FR-CLINICAL-006`; `FR-CLINICAL-002`; `FR-ELIG-018`;
`FR-CATALOG-002`; `ERR-CLINICAL-002`; `NFR-FINANCE-001`.

**Anatomy**

```
[ what is being treated ]      <- the understandable treatment, and the tooth or site where it
                                  applies
[ category ]                   <- the governed category this amount belongs to. Never "other".
[ reason ]                     <- why this line exists
[ what it covers ]             <- inclusions, populated from the procedure version
[ quantity + unit ]            <- unit populated automatically, quantity defaulted
[ modifiers ]                  <- 0 or more, each naming its own category and option
[ CMP-ELIG-002 ]               <- the line amount in its governed mode
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `authoring` | Plan authoring and stages-and-pricing workspaces | Editable. Procedure search, recent and common choices, provider-price defaults, automatic unit and inclusion population, quantity defaults, duplicate line and quick add. Required structure is retained; only repeated entry is reduced. |
| `review` | Patient plan review and acceptance | Read-only, in understandable language, with the amount and what it covers prominent |
| `oversight` | Admin case oversight and claim review | Read-only, with the governing procedure version reachable |
| `snapshot` | Inside an accepted treatment or financial terms snapshot | Immutable. Read-only at **full contrast**, with its own version identity. |

**Density and size:** `reading` for `review`; `operational` for `oversight`; `dense` for
`authoring`, which is a workspace archetype and one of the five surfaces where density is earned.
In `dense` the row spacing tightens and the Arabic text size does not change.

**States**

| State | Behaviour |
|---|---|
| default | the line |
| hover | **n/a on Profile C.** Profile A: row actions in `authoring`. |
| focus | each editable field in `authoring`, in reading order; the disclosure in the read variants. Keyboard-oriented movement through the repeater is required, because this is one of the two genuinely dense authoring surfaces. |
| active / pressed | row actions |
| disabled | a field the clinician may not set for this procedure version is **absent**, not disabled. A commercial option the governance layer has not made selectable is absent from the option set. |
| loading | the procedure version's unit, inclusions and default price populate visibly; the line does not silently change an amount the clinician has already reviewed |
| error | `ERR-CLINICAL-002` is a commercial integrity violation. It is reported **against the offending field** — category, reason, or the represented treatment — and says which rule it broke, not that the line is invalid. |
| selected | in `authoring`, for duplicate or remove |
| read-only | `review`, `oversight` and `snapshot` |

**Token mapping**

```
component.clinical-001.surface          {semantic.color.surface.default}
component.clinical-001.surface-alt      {semantic.color.surface.subtle}
component.clinical-001.divider          {semantic.color.border.subtle}
component.clinical-001.text-treatment   {semantic.color.text.primary}
component.clinical-001.text-category    {semantic.color.text.secondary}
component.clinical-001.text-reason      {semantic.color.text.primary}
component.clinical-001.text-covers      {semantic.color.text.secondary}
component.clinical-001.border-error     {semantic.color.tone.danger.border}
component.clinical-001.text-error       {semantic.color.tone.danger.text}
component.clinical-001.surface-snapshot {semantic.color.state.readonly.surface}
component.clinical-001.text-snapshot    {semantic.color.state.readonly.text}
component.clinical-001.numeric          {semantic.type.numeric}
component.clinical-001.inset            {semantic.space.inset-sm}
component.clinical-001.stack            {semantic.space.stack-xs}
```

**Content rules**

- **Every amount names its category, its reason and what it covers.** There is **no** surcharge,
  extra, adjustment, miscellaneous or other. No arbitrary amount field exists in any variant, and
  no generic noun is available to hide one behind.
- The `review` variant shows **understandable treatment lines**. Detailed professional procedure
  codes belong to the clinician and admin variants; the patient reads what the treatment is, not
  its catalogue identity.
- A modifier names its own category and option. An unexplained charge is exactly what
  `FR-CATALOG-002` and `FR-CLINICAL-006` exist to prevent.
- The `snapshot` variant is presented as what was agreed at that time. No edit, delete or
  recalculate affordance exists in it.
- No copy states or implies that the platform held, paid, insured or refunded money.
- Strings, including category names, are Session 4 `TXT-*`; the governed category set itself is
  product data.

**Right-to-left:** treatment and category at `start`, amount at `end` with logical alignment. Tooth
and site notation, procedure codes and version identifiers are bidirectionally isolated.

**Long content:** a plan with a few dozen lines is the sized-for case. **The amount, the category
and the reason never truncate**; what-it-covers truncates with the full text reachable in the same
surface. At the largest supported text size each line becomes a stacked block and the amount stays
adjacent to its category.

**Accessibility:** in `authoring` each field has a visible persistent label and its validation error
is bound to the field and states the fix; the repeater's add, duplicate and remove controls are
keyboard reachable and announce what they acted on; in the read variants each line's accessible
name carries treatment, category and amount together, so an amount is never announced without what
it is for.

**Bound on:** 10 of 165 wireframes.

`WF-*`: `WF-CLAIMS-010`, `WF-CLINICAL-003`, `WF-CLINICAL-004`, `WF-CLINICAL-009`,
`WF-CLINICAL-010`, `WF-CLINICAL-011`, `WF-CLINICAL-013`, `WF-CLINICAL-019`, `WF-FINANCE-001`,
`WF-FINANCE-006`

`SCR-*`: the same 10 suffixes under `SCR-`. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---

### CMP-CLINICAL-002 — Change disclosure

**Purpose:** show what changed, from what to what, why, and on whose authority — for a patient
deciding whether to re-accept, and for an administrator inspecting a governed change. Two
audiences, one anatomy.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the `amendment` variant |
| A — Clinic, Admin | `Custom` — a Filament custom view. A before-and-after pairing with a stated change set is not a stock entry. |

**Traceability:** `FR-CLINICAL-007`; `FR-CLINICAL-002`; `FR-POLICY-001`; `FR-POLICY-002`;
`FR-CATALOG-002`; `FR-CLAIMS-003`; `NFR-AUDIT-003`; `ERR-CLINICAL-001`.

**Anatomy**

```
[ what changed ]                 <- the change set, itemised. Not two full documents to compare
                                    by eye.
+----------------------------+----------------------------+
| as it was                  | as it is proposed / now    |
| [ prior version identity ] | [ new version identity ]   |
| the changed values         | the changed values         |
+----------------------------+----------------------------+
[ why ]                          <- the recorded reason
[ CMP-PLATFORM-013 ]             <- who changed it
[ the prior version stays reachable and immutable ]
```

The change set is itemised. Rendering two complete documents side by side and leaving the reader to
find the difference is how a material amendment gets accepted unread.

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `amendment` | Treatment plan amendment and re-acceptance | Patient-facing. **What changed is disclosed before the amendment can be accepted**, and the prior accepted snapshot stays visible and immutable. |
| `version` | Governed catalog, procedure, commercial option and policy versions | Prior against new, with effective periods and the review-gate state |
| `requested-changes` | Application status and requested changes | The reviewer's itemised requests against what the applicant submitted, so the applicant changes only what was asked and does not redo the form |
| `deadline-history` | Claim evidence and deadlines | The original deadline against the effective one, with the appended events that moved it |
| `resolution` | Dispute resolution | The disputed record against the projection after the appended resolution. Nothing is overwritten. |
| `reproduction` | Historical decision reproduction | The reproduced outcome against the recorded one, with match or mismatch as the verdict |

Six variants, one component. `reproduction` in particular is a comparison whose verdict is an
integrity result; promoting it to its own component would have failed criterion 1 outright, since it
appears on one wireframe.

**Density and size:** `reading` renders the two sides **stacked**, prior first, because a
side-by-side comparison in one reading column is a false economy on a phone; `operational` and
`dense` render them side by side. The stacking is not a fallback — it is the Profile C treatment.

**States**

| State | Behaviour |
|---|---|
| default | the change set with both sides |
| hover | **n/a on Profile C.** Profile A: the disclosure and version links. |
| focus | the disclosure, the version links, and the accept or decide control where the surface carries one |
| active / pressed | the disclosure and links |
| disabled | in the `amendment` variant, accept is blocked until the change set has been disclosed. This is the narrow legitimate disabled case: the same actor becomes able to act by doing something visible here. |
| loading | both sides load together. **A one-sided render is prohibited**, because a change set with one side missing reads as the whole truth. |
| error | if either side cannot be read the component renders `CMP-PLATFORM-010` and **no accept or decide action is offered**. Accepting a change you were not shown is the failure this component prevents. |
| selected | in `version`, the two versions being compared |
| read-only | the prior side is always read-only at full contrast, in every variant |

**Token mapping**

```
component.clinical-002.surface-prior   {semantic.color.state.readonly.surface}
component.clinical-002.text-prior      {semantic.color.state.readonly.text}
component.clinical-002.surface-new     {semantic.color.surface.default}
component.clinical-002.text-new        {semantic.color.text.primary}
component.clinical-002.divider         {semantic.color.border.default}
component.clinical-002.changed-marker  {semantic.color.tone.info.icon}
component.clinical-002.changed-fill    {semantic.color.tone.info.fill}
component.clinical-002.label           {semantic.color.text.secondary}
component.clinical-002.radius          {semantic.radius.surface}
component.clinical-002.elevation       {semantic.elevation.flat}
component.clinical-002.inset           {semantic.space.inset-md}
component.clinical-002.disclosure      {semantic.motion.disclosure}
```

The prior side uses the read-only surface at **full-contrast text**. Dimming the prior version would
make the thing the patient is being asked to compare against the harder of the two to read, which is
the inverse of what the component is for. A changed value is marked by an icon and a label as well
as a fill; the change is never carried by colour alone.

**Content rules**

- **The prior version stays visible and immutable.** An accepted treatment snapshot and a financial
  terms snapshot are never rewritten, and a superseding version never removes its predecessor from
  reach.
- **What changed is disclosed before acceptance is possible.** `FR-CLINICAL-007` requires disclosed
  amendment and re-acceptance; this component is where "disclosed" becomes structural.
- An amount that changed shows both amounts, each with its own mode, through `CMP-ELIG-002`.
- The `requested-changes` variant lists **only what was asked**, itemised, so the applicant changes
  only that.
- The recorded reason is the reason as recorded. It is never reconstructed or summarised into
  something the record does not say.
- No variant states or implies that money moved because terms changed.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** prior at `start`, new at `end`, in both directions. In the stacked treatment
prior comes first in reading order. Version identifiers, effective dates and amounts are
bidirectionally isolated.

**Long content:** a change set with many items pages or discloses rather than rendering everything
at once. **A changed value never truncates on either side**, because a truncated before-value makes
the comparison useless. At the largest supported text size the side-by-side treatment stacks.

**Accessibility:** the two sides are labelled regions named "as it was" and "as it is", so a screen
reader user knows which side they are in without inferring it from position; each changed item is
announced as changed, with both values, in one unit; the accept control's accessible name states
that it accepts the amended terms, not merely "accept"; the change count is announced when the
disclosure opens.

**Bound on:** 15 of 165 wireframes.

`WF-*`: `WF-CATALOG-004`, `WF-CATALOG-008`, `WF-CATALOG-010`, `WF-CLAIMS-007`, `WF-CLAIMS-011`,
`WF-CLINICAL-003`, `WF-CLINICAL-004`, `WF-CLINICAL-013`, `WF-CLINICAL-019`, `WF-ELIG-019`,
`WF-FINANCE-011`, `WF-IDENTITY-017`, `WF-POLICY-001`, `WF-POLICY-003`, `WF-POLICY-004`

`SCR-*`: the same 15 suffixes under `SCR-`. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---

### CMP-POLICY-001 — Governed version header

**Purpose:** state which version this is, when it is effective, what review gate it has passed, and
that its history remains readable. Configurable does not mean instant or unreviewed.

| Profile | Realization |
|---|---|
| C — Patient | **`n/a`, and deliberately.** A version identifier, an effective period and a review-gate state are internal governance vocabulary. The patient sees the practical consequence through `CMP-PLATFORM-002`, never the governance record. |
| A — Clinic, Admin | `Extended` — a Filament infolist section with a version selector, configured |

**Traceability:** `FR-POLICY-001`; `FR-POLICY-002`; `FR-CATALOG-002`; `FR-CATALOG-003`;
`FR-ELIG-019`; `FR-OPS-003`; `NFR-AUDIT-003`; `NFR-PLATFORM-007`.

**Anatomy**

```
[ what this governs ]            <- the policy key, definition or catalog scope
[ version identity ]             <- version, and audience where the machine has one
[ CMP-PLATFORM-001 ]             <- the version's lifecycle state
[ effective period ]             <- from, and until where known
[ review gate state ]            <- which gates, their state, and their expiry
[ CMP-PLATFORM-013 ]             <- who reviewed or approved, and when
[ history: prior versions ]      <- always reachable, always read-only
```

**Variants**

| Variant | Over | Note |
|---|---|---|
| `definition` | Service definitions and procedure item versions | Procedure versions reuse the service-definition machine unchanged, so they reuse this variant unchanged. |
| `policy` | Policy versions — price bands, market calibration, commercial options, proposal validity, currency normalisation | One machine, many keys. |
| `launch-gate` | Append-only launch-gate decisions | **Production readiness fails closed on an expired gate**, and `expired` is the status most likely to be misread as still approved. |
| `credential` | Immutable clinical reviewer credential snapshots | A licensed review is only as good as the credential state behind it. |
| `calibration` | Market calibration state | The calibration state is shown as a governance state. **The calibration output itself stays internal.** |

**Density and size:** `operational` by default; `dense` for the version-history list only. Not
offered in `reading`, because this component has no Profile C surface.

**States**

| State | Behaviour |
|---|---|
| default | the current version's header |
| hover | **n/a on Profile C** — there is no Profile C surface at all. Profile A: the version selector and history links. |
| focus | the version selector and each history link |
| active / pressed | the version selector |
| disabled | a version transition the actor may not perform is **absent with its reason**, not disabled. A review gate the actor may not decide is visible as pending with its owner named, and carries no control for this actor. |
| loading | absent until the version is known. **A surface must not render governed content without stating which version produced it** — that is how provisional content gets read as approved. |
| error | if the version cannot be read the surface renders `CMP-PLATFORM-010` and does not present the content as governed |
| selected | the version being viewed, in the history list |
| read-only | prior versions, launch-gate decisions and credential snapshots are immutable and read at full contrast |

**Token mapping**

```
component.policy-001.surface          {semantic.color.surface.subtle}
component.policy-001.border           {semantic.color.border.default}
component.policy-001.text-scope       {semantic.color.text.primary}
component.policy-001.text-version     {semantic.color.text.primary}
component.policy-001.text-meta        {semantic.color.text.secondary}
component.policy-001.gate-icon        {semantic.color.tone.<tone>.icon}
component.policy-001.gate-fill        {semantic.color.tone.<tone>.fill}
component.policy-001.gate-border      {semantic.color.tone.<tone>.border}
component.policy-001.surface-historical {semantic.color.state.readonly.surface}
component.policy-001.radius           {semantic.radius.surface}
component.policy-001.elevation        {semantic.elevation.flat}
component.policy-001.inset            {semantic.space.inset-md}
```

The header sits on `surface.subtle` so it reads as a frame around governed content rather than as
content. Its metadata uses `text.secondary`, which is the ramp step that clears contrast **on the
subtle surface** — the pairing that found the correction recorded in `DESIGN_TOKENS.md` section 2.2.

**Content rules**

- **No Patient surface renders this component**, in any variant, in any disclosure.
- A `scheduled` version states when it takes effect. An `active` one states since when. A
  `superseded` one names its successor and remains readable.
- **An expired launch gate reads as expired, not as approved.** Production readiness fails closed on
  it and the header says so.
- **No surface presents provisional catalog data as clinically production-approved.** Where
  `Q-CATALOG-001` or `Q-ELIG-001` still gates content, the version's state says so rather than the
  content implying otherwise.
- The `calibration` variant shows the calibration **state**. Grade bands, price bands, risk
  thresholds, calibration minimums and market sample thresholds are governed product data and are
  never rendered as design values.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** scope at `start`, version and effective period at `end`; version identifiers and
dates are bidirectionally isolated. A version identifier is Latin-with-digits and must not render
its digits in one system and its letters in another.

**Long content:** the governed scope name wraps rather than truncating. **The version identity, the
effective period and the gate states never truncate.** The history list pages rather than growing
without bound.

**Accessibility:** the header is a labelled region announced before the governed content it frames,
so a reviewer never reads content without knowing which version it is; each gate's state is carried
by wording and icon as well as tone; the version selector announces the current value as selected;
prior versions are reachable by keyboard from the header rather than only from a separate page.

**Bound on:** 16 of 165 wireframes.

`WF-*`: `WF-CATALOG-003`, `WF-CATALOG-004`, `WF-CATALOG-005`, `WF-CATALOG-006`, `WF-CATALOG-007`,
`WF-CATALOG-008`, `WF-CATALOG-009`, `WF-CATALOG-010`, `WF-CATALOG-011`, `WF-ELIG-018`,
`WF-ELIG-019`, `WF-ELIG-023`, `WF-POLICY-001`, `WF-POLICY-002`, `WF-POLICY-003`, `WF-POLICY-004`

`SCR-*`: the same 16 suffixes under `SCR-`. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

All 16 are Admin. That is the correct shape: governance is an Admin responsibility, and the Clinic
panel reads the **consequences** of a governed version through `CMP-ELIG-003` and `CMP-CLINICAL-001`
rather than the version record itself.

---

### CMP-OPS-001 — Work item row

**Purpose:** render one operational work item with its five states **and its two independent
flags**. The row a supervisor most needs to find is simultaneously in progress, escalated and
overdue, so flags cannot be states.

| Profile | Realization |
|---|---|
| C — Patient | `n/a`. Work items are staff infrastructure. The Patient equivalent is `CMP-PLATFORM-015`, which states an obligation rather than an assignment. |
| A — Clinic, Admin | `Extended` — a Filament table row and a dashboard widget row, configured with a separate flag column |

**Traceability:** `FR-OPS-001`; `FR-IDENTITY-001`; `FR-ELIG-003`; `NFR-IDENTITY-001`;
`NFR-PLATFORM-008`.

**Anatomy**

```
[ type ][ CMP-PLATFORM-001 ][ flag slot ][ subject / linked record ][ owner ][ due ][ > ]
                  |              |                                      |       |
                  |              |                                      |       +-- CMP-PLATFORM-005
                  |              |                                      +-- CMP-PLATFORM-013
                  |              |                                          assigned-to-person
                  |              +-- escalated, overdue, or both. ITS OWN SLOT. Never merged
                  |                  into the status, never recolouring it.
                  +-- OPEN | ASSIGNED | IN_PROGRESS | WAITING | COMPLETED
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `feed` | Clinic work feed | Scoped to the provider and branch context. Ordered by what needs doing. |
| `queue` | Admin work queue | Adds responsibility scope and a blocking reason. Filterable and persistent. |
| `detail` | Work item detail | The full item plus its escalation history through `CMP-PLATFORM-008` |
| `checklist` | Post-approval onboarding checklist | The same items projected as a checklist, because that surface derives its state from work items rather than owning its own |
| `embedded` | Verification workbench and booking eligibility review, where assigned work appears beside the record it concerns | Compact. No reassignment control unless the actor holds it. |

**Density and size:** `operational` in `feed`, `detail` and `checklist`; `dense` in the `queue`
table body, where volume is genuinely very high. Row targets clear `semantic.size.target-floor` in
`dense` once the hit area is counted — and `PO-UX-07` records these actors as working with a high
interruption rate on desktop and tablet, so the target is not shaved to the floor merely because
the mode allows it.

**States**

| State | Behaviour |
|---|---|
| default | the item's status plus any flags |
| hover | **n/a on Profile C** — no Profile C surface. Profile A: the row. |
| focus | the row and each control within it, in reading order |
| active / pressed | the row and its controls |
| disabled | an action the actor's scope does not permit is **absent**. A work item outside the actor's responsibility scope is absent from the projection entirely, because the item's existence can itself be information. |
| loading | a row skeleton at the row's own height; a refresh keeps rows in place |
| error | a failed read is `CMP-PLATFORM-010`; a failed claim or assignment keeps the row's prior owner and states the conflict rather than showing an optimistic owner |
| selected | where the row is chosen for an assignment action |
| read-only | `COMPLETED` items and the escalation history |

**Token mapping**

```
component.ops-001.row-surface      {semantic.color.surface.default}
component.ops-001.row-divider      {semantic.color.border.subtle}
component.ops-001.text-type        {semantic.color.text.primary}
component.ops-001.text-meta        {semantic.color.text.secondary}
component.ops-001.flag-icon        {semantic.color.tone.danger.icon}
component.ops-001.flag-fill        {semantic.color.tone.danger.emphasis}
component.ops-001.flag-text        {semantic.color.tone.danger.on-emphasis}
component.ops-001.flag-border      {semantic.color.tone.danger.emphasis-border}
component.ops-001.row-hover        {semantic.color.action.secondary-hover}
component.ops-001.row-selected     {semantic.color.state.selected.surface}
component.ops-001.numeric          {semantic.type.numeric}
component.ops-001.inline           {semantic.space.inline-sm}
```

The flag tokens resolve to the danger tone's **emphasis** set, and the status chip resolves to its
own tone independently. That independence is the mechanism: a flag cannot recolour a status because
they read from different token groups. `state-flag.escalated` and `state-flag.overdue` both carry
`solid` emphasis and different icons, so two flags on one row remain distinguishable.

**Content rules**

- **A flag never replaces or recolours the status.** A row that is `IN_PROGRESS`, escalated and
  overdue shows all three, in three slots. This is the failure `PO-UX-08` exists to prevent and the
  reason `state-flag` is a separate token group.
- The blocking reason is stated in the `queue` variant, because a work item nobody can progress is
  the item most likely to age silently.
- The linked record is reachable in one step, and the row states what kind of record it is.
- No internal queue key, worker identifier or job name is user-facing.
- Strings, including work item type names, are Session 4 `TXT-*`.

**Right-to-left:** type and status at `start`, owner and due at `end`, with logical alignment. Due
times use tabular lining figures so they align down the column and are bidirectionally isolated.

**Long content:** the linked-record identity truncates with the full value reachable. **The status,
the flags, the owner and the due time never truncate.** At the largest supported text size the row
stacks rather than scrolling horizontally.

**Accessibility:** the row's accessible name carries type, status, flags, owner and due time in one
unit, so a supervisor using a screen reader can triage a queue without entering each row; the flags
are announced as flags, distinct from the status, and are never conveyed by colour alone; sort and
filter state on the `queue` variant is announced; the claim or assign control is keyboard reachable
without a hover-revealed menu.

**Bound on:** 8 of 165 wireframes.

`WF-*`: `WF-ELIG-014`, `WF-ELIG-022`, `WF-IDENTITY-021`, `WF-OPS-001`, `WF-OPS-002`, `WF-OPS-003`,
`WF-PLATFORM-003`, `WF-PLATFORM-004`

`SCR-*`: `SCR-ELIG-014`, `SCR-ELIG-022`, `SCR-IDENTITY-021`, `SCR-OPS-001`, `SCR-OPS-002`,
`SCR-OPS-003`, `SCR-PLATFORM-003`, `SCR-PLATFORM-004`

Low wireframe count, high role count: the `OPS` role sweep lands six staff roles on these surfaces,
which is why an eight-wireframe component still earns its allocation under criterion 3.

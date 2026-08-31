# Component Inventory — Cross-Cutting Components

**Phase:** UX 3 — Design System, Session 3 of 7
**Index, allocation rule and coverage:** `COMPONENT_INVENTORY.md`
**Binding:** `WIREFRAME_COMPONENT_MAP.md` is the authoritative `WF-*` to `CMP-*` relation. The
reach figures and wireframe lists in this file are computed from it.

Rules stated once in the index and binding every block here, not repeated per block:

- **No hover state is ever emitted on Profile C.** Each block states it anyway, because a hover
  row emitted for the Patient app is a defect and the omission must not be inferred.
- **Every anatomy is defined in `start` and `end` terms.** Logical properties only.
- **Disabled is not an authorization control.** An action removed for authorization or lifecycle
  reasons is absent and explained.
- **Read-only is not disabled.** The nine immutable or append-only entities render at full
  contrast.
- **Density follows the archetype and profile**, never the platform.
- Every component token resolves to `semantic.*`. Groups live in `design_tokens/component.json`.

---

### CMP-PLATFORM-001 — State chip

**Purpose:** render exactly one lifecycle status as an inseparable tone, icon and label triple, so
that a status can never reach a surface as a colour. This is the single most repeated element in
the product and the structural home of `NFR-PLATFORM-005`.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a React Native component consuming the state triple |
| A — Clinic, Admin | `Extended` — a Filament badge column and a badge entry, configured from the same triple. Filament's own colour-only badge configuration is prohibited. |

**Traceability:** `NFR-PLATFORM-005`; `FR-ELIG-008`; `FR-ELIG-013`; `FR-BOOKING-003`;
`FR-CLINICAL-007`; `FR-CLAIMS-003`.

**Anatomy**

```
[ icon ][ label ]                       start to end, in reading order
  |        |
  |        +-- the status label. NEVER omitted. Never abbreviated to a letter.
  +----------- one of 36 governed Heroicons identifiers. Never the only carrier of meaning.

optional trailing slot, outside the chip and never inside it:
[ icon ][ label ]  [ flag ][ flag ]     see CMP-OPS-001 and section 5.4 of DESIGN_TOKENS
```

The chip has exactly three parts and no fourth. It carries no count, no timestamp, no action and
no chevron. A status that needs a reason, a date or an action is `CMP-PLATFORM-002`.

**Variants**

| Variant | Basis | Note |
|---|---|---|
| `emphasis-muted` | `state.<machine>.<STATUS>.emphasis` resolves to `muted` | Inert or not yet started. Neutral fill, no tone colour. |
| `emphasis-subtle` | resolves to `subtle` | The default treatment, 53 of the 82 statuses. |
| `emphasis-outline` | resolves to `outline` | A closed or historical state that needs no attention. |
| `emphasis-solid` | resolves to `solid` | The 12 statuses that both block the actor and carry a deadline whose lapse cannot be undone. |
| `flag` | `state-flag.escalated`, `state-flag.overdue` | Renders in its own slot. **Never replaces or recolours the status chip.** |

The variant is **not a design choice per screen.** It is read from the token source. A surface
that picks an emphasis is bypassing the state channel.

**Density and size**

| Mode | Chip height | Icon | Type |
|---|---|---|---|
| `reading` | `semantic.size.control-lg` line box | `semantic.size.icon-md` | `semantic.type.label` |
| `operational` | `semantic.size.control-md` line box | `semantic.size.icon-sm` | `semantic.type.label` |
| `dense` | `semantic.size.control-sm` line box | `semantic.size.icon-sm` | `semantic.type.dense-label` |

The label never shrinks below `semantic.type.dense-label`. Density compresses the padding around
the triple, never the triple.

**States**

| State | Behaviour |
|---|---|
| default | the resolved triple |
| hover | **n/a on Profile C.** On Profile A a chip is not interactive by default; where a chip is the row's link target, hover belongs to the row, not the chip. |
| focus | only when interactive. `semantic.color.focus.ring` plus `focus.ring-contrast`, at `semantic.focus.width` with `semantic.focus.offset`. The ring is not derived from the action colour, so it survives on every emphasis fill. |
| active / pressed | only when interactive. `semantic.opacity.pressed`. |
| disabled | **n/a.** A status is a fact. A fact is never disabled. |
| loading | **n/a on the chip.** A status that has not loaded is absent, and the surface renders its own loading state. A chip must never render a placeholder that could be mistaken for a status. |
| error | **n/a.** A status that failed to load is `CMP-PLATFORM-010`, not a chip in an error variant. |
| selected | **n/a.** A chip is not a selectable unit. |
| read-only | the normal case. Full contrast in every emphasis. |

**Token mapping**

```
component.platform-001.icon           {semantic.color.tone.<tone>.icon}
component.platform-001.text           {semantic.color.tone.<tone>.text}
component.platform-001.fill           {semantic.color.tone.<tone>.fill}
component.platform-001.border         {semantic.color.tone.<tone>.border}
component.platform-001.fill-solid     {semantic.color.tone.<tone>.emphasis}
component.platform-001.text-solid     {semantic.color.tone.<tone>.on-emphasis}
component.platform-001.border-solid   {semantic.color.tone.<tone>.emphasis-border}
component.platform-001.radius         {semantic.radius.chip}
```

`semantic.radius.chip` is the small radius, not the full radius. Direction rule 3.9 prohibits
pill-shaped status chips: a full pill reads as a marketing tag, and these are authoritative
states.

**Content rules**

- One chip renders one status of one machine. A surface showing a booking status and its
  eligibility-review status shows two chips, never a merged one.
- The label is a Session 4 `TXT-*` allocation. The state channel deliberately carries no label in
  any language, so this component has no default string.
- **Prohibited:** a status label that is a bare enumeration value; a single letter that collides
  with the verified review rating; any internal classification, calibration or risk symbol; any
  emoji, on any platform, in any position.
- `PENDING_EVALUATION` and `NOT_ELIGIBLE` are different tone **and** different icon. A chip
  implementation that maps both to one visual is a requirement violation.

**Right-to-left:** the icon occupies the `start` slot in both directions; it is mirrored only where
the governed icon is directional. `arrow-uturn-left` and `arrows-right-left` mirror.
`clock`, `check-circle` and the rest do not.

**Long content:** an eleven-word Arabic status label wraps inside the chip to at most two lines and
never truncates. At the largest supported text size the chip becomes a block and the row it sits in
stacks. A status label is never elided.

**Accessibility:** the chip announces as one unit, name plus role plus state; the icon is
decorative to assistive technology because the label already carries the meaning, so the icon takes
no separate accessible name and never becomes the only announcement. Contrast for the icon and the
text is verified in both modes by the token gate. A status that changes without user action is
announced live by the owning surface, not by the chip.

**Bound on:** 155 of 165 wireframes. Every wireframe whose screen catalog entry records at least one lifecycle status. The 10 it is not bound on are exactly the 10 that record none: patient entry, phone and code entry, provider search, join, provider type, both panel sign-ins, drill-down and export, and the audit explorer, whose events are facts rather than lifecycles.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-002 — State summary

**Purpose:** answer the four questions Principle 1 requires, in one place, in a fixed order: what
state is this in, what reason controls that, when was it assessed, and what can be done now. This
is the most prominent thing on any detail surface — direction rule 3.1, evidence before decoration.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Custom` — a Filament infolist section with a custom entry, because the ordering and the reason slot are load-bearing and stock entry layout does not guarantee them |

**Traceability:** `FR-ELIG-017`; `FR-BOOKING-003`; `FR-CLINICAL-002`; `FR-CLAIMS-004`;
`NFR-PLATFORM-005`; `ERR-ELIG-002`.

**Anatomy**

```
+--------------------------------------------------------------+
| [CMP-PLATFORM-001]        <- the authoritative state, first   |
| controlling reason        <- one reason, in the audience's    |
|                              terms. Not a list of gates.      |
| assessed at / effective   <- when, and by which version       |
| [CMP-PLATFORM-013]        <- who, where a human decided       |
| [CMP-PLATFORM-005]        <- where a deadline is running      |
| [ disclosure: full detail ]  <- IX-PLATFORM-008, on demand    |
+--------------------------------------------------------------+
   [CMP-PLATFORM-004]       <- the action bar, adjacent, never
                               nested inside the summary
```

The order is fixed and is not a per-screen decision. State, reason, time, owner, deadline. A
surface that leads with anything else has inverted the product.

**Variants**

| Variant | Audience | What changes |
|---|---|---|
| `patient` | Profile C | The reason is the practical consequence. No gate list, no internal symbol, no version identifier is reachable. |
| `operator` | Clinic | The reason is the controlling blocker plus what the provider can do about it. Still no internal classification control or value. |
| `reviewer` | Admin, authorized roles only | The reason may name the governing policy version and the controlling gate. Raw internal risk stays out of every projection except the explicitly authorized Admin one. |
| `historical` | any | The record is one of the nine immutable entities. Read-only at full contrast, with its own effective period, and no edit affordance anywhere in the anatomy. |

Three audience variants, one component. `UX_FOUNDATION.md` section 5.1 fixes that the same record
produces three materially different projections and calls it a field-filtering requirement, not a
screen-splitting one. Three components would be three places to get the boundary wrong.

**Density and size:** `reading` gives the reason `semantic.type.body` and the block
`semantic.space.inset-lg`; `operational` uses `inset-md`; `dense` is **not offered** — a state
summary is never compressed to dense, because it is the region a reader must not skim past. The
workspace archetype uses the `operational` treatment.

**States**

| State | Behaviour |
|---|---|
| default | the resolved projection |
| hover | **n/a on Profile C.** On Profile A the disclosure control hovers; the summary body does not. |
| focus | the disclosure control and any link inside the reason. `semantic.color.focus.ring`. |
| active / pressed | the disclosure control only |
| disabled | **n/a.** A state summary is a read. |
| loading | the summary renders its skeleton in place, keeping the block's height so the action bar below it does not move. `motion.transition.progress`. A spinner alone is prohibited. |
| error | the summary is replaced by `CMP-PLATFORM-010` fetch-failure, which preserves the last known safe context and retries in place. It never renders a partial state as if it were authoritative. |
| selected | **n/a** |
| read-only | the `historical` variant. Full contrast, `semantic.color.state.readonly.*`. |

**Token mapping**

```
component.platform-002.surface            {semantic.color.surface.default}
component.platform-002.surface-historical {semantic.color.state.readonly.surface}
component.platform-002.border             {semantic.color.border.subtle}
component.platform-002.text-reason        {semantic.color.text.primary}
component.platform-002.text-meta          {semantic.color.text.secondary}
component.platform-002.radius             {semantic.radius.surface}
component.platform-002.elevation          {semantic.elevation.flat}
component.platform-002.inset              {semantic.space.inset-lg}
component.platform-002.stack              {semantic.space.stack-sm}
```

Flat by default. Direction rule 3.4 reserves elevation for surfaces that genuinely float, and a
state summary does not float.

**Content rules**

- **Exactly one controlling reason.** `FR-ELIG-005` makes the final outcome come from the most
  restrictive gate, so the summary names that gate's practical meaning, not every gate evaluated.
  The full evaluation is behind the disclosure, and only where the audience is authorized to see
  it.
- Pending evaluation is visibly distinct from a negative outcome, in tone, icon and reason
  wording. Conflating them violates `FR-ELIG-008`.
- **No copy in any variant may state or imply that the platform held, paid, insured or refunded
  money.** This is the obligation the Phase 3 plan proposed as a `CMP-FINANCE-001` notice
  component; this session resolved it as a content rule carried here and by `CMP-ELIG-002`
  instead, and **no such component is allocated** (`COMPONENT_INVENTORY.md` section 8). It binds
  the `patient` variant hardest, because that is where the assumption is most natural.
- Protection is stated as its documented conditional meaning with funded protection disabled.
  Never insurance, never reimbursement, never a guaranteed result.
- A pending reschedule proposal is summarised **alongside** the original confirmed appointment,
  never instead of it. See `IX-BOOKING-002`.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** the block reads start to end; the assessed-at time and any version identifier
are isolated so a Latin identifier inside Arabic text does not reorder.

**Long content:** the reason is never truncated at any size. At the largest supported text size
state, reason, time, owner and deadline stack in that order. A truncated controlling reason is a
correctness failure.

**Accessibility:** the summary is a labelled region so a screen reader can jump to it; the reason
is plain text, not a tooltip. Where the state changes without user action the region announces
politely. The disclosure control declares its expanded state. Focus must not be obscured by the
panel's sticky chrome when the summary is reached by keyboard.

**Bound on:** 68 of 165 wireframes. Every `detail` and `dashboard` wireframe that shows a status: 63 detail plus 5 dashboard. By domain: IDENTITY 10, ELIG 10, CLINICAL 8, PLATFORM 8, CATALOG 6, CLAIMS 6, BOOKING 5, REVIEWS 4, AUDIT 3, FINANCE 3, OPS 3, POLICY 2.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-003 — Subject context header

**Purpose:** state whose case this is, which provider and branch it belongs to, and on whose
authority the current actor is acting. Acting on the wrong person's case is a named consequence of
error for two actors, so this is a safety component, not chrome.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — persistent, carrying the global active-patient context Phase 1 fixed |
| A — Clinic, Admin | `Extended` — a Filament render hook in the panel shell for the panel-global provider and branch context, plus a page-level subject block on case surfaces |

**Traceability:** `FR-IDENTITY-003`; `FR-IDENTITY-001`; `NFR-IDENTITY-001`; `ERR-IDENTITY-002`.

**Anatomy**

```
[ subject identity ] [ relationship / authority ] [ scope: provider . branch ] [ switch ]
       |                        |                             |                    |
       |                        |                             |                    +-- only where
       |                        |                             |                        more than one
       |                        |                             |                        scope exists
       |                        |                             +-- which provider and branch the
       |                        |                                 action will apply to
       |                        +-- acting as guardian, as invited staff under a scoped grant, or
       |                            as oneself. Never implied, always stated.
       +-- whose case
```

**Variants**

| Variant | Where | What it must carry |
|---|---|---|
| `self` | Patient acting for themselves | Subject identity only. The authority slot is absent rather than empty, because "as yourself" is noise on every screen. |
| `representation` | Patient acting under a guardian or legal-basis grant | Subject identity **and** the authority, always both. The grant's effective period is reachable. Revocation is reachable from here regardless of any booking state. |
| `provider-scope` | Clinic panel, panel-global | Provider and branch. Where an actor works across branches the current scope is unambiguous before any action is possible. |
| `case-subject` | Clinic and Admin case surfaces | The patient the case belongs to, plus the provider and branch scope. |
| `staff-scope` | Admin | The acting staff identity and the coarse capability set in force, so a reviewer knows what authority their own decision carries. |

**Density and size:** all three modes render the same content. `reading` gives the subject
`semantic.type.heading-4`; `operational` and `dense` use `semantic.type.body-strong`. The switch
control never drops below `semantic.size.target-floor` and never below
`semantic.size.target-primary` on Profile C.

**States**

| State | Behaviour |
|---|---|
| default | the current subject and scope |
| hover | **n/a on Profile C.** Profile A: the switch control only. |
| focus | the switch control and the authority link. The header is reachable early in the tab order because it is the safety context. |
| active / pressed | the switch control |
| disabled | **n/a.** Where only one scope exists the switch is **absent**, not disabled. |
| loading | the header renders the last known subject and marks the scope as refreshing; it never renders an empty subject over a populated surface. If the subject itself is unknown, the surface does not render its content at all. |
| error | on an authorization change the header is the surface that says the scope is no longer available, and `IX-PLATFORM-007` removes the actions. |
| selected | the active scope in the switch list uses `semantic.color.state.selected.*`. |
| read-only | a historical record names the subject as at the recorded time and marks it so. |

**Token mapping**

```
component.platform-003.surface        {semantic.color.surface.default}
component.platform-003.border-end     {semantic.color.border.subtle}
component.platform-003.text-subject   {semantic.color.text.primary}
component.platform-003.text-authority {semantic.color.text.secondary}
component.platform-003.icon           {semantic.color.text.secondary}
component.platform-003.selected-fill  {semantic.color.state.selected.surface}
component.platform-003.selected-border {semantic.color.state.selected.border}
component.platform-003.inset          {semantic.space.inset-sm}
component.platform-003.inline         {semantic.space.inline-sm}
```

**Content rules**

- The authority is **stated, never implied.** A guardian acting for a dependent sees both names and
  the relationship, on every surface, in every archetype.
- Revocation of a representation grant is reachable from the `representation` variant regardless of
  booking state. `ERR-BOOKING-002` is booking-domain only and may not surface here.
- No internal scope identifier, tenant key or grant primary key is user-facing.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** subject at `start`, scope at `end`. Latin clinic legal names and branch names
inside Arabic text are isolated.

**Long content:** a long clinic legal name truncates with the full value reachable in the same
surface; the **subject name never truncates**. At the largest supported text size the header
becomes two lines rather than eliding the authority.

**Accessibility:** the header is a landmark-adjacent labelled region announced on entry to any
authenticated surface. The switch is a listbox or menu with the current value announced as
selected. Where the subject is a represented person the accessible name includes the relationship,
because a guardian relying on a screen reader is exactly the actor who must not act on the wrong
case.

**Bound on:** 156 of 165 wireframes. Every wireframe except the nine pre-authentication ones, where no subject exists yet: `WF-IDENTITY-001`, `WF-IDENTITY-002`, `WF-IDENTITY-003`, `WF-IDENTITY-009`, `WF-IDENTITY-010`, `WF-IDENTITY-011`, `WF-IDENTITY-019`, `WF-IDENTITY-025`, `WF-PLATFORM-005`.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-004 — Action bar

**Purpose:** present the actions available on this record, to this actor, in this lifecycle state,
and hold the rule that an unavailable action is **absent and explained** rather than disabled.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a fixed action region within the reading column, respecting the safe area |
| A — Clinic, Admin | `Extended` — Filament page and table actions, configured. Action visibility is bound to the server-authorised action set, never to a client guess. |

**Traceability:** `FR-IDENTITY-001`; `NFR-IDENTITY-001`; `FR-BOOKING-003`; `FR-CLINICAL-007`;
`ERR-IDENTITY-002`; `ERR-BOOKING-002`.

**Anatomy**

```
[ primary ]  [ secondary ]  [ secondary ]        ... [ destructive ]
     |            |                                        |
     |            |                                        +-- at the END, separated. Uses
     |            |                                            action.destructive in the trigger
     |            |                                            AND in its confirmation.
     |            +-- neutral surface, neutral border, dark text. Never a coloured fill.
     +-- exactly one, or none. Never two primaries.

[ absent-action explanation ]   <- a short statement of why an expected action is not here,
                                   rendered as text, never as a disabled control
```

**Variants**

| Variant | Where |
|---|---|
| `page` | The record's own actions on a detail, form or workspace surface |
| `row` | Actions on one row of `CMP-PLATFORM-006`, subject to the same authorization and lifecycle rules |
| `sticky` | Profile C, where the primary action must remain reachable while the reading column scrolls. The sticky region must not obscure a focused element. |
| `readonly` | One of the nine immutable entities. The bar carries reads and exports only, and no create, edit or delete affordance exists to be removed. |

**Density and size:** `reading` renders actions full-width and stacked, primary first, at
`semantic.size.control-lg`, never below `semantic.size.target-primary`; `operational` renders them
inline at `control-md`; `dense` renders row actions at `control-sm` with an expanded hit area that
still clears `semantic.size.target-floor`. A deadline-bearing action clears
`semantic.size.target-primary` in every mode, on every platform.

**States**

| State | Behaviour |
|---|---|
| default | the authorised, state-valid action set |
| hover | **n/a on Profile C.** Profile A: `semantic.color.action.primary-hover`, `action.destructive-hover`, `action.secondary-hover`. |
| focus | every action. Ring at `semantic.focus.width` with `semantic.focus.offset`, visible on the primary fill, the destructive fill and the neutral secondary alike. |
| active / pressed | `action.primary-active`, `action.destructive-active`, `semantic.opacity.pressed` on Profile C. |
| disabled | **narrow.** Only where the same actor on the same record will be able to act once they complete something visible on this surface. Never for authorization. Never for lifecycle. A disabled control implies an override exists. |
| loading | the invoked action shows its own committing state and the bar blocks a second submission of the same intent. The idempotency key is unchanged by a retry. `CMP-PLATFORM-011` renders the outcome. |
| error | the bar keeps the actor's input and context, surfaces the failure against the action, and offers the recovery the `ERR-*` retry matrix actually supports rather than a uniform retry. |
| selected | **n/a** |
| read-only | the `readonly` variant |

**Token mapping**

```
component.platform-004.primary-bg            {semantic.color.action.primary}
component.platform-004.primary-bg-hover      {semantic.color.action.primary-hover}
component.platform-004.primary-bg-active     {semantic.color.action.primary-active}
component.platform-004.primary-text          {semantic.color.text.on-action}
component.platform-004.secondary-bg          {semantic.color.action.secondary-surface}
component.platform-004.secondary-border      {semantic.color.action.secondary-border}
component.platform-004.secondary-text        {semantic.color.action.secondary-text}
component.platform-004.secondary-bg-hover    {semantic.color.action.secondary-hover}
component.platform-004.destructive-bg        {semantic.color.action.destructive}
component.platform-004.destructive-bg-hover  {semantic.color.action.destructive-hover}
component.platform-004.destructive-bg-active {semantic.color.action.destructive-active}
component.platform-004.destructive-text      {semantic.color.text.on-action}
component.platform-004.text-absent-reason    {semantic.color.text.secondary}
component.platform-004.focus-ring            {semantic.color.focus.ring}
component.platform-004.focus-ring-contrast   {semantic.color.focus.ring-contrast}
component.platform-004.radius                {semantic.radius.control}
component.platform-004.inline                {semantic.space.inline-sm}
```

**Token by intent is not negotiable.** A destructive action uses `action.destructive` in the
trigger **and** in its own confirmation. A blue Delete is a bug, and so is a red Delete that turns
blue when confirmed. A secondary action resolves to a neutral surface with a neutral border and
dark text, so it cannot be given a coloured fill without editing the semantic layer.

**Content rules**

- **One action role keeps one label across all three platforms**, including inside its own
  confirmation. Session 4 allocates one `TXT-*` per action role, not one per screen.
- The absent-action explanation says what would make the action available, in the actor's terms. It
  never states or implies that an override exists, and it never names an internal permission key.
- `ELIGIBILITY_REVIEW` removes attendance, start and completion actions **structurally**. There is
  no override control designed, on any surface, for any role.
- Guardian revocation is never removed by booking state.
- No pay, wallet, balance, top-up, withdraw or platform-refund affordance exists in any variant.
- Exactly one primary action, or none. Two primaries is a decision the surface failed to make.

**Right-to-left:** the primary sits at `start`, the destructive at `end`, in both directions,
because reading order is what fixes the relationship rather than physical position.

**Long content:** long Arabic action labels wrap rather than truncate; where they cannot fit inline
the bar stacks. An action label is never elided, because a half-read destructive label is a
hazard.

**Accessibility:** every action is keyboard reachable and activated by the platform's own
activation keys; the bar's tab order matches its reading order; a sticky bar on either profile must
not obscure a focused element; the committing state sets a busy state and announces completion or
failure; a destructive action's accessible name states the effect rather than only the verb.

**Bound on:** 161 of 165 wireframes. Every wireframe except four with no state-aware mutation: `WF-CATALOG-001`, `WF-CATALOG-002`, `WF-AUDIT-002`, `WF-PLATFORM-008`.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-005 — Deadline indicator

**Purpose:** show the time remaining on a running window, whether it is approaching, and **whether
its lapse can be recovered**. Principle 4's hardest rule lives here: an unrecoverable deadline must
be visible as approaching, not reported as missed.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Custom` — a Filament entry and column, because a stock date column cannot express approach or recoverability |

**Traceability:** `FR-BOOKING-003`; `FR-BOOKING-004`; `FR-CLAIMS-003`; `FR-CLAIMS-005`;
`FR-REVIEWS-002`; `NFR-IDENTITY-002`; `NFR-PLATFORM-006`; `ERR-BOOKING-003`; `ERR-CLAIMS-001`;
`ERR-IDENTITY-003`; `ERR-IDENTITY-004`.

**Anatomy**

```
[ icon ][ remaining time ][ what lapses ][ recoverable? ]
   |            |               |               |
   |            |               |               +-- stated explicitly where the lapse is
   |            |               |                   unrecoverable. Absent where recovery exists
   |            |               |                   and is described by the owning surface.
   |            |               +-- which obligation ends, not merely "expires"
   |            +-- remaining time, and the absolute time it ends
   +-- clock while running; stop-circle once the window has closed
```

**Variants**

| Variant | Means | Treatment |
|---|---|---|
| `running` | the window is open and not near its end | `tone.info` |
| `approaching` | policy says the window is near its end | `tone.warning` |
| `closed-recoverable` | the window lapsed and the actor can still reach the outcome another way | `tone.restricted`, with the alternative named |
| `closed-final` | the window lapsed and nothing recovers it | `tone.danger`, with what was lost stated plainly and no retry offered |
| `throttled` | a resend or attempt limit is in force | `tone.warning`, stating when the next attempt is possible |

**When** a window becomes approaching is **policy data**, not styling. It comes from the effective
policy version. `DESIGN_TOKENS.md` section 9 uses this component as the worked example of the
design and product configuration boundary: how it looks is tokens, when it changes is policy, and
they never live in the same file.

**Density and size:** `reading` renders the indicator as its own line at `semantic.type.body`;
`operational` renders it inline at `semantic.type.label`; `dense` renders it as a column at
`semantic.type.numeric` so remaining times align down a table. The numeric style requests tabular
lining figures, so a counting-down value does not reflow its column.

**States**

| State | Behaviour |
|---|---|
| default | the resolved variant |
| hover | **n/a on Profile C.** Profile A: only where the indicator links to the record. |
| focus | only when interactive |
| active / pressed | only when interactive |
| disabled | **n/a** |
| loading | the indicator is absent until the deadline is known. A placeholder that could be read as time remaining is prohibited. |
| error | if the deadline cannot be read, the owning surface renders `CMP-PLATFORM-010` and **no action that depends on the window is offered**. Guessing is worse than refusing. |
| selected | **n/a** |
| read-only | a historical deadline shows its original and its effective value where they differ, which is `CMP-CLINICAL-002` |

**Token mapping**

```
component.platform-005.icon         {semantic.color.tone.<tone>.icon}
component.platform-005.text         {semantic.color.tone.<tone>.text}
component.platform-005.fill         {semantic.color.tone.<tone>.fill}
component.platform-005.border       {semantic.color.tone.<tone>.border}
component.platform-005.type-numeric {semantic.type.numeric}
component.platform-005.inline       {semantic.space.inline-xs}
component.platform-005.tick         {semantic.motion.state-change}
```

The visible value updates on a state change transition, not on a continuous animation. Under
reduced motion the value changes without transition; the information is identical.

**Content rules**

- **A non-confirmation is never a punitive cancellation.** A booking closed because an alternative
  was declined or expired reads as an appointment that was not confirmed. It carries no penalty
  language, because there is no penalty.
- The obligation that ends is named. "Expires" alone is not a statement.
- A final lapse states what was lost and offers no retry. Offering one would be dishonest and,
  under `ERR-BOOKING-003` and `ERR-CLAIMS-001`, futile.
- Neither the remaining time nor the absolute end time is ever truncated.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** the remaining time and the absolute time are bidirectionally isolated. Western
digits throughout, per `DESIGN_TOKENS.md` section 4.4, so a duration inside Arabic text does not
reorder.

**Long content:** at the largest supported text size the indicator stacks onto its own lines rather
than truncating. Truncating a deadline is a correctness failure.

**Accessibility:** the remaining time has a text equivalent that does not rely on a live-updating
value, so a screen reader user is not chasing a moving target; the absolute end time is always
available. Approach and finality are carried by icon and wording as well as tone. A window that
closes while the surface is open announces politely and the dependent actions are removed rather
than left to fail.

**Bound on:** 58 of 165 wireframes. Every wireframe carrying a running window. By domain: CLAIMS 13 (all of them), BOOKING 11, IDENTITY 11, REVIEWS 7, CLINICAL 4, OPS 4, PLATFORM 4, CATALOG 2, ELIG 2. The CLAIMS figure is the whole domain because every claim surface is deadline-bound.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-006 — Record list

**Purpose:** present rows over a governed projection, with two rules that cannot be left to the
framework: **no generic edit or delete affordance over the nine immutable entities**, and **row
flags render independently of lifecycle state**.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a single-column list. Never a horizontally scrolling table. |
| A — Clinic, Admin | `Extended` — a Filament table, configured. Stock bulk actions, including bulk delete, are **removed** on any table over one of the nine. |

**Traceability:** `NFR-AUDIT-003`; `FR-FINANCE-005`; `FR-CLINICAL-002`; `FR-OPS-001`;
`FR-AUDIT-002`; `NFR-IDENTITY-001`; `ERR-PLATFORM-002`.

**Anatomy**

```
[ header row: labels, sort, count ]                 Profile A only
+---------------------------------------------------------------+
| [ identity ] [ CMP-PLATFORM-001 ] [ flag slot ] [ facts ] [>] |
+---------------------------------------------------------------+
| ...                                                           |
+---------------------------------------------------------------+
[ paging control ]  +  [ what is not shown ]        IX-PLATFORM-016
        |                        |
        |                        +-- when a bound is applied, it is stated. A page is never
        |                            presented as the whole set.
        +-- incremental on Profile C, framework paginator on Profile A
```

**Variants**

| Variant | Where | What changes |
|---|---|---|
| `reading-list` | Profile C | One column, one row per record, tap target the whole row. No column headers, no horizontal scroll. |
| `table` | Profile A | Columns, sort, header row, count. `dense` in the body. |
| `embedded` | either | A list inside a detail surface — evidence items, plan lines, gate results, grants. No paging where the set is bounded by the parent record. |
| `immutable` | either | Over one of the nine. Read and export only. No row create, edit, delete or bulk affordance exists to be removed later. |
| `selectable` | either | Rows are a selectable unit — comparison candidates, assignment targets. Selection uses `semantic.color.state.selected.*`. |

**Density and size:** `reading` gives each row `semantic.space.inset-sm` and
`semantic.size.control-lg` for the row target; `operational` uses `inset-xs` at `control-md`;
`dense` applies to **table bodies only** at `control-sm`, and the Arabic text size is unchanged from
every other mode. Row targets clear `semantic.size.target-floor` in every mode once the hit area is
counted.

**States**

| State | Behaviour |
|---|---|
| default | rows in the projection's order |
| hover | **n/a on Profile C.** Profile A: `action.secondary-hover` on the row. |
| focus | the row, and each interactive element within it, in reading order. A focused row is not obscured by the panel's sticky header. |
| active / pressed | Profile C uses `semantic.opacity.pressed` on the row; Profile A uses the active row treatment. |
| disabled | **n/a for rows.** A row the actor may not open is **absent** from the projection, because filtering is server-side and the row's existence can itself be information. |
| loading | initial load renders a row skeleton at the row's own height so the list does not shift; a refresh keeps existing rows visible and marks the list refreshing. |
| error | the list is replaced by `CMP-PLATFORM-010` on a failed initial read; a failed refresh keeps the last good rows, marks them stale, and offers retry in place. |
| selected | `semantic.color.state.selected.surface` plus `state.selected.border`. Selection is announced, not only tinted. |
| read-only | the `immutable` variant, at full contrast |

**Token mapping**

```
component.platform-006.row-surface       {semantic.color.surface.default}
component.platform-006.row-surface-alt   {semantic.color.surface.subtle}
component.platform-006.row-divider       {semantic.color.border.subtle}
component.platform-006.header-surface    {semantic.color.surface.subtle}
component.platform-006.header-text       {semantic.color.text.secondary}
component.platform-006.row-text          {semantic.color.text.primary}
component.platform-006.row-meta          {semantic.color.text.secondary}
component.platform-006.row-hover         {semantic.color.action.secondary-hover}
component.platform-006.row-selected      {semantic.color.state.selected.surface}
component.platform-006.row-selected-border {semantic.color.state.selected.border}
component.platform-006.surface-readonly  {semantic.color.state.readonly.surface}
component.platform-006.radius            {semantic.radius.surface}
component.platform-006.elevation         {semantic.elevation.flat}
component.platform-006.numeric           {semantic.type.numeric}
```

Header text uses `text.secondary`, which resolves to the ramp step measured against the subtle
surface. `DESIGN_TOKENS.md` section 2.2 records why: the documented muted value fails contrast on
exactly this pairing, and a table header on a subtle surface is the pairing that found it.

**Content rules**

- A row shows its status through `CMP-PLATFORM-001` and its flags in a **separate slot**. A row
  that is simultaneously in progress, escalated and overdue shows all three. Collapsing a flag into
  a status is the failure `PO-UX-08` exists to prevent.
- Amounts use tabular lining figures and align down the column so they can be compared.
- **No row may present a bare internal code as its identity.** A service code appears only
  alongside its understandable name, and never on a Patient surface as the primary identity.
- Where a bound is applied — a page size, a top-N, a date window — the list states what is not
  shown. A silent cap reads as complete coverage.
- Strings, including column labels, are Session 4 `TXT-*`.

**Right-to-left:** column order mirrors; numeric columns keep their own internal direction and are
bidirectionally isolated. A physically end-aligned amount column is defined as logical alignment,
not as a right alignment that happens to look correct in one direction.

**Long content:** a long Arabic name wraps to at most two lines in `reading` and truncates in
`table` with the full value reachable without a network read. **Amounts, deadlines, statuses and
attributions never truncate.** At the largest supported text size the `table` variant degrades to
the `reading-list` shape rather than scrolling horizontally.

**Accessibility:** the `table` variant is a real table with header association, so a screen reader
can announce the column with the cell; the `reading-list` variant is a list with one accessible
name per row that includes the status. Sort state is announced. Selection is announced. Row actions
are reachable by keyboard without entering a hover-only menu, which is also why Profile C has no
hover-revealed row action.

**Bound on:** 85 of 165 wireframes. All 29 `list-and-detail`, all 5 `dashboard` and all 5 `workspace` wireframes, plus 46 `detail` and `form` wireframes carrying an embedded list. By domain: CLINICAL 13, ELIG 11, IDENTITY 10, BOOKING 8, CLAIMS 8, PLATFORM 8, CATALOG 6, FINANCE 6, OPS 5, AUDIT 4, POLICY 3, REVIEWS 3.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-007 — Filter and search bar

**Purpose:** narrow a projection, and hold the distinction Phase 4 requires as two separate data
states: **a filtered-empty result is not an empty data set.**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a search field plus a small set of visible filters. No hidden filter drawer on the discovery path. |
| A — Clinic, Admin | `Stock` — Filament table filters and search, configured, with persistence declared |

**Traceability:** `FR-ELIG-001`; `FR-OPS-001`; `FR-AUDIT-002`; `NFR-PLATFORM-001`;
`ERR-PLATFORM-001`.

**Anatomy**

```
[ search input ]  [ filter ] [ filter ]  [ active filter summary ]  [ clear all ]
                                                  |
                                                  +-- what is currently applied, always visible,
                                                      because an unexplained short result is
                                                      indistinguishable from no data
[ result count: shown of total ]
```

**Variants**

| Variant | Where |
|---|---|
| `discovery` | Patient provider search. Latency sits on the loosest budget in `NFR-PLATFORM-001` and on the most important discovery job, so it shows progress rather than appearing stalled. |
| `queue` | Work queues and review queues, where the filter is a scope and persists across visits |
| `management` | Catalog, policy, staff and provider lists |
| `history` | Over an append-only projection. Filtering never reorders history; the ordering is a property of the record, not of the view. |
| `authoring` | Procedure search inside plan authoring, where the filter's purpose is to insert rather than to browse |

**Density and size:** `reading` gives the input `semantic.size.control-lg`; `operational` uses
`control-md`; `dense` uses `control-sm` with hit areas still clearing
`semantic.size.target-floor`. Filter controls are never smaller than the search input they sit
beside.

**States**

| State | Behaviour |
|---|---|
| default | empty or persisted filters, with the active summary reflecting them |
| hover | **n/a on Profile C.** Profile A: on the filter and clear controls. |
| focus | the input and each filter control. The input is reachable early in the tab order on a list surface. |
| active / pressed | the filter and clear controls |
| disabled | a filter whose options cannot be loaded is **absent with a reason**, not present and dead |
| loading | the bar stays interactive while results load. `IX-PLATFORM-009` governs the progress treatment. An indeterminate spinner as the only feedback is prohibited. |
| error | a rejected filter value is reported against that control, in place, with the previous valid value retained |
| selected | an applied filter uses `semantic.color.state.selected.*` and appears in the active summary |
| read-only | **n/a** |

**Token mapping**

```
component.platform-007.input-surface   {semantic.color.surface.default}
component.platform-007.input-border    {semantic.color.border.strong}
component.platform-007.input-text      {semantic.color.text.primary}
component.platform-007.placeholder     {semantic.color.text.placeholder}
component.platform-007.chip-fill        {semantic.color.state.selected.surface}
component.platform-007.chip-border      {semantic.color.state.selected.border}
component.platform-007.chip-text        {semantic.color.state.selected.text}
component.platform-007.count-text       {semantic.color.text.secondary}
component.platform-007.radius           {semantic.radius.control}
component.platform-007.inline           {semantic.space.inline-sm}
```

The input boundary uses `border.strong`, not `border.default`. `border.default` is a decorative
divider value; any boundary that identifies a control uses the strong value, which is the one the
token gate requires to pass the interface-element ratio.

**Content rules**

- **Filtered-empty and no-data are different strings and different actions.** Filtered-empty offers
  relaxing or clearing the filter; no-data offers the first action. `CMP-PLATFORM-009` renders both
  and this component supplies which one applies.
- The result count states shown against total wherever a total is knowable.
- Patient discovery is entered through **service families**, never a flat list of professional
  procedure codes. No filter on any Patient surface selects an internal classification, grade,
  confidence or risk value.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** the input's own text direction follows its content, so a Latin code typed into an
Arabic interface does not reverse. The clear control sits at the input's `end`.

**Long content:** the active filter summary wraps rather than scrolling horizontally. A long applied
value truncates in its chip with the full value reachable.

**Accessibility:** the search input has a persistent visible label, not a placeholder acting as one;
result count changes are announced politely so a screen reader user learns that filtering had an
effect; each filter announces its applied value; clearing is a single reachable control, not only a
per-chip removal.

**Bound on:** 39 of 165 wireframes.

`WF-*`: `WF-AUDIT-001`, `WF-BOOKING-003`, `WF-BOOKING-008`, `WF-BOOKING-011`, `WF-BOOKING-014`, `WF-BOOKING-016`, `WF-BOOKING-017`, `WF-CATALOG-003`, `WF-CATALOG-004`, `WF-CATALOG-010`, `WF-CLAIMS-001`, `WF-CLAIMS-006`, `WF-CLAIMS-009`, `WF-CLAIMS-010`, `WF-CLINICAL-001`, `WF-CLINICAL-005`, `WF-CLINICAL-007`, `WF-CLINICAL-008`, `WF-CLINICAL-010`, `WF-CLINICAL-011`, `WF-CLINICAL-017`, `WF-CLINICAL-019`, `WF-ELIG-001`, `WF-ELIG-011`, `WF-ELIG-021`, `WF-ELIG-023`, `WF-FINANCE-002`, `WF-FINANCE-010`, `WF-IDENTITY-021`, `WF-IDENTITY-027`, `WF-IDENTITY-036`, `WF-OPS-001`, `WF-OPS-002`, `WF-OPS-004`, `WF-OPS-005`, `WF-PLATFORM-009`, `WF-POLICY-001`, `WF-REVIEWS-005`, `WF-REVIEWS-007`

`SCR-*`: `SCR-AUDIT-001`, `SCR-BOOKING-003`, `SCR-BOOKING-008`, `SCR-BOOKING-011`, `SCR-BOOKING-014`, `SCR-BOOKING-016`, `SCR-BOOKING-017`, `SCR-CATALOG-003`, `SCR-CATALOG-004`, `SCR-CATALOG-010`, `SCR-CLAIMS-001`, `SCR-CLAIMS-006`, `SCR-CLAIMS-009`, `SCR-CLAIMS-010`, `SCR-CLINICAL-001`, `SCR-CLINICAL-005`, `SCR-CLINICAL-007`, `SCR-CLINICAL-008`, `SCR-CLINICAL-010`, `SCR-CLINICAL-011`, `SCR-CLINICAL-017`, `SCR-CLINICAL-019`, `SCR-ELIG-001`, `SCR-ELIG-011`, `SCR-ELIG-021`, `SCR-ELIG-023`, `SCR-FINANCE-002`, `SCR-FINANCE-010`, `SCR-IDENTITY-021`, `SCR-IDENTITY-027`, `SCR-IDENTITY-036`, `SCR-OPS-001`, `SCR-OPS-002`, `SCR-OPS-004`, `SCR-OPS-005`, `SCR-PLATFORM-009`, `SCR-POLICY-001`, `SCR-REVIEWS-005`, `SCR-REVIEWS-007`

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-008 — Event timeline

**Purpose:** render append-only history in order, with **no edit affordance reachable from it, by
construction.** Five of the nine immutable entities are event or decision logs, and this is the
component that renders them.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Custom` — a Filament custom view. Stock table actions are not attached, so there is no row action set to forget to remove. |

**Traceability:** `FR-CLINICAL-005`; `FR-FINANCE-005`; `FR-FINANCE-006`; `FR-AUDIT-001`;
`FR-AUDIT-002`; `NFR-AUDIT-001`; `NFR-AUDIT-003`.

**Anatomy**

```
[ ordering statement ]              <- which order, and by which time field
+---------------------------------------------------------------+
| when | [ CMP-PLATFORM-001 ] what happened                     |
|      | [ CMP-PLATFORM-013 ]  who, where a human owns it        |
|      | [ disclosure ] the event's own detail                   |
+---------------------------------------------------------------+
| ...                                                            |
+---------------------------------------------------------------+
[ paging: older events ]            <- IX-PLATFORM-016
```

No connector line is drawn as a decorative rail. The order is carried by position and by the stated
time, which is what survives right-to-left, reflow and a screen reader.

**Variants**

| Variant | Over |
|---|---|
| `case` | Booking, stage, follow-up, financial, review and claim events on one case |
| `record` | One record's own events — a booking, a claim, a review, an application |
| `financial` | Append-only external financial events, which carry the money-boundary obligation |
| `governance` | Append-only launch-gate and policy decisions |
| `audit` | Audit events, with correlation identifiers rendered in the identifier type style on Admin surfaces only |

**Density and size:** `reading` renders one event per block at `semantic.type.body`; `operational`
renders a compact row at `semantic.type.label`; `dense` applies to the `audit` variant only, where
volume is genuinely very high.

**States**

| State | Behaviour |
|---|---|
| default | events in the projection's stated order |
| hover | **n/a on Profile C.** Profile A: on the disclosure and any link. |
| focus | the disclosure and links, in reading order |
| active / pressed | the disclosure and links |
| disabled | **n/a** |
| loading | a skeleton for the first page; loading older events appends without moving the events already read, and never resets scroll position |
| error | a failed initial read is `CMP-PLATFORM-010`; a failed append keeps what is loaded, states that older events could not be read, and offers retry. **It never renders a truncated history as complete.** |
| selected | **n/a** |
| read-only | the normal and only condition. Full contrast. |

**Token mapping**

```
component.platform-008.surface       {semantic.color.surface.default}
component.platform-008.divider       {semantic.color.border.subtle}
component.platform-008.time-text     {semantic.color.text.secondary}
component.platform-008.event-text    {semantic.color.text.primary}
component.platform-008.identifier    {semantic.type.identifier}
component.platform-008.radius        {semantic.radius.surface}
component.platform-008.elevation     {semantic.elevation.flat}
component.platform-008.stack         {semantic.space.stack-sm}
component.platform-008.disclosure    {semantic.motion.disclosure}
```

`semantic.type.identifier` is the mono family, admitted for machine identifiers on Admin and audit
surfaces only. It is never reachable from a Patient surface and never carries a label, a price or a
date.

**Content rules**

- **No edit, delete or correct affordance exists in any variant.** A correction is a new appended
  event, a new version, or a state transition, and it appears as its own entry.
- The ordering is stated, and filtering never changes it.
- The `financial` variant may not state or imply that the platform held, paid, settled or refunded
  money. An external payment reported by one party and confirmed or disputed by the other reads as
  exactly that.
- A computed event is not attributed to a person; a human decision is. `CMP-PLATFORM-013` carries
  both directions of that rule.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** time at `start`, event at `end`; timestamps and correlation identifiers are
bidirectionally isolated so a Latin identifier inside Arabic text does not reorder.

**Long content:** a case timeline with dozens of ordered events is the sized-for case, not the edge
case. Events page rather than render all at once, the disclosure keeps each entry short, and no
event summary truncates its status or its attribution.

**Accessibility:** the timeline is a list, not a set of headings, so a screen reader can traverse it
without polluting the document outline; each entry's accessible name carries time, status and
actor; each disclosure declares its expanded state; the ordering statement is real text, so the
order does not have to be inferred from layout.

**Bound on:** 33 of 165 wireframes.

`WF-*`: `WF-AUDIT-001`, `WF-AUDIT-002`, `WF-AUDIT-003`, `WF-AUDIT-004`, `WF-BOOKING-004`, `WF-BOOKING-014`, `WF-BOOKING-015`, `WF-CATALOG-006`, `WF-CATALOG-007`, `WF-CLAIMS-004`, `WF-CLAIMS-007`, `WF-CLAIMS-010`, `WF-CLAIMS-011`, `WF-CLINICAL-002`, `WF-CLINICAL-005`, `WF-CLINICAL-009`, `WF-CLINICAL-013`, `WF-CLINICAL-019`, `WF-ELIG-018`, `WF-ELIG-020`, `WF-FINANCE-002`, `WF-FINANCE-006`, `WF-FINANCE-010`, `WF-FINANCE-011`, `WF-FINANCE-012`, `WF-IDENTITY-017`, `WF-IDENTITY-028`, `WF-OPS-003`, `WF-PLATFORM-006`, `WF-POLICY-003`, `WF-POLICY-004`, `WF-REVIEWS-003`, `WF-REVIEWS-005`

`SCR-*`: `SCR-AUDIT-001`, `SCR-AUDIT-002`, `SCR-AUDIT-003`, `SCR-AUDIT-004`, `SCR-BOOKING-004`, `SCR-BOOKING-014`, `SCR-BOOKING-015`, `SCR-CATALOG-006`, `SCR-CATALOG-007`, `SCR-CLAIMS-004`, `SCR-CLAIMS-007`, `SCR-CLAIMS-010`, `SCR-CLAIMS-011`, `SCR-CLINICAL-002`, `SCR-CLINICAL-005`, `SCR-CLINICAL-009`, `SCR-CLINICAL-013`, `SCR-CLINICAL-019`, `SCR-ELIG-018`, `SCR-ELIG-020`, `SCR-FINANCE-002`, `SCR-FINANCE-006`, `SCR-FINANCE-010`, `SCR-FINANCE-011`, `SCR-FINANCE-012`, `SCR-IDENTITY-017`, `SCR-IDENTITY-028`, `SCR-OPS-003`, `SCR-PLATFORM-006`, `SCR-POLICY-003`, `SCR-POLICY-004`, `SCR-REVIEWS-003`, `SCR-REVIEWS-005`

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-009 — Empty state

**Purpose:** say plainly that there is nothing here and give the one action that changes that.
Required structural state on all 165 wireframes.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Extended` — Filament empty-state configuration, with heading, description and action supplied |

**Traceability:** `FR-PLATFORM-001`; `FR-ELIG-001`; `FR-OPS-001`; `NFR-PLATFORM-005`.

**Anatomy**

```
[ icon ]                <- one governed icon, at icon-lg. Optional, and small.
[ statement ]           <- what is not here, in the actor's terms
[ why, where useful ]   <- e.g. no result matches these filters
[ action ]              <- exactly one, the thing that changes the state
```

**Variants**

| Variant | Means | Action |
|---|---|---|
| `no-data` | the read succeeded and the set is genuinely empty | the first action that creates something |
| `filtered-empty` | the read succeeded and the filter excluded everything | relax or clear the filter, with the applied filter still visible |
| `not-yet` | the set will populate through someone else's action, not the reader's | no action; state what will cause it to populate and when |
| `between-cases` | Profile C attention surface with nothing pending | near-empty and says so plainly. Principle 3 forbids manufacturing activity. |

**Density and size:** the block is centred in its container in all three modes and uses
`semantic.space.inset-xl` in `reading`, `inset-lg` in `operational` and `inset-md` in `dense`.

**States**

| State | Behaviour |
|---|---|
| default | the variant's content |
| hover | **n/a on Profile C.** Profile A: the action only. |
| focus | the action. It is reachable by keyboard without traversing the whole empty region. |
| active / pressed | the action |
| disabled | **n/a.** Where the reader may not perform the action, the action is absent and the reason is stated. |
| loading | **n/a.** An empty state is never rendered while a read is in flight, because an empty state during loading is a false statement. |
| error | **n/a.** A failed read is `CMP-PLATFORM-010`, never an empty state. This separation is the reason the two are different components. |
| selected | **n/a** |
| read-only | **n/a** |

**Token mapping**

```
component.platform-009.surface     {semantic.color.surface.default}
component.platform-009.icon        {semantic.color.text.secondary}
component.platform-009.heading     {semantic.color.text.primary}
component.platform-009.body        {semantic.color.text.secondary}
component.platform-009.inset       {semantic.space.inset-xl}
component.platform-009.stack       {semantic.space.stack-sm}
```

**Content rules**

- **Never an illustration in place of a recovery action.** Direction rule 3.9 prohibits it, and the
  reason is that the illustration occupies the space the action needed.
- `no-data` and `filtered-empty` are different statements with different actions and are never
  written as one string.
- The statement explains the value and points to the first action; "No data" is not an empty state.
- No emoji, in any variant, in any position.
- Strings are Session 4 `TXT-*` per archetype.

**Right-to-left:** the block is centred, so it mirrors without change; the action's own label
follows the reading direction.

**Long content:** the statement wraps within the reading measure and never truncates.

**Accessibility:** the empty state is announced when it replaces a populated list, so a screen
reader user learns that filtering emptied the set rather than that the page failed; the icon is
decorative and takes no accessible name; the action is a real control, not a link styled as text
inside a paragraph.

**Bound on:** 165 of 165 wireframes. All 165. A required structural state on every surface, in every archetype, on all three platforms.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-010 — Recovery state

**Purpose:** say what could not be done, preserve the safe context that is still known, and offer
the recovery that actually exists. **Permission denial is a designed state here, not an assumed
impossibility.** Required structural state on all 165 wireframes.

| Profile | Realization |
|---|---|
| C — Patient | `Native` |
| A — Clinic, Admin | `Extended` — Filament notification and page-level state, plus a custom block for the permission and unknown-outcome variants |

**Traceability:** `NFR-PLATFORM-006`; `NFR-IDENTITY-001`; `FR-AUDIT-003`; `ERR-PLATFORM-002`;
`ERR-PLATFORM-003`; `ERR-PLATFORM-004`; `ERR-IDENTITY-001`; `ERR-IDENTITY-002`; `ERR-AUDIT-001`.

**Anatomy**

```
[ icon ][ what failed ]
[ what is still true ]        <- the safe known context is preserved, not discarded
[ what to do now ]            <- matched to the ERR-* retry matrix, not a uniform retry
[ action ]                    <- retry, sign in, go to a scope you do have, or nothing
```

**Variants**

| Variant | Means | Recovery offered |
|---|---|---|
| `fetch-failure` | the read failed and retry may help | retry in place, with the last known safe context preserved |
| `stale` | the read failed but a previous good projection is shown | the previous data, explicitly marked as of its time, plus retry. Stale-and-labelled beats blank. |
| `permission-denied` | the actor is outside their authorised scope | no retry. What scope they do have, and how to get the right one. Stale actions are removed. |
| `authentication-required` | the session is not or no longer valid | a route back to authentication that returns to this context afterwards |
| `unknown-outcome` | a mutation's result is unknown | **no new command is offered until the outcome is reconciled.** `IX-PLATFORM-004`. |
| `not-retryable` | the failure is one the retry matrix says retry cannot fix | what must change, and who can change it. No retry control. |

Six variants because `ERROR_CATALOG.md` section 13 distinguishes its codes by whether retry helps
at all, and Principle 4 requires the interface to reflect that distinction rather than smooth it.

**Density and size:** as `CMP-PLATFORM-009`. A page-level recovery state uses the same insets; an
action-level one renders adjacent to the action inside `CMP-PLATFORM-004`.

**States**

| State | Behaviour |
|---|---|
| default | the variant's content |
| hover | **n/a on Profile C.** Profile A: the action only. |
| focus | focus moves to the recovery block when it replaces the content the actor was reading, and the action is the first stop within it |
| active / pressed | the action |
| disabled | **n/a** |
| loading | a retry in progress renders its own committing state on the retry control; the block does not flash between states |
| error | a failed retry increments nothing and says so; it never escalates a retryable failure into a rejection |
| selected | **n/a** |
| read-only | **n/a** |

**Token mapping**

```
component.platform-010.surface        {semantic.color.surface.default}
component.platform-010.icon           {semantic.color.tone.<tone>.icon}
component.platform-010.heading        {semantic.color.text.primary}
component.platform-010.body           {semantic.color.text.secondary}
component.platform-010.fill           {semantic.color.tone.<tone>.fill}
component.platform-010.border         {semantic.color.tone.<tone>.border}
component.platform-010.inset          {semantic.space.inset-lg}
component.platform-010.stack          {semantic.space.stack-sm}
```

`fetch-failure` and `stale` resolve to `tone.warning`; `permission-denied`,
`authentication-required` and `not-retryable` to `tone.restricted`; `unknown-outcome` to
`tone.info`, because an unknown outcome is not yet a failure. There is **no start-edge accent
strip** in any variant: direction rule 3.6 forbids it as both a colour-only status and a physical
direction bug.

**Content rules**

- **The canonical Arabic message for each `ERR-*` is owned by `docs/api/ERROR_CATALOG.md` and is
  referenced, never restated.** This component renders that message and adds the recovery guidance,
  which is what Session 4 owns.
- **A retryable transfer or network failure must never read as an authoritative rejection.** This
  is copy obligation 3, the most likely evidence failure in this product's conditions, and it is
  enforced structurally by `CMP-PLATFORM-012` as well as here.
- `permission-denied` never names an internal permission key and never implies an override exists.
- `ERR-BOOKING-002` is booking-domain only. Its guidance may not be written generically enough to
  be reused on an identity or representation surface.
- No variant states or implies that money moved, was held, or was returned.
- Strings are Session 4 `TXT-*`, one family per `ERR-*`, with a Profile C surface and a Profile A
  surface for each of the 21.

**Right-to-left:** the icon is at `start`; the block mirrors as a whole.

**Long content:** the failure statement and the recovery guidance never truncate. A correlation
identifier, where shown on an Admin surface, is isolated and selectable.

**Accessibility:** the block is announced assertively when it replaces content, and focus is moved
to it, because a silent replacement leaves a screen reader user acting on a surface that is no
longer there; each variant's meaning is carried by wording and icon as well as tone; a retry that
is not offered is explained rather than absent without comment.

**Bound on:** 165 of 165 wireframes. All 165. A required structural state on every surface. Permission denial is designed on every protected surface rather than assumed impossible.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-011 — Submission state indicator

**Purpose:** show the honest state of a mutation the actor has issued — pending, failed, retrying,
completed — and never an optimistic guess. This is the visible face of the idempotency contract and
of Principle 2.

| Profile | Realization |
|---|---|
| C — Patient | `Native`. Load-bearing here: weak and intermittent connectivity is an established condition of use, not an edge case. |
| A — Clinic, Admin | `Extended` — Filament action state plus notification, configured so a committing action cannot be double-submitted |

**Traceability:** `FR-AUDIT-003`; `NFR-AUDIT-002`; `NFR-PLATFORM-006`; `ERR-AUDIT-001`;
`ERR-PLATFORM-004`.

**Anatomy**

```
[ icon ][ what was submitted ][ state ][ when ][ action ]
                                  |              |
                                  |              +-- retry with the SAME idempotency key, or
                                  |                  reconcile. Never "submit again".
                                  +-- pending | failed | retrying | completed
```

**Variants**

| Variant | Where |
|---|---|
| `inline` | Beside the action that was invoked, inside `CMP-PLATFORM-004` |
| `queue` | The Patient pending-submissions surface, listing every outstanding mutation |
| `banner` | Surface-level, where a pending mutation constrains what else the actor may do here |

**Density and size:** `reading` renders it as its own block at `semantic.type.body`; `operational`
inline at `semantic.type.label`; `dense` is not offered, because a submission state is never
something to compress.

**States**

| State | Behaviour |
|---|---|
| default | **n/a.** The component exists only while a mutation is outstanding or recently resolved. |
| hover | **n/a on Profile C.** Profile A: the action only. |
| focus | the action |
| active / pressed | the action |
| disabled | the originating action is **blocked from re-submitting the same intent** while pending. This is the one place a blocked control is correct, because the actor may act again once this resolves. |
| loading | pending and retrying are the loading states, and they are named rather than shown as an unlabelled spinner. Direction rule 3.9 prohibits an indeterminate spinner as the only feedback for a mutation. |
| error | failed, with the recovery matched to the `ERR-*` rather than a uniform retry. A retry reuses the original idempotency key; a **new** key is a new intent and is never issued automatically. |
| selected | **n/a** |
| read-only | completed entries are historical and read at full contrast |

**Token mapping**

```
component.platform-011.icon       {semantic.color.tone.<tone>.icon}
component.platform-011.text       {semantic.color.tone.<tone>.text}
component.platform-011.fill       {semantic.color.tone.<tone>.fill}
component.platform-011.border     {semantic.color.tone.<tone>.border}
component.platform-011.progress   {semantic.motion.progress}
component.platform-011.inset      {semantic.space.inset-sm}
component.platform-011.inline     {semantic.space.inline-xs}
```

pending and retrying resolve to `tone.info`, failed to `tone.danger`, completed to `tone.success`.

**Content rules**

- **A committed state is never presented as pending because a notification did not arrive**, and a
  pending state is never presented as committed. Principle 2, stated as a component rule.
- "Retrying" names the same submission. It never reads as a second attempt, because a retry with
  the same key must produce zero duplicate bookings, evidence, claims or financial events.
- A failed submission states whether the actor's input survived, and it does survive.
- An unknown outcome is `CMP-PLATFORM-010` `unknown-outcome`, not a failure, and no new command is
  offered until it is reconciled.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** icon at `start`; the submitted-thing description and the timestamp are isolated.

**Long content:** the description truncates with the full value reachable; the state, the time and
the action never truncate.

**Accessibility:** the four states are announced politely as they change, because they change
without user action, which is precisely the case that needs a live region; the busy state is set
while pending; "retrying" is distinguishable from "pending" in the announcement, not only visually.

**Bound on:** 68 of 165 wireframes. The Patient pending-submissions surface, 18 further Patient wireframes carrying a mutation, and every Profile A `form` and `workspace` wireframe. By domain: IDENTITY 22, ELIG 9, BOOKING 8, CLINICAL 7, FINANCE 7, CLAIMS 6, REVIEWS 4, CATALOG 2, PLATFORM 2, POLICY 1.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-012 — Evidence transfer item

**Purpose:** render one evidence item across the eight fixed session states, and make **retryable
transfer failure structurally separate from authoritative rejection.** Low reach, very high
consequence, and a state machine fixed by `PO-UX-17`.

| Profile | Realization |
|---|---|
| C — Patient | `Native`. Resumable, because a dropped connection mid-transfer is the most likely evidence failure in this product's conditions. |
| A — Clinic, Admin | `Custom` — the provider-neutral contract is not what a stock file upload expresses, and the quarantine and rejection states have no stock equivalent |

**Traceability:** `FR-CLINICAL-003`; `FR-CLAIMS-003`; `FR-ELIG-007`; `NFR-PLATFORM-003`;
`NFR-PLATFORM-006`; `ERR-PLATFORM-005`; `ERR-CLAIMS-002`.

**Anatomy**

```
[ icon ][ file identity ][ CMP-PLATFORM-001 ][ progress or reason ][ action ]
             |                    |                   |                |
             |                    |                   |                +-- resume, retry, replace,
             |                    |                   |                    remove, or none
             |                    |                   +-- transfer progress while moving; the
             |                    |                       specific correctable requirement when
             |                    |                       rejected
             |                    +-- one of the eight session states, as its triple
             +-- what the actor recognises. Never the opaque storage identifier.
```

**Variants**

| Variant | Where |
|---|---|
| `intake` | The actor is supplying evidence — application, activation, stage, claim |
| `review` | An authorised reviewer is verifying or rejecting an item |
| `access-log` | The Admin evidence access log, which renders state plus access and download events and offers no transfer action |

**Density and size:** `reading` renders one item per block at `semantic.size.control-lg` targets;
`operational` as a compact row; `dense` is not offered, because an evidence state is never
something to compress.

**States**

The eight session states are the component's primary axis and are not the same thing as the eight
interaction states. Both are declared.

| Session state | Treatment |
|---|---|
| `SELECTED` | chosen, not yet moving |
| `UPLOADING` | moving, with determinate progress |
| `PAUSED` | held, resumable, with resume offered |
| `FAILED_RETRYABLE` | **transfer failed. Retry is offered. This is not a rejection and its wording may never suggest one.** |
| `UPLOADED` | transferred and **not yet usable** |
| `VALIDATING_SCANNING` | undergoing the required safety check |
| `ACCEPTED` | cleared for use |
| `REJECTED` | **refused by a decision, with the specific correctable requirement named. Reachable only from validation or review, never from a transfer failure.** |

`UPLOADED` is not `ACCEPTED`. Evidence stays quarantined until scanning and validation pass, and
the two states carry different tones and different icons so the difference is visible rather than
documented.

| Interaction state | Behaviour |
|---|---|
| default | the session state's triple |
| hover | **n/a on Profile C.** Profile A: the item actions. |
| focus | each action, and the item itself where it opens a preview |
| active / pressed | the item actions |
| disabled | an action invalid for the current session state is **absent**, not disabled |
| loading | `UPLOADING` and `VALIDATING_SCANNING` are the loading states, both determinate or explicitly indeterminate-with-reason, never a bare spinner |
| error | `FAILED_RETRYABLE` only. `REJECTED` is **not** an error state; it is an authoritative outcome, and conflating them is the failure this component exists to prevent. |
| selected | where items are chosen for a binding |
| read-only | the `access-log` variant, and any accepted item bound to an immutable record |

**Token mapping**

```
component.platform-012.icon             {semantic.color.tone.<tone>.icon}
component.platform-012.text             {semantic.color.text.primary}
component.platform-012.meta             {semantic.color.text.secondary}
component.platform-012.fill             {semantic.color.tone.<tone>.fill}
component.platform-012.border           {semantic.color.tone.<tone>.border}
component.platform-012.progress-track   {semantic.color.surface.subtle}
component.platform-012.progress-fill    {semantic.color.action.primary}
component.platform-012.progress-motion  {semantic.motion.progress}
component.platform-012.radius           {semantic.radius.surface}
component.platform-012.inset            {semantic.space.inset-sm}
```

`FAILED_RETRYABLE` resolves to `tone.warning` and `REJECTED` to `tone.danger`, with different
icons and different emphases. The separation is in the token source, so it cannot be lost in a
component implementation without failing the token gate.

**Content rules**

- **`FAILED_RETRYABLE` wording may never imply that the document was refused**, and `REJECTED`
  guidance may never be reachable from a transfer failure. `ERR-PLATFORM-005` is evidence rejected
  or failed validation; a network drop is not that error and must not route to it.
- A rejection names a **specific correctable requirement**, not a generic refusal.
- The file identity is what the actor recognises. The opaque storage identifier is never shown.
- No count of attempts is presented as a penalty.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** progress fills from `start` to `end` in both directions. A progress bar that
fills left-to-right in a right-to-left interface is a directional defect.

**Long content:** a long file name truncates in the middle so the extension stays visible, with the
full name reachable. The session state and the rejection reason never truncate.

**Accessibility:** progress is announced at intervals rather than continuously; the eight session
states are distinguishable by wording and icon, not by tone alone; the transition into
`VALIDATING_SCANNING` and into `ACCEPTED` or `REJECTED` is announced, because it happens without
user action; the resume control is keyboard reachable; no state is conveyed by colour alone.

**Bound on:** 9 of 165 wireframes.

`WF-*`: `WF-CLAIMS-003`, `WF-CLAIMS-007`, `WF-CLAIMS-011`, `WF-CLINICAL-014`, `WF-ELIG-009`, `WF-ELIG-017`, `WF-IDENTITY-015`, `WF-IDENTITY-029`, `WF-PLATFORM-006`

`SCR-*`: `SCR-CLAIMS-003`, `SCR-CLAIMS-007`, `SCR-CLAIMS-011`, `SCR-CLINICAL-014`, `SCR-ELIG-009`, `SCR-ELIG-017`, `SCR-IDENTITY-015`, `SCR-IDENTITY-029`, `SCR-PLATFORM-006`

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-013 — Human attribution

**Purpose:** name who decided, when, and on what basis, wherever the requirements reserve a
decision for an accountable person — and hold the inverse rule too: **where the system computed an
outcome, it must not be dressed as a human judgement.** Principle 5 given an anatomy.

| Profile | Realization |
|---|---|
| C — Patient | `Native`. The patient's appeal paths only mean something if the accountable human is named. |
| A — Clinic, Admin | `Extended` — a Filament infolist entry, configured |

**Traceability:** `FR-CLAIMS-004`; `FR-CLINICAL-001`; `FR-REVIEWS-002`; `FR-CATALOG-003`;
`FR-AUDIT-001`; `NFR-AUDIT-001`.

**Anatomy**

```
[ icon ][ role ][ named person or system ][ when ][ basis ]
            |             |                          |
            |             |                          +-- the reason recorded at the time, or the
            |             |                              governing version. Never reconstructed.
            |             +-- a person, OR the system. Never ambiguous.
            +-- the accountable role, because the role is what makes the decision appealable
```

**Variants**

| Variant | Means | Icon family |
|---|---|---|
| `decided-by-person` | An accountable human decided | `scale`, `check-badge` |
| `computed-by-system` | The system evaluated this. **It is labelled as computed, and no person is named.** | `magnifying-glass`, `shield-check` |
| `assigned-to-person` | Ownership without a decision yet | `user-circle` |
| `reviewed-by-licensed` | A licensed clinical reviewer, whose credential state is itself governed | `check-badge` |

The `computed-by-system` variant is not a courtesy. An outcome framed as an impartial calculation
is easier to deliver and impossible to appeal, and dressing a computation as a judgement — or a
judgement as a computation — breaks the appeal paths that `FR-REVIEWS-002` and `FR-CLAIMS-005`
create.

**Density and size:** `reading` renders it as its own line at `semantic.type.body`; `operational`
inline at `semantic.type.label`; `dense` as a column at `semantic.type.dense`.

**States**

| State | Behaviour |
|---|---|
| default | the resolved attribution |
| hover | **n/a on Profile C.** Profile A: only where the attribution links to the decision record. |
| focus | the link, where present |
| active / pressed | the link, where present |
| disabled | **n/a** |
| loading | absent until known. A placeholder that could be read as an attribution is prohibited. |
| error | if the attribution cannot be read, the decision is rendered **without** an attribution and the gap is stated. Guessing an accountable owner is worse than admitting the read failed. |
| selected | **n/a** |
| read-only | the normal condition, at full contrast. Attributions belong to immutable records. |

**Token mapping**

```
component.platform-013.icon      {semantic.color.text.secondary}
component.platform-013.role      {semantic.color.text.secondary}
component.platform-013.name      {semantic.color.text.primary}
component.platform-013.time      {semantic.color.text.secondary}
component.platform-013.basis     {semantic.color.text.primary}
component.platform-013.inline    {semantic.space.inline-xs}
```

Deliberately achromatic. An attribution is not a status and takes no tone; giving it one would make
the accountable owner read as an outcome.

**Content rules**

- The **role** is always present, because the role is what makes the decision appealable.
- The **basis** is the reason recorded at the time. It is never reconstructed, summarised into
  something the record does not say, or replaced by the outcome.
- A computed outcome is labelled as computed and names no person.
- On Patient surfaces the named person is the clinician or reviewer whose decision it is. Internal
  staff identifiers, queue assignments and internal role keys are not patient-facing.
- Strings, including role names, are Session 4 `TXT-*`.

**Right-to-left:** role and name at `start`, time at `end`; the timestamp is isolated.

**Long content:** the name and the role never truncate. A long recorded basis truncates with the
full text reachable in the same surface.

**Accessibility:** the attribution reads as one unit including the role, so a screen reader user
learns who is accountable in one pass; `computed-by-system` is distinguishable in the announcement,
not only by icon; where the attribution links to the decision record the link text names the
record, not "here".

**Bound on:** 61 of 165 wireframes. Every wireframe carrying a decision, a verification, a governance gate or an assignment. By domain: ELIG 11, CLINICAL 9, IDENTITY 9, CATALOG 7, CLAIMS 6, REVIEWS 6, POLICY 4, BOOKING 3, AUDIT 2, FINANCE 2, OPS 1, PLATFORM 1.

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-014 — Sensitive confirmation

**Purpose:** capture the mandatory reason, state the effect, state whether it can be undone, and
keep **one action role reading the same way in the trigger and in its own confirmation.**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a full-screen or sheet confirmation, focus-trapped |
| A — Clinic, Admin | `Extended` — a Filament action modal with a required form field, configured. The stock confirm-only modal is insufficient wherever a reason is mandatory. |

**Traceability:** `FR-AUDIT-001`; `FR-AUDIT-003`; `FR-CLAIMS-004`; `FR-CLINICAL-007`;
`FR-BOOKING-002`; `NFR-AUDIT-001`; `NFR-AUDIT-002`; `ERR-AUDIT-001`.

**Anatomy**

```
+---------------------------------------------------------------+
| what this action is                 <- SAME label as the      |
|                                        trigger                |
| what it will do                     <- the effect, concretely |
| whether it can be undone            <- stated, always         |
| what it affects                     <- the subject and scope  |
| [ required reason ]                 <- where the audit        |
|                                        requirement mandates   |
| [ cancel ]              [ confirm ] <- confirm uses the SAME  |
|                                        action role as the     |
|                                        trigger                |
+---------------------------------------------------------------+
```

**Variants**

| Variant | Means | Reason field |
|---|---|---|
| `reversible` | The action can be undone or superseded, and the confirmation says how | optional |
| `irreversible` | Nothing undoes it. The confirmation says so in words, not by tone. | required |
| `destructive` | Removes access, revokes a grant, or ends something. Uses `action.destructive` in **both** the trigger and the confirm. | required |
| `authoritative-decision` | A sensitive human decision — a claim outcome, an appeal, a launch gate, a suspension review, an integrity decision | required, and it becomes the recorded basis in `CMP-PLATFORM-013` |

**Density and size:** the confirmation always renders at `reading`-equivalent generosity, on every
platform and in every density mode. A dense confirmation for an irreversible action is a defect;
this is the one component density does not compress.

**States**

| State | Behaviour |
|---|---|
| default | the confirmation, with confirm blocked until a required reason is present |
| hover | **n/a on Profile C.** Profile A: on cancel and confirm. |
| focus | trapped within the confirmation. Focus lands on the first meaningful element, not on confirm. Escape or the platform dismissal cancels. Focus returns to the trigger on close. |
| active / pressed | cancel and confirm |
| disabled | confirm is disabled **only** while a required reason is missing. This is the narrow legitimate case: the same actor will be able to act once they complete something visible here. |
| loading | confirm shows its committing state, the confirmation stays open, and a second submission of the same intent is blocked. The idempotency key is fixed at first submission. |
| error | the confirmation stays open, keeps the entered reason, and reports the failure against the action with the recovery the retry matrix supports |
| selected | **n/a** |
| read-only | **n/a** |

**Token mapping**

```
component.platform-014.surface           {semantic.color.surface.default}
component.platform-014.scrim             {semantic.color.surface.scrim}
component.platform-014.scrim-opacity     {semantic.opacity.scrim}
component.platform-014.heading           {semantic.color.text.primary}
component.platform-014.body              {semantic.color.text.primary}
component.platform-014.meta              {semantic.color.text.secondary}
component.platform-014.confirm-bg        {semantic.color.action.primary}
component.platform-014.confirm-destructive-bg {semantic.color.action.destructive}
component.platform-014.confirm-text      {semantic.color.text.on-action}
component.platform-014.cancel-bg         {semantic.color.action.secondary-surface}
component.platform-014.cancel-border     {semantic.color.action.secondary-border}
component.platform-014.cancel-text       {semantic.color.action.secondary-text}
component.platform-014.radius            {semantic.radius.overlay}
component.platform-014.elevation         {semantic.elevation.modal}
component.platform-014.enter             {semantic.motion.overlay-enter}
component.platform-014.exit              {semantic.motion.overlay-exit}
```

This is one of the few components that legitimately floats, so it is one of the few that uses
elevation. `component.platform-014.confirm-destructive-bg` and
`component.platform-004.destructive-bg` resolve to the same semantic role on purpose: that identity
is the mechanism that stops a red trigger from producing a blue confirm.

**Content rules**

- **The confirm label is the trigger's label.** One action role, one `TXT-*`, across all three
  platforms and inside the confirmation. A trigger that says one thing and a confirm that says
  another is how an actor confirms something they did not intend.
- The effect is concrete and names the subject. "Are you sure?" is not a confirmation.
- **Irreversibility is stated in words.** Tone is a second channel, never the only one.
- The reason field's guidance says what the reason is for and who will read it, because it becomes
  part of an audit record and, in the `authoritative-decision` variant, the recorded basis of the
  decision.
- No confirmation states or implies that money moved, was held, or was returned.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** cancel at `start`, confirm at `end`, in both directions, so the destructive
choice never sits where the eye lands first.

**Long content:** the effect statement never truncates. At the largest supported text size the
confirmation scrolls internally while the action row stays reachable, and the action row never
covers the focused element.

**Accessibility:** a modal dialog with an accessible name and a description tied to the effect
statement; focus trapped, initial focus not on confirm, dismissal returns focus to the trigger; the
required reason has a visible persistent label and its validation error is bound to the field and
says how to fix it; the confirm control's accessible name states the effect rather than only the
verb, so "confirm" alone is never what a screen reader user hears before an irreversible action.

**Bound on:** 38 of 165 wireframes.

`WF-*`: `WF-BOOKING-006`, `WF-BOOKING-009`, `WF-BOOKING-012`, `WF-BOOKING-013`, `WF-CATALOG-007`, `WF-CATALOG-008`, `WF-CLAIMS-002`, `WF-CLAIMS-005`, `WF-CLAIMS-012`, `WF-CLAIMS-013`, `WF-CLINICAL-004`, `WF-CLINICAL-012`, `WF-CLINICAL-015`, `WF-CLINICAL-016`, `WF-ELIG-015`, `WF-ELIG-016`, `WF-ELIG-017`, `WF-ELIG-020`, `WF-FINANCE-004`, `WF-FINANCE-005`, `WF-FINANCE-008`, `WF-FINANCE-009`, `WF-IDENTITY-007`, `WF-IDENTITY-016`, `WF-IDENTITY-026`, `WF-IDENTITY-030`, `WF-IDENTITY-031`, `WF-IDENTITY-032`, `WF-IDENTITY-034`, `WF-IDENTITY-035`, `WF-IDENTITY-038`, `WF-OPS-005`, `WF-PLATFORM-007`, `WF-POLICY-002`, `WF-POLICY-003`, `WF-REVIEWS-002`, `WF-REVIEWS-008`, `WF-REVIEWS-009`

`SCR-*`: `SCR-BOOKING-006`, `SCR-BOOKING-009`, `SCR-BOOKING-012`, `SCR-BOOKING-013`, `SCR-CATALOG-007`, `SCR-CATALOG-008`, `SCR-CLAIMS-002`, `SCR-CLAIMS-005`, `SCR-CLAIMS-012`, `SCR-CLAIMS-013`, `SCR-CLINICAL-004`, `SCR-CLINICAL-012`, `SCR-CLINICAL-015`, `SCR-CLINICAL-016`, `SCR-ELIG-015`, `SCR-ELIG-016`, `SCR-ELIG-017`, `SCR-ELIG-020`, `SCR-FINANCE-004`, `SCR-FINANCE-005`, `SCR-FINANCE-008`, `SCR-FINANCE-009`, `SCR-IDENTITY-007`, `SCR-IDENTITY-016`, `SCR-IDENTITY-026`, `SCR-IDENTITY-030`, `SCR-IDENTITY-031`, `SCR-IDENTITY-032`, `SCR-IDENTITY-034`, `SCR-IDENTITY-035`, `SCR-IDENTITY-038`, `SCR-OPS-005`, `SCR-PLATFORM-007`, `SCR-POLICY-002`, `SCR-POLICY-003`, `SCR-REVIEWS-002`, `SCR-REVIEWS-008`, `SCR-REVIEWS-009`

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

---
### CMP-PLATFORM-015 — Attention item

**Purpose:** render one durable, deadline-bearing thing that needs the actor, on **both** the
attention surface and the notification centre. That duplication is exactly what makes push, SMS and
email optional adapters rather than load-bearing infrastructure.

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the attention surface and the notification centre |
| A — Clinic, Admin | `Extended` — a Filament dashboard widget listing deadline-bearing items. Aggregate counts on the same dashboards are a Phase 4 widget, not this component. |

**Traceability:** `FR-PLATFORM-001`; `FR-CLINICAL-004`; `FR-BOOKING-003`; `FR-CLAIMS-003`;
`FR-FINANCE-003`; `NFR-PLATFORM-006`.

**Anatomy**

```
[ icon ][ what needs you ][ CMP-PLATFORM-001 ][ CMP-PLATFORM-005 ][ subject ][ > ]
              |                                                        |
              |                                                        +-- whose case, where the
              |                                                            actor represents someone
              +-- the obligation in the actor's terms, not the event that produced it
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `attention` | The landing surface. Ordered by what the case needs now, not by recency. | Principle 3: prominence follows the journey. |
| `notification` | The notification centre. Ordered chronologically, with read and unread. | It owns no business status; the status shown belongs to the referenced record. |
| `panel-attention` | Profile A dashboards, for deadline-bearing items | Scoped by `CMP-PLATFORM-003`, not filtered. |

The same obligation appears in `attention` and `notification` **at the same time**. Neither is a
copy of the other and neither may be the only place it appears, because no delivery transport may
be relied on for correctness.

**Density and size:** `reading` gives the whole item a single target at
`semantic.size.target-primary`; `operational` renders a compact row; `dense` is not offered.

**States**

| State | Behaviour |
|---|---|
| default | the item |
| hover | **n/a on Profile C.** Profile A: the row. |
| focus | the row, which is one target. Any secondary control inside it is separately reachable. |
| active / pressed | `semantic.opacity.pressed` on Profile C |
| disabled | **n/a.** An item the actor cannot act on is absent, or present with the reason and no action. |
| loading | a skeleton at the item's own height |
| error | a failed read is `CMP-PLATFORM-010` at the surface level. A partially read attention set is **never** presented as complete, because an actor who sees nothing pending concludes nothing is pending. |
| selected | **n/a** |
| read-only | the `notification` variant's read entries, at full contrast |

**Token mapping**

```
component.platform-015.surface        {semantic.color.surface.default}
component.platform-015.surface-unread {semantic.color.action.primary-subtle}
component.platform-015.divider        {semantic.color.border.subtle}
component.platform-015.text           {semantic.color.text.primary}
component.platform-015.meta           {semantic.color.text.secondary}
component.platform-015.icon           {semantic.color.tone.<tone>.icon}
component.platform-015.radius         {semantic.radius.surface}
component.platform-015.elevation      {semantic.elevation.flat}
component.platform-015.inset          {semantic.space.inset-sm}
```

Unread is carried by the brand surface tint **and** by a stated unread marker, because unread is a
state and the no-colour-alone rule does not stop at lifecycle statuses.

**Content rules**

- The item states **the obligation**, not the event. "A different time was offered and you have
  until X to decide" rather than "your booking changed".
- An alternative that expires or is declined never reads as a cancellation with a penalty.
- Where the actor represents someone, the subject is named in the item itself, not only in the
  header, because an attention list is exactly where a guardian mixes up two dependents.
- The empty attention surface says plainly that nothing needs the actor. It does not manufacture
  activity.
- Strings are Session 4 `TXT-*`.

**Right-to-left:** icon at `start`, chevron at `end` and mirrored.

**Long content:** the obligation wraps to at most two lines and never truncates its deadline or its
subject.

**Accessibility:** each item is one link or button whose accessible name carries the obligation, the
status and the deadline, so a screen reader user does not have to enter the item to know whether it
is urgent; unread is announced, not only tinted; new items arriving while the surface is open are
announced politely.

**Bound on:** 4 of 165 wireframes.

`WF-*`: `WF-PLATFORM-001`, `WF-PLATFORM-003`, `WF-PLATFORM-004`, `WF-PLATFORM-009`

`SCR-*`: `SCR-PLATFORM-001`, `SCR-PLATFORM-003`, `SCR-PLATFORM-004`, `SCR-PLATFORM-009`

`WF-*` and `SCR-*` are one-to-one on the same domain and numeric suffix, so the screen set is the wireframe set read through that relation. `WIREFRAME_COMPONENT_MAP.md` is authoritative.

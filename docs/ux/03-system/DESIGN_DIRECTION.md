# UberTib Design Direction

**Phase:** UX 3 — Design System, Session 2 of 7
**Status:** Fixed. Sessions 3 to 7 build against this and do not reopen it.
**Owns:** the visual direction, its rationale, and the prohibitions that follow from it.
**Does not own:** token values (`design_tokens/`), component anatomy (Session 3), screen
composition (Phase 4).

Authority is unchanged from `docs/ux/README.md`. The design kit at the repository root is a
**method, not an authority**: where its generic guidance and a canonical UberTib requirement
disagree, the requirement wins.

---

## 1. What already existed, and what it is worth

The taste doctrine requires establishing what exists before inventing anything, because a
direction that contradicts an approved one is the most expensive kind of error.

| Source | What it contributes |
|---|---|
| `UberTip-Backend/app/Providers/Filament/AdminPanelProvider.php` | An amber panel primary. This is the value Filament's own installer writes. Scaffold output, **not** a brand decision, and it is superseded by this direction. |
| `.env.example`, `config/app.php`, `public/favicon.ico` | Framework defaults throughout. Nothing to inherit. |
| `docs/README.md` → Design Sources | States that no Figma, XD, Sketch or brand-system source is authoritative for this engineering run. |
| All markdown under `docs/` and `.spec/` | Zero colour values, zero type decisions, zero icon decisions. |
| The v2.1 UX reference PDF, section 15 | **A documented visual system exists.** An eight-role colour palette, an accessibility bar, a writing register and a component list. |

The v2.1 reference was re-extracted this session and its section 15.1 palette was read directly
from the source rather than taken on trust. The eight role values reproduce exactly as recorded
in the Phase 3 plan. See `DESIGN_TOKENS.md` section 2 for the values and their measurements.

### 1.1 What section 15 can and cannot contribute

| Section 15 content | Status |
|---|---|
| 15.1 colour palette | **Adopted, with two measured accessibility corrections.** It is the only documented UberTib visual decision that exists. |
| 15.4 accessibility and weak connectivity | **Adopted in full.** Every item maps to `NFR-PLATFORM-005`, `NFR-PLATFORM-006` or WCAG 2.2 AA. Its touch-target figure exceeds the WCAG minimum, which is the recommended figure anyway. |
| 15.3 writing rules | **Carried to Session 5**, minus the row that renders a server fault as a statement about a deduction. This product has no deduction model, so that string asserts something untrue. |
| 15.2 component list | **Not usable as written.** The doctor card is specified as showing internal scientific, pricing, protection and risk symbols plus confidence to the patient, and the transaction detail as showing a commission breakdown. Both are prohibited by the algorithm-hiding boundary and the financial boundary. |
| 16 analytics, 17 launch plan, 18 acceptance | **Superseded for anything financial.** `PO-2026-08-23` decision 9 removed all money movement from V1; the event list in 16.1 still names payment, settlement and refund execution events that have no V1 surface. |

The honest summary: **the v2.1 reference contributes a palette, an accessibility bar and a
writing register. It does not contribute a component model, a disclosure model or a financial
model.**

### 1.2 The governance dependency this creates

`docs/README.md` states that no brand-system source is authoritative, and the v2.1 palette is
therefore not formally in the Phase 3 authority chain even though it is real evidence. That
conflict cannot be resolved inside Phase 3.

**`Q-PLATFORM-008` was raised and registered this session**, asking the Product Owner either to
ratify section 15.1 as the UberTib brand palette or to state that Phase 3 derives one
independently.

Until it is answered, the direction proceeds on the documented palette with the corrections
recorded in `DESIGN_TOKENS.md`. That is the lowest-risk order: **if the Product Owner ratifies,
nothing changes; if they decline, only the primitive colour layer changes** and the semantic
layer absorbs it without a single component or screen being touched. That absorption property is
the reason the layering exists.

---

## 2. The brief, inferred

Written before any token was generated.

**Industry.** Healthcare service discovery plus a non-custodial financial record. Two trust
problems at once: *is this dentist right for me*, and *is what I agreed to what I am being held
to*.

**Audience.** Three, and they do not overlap.

- An **episodic Arabic-first patient** on a personal smartphone under weak connectivity, who
  will never become fluent in the interface because they open it only when something is
  happening.
- A **trained but constantly interrupted clinic operator** on a desktop or tablet inside a
  clinic, working against a response deadline.
- An **accountable admin reviewer** whose output is a decision that must survive being
  questioned later.

**The one adjective the result must earn: accountable.** Not calm, not modern, not trustworthy —
those are effects, and every product claims them. This product's actual differentiator is that
every decision names its reason, its owner and its date, and that history cannot be quietly
rewritten. An interface that looks calm but cannot say who decided something has failed the
brief. Calm is the register; accountable is the goal.

**Motion depth: subtle feedback only.** Weak connectivity, an interruption-prone panel and a
React Native runtime all argue against choreography.

**Layout family.** Already fixed by Phase 2 and not reopened: one primary reading column for
Patient, a twelve-column conceptual content grid inside the Filament shell for both panels.

**Reference anchor: none adopted.** The kit's 138-system library carries no healthcare or
clinical-records system, and adopting a consumer or developer-tool brand wholesale would import
the wrong register — those systems are built to make a product feel desirable, and this one has
to make a record feel reliable. The direction is derived, anchored on the documented palette, and
disciplined by two archetypes: the **restraint** of the high-end archetype (calibrated low
chroma, hairline separation, flat surfaces, shadows rare) and the **reading discipline** of the
editorial archetype for the Patient column.

---

## 3. The direction, as rules

Ten rules. Each one is enforceable, and most are enforced mechanically by the token gate rather
than by review.

### 3.1 Evidence before decoration

The most prominent thing on any surface is the **authoritative state and the reason for it**.
Nothing decorative competes with it. This is Principle 1 given a visual consequence: a surface
that leads with a hero image, a metric tile or a brand flourish and buries the controlling reason
has inverted the product.

### 3.2 Neutrals carry the interface; the brand colour is the action colour and nothing else

One primary, no secondary accent. The brand teal appears on actions, links and selection, and
nowhere else. **Status colour is a signal channel, never a surface theme** — a page does not
become green because something on it succeeded.

Enforced: `action.secondary-*` resolves to a neutral surface with a neutral border and dark
text, so a secondary action *cannot* be given a coloured fill without editing the semantic layer.

### 3.3 Status is never colour alone, on any platform, for any state

This is `NFR-PLATFORM-005`, and it is the constraint most likely to be violated by a designer
working quickly, because eligibility, protection and urgency are exactly what one reaches for
colour to encode. With 82 statuses across 18 machines it cannot be enforced by review.

Enforced structurally: **a lifecycle status is a token triple — tone, icon, emphasis — and never
a colour.** A component consuming a status consumes the whole triple. See `DESIGN_TOKENS.md`
section 5.

### 3.4 Separation by hairline and surface, not by shadow

Elevation is reserved for surfaces that genuinely float — popover, modal, drawer, toast. A panel
that shadows every card reads as noise at the density Admin works at, and a card that lifts for
no reason implies an interaction that does not exist.

Enforced: the default elevation semantic role is flat, and the shallow shadow scale has no step
intended for a resting card.

### 3.5 Cards are a container of last resort

The measured archetype distribution is dominated by **detail (68) and form (58)**, not by card
grids. A card is justified when it is a selectable or comparable unit — a provider result, a
plan option — and not otherwise. Wrapping a detail surface in cards manufactures boundaries where
the content has none.

### 3.6 No colour-tinted left-border accent strips

On alerts, callouts or rows. Two reasons, and either alone is sufficient: it is a status encoded
as a decorative edge, and in a right-to-left interface a *physical* left border is a directional
bug. Every anatomy in this system is defined in **start and end** terms, never left and right.

### 3.7 Type does the hierarchy work

One Arabic-capable family, used with conviction, with weight and size carrying hierarchy. The
alternative — more grey levels — is the classic tell of a generated interface, and it is also an
accessibility trap: this session removed a third text level precisely because the value that
would have carried it fails contrast on one of our own surfaces.

Line height is set for Arabic diacritics rather than inherited from a Latin scale, and letter
spacing has exactly one value, zero, because non-zero tracking breaks Arabic glyph joining.

### 3.8 Density follows the archetype, not the platform

The obvious split — patient spacious, panels compact — is wrong. `PO-UX-07` records the clinic
representative and invited staff as desktop-and-tablet users with a **high interruption rate**,
and a person working while being interrupted wants targets they can hit without looking. The two
genuinely dense surfaces are the five Clinic workspace screens. Three modes: `reading`,
`operational`, `dense`. See `DESIGN_TOKENS.md` section 6.

### 3.9 Prohibited outright

Gradients as a brand surface. Neon or high-chroma medical colour. Glassmorphism. Decorative
dashboards. Illustrated empty states that replace the recovery action. Dark-tech surfaces.
Pill-shaped status chips, which read as marketing tags rather than authoritative states.
Uppercase Latin labels, which have no Arabic equivalent and produce a mixed register inside an
Arabic form. Indeterminate spinners as the only feedback for a mutation.

No gradient or blur tokens exist. They are **omitted rather than defined and then forbidden**,
which is the difference between a rule and a temptation.

### 3.10 Zero emoji

Icons come from one governed set, with a text label on every icon. This is enforced by
`scripts/check_no_emoji.py` across `docs/ux/`, and by the token gate, which rejects any status
icon outside the governed vocabulary.

---

## 4. How the direction expresses per platform

One theme, three expressions. **A platform-specific token value is a defect, not a variant.**
What differs is composition and density, never the palette.

### 4.1 Patient — Profile C, React Native

Arabic-first, right-to-left-first, smartphone-first, weak-network, non-medical language.

- One primary reading column at every size class, capped at its measure ceiling. A wider device
  produces whitespace, not a second pane.
- `reading` density everywhere, at every archetype. The floor for a primary action is the
  comfortable target size, not the WCAG minimum.
- **No hover state is ever emitted.** Press, long-press and swipe replace it.
- Prominence follows the journey, not the frequency (Principle 3). Between cases the attention
  surface is near-empty and says so plainly rather than manufacturing activity.
- Weak network is a *designed* condition: pending, failed, retrying and completed are visible
  states, drafts survive, and a retry is idempotent rather than a second attempt.
- The calm register does the emotional work: low chroma, generous leading, flat surfaces, and no
  urgency colour except where a deadline is genuinely running.

### 4.2 Clinic and Admin — Profile A, Filament panels

Desktop-first, information-dense without clutter, efficient on repeated work, and compatible
with a framework this chain does not rewrite.

- The Filament shell, navigation, tables, forms and notifications are **framework-owned**. This
  direction supplies tokens, states and accessibility obligations to them; it does not
  re-specify them, and it defines no bespoke atoms. That is what keeps most of the system
  classified `Stock` rather than `Custom`.
- `operational` density is the default; `dense` is earned only by the workspace archetype and by
  table bodies.
- Density compresses the space around content and never the content: a dense table has tighter
  rows and the **same** Arabic text size as everywhere else.
- Dark mode is in scope here and only here. See `DESIGN_TOKENS.md` section 4.1.
- Tablet is a supported layout, not a degraded one, so the dense mode may not assume a mouse.

### 4.3 What the three share

The palette, the type system, the state channel, the focus treatment, the motion vocabulary, the
right-to-left discipline and the prohibitions. Switching the brand means editing the token source
once. **If a page looks different, that is a bug: it bypassed the theme.**

---

## 5. Anti-slop check

The direction was checked against the kit's banned defaults before being fixed. Where a default
was rejected, the reason is a product reason, not a stylistic preference.

| Default rejected | Because |
|---|---|
| Purple-blue SaaS gradient hero | The product's own palette exists and is a teal; gradients are prohibited as brand surface. |
| Card grid as the answer to every layout | 126 of 165 screens are detail or form. |
| Three or four grey text levels | The third level fails contrast on our own subtle surface. Measured, not assumed. |
| Full-pill status chips | They read as tags. These are authoritative states. |
| Shadow on every card | Unreadable at Admin density. |
| Left accent strip on alerts | Colour-only status, and a physical-direction bug in RTL. |
| Emoji as status icons | Prohibited outright, and enforced mechanically. |
| A named design system adopted wholesale | Wrong register. None in the library is a clinical-records system. |
| Uppercase tracked labels | Arabic has no case, and tracking breaks Arabic joining. |
| Motion choreography and scroll effects | Weak connectivity, interruption, React Native. |

**Honest scope.** These checks and the token gate prove *objective* correctness — token
consistency, contrast, no drift, no colour-only status. They do **not** prove the result is
beautiful. Taste is verified by rendering and human review in Phases 4 and 5, and no automatic
score is claimed for it here.

---

## 6. What this direction does not decide

- Component anatomy, variants or states — Session 3.
- Which components exist at all — Session 3.
- Interaction behaviour — Session 4.
- Any final string, in any language — Session 5. The state channel deliberately carries no
  labels.
- Screen composition and widget placement — Phase 4.
- Framework code, an application theme file, or a Figma manifest — Phase 5.
- Any WCAG conformance claim. This chain specifies obligations against a documented target and
  measures what it can measure.

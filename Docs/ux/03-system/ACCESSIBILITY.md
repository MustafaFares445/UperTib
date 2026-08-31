# UberTib Accessibility, RTL, and Status/Data-State Semantics

**Phase:** UX 3 — Design System, Session 5 of 7
**Status:** `A11Y-*` allocated. Sessions 6–7 remain — integration/traceability audit, then the final
senior gate and CI promotion. This session does not reopen the `CMP-*` or `IX-*` taxonomies.
**Owns:** accessibility obligations (`A11Y-*`), the Arabic RTL/bidi system, status presentation
semantics, data-state semantics, native-versus-Filament accessibility responsibility, and the
mapping of every obligation to its `CMP-*`/`IX-*`/`NFR-*` carrier.
**Does not own:** business rules, canonical statuses, new lifecycle states, per-screen composition,
`WGT-*`, screen specs, API behaviour, the `CMP-*`/`IX-*` taxonomies, final per-screen copy, or
production implementation.

**Authority chain:** unchanged from `docs/ux/README.md`. The repository accessibility references
(`accessibility/wcag-checklist.md`, `accessibility/aria-patterns.md`, `accessibility/i18n-rtl.md`,
`accessibility/cognitive.md`, `accessibility/vision.md`, `accessibility/wcag-aaa.md`) are methodology,
not authority, over canonical UberTib behaviour — the same relationship every Phase 3 session has held
with the design kit at the repository root.

**Inputs this session builds on, and does not restate:** `COMPONENT_INVENTORY.md` and its two block
files already carry a component-level **Accessibility** paragraph, a **Right-to-left** paragraph, and
a **Long content** paragraph on every one of the 22 `CMP-*`. `INTERACTION_PATTERNS.md` and its domain
companion already carry **Focus behaviour**, **Keyboard behaviour**, and **Right-to-left implications**
fields on every one of the 26 `IX-*`. `CONTENT_GUIDE_STATES.md` already carries the tone/icon/emphasis
triple and the per-audience meaning for all 82 statuses. `design_tokens/semantic.state.json` already
fixes the triple mechanically. **This file's job is the system-level obligation those per-block notes
are all instances of** — the reusable rule, verified once, that a reader would otherwise have to infer
by reading all 22 components and 26 patterns side by side. Where a block below names a `CMP-*` or
`IX-*` paragraph, that paragraph is the primary source and this file does not fork it.

---

## 1. Position — WCAG 2.2 AA, obligations not conformance

Target is **WCAG 2.2 AA**, from `NFR-PLATFORM-005`. Consistent with `DESIGN_TOKENS.md` §11 and
`COMPONENT_INVENTORY.md` §11: **this session specifies obligations against that target. It does not
and may not claim conformance.** Conformance is measured against a running interface, and there is no
running interface at Phase 3. Section 20 separates, obligation by obligation, what is mechanically
verifiable now from what needs Phase 5 rendered QA.

---

## 2. How to read an `A11Y-*` block

Every obligation below carries the same fields, in the same order, so a reader can compare two blocks
without re-deriving what each column means:

| Field | Meaning |
|---|---|
| Purpose | Why this obligation exists as a distinct, reusable rule |
| Applies to | Profile C, Profile A, or both |
| Requirement source | The WCAG 2.2 success criterion and/or `NFR-*`/product rule it comes from |
| User impact | What a real user experiences if this is got wrong |
| Normative rule | The rule itself, stated so it is checkable |
| Profile C (Patient) behaviour | How the rule lands on React Native |
| Profile A (Clinic/Admin) behaviour | How the rule lands on the Filament panels |
| Carrier `CMP-*` | The component(s) whose anatomy or content rule already carries this |
| Carrier `IX-*` | The pattern(s) whose sequence already carries this |
| RTL implications | Direction-specific consequence, or an explicit "none beyond `IX-PLATFORM-010`" |
| Verification method | What actually proves this — a script, a render, a manual pass |
| Verification phase | **Mechanically verified now** or **Phase 5 rendered QA** — see section 20 |
| Framework responsibility | A/B/C/D per the matrix in section 3 |
| UberTib responsibility | What this system must supply regardless of framework default |

A **Failure example** and **Pass criteria** row is added only where a worked example clarifies a rule
that would otherwise stay abstract — not on every block, per the router instruction against
mechanically padding every entry.

---

## 3. Framework responsibility matrix

Four categories, applied consistently rather than declared once and forgotten. Neither `"Filament
handles accessibility"` nor `"React Native handles accessibility"` is treated as a complete answer
anywhere in this file — both are true only for a specific, named slice of behaviour.

| Code | Meaning | Who verifies |
|---|---|---|
| A | Framework can probably provide it by default | Still spot-checked at Phase 5, because "probably" is not "verified" |
| B | UberTib must configure it correctly | The configuration is the deliverable; a default left untouched is a defect |
| C | UberTib custom component must explicitly implement it | No framework equivalent exists; the `CMP-*` anatomy carries the obligation |
| D | Must be verified at rendered Phase 5 QA | True regardless of A/B/C — documentation cannot prove a runtime behaviour |

**Worked example — the sensitive-confirmation modal (`CMP-PLATFORM-014`).** On Profile A, Filament's
action modal shell may provide the base `role="dialog"` and a focus trap (**A**). UberTib must still
configure the required-reason field, the destructive-action colour identity between trigger and
confirm, and the initial-focus target (**B**). The stated-irreversibility sentence, the "same label
in the trigger and the confirmation" rule, and the effect-naming accessible name on the confirm control
have no framework equivalent at all and are `CMP-PLATFORM-014` anatomy (**C**). Whether the trap
actually holds, whether Escape actually closes it, and whether focus actually returns to the trigger
are runtime facts no document can assert (**D** — `scripts/verify_focustrap.mjs` is the Phase 5/design-kit
tool for exactly this, and is out of scope for Phase 3 per `DESIGN_TOKENS.md` §11).

**Worked example — the Patient reading list (`CMP-PLATFORM-006` `reading-list` variant).** React
Native's accessibility APIs supply the base `accessible`/`accessibilityRole` plumbing (**A**). UberTib
must set `accessibilityRole="button"` (not `"text"`) on the whole row and compose the accessible name
from status, flags and identity rather than accepting the default DOM-order concatenation (**B**). The
row's status-aware disabled/absent distinction has no native equivalent and is `CMP-PLATFORM-004`/`-006`
anatomy (**C**). Whether TalkBack actually announces the composed name in the intended order on a real
device is a Phase 5 fact (**D**).

**General rule that follows from both examples:** a component classified `Stock` in
`COMPONENT_INVENTORY.md` is never automatically **A** for every accessibility obligation it carries —
only for the specific behaviours the framework actually ships unconfigured. Every other obligation on
that component is **B**, **C**, or **D**, named individually rather than inherited from the realization
classification.

---

## 4. Registry — 40 obligations

Reach and category, so the shape of the system is visible before the detail. Every ID is `PLATFORM`
domain except the four rows marked otherwise, allocated only where a genuinely domain-specific
obligation exists (section 22) — the router instruction against domain sprawl.

| ID | Name | Category |
|---|---|---|
| `A11Y-PLATFORM-001` | Complete keyboard operability, Profile A | Keyboard |
| `A11Y-PLATFORM-002` | No keyboard trap; controlled overlay entry and exit | Keyboard |
| `A11Y-PLATFORM-003` | Logical order and reachable gesture equivalents | Keyboard |
| `A11Y-PLATFORM-004` | Visible focus indicator, both profiles | Focus |
| `A11Y-PLATFORM-005` | Focus not obscured by sticky chrome | Focus |
| `A11Y-PLATFORM-006` | Focus movement after mutation, error, and structural-state replacement | Focus |
| `A11Y-PLATFORM-007` | Dialog initial focus and return-to-trigger focus | Focus |
| `A11Y-PLATFORM-008` | Focus restoration, list-to-detail-and-back | Focus |
| `A11Y-PLATFORM-009` | Accessible name, role and state for every interactive element and status | Screen reader |
| `A11Y-PLATFORM-010` | Icons decorative to assistive technology; the label always carries meaning | Screen reader |
| `A11Y-PLATFORM-011` | Live-region announcement policy | Screen reader |
| `A11Y-PLATFORM-012` | Native structural semantics — list, table, disclosure | Screen reader |
| `A11Y-PLATFORM-013` | Target size floor and comfortable floor | Target size |
| `A11Y-PLATFORM-014` | Adjacent destructive/primary separation and ceremony | Target size |
| `A11Y-PLATFORM-015` | No colour-alone communication | Colour / non-colour |
| `A11Y-PLATFORM-016` | Disabled vs unavailable vs hidden — accessibility-tree consequence | Colour / non-colour |
| `A11Y-PLATFORM-017` | Text and UI-component contrast obligation | Contrast |
| `A11Y-PLATFORM-018` | Forced-colours / high-contrast survival, Profile A | Contrast |
| `A11Y-PLATFORM-019` | Text scaling without loss of content or function | Text |
| `A11Y-PLATFORM-020` | Reflow — no two-dimensional scrolling | Text |
| `A11Y-PLATFORM-021` | Text-spacing survival | Text |
| `A11Y-PLATFORM-022` | Arabic readability — leading, tracking, dual-script metrics | Text |
| `A11Y-PLATFORM-023` | Long content is sized-for; critical values never truncate | Text |
| `A11Y-PLATFORM-024` | Reduced-motion parity | Motion |
| `A11Y-PLATFORM-025` | No information conveyed only through animation | Motion |
| `A11Y-PLATFORM-026` | Persistent visible labels; no placeholder-as-label | Forms |
| `A11Y-PLATFORM-027` | Field-bound error association, summary, input preservation | Forms |
| `A11Y-PLATFORM-028` | Multi-step and draft-form progress is accessible and resumable | Forms |
| `A11Y-PLATFORM-029` | Accessible authentication | Authentication |
| `A11Y-PLATFORM-030` | Bidirectional content — assistive-technology reading order and isolation | RTL / bidi |
| `A11Y-PLATFORM-031` | Icon mirroring rules | RTL / bidi |
| `A11Y-PLATFORM-032` | Visual RTL vs content direction | RTL / bidi |
| `A11Y-PLATFORM-033` | Data-state accessibility matrix | Data-state |
| `A11Y-PLATFORM-034` | Evidence-transfer accessibility | Domain reinforcement |
| `A11Y-PLATFORM-035` | Responsive/reflow — Patient reading column | Responsive |
| `A11Y-PLATFORM-036` | Responsive/reflow — operational panel | Responsive |
| `A11Y-FINANCE-001` | Financial value accessibility | Domain — FINANCE |
| `A11Y-CLINICAL-001` | Treatment/plan change accessibility | Domain — CLINICAL |
| `A11Y-POLICY-001` | Governed version and comparison accessibility | Domain — POLICY |
| `A11Y-AUDIT-001` | Sensitive decision capture accessibility | Domain — AUDIT |

---

## 5. Keyboard

### A11Y-PLATFORM-001 — Complete keyboard operability, Profile A

| Field | Value |
|---|---|
| Purpose | Give every Profile A obligation one home instead of restating "keyboard reachable" on 118 wireframes. |
| Applies to | Profile A only. Profile C has no keyboard as a primary input — `A11Y-PLATFORM-003` carries its equivalent. |
| Requirement source | WCAG 2.2 SC 2.1.1 Keyboard; `IX-PLATFORM-012` |
| User impact | A keyboard-only or switch-device user cannot complete a task a mouse user can. |
| Normative rule | Every sequence in every `IX-*` is completable by keyboard alone on Profile A, with no step that requires a pointer. Hover is an enhancement, never the only way to reveal a row action. |
| Profile C (Patient) behaviour | n/a as a primary channel; an external keyboard on a tablet remains a supported input and the same activation and focus rules apply where one is attached. |
| Profile A (Clinic/Admin) behaviour | Table row actions, filter controls, disclosure toggles, the action bar, and every dialog control are keyboard-activated by the platform's own activation keys. |
| Carrier `CMP-*` | `CMP-PLATFORM-004`, `-006`, `-007`, `-008` |
| Carrier `IX-*` | `IX-PLATFORM-012` (rule 3 of the index's section 4), `IX-PLATFORM-015`, `IX-PLATFORM-016` |
| RTL implications | None beyond `IX-PLATFORM-010`; activation keys are direction-neutral. |
| Verification method | Manual keyboard traversal of a rendered surface; no mechanical proxy exists in documentation. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for stock Filament form/table controls; B wherever a table or action is `Extended`; C for `Custom` realizations (`CMP-PLATFORM-002`, `-005`, `-008`, `-012`, `CMP-ELIG-003`, `CMP-CLINICAL-002`, `CMP-POLICY-001`) |
| UberTib responsibility | Configure every `Extended` and `Custom` realization to be keyboard-complete; never ship a hover-revealed row action with no keyboard equivalent. |

### A11Y-PLATFORM-002 — No keyboard trap; controlled overlay entry and exit

| Field | Value |
|---|---|
| Purpose | An overlay that cannot be escaped by keyboard is a documented WCAG failure mode, and this product has one high-frequency overlay type: the sensitive confirmation. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.1.2 No Keyboard Trap; SC 2.4.3 Focus Order |
| User impact | A keyboard or screen-reader user who opens a confirmation and cannot close it is stuck on the surface. |
| Normative rule | Every dialog, drawer, sheet, and disclosure is dismissible by the platform's cancel key or an equivalent reachable control, and dismissal never leaves focus stranded outside the document. |
| Profile C (Patient) behaviour | A full-screen or sheet confirmation is focus-trapped for the duration it is open and dismissible by the platform's own back/cancel gesture and a reachable Cancel control. |
| Profile A (Clinic/Admin) behaviour | The Filament action modal's stock trap is retained; UberTib configures the required-reason field and initial focus inside it without breaking the trap boundary. |
| Carrier `CMP-*` | `CMP-PLATFORM-014` |
| Carrier `IX-*` | `IX-AUDIT-001`, `IX-CLINICAL-001` |
| RTL implications | None beyond `A11Y-PLATFORM-032`'s cancel-at-`start`/confirm-at-`end` ordering — trap boundaries are direction-neutral. |
| Verification method | `scripts/verify_focustrap.mjs` (design-kit tool; Phase 5) — confirms Tab stays inside, Escape closes, focus returns |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for the Filament modal shell's base trap; B for configuring the required-reason field without breaking it; C for the Profile C sheet trap, which has no framework default |
| UberTib responsibility | Never ship a `CMP-PLATFORM-014` instance without a verified escape path. |

### A11Y-PLATFORM-003 — Logical order and reachable gesture equivalents

| Field | Value |
|---|---|
| Purpose | Bind the Profile A tab order and the Profile C gesture model to one obligation, because they answer the same user question — "can I reach and act on everything" — through two different input channels. |
| Applies to | Both profiles, with profile-specific normative content |
| Requirement source | WCAG 2.2 SC 2.4.3 Focus Order; SC 2.5.1 Pointer Gestures; `IX-PLATFORM-012` |
| User impact | Profile A: a keyboard user's tab order jumps unpredictably. Profile C: a screen-reader user cannot perform a swipe or long-press gesture and has no alternative route to the action it triggers. |
| Normative rule | Profile A: tab order matches visual/reading order, and mixed-direction content never produces a jumping order (`A11Y-PLATFORM-030`). Profile C: every long-press or swipe action has a reachable, single-tap equivalent — a gesture is a shortcut, never the only route. |
| Profile C (Patient) behaviour | Long-press-to-select and swipe-to-act (evidence resume, list actions) each carry a visible, single-tap control that performs the same action. |
| Profile A (Clinic/Admin) behaviour | Tab order follows the panel's reading order region by region: subject header, filters, primary content, action bar, supporting information. |
| Carrier `CMP-*` | `CMP-PLATFORM-004`, `-006`, `-012` |
| Carrier `IX-*` | `IX-PLATFORM-012` |
| RTL implications | Reading order in Profile A tab traversal follows logical order, not visual left-to-right, so a mirrored layout does not invert the tab sequence. |
| Verification method | Manual traversal (Profile A); manual VoiceOver/TalkBack pass over gesture-triggered actions (Profile C) |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's default DOM-order tab sequence on stock forms; B wherever a custom grid or repeater reorders visually; C for every gesture-equivalent control on Profile C, which React Native does not supply by default |
| UberTib responsibility | Never ship a swipe or long-press action without its single-tap sibling. |

---

## 6. Focus

### A11Y-PLATFORM-004 — Visible focus indicator, both profiles

| Field | Value |
|---|---|
| Purpose | Fix, once, that focus visibility is a token-level guarantee rather than a per-component discretionary choice. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.4.7 Focus Visible; SC 2.4.11 Focus Not Obscured (Minimum) |
| User impact | A keyboard or switch user loses track of where they are on the surface. |
| Normative rule | Every focusable control renders `semantic.color.focus.ring` at `semantic.focus.width` with `semantic.focus.offset`, deliberately not derived from `action.primary`, so the ring survives on top of an action fill, a destructive fill, and every status emphasis fill alike (`DESIGN_TOKENS.md` §8.1). |
| Profile C (Patient) behaviour | Visible on any control an external keyboard reaches; not suppressed merely because the primary input is touch. |
| Profile A (Clinic/Admin) behaviour | Visible on every control, including inside dense table rows and the sticky action region. |
| Carrier `CMP-*` | Every interactive `CMP-*` — its own **States → focus** row already names the token pair. |
| Carrier `IX-*` | `IX-PLATFORM-012` |
| RTL implications | None; the ring is a two-band outline with no directional asymmetry. |
| Verification method | Token-level: the focus token pair clears 3:1 against every one of the eleven backgrounds a focused control can sit on (measured in `DESIGN_TOKENS.md` §8.1). Rendered: a visual pass confirming the ring actually paints. |
| Verification phase | Token pairing mechanically verified now; rendered appearance is Phase 5. |
| Framework responsibility | A for Filament's own focus-visible default on stock controls, which UberTib's token override replaces; B to apply the token pair consistently across `Extended`/`Custom` realizations; C has no case here — focus tokens exist precisely so nothing bespoke is needed |
| UberTib responsibility | Never let a component's own state fill (a status emphasis, an action colour) suppress the ring by contrast collision — this is why the ring is deliberately not derived from `action.primary`. |

### A11Y-PLATFORM-005 — Focus not obscured by sticky chrome

| Field | Value |
|---|---|
| Purpose | Both panels use a framework shell with sticky navigation and a sticky action bar; a focused control sliding under either is a real, named risk, not a theoretical one. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) |
| User impact | A keyboard user tabs to a control they cannot see, and cannot tell whether their next keypress will activate it. |
| Normative rule | A focused element scrolls into view within its own container and is never covered by sticky chrome, at any text size, in any density mode. |
| Profile C (Patient) behaviour | The sticky primary-action region (`CMP-PLATFORM-004` `sticky` variant) never covers a field the actor is editing above it. |
| Profile A (Clinic/Admin) behaviour | The panel's sticky header/navigation never covers a focused row or field in a scrolled table or long form. |
| Carrier `CMP-*` | `CMP-PLATFORM-004` (`sticky` variant), `CMP-PLATFORM-006` |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | None; sticky-chrome overlap is a block-direction concern, not an inline-direction one. |
| Verification method | Rendered pass at each text size and density mode, sticky elements present. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — Filament's sticky shell is framework-owned; UberTib must configure scroll-margin/offset behaviour so it does not cover focus |
| UberTib responsibility | Test every surface that combines a sticky element with a long scrollable region — table bodies and long forms are the highest-risk combination. |

### A11Y-PLATFORM-006 — Focus movement after mutation, error, and structural-state replacement

| Field | Value |
|---|---|
| Purpose | Collect the "where does focus go" rule that otherwise appears fragmented across `IX-PLATFORM-001`, `-004`, `-017`, `-018` and several `CMP-*` blocks, into one obligation a reviewer can check against any new surface. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.4.3 Focus Order; SC 4.1.3 Status Messages |
| User impact | Content is replaced silently under a screen-reader or keyboard user who keeps acting on a surface that no longer exists. |
| Normative rule | On failure, focus moves to the failure message. On success, focus moves to the region that changed. When a structural state (`CMP-PLATFORM-009`/`-010`) replaces content the actor was reading, focus moves to it and it is announced (`A11Y-PLATFORM-011`). On field validation failure, focus moves to the **first field in error**, never to a summary alone and never to the top of the form. A refresh that does not replace a focused element's container never moves focus. |
| Profile C (Patient) behaviour | Identical rule; the constrained one-column layout makes a stray focus target more disorienting, not less. |
| Profile A (Clinic/Admin) behaviour | Identical rule; a dense table refresh must not steal focus from a row the actor is working. |
| Carrier `CMP-*` | `CMP-PLATFORM-009`, `-010`, `-011` |
| Carrier `IX-*` | `IX-PLATFORM-001`, `-003`, `-004`, `-017`, `-018` |
| RTL implications | None beyond the general rule. |
| Verification method | Rendered pass triggering each transition (success, failure, structural-state replacement, validation failure) and observing focus. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B/C — Filament's default validation focus behaviour is configured (B) where used unmodified; the structural-state and mutation-outcome focus moves are C, since no framework default anticipates this product's failure taxonomy. |
| UberTib responsibility | Never let a silent content swap happen under a focused or read element without moving and announcing. |
| Failure example | A list refreshes in place after a background poll, the row the actor had focused is now three positions lower, and focus stays on an unrelated row — the actor's next keypress acts on the wrong record. |
| Pass criteria | After any content replacement, focus is either preserved on the same logical item, moved deliberately to the changed region, or moved to an explicit structural-state block — never left pointing at content that is no longer what it was. |

### A11Y-PLATFORM-007 — Dialog initial focus and return-to-trigger focus

| Field | Value |
|---|---|
| Purpose | `CMP-PLATFORM-014` fixes this at the component level already; this obligation makes it a standing check independent of which specific confirmation is rendered. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.4.3 Focus Order |
| User impact | Initial focus landing on Confirm means a keystroke in flight when the dialog opens can activate an irreversible action before the actor has read anything. |
| Normative rule | Initial focus lands on the first meaningful element inside the dialog — **never on Confirm**. Focus returns to the control that triggered the dialog on cancel or close, in every case, including when Confirm becomes enabled by completing the required reason field (focus is not moved onto Confirm as a side effect of that). |
| Profile C (Patient) behaviour | Same rule, applied to the full-screen or sheet confirmation. |
| Profile A (Clinic/Admin) behaviour | Same rule, applied to the Filament action modal. |
| Carrier `CMP-*` | `CMP-PLATFORM-014` |
| Carrier `IX-*` | `IX-AUDIT-001` |
| RTL implications | None. |
| Verification method | Rendered pass: open, observe initial focus target; type/keystroke while the reason field completes, observe focus stays put; cancel and close, observe focus returns to the exact trigger control. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's default first-focusable-element behaviour, which happens to be adequate here since the reason field is the first meaningful element; B to verify it explicitly rather than assume it; C for the Profile C sheet, no framework default |
| UberTib responsibility | Audit every `CMP-PLATFORM-014` instance individually — a confirmation with no reason field has no "first meaningful element" to default to and needs an explicit initial-focus target (the effect statement, made focusable). |

### A11Y-PLATFORM-008 — Focus restoration, list-to-detail-and-back

| Field | Value |
|---|---|
| Purpose | `IX-PLATFORM-015` already names this "the single most commonly missed half of this pattern"; it earns its own obligation because it is the one accessibility fact that makes a queue usable by keyboard at all. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.4.3 Focus Order |
| User impact | A keyboard or screen-reader user returning from a detail surface lands at the top of the list and must re-navigate to where they were, on every single record they review — a queue of any size becomes unusable. |
| Normative rule | On entering a detail surface, focus moves to the detail's heading or state summary, not to the first control. On returning, focus returns to the **row the actor came from**, and the list's filter, sort, scroll position and selection are restored — not a default view. |
| Profile C (Patient) behaviour | The platform back gesture returns to the list with state intact; a swipe-back must not lose the filter. |
| Profile A (Clinic/Admin) behaviour | Where list and detail render together at a wider content width, the return route is a deselect that keeps focus in the list region rather than a full navigation. |
| Carrier `CMP-*` | `CMP-PLATFORM-006`, `-007`, `-003` |
| Carrier `IX-*` | `IX-PLATFORM-015` |
| RTL implications | None beyond the general rule; the disclosure chevron mirrors at `end` per `A11Y-PLATFORM-031`. |
| Verification method | Rendered pass: open a filtered/sorted/scrolled list, open a record, return, confirm focus and list state both match. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — no Filament or React Native default restores both scroll/filter/sort state **and** row-level focus together; this is `CMP-PLATFORM-006`/`-015` anatomy |
| UberTib responsibility | Treat this as a required regression check on every `list-and-detail` wireframe (29) and every embedded-list surface, not an incidental nicety. |

---

## 7. Screen reader

### A11Y-PLATFORM-009 — Accessible name, role and state for every interactive element and status

| Field | Value |
|---|---|
| Purpose | The base WCAG 4.1.2 obligation, stated once instead of once per component, because every `CMP-*`'s own **Accessibility** paragraph already instantiates it and a system-level anchor keeps them from drifting apart. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 4.1.2 Name, Role, Value |
| User impact | A screen-reader user hears nothing, or hears the wrong thing, for a control or a status. |
| Normative rule | Every interactive element exposes an accessible name, role, and current state (expanded/collapsed, selected, pressed, busy). Every status chip announces as one unit — name, role and state together — not as an icon with no accessible name plus adjacent unlabelled text. |
| Profile C (Patient) behaviour | React Native `accessibilityRole`/`accessibilityLabel`/`accessibilityState` set explicitly on every custom (`Native`) component; never left to default DOM-adjacent text concatenation. |
| Profile A (Clinic/Admin) behaviour | Filament's stock ARIA plumbing on `Stock` controls; explicit `aria-label`/`aria-describedby` wiring on every `Extended`/`Custom` realization. |
| Carrier `CMP-*` | All 22 — each names this in its own Accessibility paragraph; `CMP-PLATFORM-001` is the canonical worked example (chip announces as one unit, icon takes no separate name). |
| Carrier `IX-*` | `IX-PLATFORM-001`, `-017` |
| RTL implications | Composed accessible names follow reading order, not source order, where the two diverge under `A11Y-PLATFORM-030`. |
| Verification method | `scripts/axe_audit.mjs` (design-kit tool, Phase 5) for automated name/role/value checks; manual screen-reader pass for composition correctness axe cannot judge. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament stock form controls and React Native primitives' default roles; B/C for every custom composition named in the carrier list |
| UberTib responsibility | Every `Custom`-realized `CMP-*` gets an explicit accessible-name composition rule, stated in its own block — already true for all 22 — carried through into implementation without silent drift. |

### A11Y-PLATFORM-010 — Icons decorative to assistive technology; the label always carries meaning

| Field | Value |
|---|---|
| Purpose | Prevent a common implementation slip: an icon with its own accessible name announced separately from, or instead of, the text label it sits beside. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.1.1 Non-text Content; product rule — icon system, `DESIGN_TOKENS.md` §4.3 |
| User impact | A screen reader announces a bare icon name ("check circle icon") with no meaning, or announces it twice alongside the label. |
| Normative rule | Every governed icon is decorative to assistive technology (`aria-hidden`/`importantForAccessibility=false` or platform equivalent) because the adjacent text label already carries the meaning. An icon never becomes the sole carrier of meaning and never receives its own competing accessible name. |
| Profile C (Patient) behaviour | Icons marked non-accessible in React Native's accessibility tree; the label text is what VoiceOver/TalkBack reads. |
| Profile A (Clinic/Admin) behaviour | `aria-hidden="true"` on every governed icon inside a labelled control. |
| Carrier `CMP-*` | `CMP-PLATFORM-001` (explicit: "the icon is decorative to assistive technology... and never becomes the only announcement"), and by extension every component using the icon vocabulary |
| Carrier `IX-*` | none directly — this is a component-anatomy rule |
| RTL implications | None. |
| Verification method | `scripts/axe_audit.mjs`; manual spot check for double-announcement. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — this is a `CMP-*` anatomy rule with no framework default to lean on; Heroicons ships with no accessibility opinion baked in |
| UberTib responsibility | Audit every icon usage at implementation time, not only the 22 governed components — a Phase 4 widget introducing a new icon inherits this rule without a new `A11Y-*` allocation. |

### A11Y-PLATFORM-011 — Live-region announcement policy

| Field | Value |
|---|---|
| Purpose | This is the anchor obligation for section 19's "state announcement rules." Without one stated policy, each surface improvises when to announce, and the two failure modes — silence on something that matters, noise on something that does not — both degrade trust in the announcements that remain. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 4.1.3 Status Messages |
| User impact | Too little: a screen-reader user misses that their submission failed, or that eligibility changed under them. Too much: every background refresh interrupts reading, and the actor starts ignoring announcements altogether, which defeats the ones that matter. |
| Normative rule | **Announce (polite, unless noted assertive):** a lifecycle status changing without the actor's own action on the surface they are viewing (`CMP-PLATFORM-001`/`-002`); a submission state transition — pending, retrying, failed, completed (`CMP-PLATFORM-011`); a structural-state replacement of content the actor was reading (`CMP-PLATFORM-009`/`-010`, assertive when it replaces content — see `A11Y-PLATFORM-006`); a disclosure opening/closing with its content summary; a filtered result count changing; a deadline closing while the surface is open. **Do not announce:** an individual skeleton cell appearing during initial load; a background poll that found no change; per-keystroke input echo beyond what the platform's own input semantics already provide; routine focus movement that is not itself a status change. |
| Profile C (Patient) behaviour | Applies identically; weak connectivity makes submission-state announcements (pending/retrying/failed/completed) load-bearing rather than a courtesy, since the actor may not be watching the screen continuously. |
| Profile A (Clinic/Admin) behaviour | Applies identically; a long-lived panel tab makes authorization-loss and staleness announcements (`A11Y-PLATFORM-006`, `IX-PLATFORM-007`) the highest-value case, because the actor is least likely to notice a silent change on a tab they are not currently reading. |
| Carrier `CMP-*` | `CMP-PLATFORM-001`, `-002`, `-009`, `-010`, `-011`, `-012`, `-015` |
| Carrier `IX-*` | `IX-PLATFORM-001`, `-003`, `-004`, `-007`, `-017` |
| RTL implications | Announced text follows the same bidi-isolation rule as displayed text (`A11Y-PLATFORM-030`) — an amount or identifier inside an announcement is not read digit-reversed. |
| Verification method | Manual screen-reader pass triggering each listed transition; no mechanical proxy exists in documentation alone. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — Filament's `Notification::make()` provides a live region for its own toasts (A); every custom live region (structural-state block, submission indicator, status chip change) is C |
| UberTib responsibility | Implement exactly one `aria-live="polite"` (or assertive per the rule above) region per logical surface region — not one per component — so simultaneous changes do not produce overlapping or truncated announcements. |
| Failure example | A patient's booking silently moves from `REQUESTED` to `ELIGIBILITY_REVIEW` while they are reading the appointment detail with a screen reader; nothing is announced; they only discover the change on their next visit, past the point where "no action needed yet" would have mattered. |
| Pass criteria | Every transition in the worked-example table in section 19 produces exactly one announcement, at the correct politeness level, and no unlisted transition produces one. |

### A11Y-PLATFORM-012 — Native structural semantics — list, table, disclosure

| Field | Value |
|---|---|
| Purpose | A visually correct table or list that is not marked up as one is invisible structure to a screen reader, which is a distinct failure from a missing accessible name. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.1 Info and Relationships |
| User impact | A screen-reader user cannot use table-navigation commands (next cell, next row, read column header) on data that visually looks tabular, or cannot use list-navigation commands on a reading list. |
| Normative rule | `CMP-PLATFORM-006`'s `table` variant is a real table with header-cell association, so a screen reader announces the column with the cell. Its `reading-list` variant is a real list with one accessible name per row. `CMP-PLATFORM-008`'s timeline is a list, not a sequence of headings, so it does not pollute the document outline. Every disclosure control declares its expanded/collapsed state (`aria-expanded` or platform equivalent). |
| Profile C (Patient) behaviour | React Native list semantics (`accessibilityRole="list"`/`"listitem"` or FlatList's native equivalent) on `reading-list`. |
| Profile A (Clinic/Admin) behaviour | Semantic `<table>`/`role="table"` with `<th>`/`scope` or ARIA grid roles on `table`; Filament's table component supplies this by default for stock columns. |
| Carrier `CMP-*` | `CMP-PLATFORM-006`, `-008` |
| Carrier `IX-*` | `IX-PLATFORM-008`, `-015`, `-016` |
| RTL implications | Column order mirrors visually; header-cell association is a data relationship and is unaffected by direction. |
| Verification method | `scripts/axe_audit.mjs` for table/list structural checks (Phase 5); manual pass for the timeline's list-not-headings rule, which axe does not directly assert. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's stock table markup; C for `CMP-PLATFORM-006`'s `embedded`/`immutable`/`selectable` variants and for `CMP-PLATFORM-008`, which is `Custom` on Profile A precisely because stock table actions are not attached |
| UberTib responsibility | Never let a `Custom`-realized list or table fall back to a visually-styled `<div>` grid with no underlying semantics. |

---

## 8. Target size

### A11Y-PLATFORM-013 — Target size floor and comfortable floor

| Field | Value |
|---|---|
| Purpose | Fix that the WCAG minimum and this product's own comfortable floor are two distinct, both-enforced tokens, not one number applied loosely. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.5.8 Target Size (Minimum) |
| User impact | A user with limited fine motor control, or on a moving vehicle, or interrupted mid-task (`PO-UX-07`'s documented condition for Clinic staff), mis-taps an adjacent control. |
| Normative rule | `semantic.size.target-floor` is the absolute floor for any interactive target on any platform in any density mode, once the hit area is counted — a visually smaller control still clears the floor through an expanded hit area. `semantic.size.target-primary` is the floor for every Patient primary action and every deadline-bearing action on any platform, in any mode; no density multiplier may cross either floor (`COMPONENT_INVENTORY.md` §4). |
| Profile C (Patient) behaviour | `reading` density renders all interactive elements above the comfortable floor by default; the primary action never drops to the bare minimum. |
| Profile A (Clinic/Admin) behaviour | `dense` mode (workspace archetype, table bodies) compresses padding, never the target floor — a `control-sm` row action still clears the floor via hit-area expansion. |
| Carrier `CMP-*` | Every interactive `CMP-*` — each states its density-mode target behaviour in its own **Density and size** section. |
| Carrier `IX-*` | `IX-PLATFORM-012` |
| RTL implications | None. |
| Verification method | Token-level: the floors exist as tokens rather than guidelines (mechanically true by construction, per `DESIGN_TOKENS.md` §6 and §11). Rendered: measured hit area on a real device/viewport. |
| Verification phase | Token existence verified now; actual rendered hit area is Phase 5. |
| Framework responsibility | A for Filament's default control sizing at rest; B to apply the density token consistently so `dense` never shrinks the hit area below the floor; C for `Custom` realizations with bespoke touch targets (`CMP-PLATFORM-005`, `-012`) |
| UberTib responsibility | Treat a `dense` table row action as the highest-risk case for this obligation — it is the one place density and the target floor are in the most direct tension, and `PO-UX-07`'s interruption-rate finding is the reason the floor is not shaved merely because the mode allows tighter spacing. |

### A11Y-PLATFORM-014 — Adjacent destructive/primary separation and ceremony

| Field | Value |
|---|---|
| Purpose | A destructive and a primary control sitting close together at a small target size is a mis-tap risk with an irreversible consequence, which is a materially worse failure than a mis-tap on two harmless actions. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.5.8 Target Size (Minimum); product rule — `CMP-PLATFORM-004`, `IX-AUDIT-001` |
| User impact | A mis-tap commits an irreversible action instead of the intended routine one. |
| Normative rule | The destructive action sits at the action bar's `end`, separated from the primary and secondary group, never adjacent without a visible gap at least equal to the inline spacing token. Any irreversible or destructive command additionally requires `CMP-PLATFORM-014` before commit, which is the ceremony that makes a mis-tap recoverable even where target separation alone would not be. |
| Profile C (Patient) behaviour | The `sticky` action-bar variant keeps the same separation and ceremony rule; a sticky region never compresses the gap between primary and destructive to fit more actions. |
| Profile A (Clinic/Admin) behaviour | Row-level destructive actions in `CMP-PLATFORM-006` follow the same separation rule even at `dense` size. |
| Carrier `CMP-*` | `CMP-PLATFORM-004`, `-006`, `-014` |
| Carrier `IX-*` | `IX-AUDIT-001` |
| RTL implications | Primary at `start`, destructive at `end`, in both directions — `A11Y-PLATFORM-032`'s ordering rule, stated here for the safety consequence rather than the visual one. |
| Verification method | Rendered visual/spacing check plus the `CMP-PLATFORM-014` ceremony confirms the second line of defence exists. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — Filament's stock action-group layout is configured to enforce the separation and the destructive-color-identity match between trigger and confirm |
| UberTib responsibility | Treat "mis-tap-then-confirm" as the actual safety property, not spacing alone — spacing reduces the chance of the mis-tap, the confirmation is what makes the mis-tap non-fatal. |

---

## 9. Colour and non-colour communication

### A11Y-PLATFORM-015 — No colour-alone communication

| Field | Value |
|---|---|
| Purpose | The system-level statement of `NFR-PLATFORM-005`'s hardest clause, made structural rather than a review item, exactly as `DESIGN_TOKENS.md` §5 and `DESIGN_DIRECTION.md` §3.3 already establish at the token layer — this obligation is the accessibility-side confirmation that the structure actually delivers the WCAG guarantee it was built for. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.1 Use of Color |
| User impact | A colour-blind user, a user in direct sunlight, a user on a monochrome or forced-colours display, or a screen-reader user cannot distinguish states that differ only by hue. |
| Normative rule | Status, error, protection, eligibility, urgency, and selection are never conveyed by colour alone. Every lifecycle status consumes the tone/icon/emphasis triple as a whole (`design_tokens/semantic.state.json`) — a component that renders the tone without the icon and the label is a defect, not a variant. A flag (`escalated`, `overdue`) is additive in its own slot, never a recolour of the status. Selection additionally carries a stated selection, not tint alone (`CMP-PLATFORM-006`, `CMP-ELIG-001`). |
| Profile C (Patient) behaviour | Identical rule; the highest-consequence instance is `PENDING_EVALUATION` vs `NOT_ELIGIBLE` (different tone, different icon — `CONTENT_GUIDE_STATES.md` `TXT-STATE-ELIG-001`) and `FAILED_RETRYABLE` vs `REJECTED` (different tone, icon, and emphasis — `TXT-STATE-PLATFORM-001`). |
| Profile A (Clinic/Admin) behaviour | Identical rule, plus Filament's own colour-only badge configuration is explicitly prohibited (`CMP-PLATFORM-001` realization row). |
| Carrier `CMP-*` | `CMP-PLATFORM-001` (the structural home of this rule), and by composition every component listed in `COMPONENT_INVENTORY.md` §2.3 |
| Carrier `IX-*` | `IX-OPS-001` (flag-vs-status separation), `IX-BOOKING-001` (`CANCELLED` tone correction) |
| RTL implications | None — the triple's three channels are all direction-neutral. |
| Verification method | **Mechanically verified now**: `validate_ux_tokens.py` requires a complete triple with a governed tone, icon, and emphasis for every one of the 82 statuses, and forbids a machine reusing one icon for two of its own statuses (`DESIGN_TOKENS.md` §10). **Not verifiable from documentation**: whether `restricted` and `neutral` — deliberately close in hue and separated by icon, emphasis and label rather than colour — are genuinely distinguishable to a real reader (`DESIGN_TOKENS.md` §11). |
| Verification phase | Token-triple completeness verified now; real distinguishability is Phase 5. |
| Framework responsibility | C — this has no framework default anywhere; it is pure `CMP-*` anatomy enforced by the token gate |
| UberTib responsibility | Treat any future status addition (beyond the 82) as automatically bound by this rule through the existing token schema — no new `A11Y-*` allocation is needed per status. |

### A11Y-PLATFORM-016 — Disabled vs unavailable vs hidden — accessibility-tree consequence

| Field | Value |
|---|---|
| Purpose | This is the system rule section 13 of the session brief asks for, restated here as an accessibility obligation because the three states have three different, and currently under-specified, accessibility-tree consequences. `COMPONENT_INVENTORY.md`'s "disabled is not an authorization control" rule already fixes the *visual/authorization* semantics on every component; this obligation fixes what each state means for assistive technology and the tab order specifically. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.1 Info and Relationships; SC 2.4.3 Focus Order; product rule — `CMP-PLATFORM-004`, `IX-PLATFORM-007` |
| User impact | A disabled control left reachable by keyboard wastes a screen-reader or keyboard user's time on something they cannot act on and, worse, implies an override exists that does not. A hidden action that should have been visibly unavailable-with-reason leaves the actor unable to understand why nothing is there. |
| Normative rule | **Hidden** — the actor is not authorized, or the action must not exist in this state. The control does not exist in the DOM/view tree and is not reachable by any input method; its absence carries no separate announcement, because a hidden action is not a fact the actor needs stated (its absence from the action bar's rendered set is itself neutral). **Unavailable** — the action exists conceptually but cannot currently be performed, and the actor may need to know why. It renders as explanatory *text*, not as a disabled control (`CMP-PLATFORM-004`'s absent-action-explanation slot) — present in the accessibility tree as a labelled statement, not as a focusable-but-inert button. **Disabled** — reserved narrowly for a control that is temporarily not actionable inside an *active* interaction the same actor is completing, where the reason is visible on the same surface (an incomplete required field, a pending in-flight submission blocking re-submission). It remains in the tab order, exposes `aria-disabled`/platform-equivalent state, and its enabling condition is visible without leaving the surface. |
| Profile C (Patient) behaviour | Same three-way distinction; `IX-PLATFORM-007`'s authorization-loss case (a guardian grant revoked mid-session) moves an action from present to **hidden** immediately, never to disabled. |
| Profile A (Clinic/Admin) behaviour | Same distinction; Filament's stock disabled-button styling is never used for the authorization or lifecycle case — only for the narrow legitimate case (e.g., Confirm blocked pending a required reason in `CMP-PLATFORM-014`). |
| Carrier `CMP-*` | `CMP-PLATFORM-004` (primary carrier), `-001`, `-005`, `-006`, `-007`, `-009`, `-010`, `-014`, `-015` — every block's own **States → disabled** row already states its own n/a-or-narrow reasoning; this obligation is the cross-component rule those rows are each instances of. |
| Carrier `IX-*` | `IX-PLATFORM-007`, `-018`; `IX-AUDIT-001` (the one narrow legitimate disabled case, Confirm pending a reason) |
| RTL implications | None. |
| Verification method | Rendered accessibility-tree inspection confirming a hidden action is absent (not `display:none` on a still-focusable node), an unavailable action is a labelled non-interactive statement, and a disabled action carries `aria-disabled` and remains reachable. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — Filament's `->disabled()` action modifier is the wrong tool for the hidden and unavailable cases and must not be reached for by default; it is the correct, framework-provided tool only for the narrow disabled case |
| UberTib responsibility | This is the rule most likely to be violated by reaching for the nearest framework primitive (`->disabled()`, a React Native `disabled` prop) under time pressure — flag it explicitly in implementation review rather than trusting the component spec alone to prevent it. |
| Failure example | A Clinic staff member's booking-response scope is revoked mid-shift; the "Respond" button stays visible and clickable-looking but throws a permission error on click — this is the exact failure `IX-PLATFORM-007` and this obligation both exist to prevent. |
| Pass criteria | For every action removed on this session's authorization or lifecycle grounds, the accessibility tree shows either no node at all (hidden) or a non-interactive labelled explanation (unavailable) — never a focusable, `aria-disabled` node implying a temporary block. |

---

## 10. Contrast

### A11Y-PLATFORM-017 — Text and UI-component contrast obligation

| Field | Value |
|---|---|
| Purpose | State the contrast obligation once at the system level, distinguishing what the token gate already proves from what still needs a rendered surface — consistent with `DESIGN_TOKENS.md` §11's own honesty framing. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.3 Contrast (Minimum); SC 1.4.11 Non-text Contrast |
| User impact | Low-vision users, users in poor lighting, and users with a compromised display cannot read text or distinguish a control's boundary. |
| Normative rule | Normal text (below the large-text threshold) meets 4.5:1; large text and graphical/UI-component boundaries that identify a control meet 3:1. `border.strong`, not `border.default`, is the value any boundary identifying a control must use — `border.default` is decorative-only (dividers, card edges) and is never relied on to communicate an interactive boundary. |
| Profile C (Patient) behaviour | Identical requirement; the `reading` density's larger type sizes make more of the Patient surface qualify under the large-text 3:1 threshold, which is a floor, not a licence to use less contrast than necessary. |
| Profile A (Clinic/Admin) behaviour | Identical requirement; the `dense` table body is the highest-risk surface for this rule because compressed padding tempts a lighter divider value where a boundary-identifying value is actually required. |
| Carrier `CMP-*` | Every `CMP-*`'s token mapping already resolves to `semantic.color.text.*`/`tone.*.text`/`border.strong`, which is what the gate checks. |
| Carrier `IX-*` | none directly — this is a token-and-render obligation, not a sequence obligation |
| RTL implications | None. |
| Verification method | **Mechanically verified now**: `validate_ux_tokens.py` reports 114/114 required pairs passing in light mode and 114/114 in the retained dark compatibility map (`DESIGN_TOKENS.md` §10). **Not verified by that gate**: the actual computed contrast of rendered text once real content, real fonts, and real anti-aliasing are involved — that needs `scripts/measure_render.mjs`/`scripts/verify_states.mjs` (design-kit tools) against built surfaces. |
| Verification phase | Token-pair contrast verified now; real rendered contrast is Phase 4/5. |
| Framework responsibility | A for Filament's own default text/background pairing where left unconfigured; B to apply the semantic tokens consistently everywhere a component overrides the framework default |
| UberTib responsibility | Never introduce a new text/background pairing outside the semantic layer's already-verified set — a one-off inline style is exactly how a rendered surface diverges from a passing token gate. |

### A11Y-PLATFORM-018 — Forced-colours / high-contrast survival, Profile A

| Field | Value |
|---|---|
| Purpose | Windows High Contrast / forced-colours mode replaces the entire colour system with a user-chosen palette; a surface that relies on a background fill alone to communicate a boundary or a status disappears under it. This affects Profile A specifically because it is the desktop-browser surface where the OS feature is reachable. |
| Applies to | Profile A only |
| Requirement source | WCAG 2.2 (informative — forced-colours mode); `accessibility/vision.md` |
| User impact | A user relying on the OS forced-colours mode cannot see a status fill, a selection tint, or a boundary that depended on a specific colour value rather than a system colour keyword or a border. |
| Normative rule | Every status and selection state carries a structural cue that survives forced-colours mode — the icon and label (`A11Y-PLATFORM-015` already guarantees these exist), plus a border that is not suppressed under `forced-colors: active` (or platform equivalent). No information is conveyed by a background fill alone once colours are overridden. |
| Profile C (Patient) behaviour | n/a — React Native has no equivalent OS-level forced-colours mode; this obligation is Profile A only. |
| Profile A (Clinic/Admin) behaviour | Every `CMP-PLATFORM-001` emphasis variant, every selected-row treatment, and every focus ring must remain legible under `forced-colors: active`. |
| Carrier `CMP-*` | `CMP-PLATFORM-001`, `-006`, `-014` |
| Carrier `IX-*` | none directly |
| RTL implications | None. |
| Verification method | Rendered pass with the OS forced-colours / browser `forced-colors` emulation enabled. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's own CSS, which generally respects system colours reasonably by default; C for any `Custom` view that paints its own background fills without a forced-colours-safe fallback (`CMP-PLATFORM-002`, `-005`, `-008`, `-012`, `CMP-ELIG-003`, `CMP-CLINICAL-002`, `CMP-POLICY-001`) |
| UberTib responsibility | Prioritize this check on the `Custom`-realized components listed above; they are the ones most likely to paint a fill without a border that survives colour replacement. |

---

## 11. Text, scaling, and reflow

### A11Y-PLATFORM-019 — Text scaling without loss of content or function

| Field | Value |
|---|---|
| Purpose | Restate `IX-PLATFORM-011`'s obligation as a checkable accessibility item, because it is a WCAG success criterion in its own right and not only a responsive-design convenience. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.4 Resize Text |
| User impact | A low-vision user who increases text size loses content, loses a control, or is forced to scroll horizontally to read a line. |
| Normative rule | Text scales to at least double its default size without loss of content or function, on both the platform text-size setting (Profile C) and browser zoom (Profile A). |
| Profile C (Patient) behaviour | The platform's own maximum text size is honoured; one reading column is preserved at every size class rather than degrading to horizontal scroll. |
| Profile A (Clinic/Admin) behaviour | Browser zoom to 200% is honoured; the framework's own responsive behaviour plus this system's reflow rule (`A11Y-PLATFORM-020`) together keep content and function intact. |
| Carrier `CMP-*` | every `CMP-*` states its own long-content/stacking behaviour |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | Reflow uses logical properties throughout, so scaling behaves identically in both directions rather than being verified in one and assumed in the other (`IX-PLATFORM-011`). |
| Verification method | `scripts/verify_responsive.mjs` (design-kit tool) at the narrow verification widths, combined with a manual pass at 200% zoom/platform maximum text size — the script proves no horizontal overflow, not text-scale correctness specifically, so both checks are needed. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's own responsive CSS at moderate zoom; B/C at the extremes, where this product's own stacking threshold (not a width, a text-size threshold — `DESIGN_TOKENS.md` §7) is bespoke |
| UberTib responsibility | Verify the **stacking threshold** specifically, not only that nothing overflows — `DESIGN_TOKENS.md` §7 fixes that at the largest supported size, critical regions stack rather than truncate, which is a stronger and more specific claim than "reflows without overflow." |

### A11Y-PLATFORM-020 — Reflow — no two-dimensional scrolling

| Field | Value |
|---|---|
| Purpose | Distinguish the page-level obligation (no 2D scroll) from the legitimate exception (a data table's own horizontal scroll), which is `A11Y-PLATFORM-036`'s job specifically — this obligation states the page-level rule that exception sits inside. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.10 Reflow |
| User impact | A user zoomed in or on a narrow viewport must scroll in two directions to read ordinary content, which is disorienting and, for some motor-impairment users, close to unusable. |
| Normative rule | At 320 CSS px equivalent width (Profile C) or 200% zoom (Profile A), content reflows to a single column with no loss of information and no requirement to scroll in two dimensions for the page as a whole. A `CMP-PLATFORM-006` `table` variant degrades to the `reading-list` shape at the largest text sizes rather than scrolling horizontally, per its own **Long content** rule. |
| Profile C (Patient) behaviour | One reading column at every size class by construction (`DESIGN_DIRECTION.md` §4.1); this obligation is close to automatically satisfied by the layout family Phase 2 already fixed. |
| Profile A (Clinic/Admin) behaviour | The twelve-column content grid collapses to one column at the `narrow` content width; a supporting rail moves below primary content rather than requiring horizontal scroll (`breakpoints.json` `profile-a.content-width.narrow`). |
| Carrier `CMP-*` | `CMP-PLATFORM-006` |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | None beyond the general reflow rule. |
| Verification method | `scripts/verify_responsive.mjs` at the verification widths (`breakpoints.json` `primitive.verification-width`) |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's grid collapsing at its own breakpoints; B to configure the collapse points against this product's `profile-a.content-width` thresholds specifically, since they are measured on the content area, not the viewport |
| UberTib responsibility | Verify the content-area measurement distinction specifically — a viewport at the `a-wide` threshold is not a content area of the same width once the framework-owned shell navigation is subtracted, per `DESIGN_TOKENS.md` §7. |

### A11Y-PLATFORM-021 — Text-spacing survival

| Field | Value |
|---|---|
| Purpose | A user who overrides line height, paragraph spacing, letter spacing, or word spacing through assistive software must not lose content — a real and distinct WCAG criterion from resize/reflow. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.12 Text Spacing |
| User impact | A user with a dyslexia-support tool that overrides spacing finds text clipped, overlapping, or truncated. |
| Normative rule | No content or functionality is lost when a user overrides text spacing to the WCAG-specified multipliers. This interacts directly with `DESIGN_TOKENS.md` §4.2's letter-spacing rule: **letter spacing has exactly one value, zero**, because non-zero tracking breaks Arabic glyph joining — which means this product starts from a spacing-safe baseline rather than fighting an existing tracking value under override. |
| Profile C (Patient) behaviour | Same rule; the constrained reading column is the higher-risk surface for spacing overrides causing wraps that push content below the fold unexpectedly. |
| Profile A (Clinic/Admin) behaviour | Same rule; dense table rows are the higher-risk surface for row-height clipping under spacing overrides. |
| Carrier `CMP-*` | none specifically named — this is a typography-token-level obligation inherited by every component using `semantic.type.*` |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | The zero-tracking rule is itself an RTL-motivated decision (Arabic glyph joining) that happens to also serve this obligation. |
| Verification method | Rendered pass with a spacing-override bookmarklet/browser extension at the WCAG multipliers. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's own layout, which generally tolerates spacing overrides reasonably; B to verify UberTib's own fixed-height containers (chips, table rows) do not clip under override |
| UberTib responsibility | Audit any component using a fixed pixel height rather than a content-driven height — `CMP-PLATFORM-001`'s chip and `CMP-OPS-001`'s row are the components most likely to define a line-box height that could clip under spacing override. |

### A11Y-PLATFORM-022 — Arabic readability — leading, tracking, dual-script metrics

| Field | Value |
|---|---|
| Purpose | Make explicit, as an accessibility obligation and not only a taste decision, the Arabic-specific readability rules `DESIGN_TOKENS.md` §4.2 already fixed for other reasons — because an illegible diacritic or a broken glyph joint is an accessibility failure for the large majority of this product's users, not a stylistic nicety. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.8 Visual Presentation (informative here — no numeric line-height SC exists, but the underlying legibility goal is squarely WCAG's); `NFR-PLATFORM-005` |
| User impact | A reader with any degree of low vision, or simply reading at speed under stress (a pending decision, an approaching deadline), loses meaning if diacritics clip or letterforms disconnect. |
| Normative rule | Line height is set for Arabic diacritics rather than inherited from a Latin scale — the tightest value in the type scale is deliberately looser than a Latin heading scale would use. Letter spacing has exactly one value, zero, everywhere, because non-zero tracking breaks Arabic glyph joining. The selected family (IBM Plex Sans Arabic) carries Arabic and Latin on one line without a metric mismatch, which matters directly for every mixed-direction string this product renders (`A11Y-PLATFORM-030`). |
| Profile C (Patient) behaviour | Identical obligation; the Patient reading column is Arabic-first and carries the highest volume of continuous Arabic body text in the product. |
| Profile A (Clinic/Admin) behaviour | Identical obligation, plus the mono identifier style (`IBM Plex Mono`) for machine identifiers, which never carries Arabic text and is therefore exempt from the diacritic-leading rule by construction. |
| Carrier `CMP-*` | every `CMP-*` — inherited through `semantic.type.*` |
| Carrier `IX-*` | `IX-PLATFORM-010`, `-011` |
| RTL implications | This obligation **is** an RTL/Arabic obligation; it has no separate RTL-implications note beyond itself. |
| Verification method | Rendered pass confirming diacritics do not clip at heading sizes and confirming the Arabic and Latin faces share usable vertical metrics on one line — explicitly named in `DESIGN_TOKENS.md` §4.2 as **not yet measured**, carried forward as a Phase 5 obligation there and reaffirmed here. |
| Verification phase | Phase 5 rendered QA — `DESIGN_TOKENS.md` §4.2 states plainly that nothing measured a glyph at Session 2, and nothing in this session changes that. |
| Framework responsibility | B — both frameworks accept a custom font family and a custom line-height scale; the values themselves are UberTib's decision, not a framework default |
| UberTib responsibility | This is one of the highest-priority Phase 5 rendered checks in the whole system, because it was explicitly flagged as unmeasured at token definition time and nothing between Session 2 and this session has measured it. |

### A11Y-PLATFORM-023 — Long content is sized-for; critical values never truncate

| Field | Value |
|---|---|
| Purpose | Collect the "never truncate an amount/deadline/reason/attribution" rule that appears, worded consistently, in every single `CMP-*`'s **Long content** paragraph, into one obligation — because a reader auditing a new surface for this rule should not have to cross-reference 22 components to confirm it is universal. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.10 Reflow (informative extension); product rule — `UX_FOUNDATION.md` §5.1, `COMPONENT_INVENTORY.md` §5 |
| User impact | A truncated amount, deadline, controlling reason, or attribution is not a cosmetic loss — it is read (or heard) as a different, wrong fact, which `COMPONENT_INVENTORY.md` §5 already calls a correctness failure rather than a layout compromise. |
| Normative rule | At the largest supported text size, critical regions **stack rather than truncate**. An amount, a deadline, a controlling reason, and an attribution are **never** truncated at any size, in any density mode, on either profile. Truncation is permitted only where the full value is reachable in the same surface without a network read (a long clinic legal name, a file name truncated in the middle with its extension preserved). |
| Profile C (Patient) behaviour | The stacking threshold applies at every size class, not only the smallest device (`breakpoints.json` `profile-c.stack-threshold`). |
| Profile A (Clinic/Admin) behaviour | A `dense` table row stacks into a block rather than eliding a critical value when the row cannot fit its full content. |
| Carrier `CMP-*` | Every `CMP-*`'s own **Long content** paragraph is the primary source; `CMP-ELIG-002` (amounts), `CMP-PLATFORM-005` (deadlines), `CMP-ELIG-003`/`CMP-PLATFORM-002` (controlling reasons), `CMP-PLATFORM-013` (attributions) are the four named critical-value carriers. |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | Stacking is a block-direction behaviour and is direction-neutral; the values themselves remain bidi-isolated per `A11Y-PLATFORM-030` whether stacked or inline. |
| Verification method | `scripts/verify_responsive.mjs` for overflow; manual pass at the largest supported text size specifically checking the four critical-value types are present in full, not merely that nothing overflows. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — this is a content-priority decision with no framework default; Filament and React Native both truncate by default absent explicit configuration |
| UberTib responsibility | Treat any CSS `text-overflow: ellipsis` (or platform equivalent) applied to one of the four critical-value types as a defect regardless of where it is found, including inside a future Phase 4 widget this document does not enumerate. |

---

## 12. Motion

### A11Y-PLATFORM-024 — Reduced-motion parity

| Field | Value |
|---|---|
| Purpose | Restate `IX-PLATFORM-013` as a checkable accessibility obligation and bind it explicitly to the token source that already implements it. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 2.3.3 Animation from Interactions (AAA, adopted here as a product-level obligation because `NFR-PLATFORM-005` sets the bar and `motion.json` already implements it); SC 2.2.2 Pause, Stop, Hide |
| User impact | A user with a vestibular disorder or motion sensitivity experiences discomfort or disorientation from unnecessary travel; a user who disables motion for any reason must not lose feedback that only existed as an animation. |
| Normative rule | Every semantic motion preset has a defined reduced-motion equivalent (`design_tokens/motion.json` `reduced-motion`): travel is removed, feedback is preserved. A disclosure still confirms it opened; a commit still confirms it committed. Where a transition carried meaning (this replaced that, this came from there), the meaning moves into wording or position, not into a faster version of the same animation. |
| Profile C (Patient) behaviour | Identical obligation; already close to the reduced-motion baseline by design, since the runtime and weak connectivity both argue against choreography regardless of the user's own preference (`motion.json` description). |
| Profile A (Clinic/Admin) behaviour | Identical obligation, honouring the browser's `prefers-reduced-motion`. |
| Carrier `CMP-*` | `CMP-PLATFORM-005` (value-change tick), `-008`/`-002` (disclosure), `-011` (progress), `-014` (overlay enter/exit) |
| Carrier `IX-*` | `IX-PLATFORM-013` |
| RTL implications | None — removing travel removes the only direction-dependent part of a transition (`IX-PLATFORM-013`). |
| Verification method | Rendered pass with `prefers-reduced-motion: reduce` enabled, confirming feedback (not just speed) is preserved for each of the four named transition types. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for the browser/OS-level `prefers-reduced-motion` media query support itself; C for ensuring UberTib's own custom transitions (all four listed) actually branch on it rather than merely speeding up |
| UberTib responsibility | Verify specifically that the reduced-motion path still produces the announcement/feedback event (`A11Y-PLATFORM-011`) it would under full motion — the risk is not "too much motion," it is "silently dropped feedback" once motion is removed. |

### A11Y-PLATFORM-025 — No information conveyed only through animation

| Field | Value |
|---|---|
| Purpose | A narrower, information-integrity companion to `A11Y-PLATFORM-024`: even with motion fully enabled, no fact may exist only inside a transition, because a user who looked away, or a screen reader that cannot perceive motion at all, must still get the fact. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.4.1 Use of Color (extended by analogy — motion-as-sole-carrier), product rule — `DESIGN_DIRECTION.md` §3.9 |
| User impact | A screen-reader user, or a sighted user who blinked, misses a fact that existed only as a visual transition and nowhere in the persisted state. |
| Normative rule | No decorative motion is required for task completion. Determinate progress remains a legible value (not only a moving bar); a status change is stated in the persisted chip/label as well as animated; a value change (`CMP-PLATFORM-005`'s tick) updates on a discrete state-change transition with a text equivalent, not a continuous animation the actor must watch to catch. |
| Profile C (Patient) behaviour | Identical obligation; the evidence-transfer progress state (`CMP-PLATFORM-012`) is the highest-value case, because a patient who is not watching the screen during upload must still find the correct state on return. |
| Profile A (Clinic/Admin) behaviour | Identical obligation; a dashboard metric or deadline countdown must be legible as a static value at any single glance, not only as a moving trend. |
| Carrier `CMP-*` | `CMP-PLATFORM-005`, `-011`, `-012` |
| Carrier `IX-*` | `IX-PLATFORM-009`, `-013` |
| RTL implications | None. |
| Verification method | Manual pass: pause or disable animation entirely and confirm every fact remains legible. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — no framework default addresses this; it is a content-modeling discipline |
| UberTib responsibility | Apply this test to any future Phase 4 chart or metric widget: if the only way to learn a fact is to watch it change, the widget is non-compliant regardless of how it renders at rest. |

---

## 13. Forms

### A11Y-PLATFORM-026 — Persistent visible labels; no placeholder-as-label

| Field | Value |
|---|---|
| Purpose | Restate `TXT-PLATFORM-003`'s content rule as an accessibility obligation, because a disappearing placeholder is a WCAG-relevant failure (loss of the field's identity once populated or focused), not only a content-quality issue. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 3.3.2 Labels or Instructions; SC 1.3.1 Info and Relationships |
| User impact | A screen-reader user hears no label at all once a placeholder has served as the only label and the field has been focused or filled; a sighted user loses the field's identity once they start typing in an Arabic RTL field, where placeholder disappearance is especially disorienting because there is no remaining visual anchor. |
| Normative rule | The label is always visible and persistently associated with its field — above or logically adjacent, never only as placeholder text. Required fields are marked with a text indicator ("required"), not a colour or symbol alone (`A11Y-PLATFORM-015`'s rule extended to form semantics, per `TXT-PLATFORM-003`). Financial field labels name the currency/unit within the label itself, not in separate text that could be visually separated in an RTL layout. |
| Profile C (Patient) behaviour | Identical rule; framework-owned (React Native form primitives), configured with a persistent label component rather than a placeholder-only pattern. |
| Profile A (Clinic/Admin) behaviour | Identical rule; Filament's stock form field label is retained and configured — `Stock` for this specific behaviour, since Filament does not default to placeholder-as-label either. |
| Carrier `CMP-*` | `CMP-CLINICAL-001` (`authoring` variant) is the named worked example carrying structured field labels |
| Carrier `IX-*` | `IX-PLATFORM-018` |
| RTL implications | Placeholder disappearance is a materially worse problem in RTL, per the normative rule's own reasoning — restated here rather than only in the content guide because it changes the WCAG severity assessment, not only the copy quality. |
| Verification method | `scripts/axe_audit.mjs` catches the missing-label case; manual pass confirms no field relies on placeholder alone. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A — both frameworks default to a persistent label pattern; this obligation is mostly a "do not override the default toward placeholder-only," which is a discipline rather than a build task |
| UberTib responsibility | Flag any future form field that ships with only a placeholder as a defect regardless of which Phase 4 screen introduces it. |

### A11Y-PLATFORM-027 — Field-bound error association, summary, and input preservation

| Field | Value |
|---|---|
| Purpose | Bind `IX-PLATFORM-018`'s already-thorough validation sequence to the specific WCAG association mechanism (`aria-describedby`/platform equivalent) it depends on to actually work for assistive technology, which the pattern's own field list does not spell out at the markup level. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 3.3.1 Error Identification; SC 3.3.3 Error Suggestion; SC 4.1.2 (name/role/value for the error association itself) |
| User impact | A screen-reader user focused on a field in error hears nothing about the error unless it is programmatically associated with the field, not merely visually adjacent to it. |
| Normative rule | Every field-level error is programmatically associated with its field (the error text's identifier is referenced by the field's description/error attribute), in addition to being visually bound. A summary additionally lists errors with links to each field for a long form. Each message states what is wrong and how to fix it. The actor's input survives entirely — nothing is cleared on a failed submission. |
| Profile C (Patient) behaviour | The error is visible without hovering or scrolling away from the field, and the on-screen keyboard must not cover it — this is the Profile C-specific risk `IX-PLATFORM-018` already names. |
| Profile A (Clinic/Admin) behaviour | The summary is the primary navigation between errors on a long form; the framework's own validation display is configured rather than replaced. |
| Carrier `CMP-*` | `CMP-PLATFORM-011`, `CMP-CLINICAL-001` |
| Carrier `IX-*` | `IX-PLATFORM-018` |
| RTL implications | The error message sits below its field in the block direction, which is direction-neutral (`IX-PLATFORM-018`); a rejected value containing a Latin code is echoed back bidi-isolated (`A11Y-PLATFORM-030`) so the actor can see exactly what was rejected. |
| Verification method | `scripts/axe_audit.mjs` for the programmatic association; manual pass confirming focus lands on the first field in error (`A11Y-PLATFORM-006`) and input is preserved. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's stock field-error association, which is generally correct by default; B/C for `CMP-CLINICAL-001`'s custom repeater, where the offending element may be a category, a reason, or a represented treatment rather than a simple field and the association must be built explicitly |
| UberTib responsibility | Verify the association specifically on `CMP-CLINICAL-001` `authoring` and any other `Extended`/`Custom` form surface — the stock case is lower risk than the custom repeater case. |

### A11Y-PLATFORM-028 — Multi-step and draft-form progress is accessible and resumable

| Field | Value |
|---|---|
| Purpose | `IX-PLATFORM-005` already fixes the resilience behaviour (draft persists, no submitted record); this obligation adds the accessibility-specific requirement that the draft's completeness state and resumption point are themselves perceivable, not only functionally present. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.1 Info and Relationships; SC 2.4.3 Focus Order (resumption focus target) |
| User impact | A screen-reader or keyboard user resuming a long form cannot tell what remains incomplete, or is dropped at the top of the form and must re-traverse everything already completed. |
| Normative rule | Per-section completeness is exposed as a real, announceable state (not colour alone), so the actor knows what remains rather than discovering it at submission. On resume, focus lands on the first incomplete required field or, on a long workspace, the section the actor left — never at the top of the form by default. |
| Profile C (Patient) behaviour | Draft survival across app restarts is a resilience requirement; the resumption focus target is the same rule applied to a shorter form. |
| Profile A (Clinic/Admin) behaviour | The interruption-prone staff actor (`PO-UX-07`) is the primary beneficiary; save-and-close is a reachable, keyboard-activatable control, not only an implicit behaviour. |
| Carrier `CMP-*` | `CMP-PLATFORM-001` (draft status), `-011` (last-saved indicator), `CMP-CLINICAL-001` (per-line completeness) |
| Carrier `IX-*` | `IX-PLATFORM-005` |
| RTL implications | The last-saved timestamp is bidi-isolated (`IX-PLATFORM-005`, `A11Y-PLATFORM-030`). |
| Verification method | Rendered pass: fill part of a long form, leave, resume, confirm focus target and completeness state. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — resumption-focus-targeting has no framework default on either platform |
| UberTib responsibility | Verify this specifically on the six draft-carrying wireframes named in `IX-PLATFORM-005`'s `Related WF-*` list, since they are the concrete instances this obligation binds. |

---

## 14. Authentication

### A11Y-PLATFORM-029 — Accessible authentication

| Field | Value |
|---|---|
| Purpose | State the WCAG 2.2 accessible-authentication obligation at the provider-neutral level this product can commit to now, without selecting a vendor or inventing a mechanism `Q-OPS-001` has not yet resolved. |
| Applies to | Profile C primarily (the OTP/code entry path is Patient-facing per `API-IDENTITY-001`/`-002`); Profile A wherever a comparable challenge exists |
| Requirement source | WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum) |
| User impact | A cognitive-function test with no accessible alternative (e.g., a puzzle, a memorization task, a transcription task under time pressure) blocks a class of users from authenticating at all. |
| Normative rule | No cognitive function test is required to complete authentication. An OTP/code-entry challenge is permitted under WCAG's own exception for it (object recognition / a code sent to a channel the user controls), provided: the code can be pasted or auto-filled rather than requiring manual transcription under time pressure where the platform supports it; the throttle and expiry windows are stated plainly (`ERR-IDENTITY-003`, `-004`) rather than silently blocking; and password managers and platform auto-fill are never blocked. |
| Profile C (Patient) behaviour | The phone-and-code entry path (`WF-IDENTITY-001`–`003` and comparable) supports auto-fill/paste of the received code where the OS provides it, and the four sub-cases of `ERR-IDENTITY-004` (wrong code, expired, consumed, exhausted) each state the next action rather than presenting a bare retry. |
| Profile A (Clinic/Admin) behaviour | Filament's own sign-in form supports standard password-manager auto-fill by default; no additional cognitive-function step is layered on top of it by this system. |
| Carrier `CMP-*` | none allocated specifically — the OTP flow is framework-owned form input plus `TXT-ERR-IDENTITY-003`/`-004` content, not a bespoke component |
| Carrier `IX-*` | `IX-PLATFORM-018` (field-bound validation applies to code entry too) |
| RTL implications | The code itself is Western digits (`DESIGN_TOKENS.md` §4.4) and bidi-isolated inside any surrounding Arabic instruction text. |
| Verification method | Manual pass confirming auto-fill/paste is not blocked and that no additional puzzle or transcription step exists. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's stock sign-in auto-fill support; B for the Profile C OTP field, which must be explicitly configured to accept platform auto-fill rather than forcing manual digit-by-digit entry |
| UberTib responsibility | This obligation is explicitly scoped to what is provider-neutral and already fixed by the content guide (`CONTENT_GUIDE_ERRORS.md` `TXT-ERR-IDENTITY-003`/`-004`); concrete OTP delivery vendor selection remains `Q-OPS-001` and is out of scope here, per the session brief's own instruction not to select vendors or invent mechanisms. |

---

## 15. Right-to-left and bidirectional content — the accessibility layer

`IX-PLATFORM-010` already fixes the general correctness rule ("a reordered code is a wrong code") and
binds every component's anatomy in `start`/`end` terms. This section adds the three obligations that
are specifically about assistive technology and mirroring — the part of the RTL system session 5 owns
that the existing pattern does not itself state, because `IX-PLATFORM-010` is a rendering-correctness
pattern, not an accessibility-tree pattern.

### A11Y-PLATFORM-030 — Bidirectional content: assistive-technology reading order and isolation

| Field | Value |
|---|---|
| Purpose | Confirm that the isolation `IX-PLATFORM-010` requires for visual correctness also produces the correct **spoken** order — the two are related but not automatically identical, because a screen reader can read the underlying character order rather than the rendered visual order if isolation markers are missing or misapplied. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.2 Meaningful Sequence; `NFR-PLATFORM-005` |
| User impact | A screen-reader user hears a service code, an amount, or a date digit-reversed or word-reversed, which is not a cosmetic bug — a reordered code or amount is a wrong code or amount to a listener exactly as it is to a reader. |
| Normative rule | Every mixed-direction run — service codes, procedure codes, version identifiers, amounts with currency, dates, times, durations, correlation identifiers, and Latin clinic/doctor names — is isolated with Unicode bidi isolation (e.g., first-strong isolate / `dir="auto"` scoped to the run, or the platform's equivalent embedding control) at render time, not styled after the fact. Isolation must be verified to also produce correct **screen-reader pronunciation order**, not only correct visual glyph order — the two can diverge if isolation is applied only through CSS `direction` without the underlying Unicode control characters or `dir` attribute the screen reader itself reads. |
| Profile C (Patient) behaviour | Identical obligation; the highest-frequency case is an amount with currency and a date inside a status explanation sentence. |
| Profile A (Clinic/Admin) behaviour | Identical obligation, plus correlation identifiers and content hashes in the mono identifier style, which are Admin-only and never reachable from a Patient surface. |
| Carrier `CMP-*` | Named explicitly in `IX-PLATFORM-010`: `CMP-ELIG-002`, `CMP-CLINICAL-001`, `CMP-POLICY-001`, `CMP-PLATFORM-005`, `-006`, `-008` |
| Carrier `IX-*` | `IX-PLATFORM-010` (the source correctness rule this obligation adds the screen-reader dimension to) |
| RTL implications | This obligation **is** the RTL/accessibility intersection; no separate note. |
| Verification method | `scripts/verify_rtl.mjs` (design-kit tool) for the rendering-correctness half; manual screen-reader pass reading a mixed-direction string aloud for the pronunciation-order half, which the script does not cover. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — both frameworks provide the underlying `dir`/bidi primitives; UberTib must apply them to every named run type rather than relying on default paragraph direction alone |
| UberTib responsibility | Treat the screen-reader pronunciation check as a distinct verification step from the visual-correctness script — a passing `verify_rtl.mjs` run does not by itself prove correct spoken order. |

### A11Y-PLATFORM-031 — Icon mirroring rules

| Field | Value |
|---|---|
| Purpose | Generalize the mirroring rule `CMP-PLATFORM-001` already states for its own icon slot into a system-wide rule, so a Phase 4 widget introducing a new icon usage does not have to reverse-engineer the principle from one component's example. |
| Applies to | Both profiles |
| Requirement source | `accessibility/i18n-rtl.md`; `NFR-PLATFORM-005`; `design_tokens/semantic.state.json` `icon-vocabulary` |
| User impact | A non-mirrored directional icon (an arrow pointing the wrong logical way) misdirects a user about which way an action moves; a mirrored non-directional icon (a clock face flipped) looks broken and erodes trust for no accessibility gain. |
| Normative rule | **Mirrors:** icons whose meaning is itself directional or relational — a return-for-correction arrow, an exchange/alternative arrow, a chevron indicating disclosure or navigation direction, a stepper's forward/back indicator, a breadcrumb separator. **Does not mirror:** icons depicting an object or a state with no inherent direction — a clock, a document, a check mark, an archive box, a shield, a magnifying glass, and the majority of the 36-identifier governed vocabulary in `design_tokens/semantic.state.json`. The test is whether the icon's *meaning* encodes a direction, not whether it happens to be asymmetric in its default rendering. Timelines and progress indicators mirror as a whole (their start-to-end axis reverses with the interface direction); the individual event markers and status icons placed along them do not. |
| Profile C (Patient) behaviour | Identical rule; the reading column's single-axis layout makes a mis-mirrored directional icon (e.g., a "next" chevron pointing left in an RTL reading flow instead of toward the actual "next" direction) an immediate navigation error. |
| Profile A (Clinic/Admin) behaviour | Identical rule; breadcrumb and stepper mirroring in the panel shell follows the same test. |
| Carrier `CMP-*` | `CMP-PLATFORM-001` (states the worked example: `arrow-uturn-left` and `arrows-right-left` mirror; `clock`, `check-circle` and the rest do not), `-006` (disclosure chevron), `-008` (timeline axis) |
| Carrier `IX-*` | `IX-PLATFORM-010` |
| RTL implications | This obligation is itself an RTL rule. |
| Verification method | `scripts/verify_rtl.mjs` where it covers icon mirroring; manual visual pass against the governed icon vocabulary's documented meanings otherwise. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — Heroicons ships no mirroring metadata; the mirror/no-mirror classification is a per-icon UberTib decision applied at the point each icon is used |
| UberTib responsibility | Apply the stated *test* (does the meaning encode direction) to any icon added beyond the current 36-identifier vocabulary, rather than treating the two named examples as the complete list — the governed vocabulary and its documented meanings in `semantic.state.json` remain the single source of which icons exist; this obligation only fixes the mirroring test applied to them. |

### A11Y-PLATFORM-032 — Visual RTL vs content direction

| Field | Value |
|---|---|
| Purpose | State explicitly the distinction the session brief calls out by name: a Latin identifier does not become RTL merely because the page is RTL. This is the accessibility/correctness framing of a rule `IX-PLATFORM-010` already implements structurally; this obligation is the one place it is stated as its own named principle rather than only as a consequence of isolation. |
| Applies to | Both profiles |
| Requirement source | Unicode Bidirectional Algorithm (UAX #9); WCAG 2.2 SC 1.3.2; `NFR-PLATFORM-005` |
| User impact | An email address, a URL, a service code, or a version identifier that gets its internal character order scrambled by inheriting the page's RTL direction becomes unreadable and, for a code or amount, factually wrong. |
| Normative rule | **Visual RTL** — the document, the surface, and Arabic prose all lay out right-to-left; this is the interface's overall direction. **Content direction** — a run of inherently left-to-right content (a Latin clinic name, an email address, a URL, a service/procedure code, a version identifier, an ID, a phone number in its canonical international format) keeps its own internal left-to-right character order regardless of the surrounding direction, achieved through bidi isolation (`A11Y-PLATFORM-030`), never through forcing the whole run into a manually reversed string. Numeric values (amounts, dates, times, durations, counts) use Western digits throughout (`DESIGN_TOKENS.md` §4.4) specifically so this distinction does not also have to be litigated per numeral system. Mixed Arabic-and-Latin strings (a bilingual clinic name, an Arabic sentence containing an English medical term used because no natural Arabic equivalent exists) isolate only the Latin sub-run, leaving the Arabic portion in the surrounding RTL flow. |
| Profile C (Patient) behaviour | Identical rule; a clinic's Latin legal name inside an Arabic sentence is the highest-frequency instance on Patient surfaces. |
| Profile A (Clinic/Admin) behaviour | Identical rule, plus the broader set of Admin-only Latin content — correlation identifiers, content hashes, version numbers in the mono identifier style. |
| Carrier `CMP-*` | Named explicitly in `IX-PLATFORM-010`: `CMP-ELIG-002`, `CMP-CLINICAL-001`, `CMP-POLICY-001`, `CMP-PLATFORM-005`, `-006`, `-008`; `CMP-PLATFORM-003` for the Latin clinic/branch legal name specifically |
| Carrier `IX-*` | `IX-PLATFORM-010` |
| RTL implications | This obligation **is** the RTL rule the session brief names directly ("a Latin identifier should not become RTL simply because the page is RTL"). |
| Verification method | `scripts/verify_rtl.mjs`; manual pass typing/pasting a Latin code, an email, and a URL into an Arabic-context field and confirming the caret and the resulting stored/displayed value both preserve left-to-right internal order. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — both frameworks provide `dir="ltr"`/`dir="rtl"` scoping primitives; UberTib applies them per run type rather than relying on the document-level direction to resolve every case correctly by accident |
| UberTib responsibility | Verify this specifically wherever a form field accepts freeform mixed content — an input containing a Latin code inside an Arabic interface keeps caret movement consistent with the run the caret is in, per `IX-PLATFORM-010`'s own keyboard-behaviour field, which is the case most likely to break in an untested implementation. |

---

## 16. Data-state accessibility

### A11Y-PLATFORM-033 — Data-state accessibility matrix

`IX-PLATFORM-017` already fixes **which** of the nine Phase 4 data states a surface resolves to, and
in what precedence. `CMP-PLATFORM-009`, `-010`, and `-011` already carry each state's visual and
content behaviour in their own blocks. This obligation is the **accessibility** matrix those decisions
resolve into — screen-reader behaviour, focus behaviour, and whether existing content stays visible —
stated once per state so a reader does not have to reconstruct it from three component blocks and one
pattern.

| Field | Value |
|---|---|
| Purpose | One obligation, one matrix, covering all nine states plus the offline/unstable-connectivity condition, rather than nine separate near-identical blocks. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 4.1.3 Status Messages; `NFR-PLATFORM-006`; `IX-PLATFORM-017` |
| User impact | See the per-state table below — the two systemic failure modes are an empty state announced during loading (false statement) and an error state that reads as merely empty (hides that something is wrong). |
| Normative rule | See table. |
| Carrier `CMP-*` | `CMP-PLATFORM-009`, `-010`, `-011` |
| Carrier `IX-*` | `IX-PLATFORM-003`, `-017` |
| Verification phase | Phase 5 rendered QA for announcement and focus behaviour; the precedence logic itself is documentation-verifiable now (it is fully specified in `IX-PLATFORM-017` and not reopened here). |

**The nine Phase 4 data states, plus the offline/unstable-connectivity condition:**

| State | Meaning | Existing content | Screen-reader behaviour | Focus behaviour | Recovery | Patient (Profile C) | Clinic/Admin (Profile A) |
|---|---|---|---|---|---|---|---|
| `loading-initial` | No content exists yet; the first read is in flight | None to preserve | Not announced per skeleton cell; the region is marked busy once, not narrated cell by cell | Stays on the control that triggered navigation/entry; does not move into the skeleton | n/a — resolves to another state on completion | Skeleton at content height, no layout shift on completion | Identical |
| `loading-refresh` | Content exists; a background or explicit refresh is in flight | Stays fully visible and interactive | Not announced while in flight; the eventual result (unchanged, changed, or failed) is what gets announced, per `A11Y-PLATFORM-011` | Unchanged — a refresh never steals focus from what the actor is reading | n/a — resolves on completion | Pull-to-refresh plus a reachable refresh control; returning to the app counts as a refocus trigger | Long-lived panel tabs treat refocus as a required refresh trigger too, per `IX-PLATFORM-003` |
| `empty-no-data` | The read succeeded; the set is genuinely empty | n/a | Announced when it **replaces** a previously populated list (so the actor learns filtering/deletion emptied it, not that the page failed); not announced on first paint of an already-known-empty surface | Focus reaches the one recovery action without traversing the whole empty region | The one action that creates the first item | `between-cases` variant: near-empty and states so plainly, never manufactures activity (Principle 3) | Identical structural rule |
| `empty-filtered` | The read succeeded; the applied filter excluded everything | The applied filter stays visible | Announced with the applied-filter context stated, distinct wording from `empty-no-data` | Focus stays in the control the actor used to filter; never jumps to the (empty) results | Relax or clear the filter, filter context preserved | Small persistent filter set (never a hidden drawer) means the filter that caused emptiness is always visibly present | Persisted `queue`/`management` filters make this the common steady state for an over-scoped query |
| `partial` | Some of the surface loaded; some did not | The part that loaded stays fully visible and interactive | Announced, naming which part failed — never presented as complete | Focus is not forced onto the failed part; the actor keeps working the part that loaded | Retry the failed part in place | e.g., the attention list loads but the deadline indicator on one item does not — the item is not silently presented with no deadline | e.g., a dashboard's list loads but its status summary does not |
| `stale` | A previous good read is shown; the current read failed | Fully visible, marked stale with its as-of time | Announced as stale with the as-of time stated, not silent | Stays where the actor is; retry control is reachable without leaving the surface | Retry; stale-and-labelled beats blank | The load-bearing case for weak connectivity — a confirmed appointment time stays readable while marked as-of | A long-lived panel tab is the load-bearing case here — refocus is a required re-read trigger |
| `error-fetch` | The read failed and retry may help | Last known safe context preserved, not discarded | Announced assertively when it replaces content the actor was reading (`A11Y-PLATFORM-006`) | Focus moves to the failure message; first control inside it is the retry action | Retry in place | Query/context preserved so retry does not mean re-entering it | Identical |
| `error-permission` | The actor is outside their authorised scope | Stale actions removed, not disabled (`A11Y-PLATFORM-016`) | Announced assertively; **takes precedence over every other state**, including an otherwise-empty result — a permission failure must never read as a quiet, empty queue | Focus moves to the denial block; the route to a permitted scope is the first control inside it | No retry offered; route to a scope the actor does hold | A guardian grant revoked mid-session is the common case; the represented subject disappears from the context switcher too | A staff scope revoked mid-shift is the common case, and `PO-UX-07`'s interruption pattern makes this the state most likely to be encountered mid-task |
| `success` | Content, fully loaded | n/a | Not announced merely for succeeding on first load; announced only if it **replaces** a prior non-success state (e.g., a retry that succeeded) | Unchanged from the actor's current position, unless the transition was itself a mutation outcome (`A11Y-PLATFORM-006`) | n/a | Identical | Identical |
| Offline / unstable connectivity (client condition, not a canonical backend state) | The client cannot currently reach the server | Last known data stays visible, marked with its as-of time — this is `stale` given a client-side cause rather than a server-side one | "No connection currently" stated as a clear condition, not a vague failure (`TXT-PLATFORM-009`); resumes silently on reconnection without requiring the actor to notice and retry manually where the action is idempotent-resumable | Same as `stale` | Resume from the point of interruption (`IX-PLATFORM-006` for transfers), not a restart from zero, where the session supports it | The load-bearing case in this product — weak connectivity is a documented condition of use, not an edge case | Rarer, but not absent; the same rule applies rather than a degraded one |

**Two rules that bind every row and are not repeated in every cell:** an empty state is never rendered
while a read is in flight (`CMP-PLATFORM-009`'s own **error** row: "**n/a.** An empty state is never
rendered while a read is in flight, because an empty state during loading is a false statement"), and
a failed read is never rendered as an empty state (the reason `CMP-PLATFORM-009` and `-010` are two
components rather than one, per `COMPONENT_INVENTORY.md` §2.3).

---

## 17. State announcement rules — worked examples

The general policy is `A11Y-PLATFORM-011`. This table applies it to the specific transitions the
session brief names, so the policy is checkable against concrete cases rather than left abstract.

| Transition | Announce? | Politeness | Focus moves? | Why |
|---|---|---|---|---|
| Booking committed (`REQUESTED`→`CONFIRMED`) | Yes | Polite | To the changed state summary region | A committed outcome the actor is actively viewing is exactly `A11Y-PLATFORM-011`'s core case; `IX-PLATFORM-001` requires a re-read and re-render regardless. |
| Eligibility changed while the actor is viewing it | Yes | Polite (assertive only if it blocks an in-flight commit under `IX-ELIG-001`) | To the eligibility explanation region if it blocks the actor's current intent; otherwise no forced move | `PENDING_EVALUATION`→`NOT_ELIGIBLE` (or the reverse) is a fact the actor needs, distinct from the two states' already-distinct tone/icon. |
| Evidence upload progressed (`SELECTED`→`UPLOADING`→`UPLOADED`) | Progress announced at intervals, not continuously; `UPLOADED` announced once | Polite | No | `CMP-PLATFORM-012`'s own rule: "progress is announced at intervals rather than continuously." Continuous announcement during upload would be noise, not signal. |
| Evidence upload failed retryably (`FAILED_RETRYABLE`) | Yes | Polite (this is a recoverable, expected condition, not an emergency) | To the item's retry/resume control | Must be clearly distinguishable in the announcement from `REJECTED` — copy obligation 3's accessibility consequence: an assertive/alarming announcement for a transient network failure would itself misstate severity. |
| Evidence rejected authoritatively (`REJECTED`) | Yes | Polite | To the item's stated correctable requirement | Distinct wording and a distinct destination (the specific requirement, not a retry control) from the row above — the structural separation `CMP-PLATFORM-012` enforces visually is carried into the announcement too. |
| Authorization revoked while a surface is open | Yes | Assertive | To the permission-denied block, replacing removed actions | `IX-PLATFORM-007`'s core case: a stale session must not silently keep mutating; the user must not discover the loss by a failed action. |
| Reschedule proposal accepted | Yes | Polite | To the updated booking state summary | `IX-BOOKING-002`'s revalidation-then-commit sequence completes and the surface re-reads authoritative state; the actor needs to know which appointment now holds. |
| Work item reassigned (to or away from the current actor) | Yes, on the surface currently viewing that item | Polite | Stays on the row (no forced navigation) | `IX-OPS-001`: an assignment conflict must state the conflict rather than silently show an optimistic owner the server did not accept. |
| Treatment amendment awaiting re-acceptance | Yes, when the amendment first becomes available to view | Polite | To the change-set disclosure, not onto the Accept control | `IX-CLINICAL-001`: disclosure must happen before acceptance is even possible, and focus is deliberately not moved onto Accept as a side effect, to prevent an in-flight keystroke from committing an irreversible acceptance. |

**Two adjacent categories worth stating explicitly, per the session brief's own framing:** *"information
changed silently"* is content that the actor has not yet acted on and is not currently blocking them —
most background refreshes and most `loading-refresh`→`success` transitions with no material change fall
here, and are not announced. *"Information requires immediate user attention"* is anything that changes
what the actor can currently do, or that they are actively viewing when it changes — every row in the
table above falls here, which is exactly why each one is a named exception rather than the default.
This obligation does not invent any new notification behaviour; it governs **in-surface accessibility
feedback only**, per the session brief's own scope boundary — push, SMS, and email remain optional
adapters under `CMP-PLATFORM-015`'s duplication rule, never the mechanism this table depends on.

---

## 18. Financial accessibility

### A11Y-FINANCE-001 — Financial value accessibility

| Field | Value |
|---|---|
| Purpose | Collect the accessibility-specific consequences of `CMP-ELIG-002`'s already-thorough content rules into one obligation, because a financial value is read differently by assistive technology than by a sighted reader and the existing component block does not itself state the announcement-order rule. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.1, SC 1.3.2, SC 4.1.2; `NFR-FINANCE-001` |
| User impact | A screen-reader user hears an amount with no mode ("five hundred" with no indication it is a starting point, not a total) and acts on a materially different fact than the one the record states. |
| Normative rule | The accessible name for any rendered amount is the amount **and** its mode together, read as one unit — never the bare number alone, per `CMP-ELIG-002`'s own accessibility rule, restated here as the system-level financial obligation. Currency reads in a fixed, stated order (amount, then currency, as one bidi-isolated unit — `A11Y-PLATFORM-030`) so it is never split across a sentence boundary in a way that could be misheard as two separate facts. Numeric grouping uses tabular lining Western digits (`DESIGN_TOKENS.md` §4.4) so a screen reader's number-parsing does not stumble on a locale-ambiguous separator. An amount inside an Arabic sentence is bidi-isolated as a whole unit, currency symbol included, so word order around it is unaffected. Tabular alignment for columns of amounts is a **visual** property only and carries no accessibility meaning on its own — the row's own accessible name (via `CMP-PLATFORM-006`'s table semantics, `A11Y-PLATFORM-012`) is what actually associates an amount with its row and category for a screen-reader user, not its column position. A before/after financial comparison (`CMP-CLINICAL-002`) announces both values in one unit, labelled "as it was" / "as it is," never as two independently-announced numbers a listener must remember and compare. A `snapshot`/historical immutable value is announced as read-only at full contrast — never dimmed, and never with a screen-reader "disabled" state, since it is a fact, not an inactive control (`A11Y-PLATFORM-016`'s read-only-is-not-disabled rule applied to money specifically). No financial meaning — positive, negative, owed, settled — is ever conveyed by colour alone; every financial state renders through the same tone/icon/emphasis triple as any other status (`A11Y-PLATFORM-015`). |
| Profile C (Patient) behaviour | The provider's own price in its governed display mode (`fixed`/`from`/`range`/`free`/`requires-plan`) is the only financial content a patient reads; the mode word is never dropped from the announcement even when visually implied by layout. |
| Profile A (Clinic/Admin) behaviour | Identical rule, plus the `snapshot` record kind for accepted terms and financial-terms snapshots, and the external-financial-event log, which never states or implies the platform held, paid, insured, or refunded money (`TXT-PLATFORM-013`, carried into the announcement as much as the visible text). |
| Carrier `CMP-*` | `CMP-ELIG-002`, `CMP-CLINICAL-001`, `CMP-CLINICAL-002`, `CMP-PLATFORM-008` (`financial` variant) |
| Carrier `IX-*` | `IX-PLATFORM-010`, `IX-CLINICAL-001` |
| RTL implications | Fully governed by `A11Y-PLATFORM-030`/`-032` — an amount with currency is the single most-cited example of the bidi-isolation rule across the whole component inventory. |
| Verification method | Manual screen-reader pass over `CMP-ELIG-002` in each display mode, and over `CMP-CLINICAL-002`'s before/after pairing, confirming the mode/label is always announced with the number. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — currency/mode-aware accessible-name composition has no framework default on either platform; it is `CMP-ELIG-002` anatomy |
| UberTib responsibility | This product performs no money movement in V1 (`NFR-FINANCE-001`); this obligation governs how a **recorded fact** about external money is presented accessibly, and introduces no payment, wallet, or platform-refund affordance of any kind, consistent with the session brief's explicit boundary. |

---

## 19. Evidence-transfer accessibility

### A11Y-PLATFORM-034 — Evidence-transfer accessibility

`CMP-PLATFORM-012`'s own **Accessibility** paragraph already states most of this obligation at the
component level ("progress is announced at intervals rather than continuously," "the eight session
states are distinguishable by wording and icon, not by tone alone," "the resume control is keyboard
reachable"). This block is the system-level anchor that paragraph is an instance of, plus the two
reinforcements the session brief specifically asks for.

| Field | Value |
|---|---|
| Purpose | Reinforce, as a named accessibility obligation rather than only a component content rule, the single most safety-critical distinction in the content system: retryable transfer failure must never be presented — visually, or to assistive technology — as an authoritative rejection. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 4.1.3 Status Messages; `NFR-PLATFORM-005`; copy obligation 3 |
| User impact | A patient on a weak connection who hears (or reads) their document was "rejected" when the network merely dropped experiences this as a false, alarming, and consequential statement — exactly the failure `PO-UX-17`'s eight-state machine was built to make structurally impossible. |
| Normative rule | For transfer progress: expose meaningful, interval-based progress (never continuous, never a bare unlabelled spinner); support pause/interruption/re-entry through the resumable session states already defined; retain file identity and context across state changes; make retry discoverable and keyboard-reachable; never route `FAILED_RETRYABLE` wording toward rejection language. For rejection: expose the rejection meaning plainly; expose the canonical, specific correctable requirement as the recovery action; never offer the transport-retry action when the canonical behaviour requires replacement instead — the two recovery actions (retry vs. replace) must never both be presented for the same failure, because offering both re-introduces the ambiguity the eight-state structure exists to remove. `UPLOADED` and `ACCEPTED` are announced as distinguishable states (quarantined-pending-check vs. cleared), never collapsed into one "done" announcement. |
| Profile C (Patient) behaviour | Resumability is the load-bearing requirement — a transfer interrupted by a connectivity gap resumes rather than restarting, and this is stated in the announcement ("resumed," not "started over"). |
| Profile A (Clinic/Admin) behaviour | A reviewer sees the same eight states and the same distinguishability requirement, but takes review actions (accept/reject with a named requirement) rather than transfer actions; the `access-log` variant offers neither and is read-only throughout. |
| Carrier `CMP-*` | `CMP-PLATFORM-012` (primary source) |
| Carrier `IX-*` | `IX-PLATFORM-006` |
| RTL implications | Progress fills `start`-to-`end` in both directions (`CMP-PLATFORM-012`); the file name is bidi-isolated and truncated in the middle with the extension preserved (`A11Y-PLATFORM-030`, `-023`). |
| Verification method | Manual screen-reader pass across all eight session states in sequence, confirming each is announced distinguishably and that `FAILED_RETRYABLE`/`REJECTED` are never interchangeable in wording. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — `CMP-PLATFORM-012` is `Custom` on Profile A specifically because the eight-state provider-neutral contract has no stock equivalent |
| UberTib responsibility | Treat the retry-vs-replace mutual exclusivity as a checkable pass/fail on every evidence-bearing surface (9 wireframes), not only a copy-review item. |

---

## 20. Treatment and governance accessibility

Three domain-specific obligations, allocated only because each carries a genuinely distinct
accessibility consequence beyond what the cross-cutting `A11Y-PLATFORM-*` set already states — the
router instruction against domain sprawl applies, and no fourth is added merely for symmetry.

### A11Y-CLINICAL-001 — Treatment/plan change accessibility

| Field | Value |
|---|---|
| Purpose | `IX-CLINICAL-001` and `CMP-CLINICAL-002` already carry most of this at the pattern/component level; this obligation is the accessibility-specific reinforcement the session brief calls for by name — that before/after changes are understandable without colour and that the comparison stays keyboard-operable. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 1.3.1, SC 1.4.1, SC 2.4.3; `FR-CLINICAL-007` |
| User impact | A patient using a screen reader who cannot navigate the "as it was" / "as it is" comparison item by item cannot make an informed re-acceptance decision — this is not a convenience gap, it is a consent-quality failure. |
| Normative rule | The two sides of a change set are labelled regions ("as it was," "as it is") a screen reader can enter directly, not inferred from position. Each changed item is announced as changed, with both values, in one unit — never the two values presented as separate, unlinked announcements the listener must correlate manually. The accept control's accessible name states that it accepts the **amended** terms specifically, never "accept" alone with no object — this is stated explicitly because it is the one accept control in the whole system where a generic label would be actively misleading to a screen-reader user who has not seen the visual comparison. The change set is traversable item by item; accept and decline are separate reachable controls; the confirmation itself is focus-trapped under `A11Y-PLATFORM-002`/`CMP-PLATFORM-014`. The prior version remains reachable and is read at full contrast, never dimmed, consistent with `A11Y-PLATFORM-016`'s read-only-is-not-disabled rule. |
| Profile C (Patient) behaviour | The two sides render stacked, prior first, in reading order — the single highest-consequence accessible-comparison surface in the product for this actor. |
| Profile A (Clinic/Admin) behaviour | The clinician authoring the amendment sees the same comparison before proposing it; the admin oversight surface reads it without either authoring or accepting rights. |
| Carrier `CMP-*` | `CMP-CLINICAL-002`, `-001`, `CMP-ELIG-002`, `CMP-PLATFORM-013` |
| Carrier `IX-*` | `IX-CLINICAL-001` |
| RTL implications | Prior at `start`, new at `end`, or stacked prior-first on Profile C (`CMP-CLINICAL-002`); amounts and version identifiers bidi-isolated (`A11Y-PLATFORM-030`). |
| Verification method | Manual screen-reader pass through a full amendment comparison and acceptance flow. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — `CMP-CLINICAL-002` is `Custom` on Profile A precisely because this comparison has no stock equivalent |
| UberTib responsibility | Verify the accept-control accessible name specifically, since it is the field most likely to regress to a generic "Confirm"/"Accept" during implementation under the shared action-role-label rule (`TXT-PLATFORM-002`), which this obligation deliberately overrides for this one control. |

### A11Y-POLICY-001 — Governed version and comparison accessibility

| Field | Value |
|---|---|
| Purpose | Fix the accessibility consequence of a rule `CMP-POLICY-001`'s content already states in prose but does not phrase as a screen-reader obligation: a surface must not render governed content without stating which version produced it, and that statement must reach assistive technology, not only sighted layout. |
| Applies to | Profile A only — `CMP-POLICY-001` is `n/a` on Profile C by design. |
| Requirement source | WCAG 2.2 SC 1.3.1, SC 2.4.3; `FR-POLICY-001`, `FR-POLICY-002` |
| User impact | An Admin reviewer using assistive technology who cannot tell which version's content they are reading cannot make an accountable decision about it — this binds directly to the product's stated brief adjective, accountable. |
| Normative rule | The governed-version header is a labelled region announced **before** the governed content it frames, so a reviewer never reads content without first knowing which version produced it. Each review gate's state (pending/approved/rejected/revoked/expired) is carried by wording and icon as well as tone (`A11Y-PLATFORM-015`), with `expired` specifically distinguishable from `approved` in the announcement — the status this obligation calls out as the one most likely to be misread as still valid. The version selector announces the current value as selected; prior versions are reachable by keyboard from the header itself, not only from a separate page. For the comparison variant (`IX-POLICY-002`), both sides load and are announced together — never a partial comparison presented as a verdict — and a mismatch (integrity exception) is announced as a distinct result type, not folded into the same wording as a routine content difference. Dense governance tables (catalog/policy version lists) retain row/column header association so a reviewer can navigate by column (version, effective date, gate state) as well as by row. |
| Profile C (Patient) behaviour | n/a by design — the patient reads the practical consequence of a governed version through `CMP-PLATFORM-002`/`CMP-ELIG-002`, never the version record itself; this exclusion is part of the accessibility obligation, not an omission from it, mirroring `IX-POLICY-001`'s own framing. |
| Profile A (Clinic/Admin) behaviour | All 16 `CMP-POLICY-001` wireframes are Admin; the version-history list is keyboard-reachable and its `dense` list rows still expose row identity to assistive technology. |
| Carrier `CMP-*` | `CMP-POLICY-001`, `CMP-CLINICAL-002` (`version`/`reproduction` variants), `CMP-PLATFORM-013` |
| Carrier `IX-*` | `IX-POLICY-001`, `-002` |
| RTL implications | Scope at `start`, version and effective period at `end`; version identifiers and dates bidi-isolated (`A11Y-PLATFORM-030`, `-032`). |
| Verification method | Manual screen-reader pass through a governed-version detail and a version comparison, confirming header-before-content ordering and gate-state distinguishability. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | B — Filament's infolist section provides the base labelled-region structure; UberTib configures the ordering guarantee (header announced first) explicitly |
| UberTib responsibility | Verify the mismatch-vs-routine-difference announcement distinction specifically on `IX-POLICY-002`'s reproduction variant, since a mismatch is an integrity finding that must not read as ordinary version drift. |

### A11Y-AUDIT-001 — Sensitive decision capture accessibility

| Field | Value |
|---|---|
| Purpose | `CMP-PLATFORM-014` and `IX-AUDIT-001` already carry the great majority of this at the component and pattern level (focus trap, initial-focus rule, required-reason association); this obligation is the accessibility-specific consolidation the session brief asks for — that an irreversible action's consequence is announced **before** commit, not only stated visually. |
| Applies to | Both profiles |
| Requirement source | WCAG 2.2 SC 3.3.4 (Error Prevention, Legal/Financial/Data), extended by product decision to every irreversible action; `FR-AUDIT-001`, `FR-AUDIT-003` |
| User impact | A screen-reader user who cannot perceive that a pending action is irreversible, or whose reason field is not correctly associated with its label and error state, can commit a consequential decision without the information a sighted user would have had. |
| Normative rule | The dialog exposes an accessible name and a description tied directly to the effect statement — not merely a generic "confirm" dialog role with the effect text floating unassociated nearby. Irreversibility is stated in words inside that accessible description, never carried by tone or icon alone (`A11Y-PLATFORM-015`'s rule applied to consequence-severity specifically, which is a distinct claim from a lifecycle status). The required-reason field has a persistent visible label and its validation error is bound to the field (`A11Y-PLATFORM-027`) — Confirm remains genuinely blocked, and exposed as such via state, until a reason is present, which is the one legitimate case in this whole system where a blocked control is the correct pattern (`A11Y-PLATFORM-016`). The confirm control's accessible name states the **effect**, not only the verb — "Confirm" alone is never what a screen-reader user hears immediately before an irreversible action; it is, at minimum, the same effect-stating label the trigger itself used (`TXT-PLATFORM-012`, `IX-AUDIT-001`). Focus trap and initial-focus/return-focus obligations are `A11Y-PLATFORM-002`/`-007`, cross-referenced rather than restated. |
| Profile C (Patient) behaviour | The patient's sensitive actions — accepting a plan, cancelling a booking, revoking a representation grant, submitting a claim or review — receive identical ceremony to any Admin sensitive decision, at full reading-density generosity, never compressed. |
| Profile A (Clinic/Admin) behaviour | The Filament action modal is extended with the required-reason field and its accessible association; the stock confirm-only modal is explicitly insufficient wherever a reason is mandatory, which is every `irreversible`, `destructive`, and `authoritative-decision` variant. |
| Carrier `CMP-*` | `CMP-PLATFORM-014` (primary source), `-004`, `-013` |
| Carrier `IX-*` | `IX-AUDIT-001` |
| RTL implications | Cancel at `start`, confirm at `end` (`A11Y-PLATFORM-014`, `-032`); the description reads in logical order regardless of visual mirroring. |
| Verification method | `scripts/axe_audit.mjs` for the name/description/association checks; manual screen-reader pass confirming the irreversibility statement and the effect-stating confirm label are both actually spoken before an activatable Confirm control. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for the Filament modal's base dialog role; B for the accessible-description-tied-to-effect-statement configuration; C for the required-reason field association and the Profile C sheet equivalent |
| UberTib responsibility | Audit this specifically on the 38 `CMP-PLATFORM-014`-bound wireframes as a batch, since the pattern is identical across all of them and a single implementation defect (e.g., the description not actually wired to `aria-describedby`) would silently affect every irreversible action in the product at once. |

---

## 21. Responsive and reflow — system-level rules

Two obligations, split by profile because the two platforms' reflow risk is qualitatively different —
consistent with the session brief's instruction to document system-level behaviour only, not per-screen
breakpoint specifications, and not to create `WGT-*` or screen specs.

### A11Y-PLATFORM-035 — Responsive/reflow, Patient reading column

| Field | Value |
|---|---|
| Purpose | State the Patient-specific reflow risk profile once, since it differs materially from the panel's (a single reading column vs. a data grid). |
| Applies to | Profile C only |
| Requirement source | WCAG 2.2 SC 1.4.4, SC 1.4.10; `DESIGN_DIRECTION.md` §4.1 |
| User impact | Text scaling that destroys action order, or forces horizontal scrolling for ordinary content, blocks task completion for a low-vision user on the platform's primary device class. |
| Normative rule | Text scaling to the platform's own maximum size must not destroy action order — the primary action stays reachable and remains understandable at every size, per the layout family Phase 2 already fixed. Long Arabic text wraps naturally within the one reading column; horizontal scrolling is never required for ordinary content, only for content genuinely wider than the column by nature (a data export table shown read-only, if one ever appears on Profile C, which no current wireframe requires). |
| Profile C (Patient) behaviour | One primary reading column at every size class, capped at its measure ceiling (`breakpoints.json` `profile-c.reading-column-max`); a wider device produces whitespace, not a second pane — Phase 2's fixed rule, not reopened here. |
| Profile A (Clinic/Admin) behaviour | n/a — see `A11Y-PLATFORM-036`. |
| Carrier `CMP-*` | every `CMP-*` realized `Native` on Profile C |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | The reading column's own direction is RTL by default for this product; the stacking threshold (`breakpoints.json` `profile-c.stack-threshold`) is a text-size condition, not a width, and applies identically in both directions. |
| Verification method | `scripts/verify_responsive.mjs` at the verification widths; manual pass at the platform's maximum text size confirming action order survives. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | C — the single-column, action-order-preserving guarantee at maximum text size has no React Native default; it is layout-family anatomy fixed at Phase 2 and carried here as an accessibility obligation |
| UberTib responsibility | Treat the primary action's continued reachability at maximum text size as the pass/fail criterion, not merely "nothing overflows." |

### A11Y-PLATFORM-036 — Responsive/reflow, operational panel

| Field | Value |
|---|---|
| Purpose | State the specific, named distinction the session brief asks for: legitimate data-table horizontal scrolling is not the same defect as accidental page overflow, and the two must be told apart rather than both being treated as reflow failures. |
| Applies to | Profile A only |
| Requirement source | WCAG 2.2 SC 1.4.10 Reflow (which explicitly permits a two-dimensional layout where content requires it, e.g., a data table) |
| User impact | Conflating the two makes every dense operational table read as an accessibility defect even where its own internal horizontal scroll is the correct, WCAG-permitted pattern — and conversely risks a reviewer waving through genuine page-level overflow because "tables scroll anyway." |
| Normative rule | **Legitimate:** a `CMP-PLATFORM-006` `table` variant's own body may scroll horizontally within its own bounded container when its column count genuinely requires more width than the content area provides, provided the table degrades to the `reading-list` shape at the largest text sizes rather than relying on scroll indefinitely (`COMPONENT_INVENTORY.md` §5). **Illegitimate:** the page itself — anything outside a table's own bounded scroll container — never requires horizontal scrolling at any zoom level or content width down to the narrow verification widths. Sticky elements (panel navigation, action bars) never obscure a focused element regardless of which reflow state the surface is in (`A11Y-PLATFORM-005`). Long Arabic labels in a dense table are sized-for, not destructively truncated (`A11Y-PLATFORM-023`) — they wrap or the row stacks, they do not silently lose meaning to fit a column. |
| Profile C (Patient) behaviour | n/a — see `A11Y-PLATFORM-035`. |
| Profile A (Clinic/Admin) behaviour | The twelve-column content grid measured on the content area (`breakpoints.json` `profile-a.content-width`), not the viewport; tablet is a supported layout, not a degraded one, so the `dense` mode may not assume a mouse for whatever interaction reflow produces. |
| Carrier `CMP-*` | `CMP-PLATFORM-006` (primary source of the legitimate-scroll exception) |
| Carrier `IX-*` | `IX-PLATFORM-011` |
| RTL implications | Column order mirrors; a table's own internal horizontal scroll direction follows the interface direction, not a fixed left-to-right assumption. |
| Verification method | `scripts/verify_responsive.mjs` distinguishing page-level overflow (fail) from a table's own contained scroll region (pass by design); manual pass confirming the `table`-to-`reading-list` degradation actually occurs at the largest text sizes. |
| Verification phase | Phase 5 rendered QA |
| Framework responsibility | A for Filament's own table horizontal-scroll container; B to configure the content-area-measured breakpoints and the largest-text-size degradation specifically |
| UberTib responsibility | Distinguish the two cases explicitly in any Phase 4/5 QA report — "this table scrolls horizontally" is not by itself a finding; "this page scrolls horizontally" is. |

---

## 22. Status semantics — the accessibility layer over the existing content system

`CONTENT_GUIDE_STATES.md` already owns the approved Arabic label and per-audience meaning for all 82
statuses across 18 machines. `design_tokens/semantic.state.json` already fixes the tone/icon/emphasis
triple mechanically. **This session renames no status, recreates no `TXT-STATE-*` family, changes no
Arabic label, and redefines no lifecycle meaning.** What this session adds is the accessibility
consequence of that already-fixed system: `A11Y-PLATFORM-009`, `-011`, and `-015` are the three
obligations every one of the 82 statuses is bound by, stated once rather than 82 times.

**Reusable semantic intents, and the boundary they do not cross.** `design_tokens/semantic.state.json`
already names six tones — `neutral`, `info`, `success`, `warning`, `danger`, `restricted` — as a
*presentation* vocabulary. This session does not add a seventh, and does not collapse any business
status into a tone as if the tone were the status. The following remain semantically and structurally
distinct even where two of them happen to share a visual tone:

| Status | Tone | Shares a tone with | Why they are not the same status despite it |
|---|---|---|---|
| `ELIGIBILITY_REVIEW` (booking) | `warning` | Reschedule proposal `PENDING`, launch gate `pending` | Each is a different machine with a different meaning, a different audience-facing wording (`TXT-PLATFORM-010`), and a different recovery path. Sharing `warning` only means all three currently ask for attention — it says nothing about what kind. |
| Booking `CANCELLED` reason `ALTERNATIVE_EXPIRED`/`ALTERNATIVE_DECLINED` | `restricted` | Reschedule proposal `DECLINED`/`EXPIRED`, review `RETIRED`, staff invitation `EXPIRED`/`REVOKED` | `restricted` groups "no longer available, nothing went wrong" (`DESIGN_TOKENS.md` §5.1) — a deliberately achromatic, deliberately heavy tone chosen precisely so it does not alarm the way `danger` would. It is a shared *register*, never a shared *meaning*. |
| Evidence `REJECTED` | `danger` | Booking `NO_SHOW`, onboarding `REJECTED`, launch gate `rejected` | Four entirely different decisions in four different machines; `danger` says "this ended badly," and each carries its own distinct icon and wording precisely so a reader does not conflate "my document was rejected" with "my application was rejected." |
| Financial event `DISPUTED` | `danger` | Evidence `REJECTED` | Different machine, different consequence, different recovery route (`TXT-STATE-CLAIMS-*` vs. re-upload) — sharing a tone is not sharing a meaning here either. |
| Treatment plan `COMPLETED` (stage-level) | `success` | Booking `COMPLETED`, onboarding `APPROVED`, evidence `ACCEPTED` | Four different "reached its intended outcome" facts about four unrelated records. |
| Onboarding `CHANGES_REQUESTED`, claim `EVIDENCE_INCOMPLETE` | `warning`, `solid` emphasis | Each other | Both are `solid` because both block the actor and carry a deadline whose lapse cannot be undone (`DESIGN_TOKENS.md` §5.2's actual rule for the emphasis, not the tone) — but one is an application in progress and the other is a live claim; they are never presented interchangeably and never share a chip label. |

The general rule the table demonstrates: **a semantic tone is a presentation signal, and a canonical
lifecycle state is the fact.** Two statuses sharing a tone is expected — `DESIGN_TOKENS.md` §5.2
measures the distribution deliberately (53 `subtle`, 12 `solid`, 11 `outline`, 6 `muted` across 82
statuses; `restricted` alone covers 19 of them) — and is never treated as license to collapse them into
one label, one recovery path, or one accessible name. The four safety-critical separations
`DESIGN_TOKENS.md` §5.3 already names by name (`PENDING_EVALUATION` vs. `NOT_ELIGIBLE`,
`FAILED_RETRYABLE` vs. `REJECTED`, `UPLOADED` vs. `ACCEPTED`, booking `CANCELLED`'s `restricted` tone)
are the four instances where getting this wrong has a documented, named harm, and this session adds no
fifth candidate — none was found during this audit.

---

## 23. Patient vs Clinic/Admin — summary

No new obligations in this section; a cross-reference table collecting what sections 5–21 already
state per-profile, so a reader auditing one platform does not have to re-read every block.

**Patient — Profile C, React Native:**

| Area | Obligation(s) |
|---|---|
| Native accessibility semantics | `A11Y-PLATFORM-009`, `-010` |
| VoiceOver/TalkBack expectations | `A11Y-PLATFORM-009`, `-011`, `-012` |
| Dynamic font scaling | `A11Y-PLATFORM-019`, `-021`, `-022` |
| Touch interaction, no hover | `A11Y-PLATFORM-003`, `-013` |
| Mobile focus behaviour | `A11Y-PLATFORM-004`, `-006`, `-007`, `-008` |
| Weak connectivity | `A11Y-PLATFORM-011`, `-025`, `-028`, `-034`; row "Offline" in §16's matrix |
| Interrupted submissions | `A11Y-PLATFORM-006`, `-028` |
| Mobile screen-reader announcements | `A11Y-PLATFORM-011`, §17 |
| One-primary-reading-column hierarchy | `A11Y-PLATFORM-035` |
| Safe touch target spacing | `A11Y-PLATFORM-013`, `-014` |

**Clinic/Admin — Profile A, Filament:**

| Area | Obligation(s) |
|---|---|
| Keyboard-first operability | `A11Y-PLATFORM-001`, `-002`, `-003` |
| Browser zoom/reflow | `A11Y-PLATFORM-019`, `-020`, `-036` |
| Desktop screen readers | `A11Y-PLATFORM-009`, `-012` |
| Tables | `A11Y-PLATFORM-012`, `-036` |
| Filters | `A11Y-PLATFORM-006` (focus), §16 (`empty-filtered`) |
| Actions | `A11Y-PLATFORM-014`, `-016` |
| Dialogs | `A11Y-PLATFORM-002`, `-007`, `A11Y-AUDIT-001` |
| Dropdowns | `A11Y-PLATFORM-012` |
| Tabs | `A11Y-PLATFORM-001` |
| Pagination | `A11Y-PLATFORM-001` (load-more reachability, per `IX-PLATFORM-016`) |
| Dense operational surfaces | `A11Y-PLATFORM-013`, `A11Y-CLINICAL-001` (`authoring`) |
| Sticky headers/action regions | `A11Y-PLATFORM-005` |
| Focus not obscured by panel chrome | `A11Y-PLATFORM-005` |

---

## 24. Traceability

Every `A11Y-*` block above names, at minimum: a WCAG 2.2 success criterion or the product rule
(`NFR-PLATFORM-005` etc.) it comes from; the `CMP-*` and/or `IX-*` that carries it; its verification
method and phase. This matches the shape `PHASE_03_IMPLEMENTATION_PLAN.md` §10 fixed for `A11Y-*`
traceability before any block existed, and the section 4 registry table above is the single index a
future mechanical check (proposed, not built, in §12.4 of that plan) would validate against.

**Carrier reach, measured from the blocks above rather than estimated:**

| `CMP-*` | Obligations naming it |
|---|---:|
| `CMP-PLATFORM-001` | 8 |
| `CMP-PLATFORM-002` | 3 |
| `CMP-PLATFORM-003` | 3 |
| `CMP-PLATFORM-004` | 7 |
| `CMP-PLATFORM-005` | 4 |
| `CMP-PLATFORM-006` | 10 |
| `CMP-PLATFORM-007` | 2 |
| `CMP-PLATFORM-008` | 5 |
| `CMP-PLATFORM-009` | 4 |
| `CMP-PLATFORM-010` | 6 |
| `CMP-PLATFORM-011` | 5 |
| `CMP-PLATFORM-012` | 3 |
| `CMP-PLATFORM-013` | 4 |
| `CMP-PLATFORM-014` | 6 |
| `CMP-PLATFORM-015` | 1 |
| `CMP-ELIG-001` | 0 (bound indirectly through `CMP-PLATFORM-001`/`-004`; no `A11Y-*` names it directly, and none is manufactured merely for coverage) |
| `CMP-ELIG-002` | 3 |
| `CMP-ELIG-003` | 1 |
| `CMP-CLINICAL-001` | 4 |
| `CMP-CLINICAL-002` | 4 |
| `CMP-POLICY-001` | 2 |
| `CMP-OPS-001` | 0 (bound indirectly through `CMP-PLATFORM-001`/`-005`/`-006`/`-013`, all separately named) |

Every one of the 22 `CMP-*` is reachable from at least one `A11Y-*`, directly or through a named
cross-cutting component it composes (`COMPONENT_INVENTORY.md` §2.3's own composition table — `CMP-ELIG-001`
composes `CMP-PLATFORM-001` and `CMP-ELIG-002`, both directly bound; `CMP-OPS-001` composes
`CMP-PLATFORM-001`, `-005`, and the flag slot, all directly bound). No `A11Y-*` was added merely to
force a direct-binding count on these two, because doing so would allocate an obligation for
appearance rather than for a genuine reusable rule — the router instruction this whole file follows.

---

## 25. Mechanically verified now vs. Phase 5 rendered QA

Consistent with `COMPONENT_INVENTORY.md` §11 and `DESIGN_TOKENS.md` §11's own honesty framing, carried
forward rather than reinvented.

**Mechanically verified now, or true by construction:**

- Every `A11Y-*` ID exists, is named, and carries a `CMP-*`/`IX-*` carrier — confirmed by this
  document's own registry (section 4) and the traceability table (section 24).
- Every one of the 22 `CMP-*` is reachable from at least one `A11Y-*`, directly or through a named
  composed component (section 24).
- Every one of the 82 lifecycle statuses already carries a complete tone/icon/emphasis triple, with no
  colour-only status structurally possible — `validate_ux_tokens.py`, reported in `DESIGN_TOKENS.md`
  §10, unchanged by this session.
- No two statuses within one machine reuse one governed icon — same gate.
- Every required text/UI-component contrast pair passes in both light mode and the retained dark
  compatibility map, at the token level — same gate, 114/114 in each mode.
- The target-size floors exist as tokens (`semantic.size.target-floor`, `target-primary`) rather than
  as guidance someone has to remember.
- The four safety-critical status separations (`PENDING_EVALUATION`/`NOT_ELIGIBLE`,
  `FAILED_RETRYABLE`/`REJECTED`, `UPLOADED`/`ACCEPTED`, booking `CANCELLED`'s `restricted` tone) are
  structurally distinct in the token source, not merely documented as a convention.
- The nine Phase 4 data states have a fixed, documented precedence (`IX-PLATFORM-017`) this session's
  matrix (section 16) applies rather than re-derives.
- Status labels, meanings, and prohibitions (no bare Latin letter, no internal classification leak)
  are already complete for all 18 machines in `CONTENT_GUIDE_STATES.md`, unchanged by this session.
- Every one of the 21 `ERR-*` already has recovery guidance and a Profile A surface mapping in
  `CONTENT_GUIDE_ERRORS.md`, unchanged by this session.

**Requires rendered UI in Phase 5, stated explicitly rather than implied by a green mechanical gate:**

- Actual keyboard focus order, on every surface (`A11Y-PLATFORM-001`, `-003`, `-008`).
- Actual focus trap behaviour and return-focus correctness (`A11Y-PLATFORM-002`, `-007`,
  `scripts/verify_focustrap.mjs`).
- Actual screen-reader announcement correctness and composition, including the live-region policy's
  real-world timing (`A11Y-PLATFORM-009` through `-012`, section 17's worked examples).
- VoiceOver/TalkBack behaviour specifically, as distinct from generic ARIA correctness
  (`A11Y-PLATFORM-009`, `-030`).
- Keyboard completion end to end on real Profile A surfaces (`A11Y-PLATFORM-001`).
- Rendered target size in real viewport pixels, once the hit area is counted (`A11Y-PLATFORM-013`,
  `-014`).
- Real computed contrast on rendered text, as distinct from the token-pair contrast already verified
  (`A11Y-PLATFORM-017`, `scripts/measure_render.mjs`/`verify_states.mjs`).
- Forced-colours/high-contrast survival on Profile A (`A11Y-PLATFORM-018`).
- Text scaling and reflow on a real device/browser, including the diacritic/dual-script metric claim
  `DESIGN_TOKENS.md` §4.2 already flagged as unmeasured (`A11Y-PLATFORM-019` through `-023`).
- Reduced-motion behaviour actually branching correctly, not merely defined (`A11Y-PLATFORM-024`,
  `-025`).
- Whether `restricted` and `neutral` — deliberately close in hue by design — are genuinely
  distinguishable to a real reader (`A11Y-PLATFORM-015`, `DESIGN_TOKENS.md` §11).
- Bidi isolation's actual screen-reader pronunciation order, as distinct from visual correctness
  (`A11Y-PLATFORM-030`, `scripts/verify_rtl.mjs`).
- The complete data-state accessibility matrix's announcement and focus claims, on real transitions
  (section 16).
- The full state-announcement worked-examples table (section 17), on real transitions.
- Real accessibility-tree behaviour for the disabled/unavailable/hidden distinction
  (`A11Y-PLATFORM-016`).

**No conformance claim is made anywhere in this document.** The target is WCAG 2.2 AA from
`NFR-PLATFORM-005`; this session specifies obligations against that target and states, obligation by
obligation, what can and cannot be verified before a rendered interface exists.

---

## 26. Findings, dependencies, and what this session did not do

**No conflict found requiring escalation.** This session read `COMPONENT_INVENTORY.md`,
`COMPONENT_INVENTORY_PLATFORM.md`, `COMPONENT_INVENTORY_DOMAIN.md`, `INTERACTION_PATTERNS.md`,
`INTERACTION_PATTERNS_DOMAIN.md`, `CONTENT_GUIDE.md`, `CONTENT_GUIDE_STATES.md`,
`CONTENT_GUIDE_ERRORS.md`, `DESIGN_TOKENS.md`, `DESIGN_DIRECTION.md`, `design_tokens/*.json`,
`WIREFRAME_COMPONENT_MAP.md`'s structure, and the repository accessibility reference files in full
before writing a single `A11Y-*` block, specifically looking for a genuine architectural or product
contradiction between an accessibility obligation and the already-approved system. None was found.
Every obligation above extends, cross-references, or formalizes a rule the existing `CMP-*`/`IX-*`/
`TXT-*` system already states — this session added no new component, no new pattern, no new lifecycle
status, and requested no change to any of the three.

**One near-miss, resolved without escalation.** `COMPONENT_INVENTORY.md` uses `semantic.size.target-floor`/
`target-primary`; `DESIGN_TOKENS.md` narrates the same values as `size.target-minimum`/
`target-comfortable`. These are not a conflict — `semantic.json` confirms the semantic-layer names
alias the primitive-layer names exactly (`target-floor` → `{size.target-minimum}`, `target-primary` →
`{size.target-comfortable}`) — but it is recorded here because it was checked, not assumed, per this
session's own verification-first obligation.

**No files modified except `ACCESSIBILITY.md` (created) and `docs/ux/README.md` (phase-status update,
section 27).** `COMPONENT_INVENTORY*.md`, `INTERACTION_PATTERNS*.md`, `CONTENT_GUIDE*.md`,
`DESIGN_TOKENS.md`, and `design_tokens/*` were read and not written to, per the session's own
instruction to avoid modifying them absent a direct, unavoidable conflict — none existed.

**Dark mode.** No dark-mode obligation is added as a V1 requirement anywhere in this document. Every
obligation above concerns the shipping light experience. Where a rendered-QA note mentions the retained
dark compatibility map (section 25, contrast row), it is reporting the existing token-level measurement
(`DESIGN_TOKENS.md` §10, 114/114 pairs), not proposing a dark-mode accessibility scope.

**No Phase 4 or Phase 5 artifact created.** No `WGT-*`, no `04-specs/`, no widget or screen spec, no
Figma frame, no React Native component, no Filament resource, page, or component, no Laravel code, and
no migration. No production application file under `UberTip-Backend/` was read for the purpose of
modification, and none was modified.

---

## 27. Phase status

`docs/ux/README.md` is updated in the same change as this file: Phase 3 stays **IN PROGRESS**, now
reading **Session 5 of 7 complete**, with accessibility/RTL/status/data-state semantics added to the
completed list and Sessions 6–7 (integration/traceability audit; final senior gate, handoff, and CI
promotion to `--phase 3`) named as remaining. `docs/README.md`'s own registry line — which still
records `A11Y-*` as not yet allocated — is **not** touched here, on the same reasoning
`CONTENT_GUIDE.md` §6 already applied to `TXT-*`: the implementation plan assigns that correction to
Session 7, batched with the other registry corrections, so the file changes exactly once within its
line budget rather than once per session. `A11Y-*` is not tracked by `docs/scripts/validate_docs.py`'s
registry check, so no engineering gate depends on this edit happening now. CI remains pinned at
`--phase 2`; Session 7 owns the flip to `--phase 3`.

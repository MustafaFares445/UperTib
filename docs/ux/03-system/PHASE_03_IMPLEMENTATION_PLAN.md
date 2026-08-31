# UberTib UX Phase 3 — Design System Implementation Plan

**Phase:** UX 3 — Design System
**Status:** Architecture and audit only. No Phase 3 artifact is produced by this plan and no production code is touched.
**Baseline:** Phase 1 complete, Phase 2 complete, 165/165 `SCR-*` covered by `WF-*` — Patient 47 · Clinic 56 · Admin 62
**CI remains pinned at `--phase 2`.** This plan does not change it.

---

## 1. Phase 3 Scope

Phase 3 owns four things and nothing else.

| Owns | Does not own |
|---|---|
| The single token theme all three platforms render from | Screen composition, widget placement, route paths |
| The component taxonomy — what repeats, its anatomy, its states, its token mapping | Framework component implementations |
| The interaction-pattern taxonomy — how safety-critical interactions behave everywhere | Per-screen behavior specifications |
| The content obligations — state meanings, error recovery, prohibited wordings | Per-screen final copy for every string on every surface |
| The accessibility obligations that bind components and patterns | Any conformance claim |

Phase 3 is the last phase that can still fix a systemic problem cheaply. After Phase 3, a wrong status treatment is wrong on 155 screens.

**Scale Phase 3 must serve, measured rather than estimated:**

| Measure | Value | Source |
|---|---:|---|
| Screens | 165 | `INFORMATION_ARCHITECTURE.md` section 11, parsed |
| Screens showing at least one lifecycle status | 155 | parsed from the `Lifecycle statuses shown` field |
| Lifecycle statuses across 18 machines | 82 | `INFORMATION_ARCHITECTURE.md` section 10.16 |
| Patient screens on `API-*` contracts | 47 | parsed from the `Contract` field |
| Clinic and Admin screens on `SDC-*` contracts | 118 | parsed from the `Contract` field |
| Distinct `ERR-*` anywhere under `docs/**/*.md` | 21 | measured with the same expression the validator uses |
| Immutable or append-only entities | 9 | `UX_FOUNDATION.md` section 5.1 |
| Evidence-transfer session states | 8 | `STATE_MACHINES` section 21.1, fixed by `PO-UX-17` |

**Wireframe archetype distribution, measured across all 165 `WF-*` by their fixed priority order:**

| Archetype | Patient | Clinic | Admin | Total |
|---|---:|---:|---:|---:|
| dashboard | 1 | 1 | 3 | 5 |
| list-and-detail | 7 | 10 | 12 | 29 |
| form | 14 | 26 | 18 | 58 |
| workspace | 0 | 5 | 0 | 5 |
| detail | 25 | 14 | 29 | 68 |
| **Total** | **47** | **56** | **62** | **165** |

This distribution is the primary structural input to the component taxonomy. Five archetypes, three profiles, and a status obligation on 155 of 165 screens is what makes a shared system worth building at all.

---

## 2. Authority Chain

Unchanged from `docs/ux/README.md`, restated so Phase 3 sessions do not reconstruct it.

1. Canonical engineering and product behavior: `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`.
2. Product Owner decisions under `.spec/decisions/`.
3. Phase 1 — actors, jobs, information architecture, screen inventory, flows.
4. Phase 2 — grey-box structure, hierarchy, interaction shape, region vocabulary, priority order.
5. Phase 3 — this layer.

Three authority facts Phase 3 must respect specifically:

- **`docs/api/ERROR_CATALOG.md` already owns the canonical Arabic client-facing message for all 21 `ERR-*`.** Phase 3 must not fork those strings. See section 11.
- **`docs/README.md` already reserves `CMP-*`, `IX-*`, `TXT-*` and `A11Y-*` as Phase 3 prefixes.** The line stating they are not yet allocated is the line Phase 3 updates.
- **`docs/README.md` carries a 200-line budget and currently sits at exactly 200 lines.** Registry updates must be net-zero: extend the existing UX Chain Registry table with columns; do not add rows or paragraphs.

The design kit at the repository root — `CLAUDE.md`, `tokens/`, `taste/`, `accessibility/`, `content/`, `scripts/` — is a **method, not an authority**. Where the kit's generic guidance and a canonical UberTib requirement disagree, the requirement wins. The clearest instance is dark mode: the kit assumes it, this product has to decide it. See section 5.4.

---

## 3. Proposed File Structure

```
docs/ux/03-system/
├── PHASE_03_IMPLEMENTATION_PLAN.md      this file
├── DESIGN_TOKENS.md                     token architecture, layer map, decisions, measured contrast
├── design_tokens/                       DTCG source of truth
│   ├── README.md
│   ├── primitive.color.json
│   ├── primitive.type.json
│   ├── primitive.space.json
│   ├── semantic.json
│   ├── component.json
│   ├── motion.json
│   ├── density.json
│   └── breakpoints.json
├── COMPONENT_INVENTORY.md               index, taxonomy rules, allocation registry
├── COMPONENT_INVENTORY_PLATFORM.md      cross-cutting CMP blocks
├── COMPONENT_INVENTORY_DOMAIN.md        domain-specific CMP blocks
├── WIREFRAME_COMPONENT_MAP.md           WF to CMP binding, one row per wireframe
├── INTERACTION_PATTERNS.md              IX blocks
├── CONTENT_GUIDE.md                     index, voice, surface vocabulary, prohibitions
├── CONTENT_GUIDE_STATES.md              TXT blocks for the 18 lifecycle machines
├── CONTENT_GUIDE_ERRORS.md              TXT blocks for the 21 ERR recovery families
├── ACCESSIBILITY.md                     A11Y blocks
└── PHASE_03_HANDOFF.md
```

Every filename here is chosen against the validator's path matching, not for appearance. Reasoning is in section 12; the short version:

- Component lookup matches any path containing `COMPONENT_INVENTORY`, so splitting across three files is safe.
- Content lookup matches any path containing `CONTENT_GUIDE`, so splitting across three files is safe.
- Any path containing `DESIGN_TOKENS` is exempt from the Phase 3 raw-value gate, which is why the token narrative and the token directory both carry that string. Token JSON is not scanned by the UX validator at all — a gap Phase 3 closes with its own gate.
- `WIREFRAME_COMPONENT_MAP.md` contains `WIREFRAME`, which is what closes the "component used nowhere" check **without editing a single Phase 2 file**. This was verified experimentally on a scratch copy of the tree, not assumed.

### 3.1 The one structural decision this plan asks the gate to approve

The Phase 3 validator requires every defined `CMP-*` to appear in a file whose path contains `WIREFRAME`, `WIDGET_SPECS` or `SCREEN_SPECS`. The latter two are Phase 4 artifacts that do not exist yet. So at the Phase 3 gate every component must be traceable to a wireframe, and there are exactly two ways to do that.

| Option | What it means | Cost |
|---|---|---|
| **A — binding map inside Phase 3 (recommended)** | `docs/ux/03-system/WIREFRAME_COMPONENT_MAP.md` carries one row per `WF-*` listing the components that wireframe resolves to. | Phase 2 files stay frozen at their gate. Phase 3 owns the binding, which matches the phase ownership split. A second artifact must be kept in step with the inventory. |
| **B — annotate the Phase 2 wireframes** | Add a `Components:` line to each of the 165 `WF-*` blocks. | The binding sits next to the wireframe, which is arguably better traceability. But it edits twelve files a completed gate approved, and makes Phase 2 artifacts depend on identifiers that did not exist when they were approved. |

**Recommendation: A.** Phase 3 owns the component taxonomy, so Phase 3 should own the mapping from structure to taxonomy.

Both directions of the closure were confirmed on a scratch copy: a component defined but absent from the map fails, and a component referenced in the map but absent from the inventory fails. It is a real two-way closure, not a formality.

---

## 4. Design Direction

### 4.1 Brand evidence found in the repository

The taste doctrine requires inferring the brief before generating. The first step is establishing what already exists, because inventing a direction that contradicts an approved one is the most expensive kind of taste error.

**Searched and found:**

| Source | Finding |
|---|---|
| `UberTip-Backend/app/Providers/Filament/AdminPanelProvider.php` | An amber panel primary. This is the value Filament's own installer writes. Scaffold output, not a brand decision. |
| `UberTip-Backend/.env.example`, `config/app.php` | Application name is the framework default. |
| `UberTip-Backend/public/favicon.ico` | Framework default. |
| `docs/README.md` | States that no Figma, XD, Sketch or brand-system source is authoritative for the engineering run. |
| All markdown under `docs/` and `.spec/` | Zero colour values, zero type decisions, zero icon decisions. Confirmed by scan. |
| `docs/UberTib خريطة التطبيق وتجربة المستخدم المحدثة الإصدار 2.1 الكامل.pdf` | **A documented visual system exists.** Section 15 of this 74-page Arabic executive reference is titled "the visual system, writing and accessibility" and carries an eight-role colour palette, a component list, a writing do-and-do-not table, and an accessibility and weak-connectivity list. |

The other five PDFs were scanned for colour values and visual-system content. None carries any. The SRS PDF does extract text, but its Arabic text layer is scrambled at the word level, which independently confirms `GAP-006` and leaves `Q-PLATFORM-001` untouched.

### 4.2 The documented palette, and its measured accessibility

Section 15.1 of the v2.1 reference names eight roles. The ratios below were produced by running the kit's contrast script on each pair. They are measured, not estimated.

```
role           value     purpose (as documented)             on white   AA text  AA UI
Primary        #0F766E   buttons and active headings           5.47:1     pass     pass
Primary Light  #E7F4F3   supporting backgrounds                   --       --       --
Text           #0F172A   primary text                         17.85:1     pass     pass
Muted          #64748B   secondary text                        4.76:1     pass     pass
Success        #15803D   completion and documentation          5.02:1     pass     pass
Warning        #F59E0B   waiting and action required           2.15:1     FAIL     FAIL
Danger         #DC2626   cancellation, failure, dispute        4.83:1     pass     pass
Info           #2563EB   classification, system information    5.17:1     pass     pass

additional measured pairs
white on Primary                                               5.47:1     pass     pass
Primary on Primary Light                                       4.86:1     pass     pass
Text on Primary Light                                         15.84:1     pass     pass
Text on Warning                                                8.31:1     pass     pass
```

**Seven of the eight roles pass WCAG 2.2 AA as documented. One fails, and it is the worst one to fail.**

> **Superseded in part by Session 2 — see section 17.** The audit above measured every role against white only. Measured against this product's own surface set, a second role also fails, and the remediation for the warning role needs one more token than this section proposes. Both corrections are in section 17 and both are implemented in `DESIGN_TOKENS.md`.

The warning role is documented as meaning "waiting and action required". In this product that role carries alternative-appointment deadlines the patient did not choose, claim windows that cannot be reopened, appeal windows, provider response deadlines and the eligibility-review deadline. A patient who cannot read the one signal that says a deadline is running misses an obligation no later action repairs. Taste never overrides accessibility, and an inherited brand value is not an exception.

The remediation is narrow and does not change the brand's character. Measured candidates for a text-and-icon-safe warning:

```
#B45309 on white   5.02:1   pass
#92400E on white   7.09:1   pass
```

**Proposed rule for Session 2:** the documented warning value is retained only as a large-area fill, paired with the text role over it at 8.31:1, and a darker warning value carries every warning text, icon and border. This preserves the documented look while making the signal readable.

### 4.3 What the v2.1 reference can and cannot contribute

The same section 15 also carries content later authority has superseded. This must be stated plainly so a later session does not adopt it wholesale.

| Section 15 content | Status | Reason |
|---|---|---|
| 15.1 colour palette | **Usable, with the warning fix.** Nothing in the canonical baseline contradicts it. | It is the only documented UberTib visual decision in the repository. |
| 15.4 accessibility and weak connectivity | **Usable and consistent.** AA contrast, no reliance on colour alone, 200% text zoom, 44 by 44 touch targets, a label for every icon, right-to-left screen-reader order, keyboard-complete panels, field-bound errors that explain the fix, upload progress and resume, draft save before submission, idempotent safe retry instead of an endless spinner. | Every item maps to `NFR-PLATFORM-005`, `NFR-PLATFORM-006` or WCAG 2.2 AA. The 44 figure exceeds the 24 minimum, which is the recommended figure anyway. |
| 15.3 writing rules | **Mostly usable, one row superseded.** The pairs map onto existing obligations: no superlatives about doctors, protection stated as conditional rather than guaranteed, a pre-examination price stated as approximate, a rejection stated as a specific correctable requirement. | The row that renders a server fault as "no amount was deducted" asserts a deduction model this product does not have. |
| 15.2 component list | **Not usable as written.** | The doctor card is specified as showing the internal scientific, pricing, protection and rating symbols plus confidence to the patient, and the transaction detail is specified as showing the commission breakdown. Both are prohibited by the algorithm-hiding boundary and the financial boundary. |
| 16 analytics, 17 launch plan, 18 acceptance | **Superseded for anything financial.** | `PO-2026-08-23` decision 9 removed all money movement from V1. Payment, settlement, chargeback and protection-fund events have no V1 surface. |

The honest summary: **the v2.1 reference contributes a palette, an accessibility bar and a writing register. It does not contribute a component model, a disclosure model or a financial model.** Section 4.6 records the governance action this implies.

### 4.4 Brief inference

Written before any token is generated, as the taste doctrine requires.

- **Industry** — healthcare service discovery plus a non-custodial financial record. Two trust problems at once: is this dentist right for me, and is what I agreed to what I am being held to.
- **Audience** — three, and they do not overlap. An episodic Arabic-first patient on a personal smartphone under weak connectivity who will never become fluent. A trained but constantly interrupted clinic operator on a desktop or tablet inside a clinic, working against a response deadline. An accountable admin reviewer whose output is a decision that must survive being questioned later.
- **Mood, the one adjective the result must earn — accountable.** Not calm, not modern, not trustworthy. Those are effects. This product's actual differentiator is that every decision names its reason, its owner and its date, and that history cannot be quietly rewritten. An interface that looks calm but cannot say who decided something has failed the brief. Calm is the register; accountable is the goal.
- **Motion depth — subtle feedback only.** Weak connectivity, an interruption-prone panel and a React Native runtime all argue against choreography. Motion confirms that something committed, or that a disclosure opened. Nothing else.
- **Layout family** — already fixed by Phase 2 and not reopened: one primary reading column for Patient, a twelve-column conceptual content grid inside the Filament shell for both panels.
- **Reference anchor** — no named library system is adopted. The kit's 138-system library carries no healthcare or clinical-records system, and adopting a consumer or developer-tool brand wholesale would import the wrong register. The direction is derived, anchored on the documented palette, and disciplined by two archetypes: the restraint of the high-end archetype — calibrated low chroma, hairline separation, flat surfaces, shadows rare — and the reading discipline of the editorial archetype for the Patient reading column.

### 4.5 The direction, stated as rules

Phase 3 will implement these. This plan only fixes them.

1. **Evidence before decoration.** The most prominent thing on any surface is the authoritative state and the reason for it. Nothing decorative competes with it.
2. **Neutrals carry the interface; the teal is the action colour and nothing else.** One primary, no secondary accent. Status colour is a signal channel, never a surface theme.
3. **Status is never colour alone, on any platform, for any state.** This is `NFR-PLATFORM-005`, and it is the constraint most likely to be violated by a designer working quickly, because eligibility and protection states are exactly what a designer reaches for colour to encode.
4. **Separation by hairline and surface, not by shadow.** Elevation is reserved for genuinely floating surfaces. A panel that shadows every card reads as noise at the density Admin works at.
5. **Cards are a container of last resort.** The archetype distribution is dominated by detail and form, not by card grids. A card is justified when it is a selectable or comparable unit and not otherwise.
6. **No colour-tinted left-border accent strips** on alerts, callouts or rows. In a right-to-left interface a physical left border is also a directional bug.
7. **Type does the hierarchy work.** One Arabic-capable family used with conviction; weight and size for hierarchy. Line height verified against Arabic diacritics rather than inherited from a Latin scale.
8. **Density follows the archetype, not the platform.** See section 5.6.
9. **Prohibited outright:** gradients as brand surface, neon or high-chroma medical colour, glassmorphism, decorative dashboards, illustrated empty states that replace the recovery action, dark-tech surfaces, and any pictographic emoji anywhere in any output.
10. **Zero emoji.** Icons come from one governed icon set, with a label on every icon.

### 4.6 Governance action this section requires

The v2.1 palette is real brand evidence but it is not currently in the Phase 3 authority chain, and `docs/README.md` states that no brand-system source is authoritative. Phase 3 cannot resolve that by itself.

**Session 1 must raise a new PLATFORM-domain open question** asking the Product Owner either to ratify section 15.1 of the v2.1 reference as the UberTib brand palette, or to state that Phase 3 derives a palette independently. The identifier is allocated in Session 1 rather than here, because the engineering validator rejects any identifier above the registry maximum and this plan must not fail validation merely to describe a question.

Until it is answered, Session 2 proceeds on the documented palette with the measured warning correction and records the dependency. That is the lowest-risk order: if the Product Owner ratifies, nothing changes; if they decline, only the primitive layer changes and the semantic layer absorbs it.

---

## 5. Token Architecture

Tokens are not generated by this plan. This section fixes the layer contract, the coverage, and the two decisions the generic token skill would otherwise make silently.

### 5.1 Three layers, one theme

Standard three-tier: primitive, semantic, component. The rules that matter are the ones this product adds.

| Layer | Contains | Rule specific to UberTib |
|---|---|---|
| **Primitive** | Ramps and scales. Never referenced by a component. | The only layer carrying literal values. If the Product Owner declines the v2.1 palette, this is the only layer that changes. |
| **Semantic** | Purpose aliases: action, text, surface, border, feedback, focus, state. | **Every one of the 82 lifecycle statuses resolves to a semantic state token plus a non-colour channel.** A status may not reach a component as a raw colour. |
| **Component** | Component-scoped tokens for the `CMP-*` set only. | A component token exists only where a `CMP-*` exists. No component tokens for framework-owned controls. |

One theme. Three platforms render from it. A platform-specific value is a defect, not a variant.

### 5.2 Coverage

| Group | In scope | Note |
|---|---|---|
| Colour | Yes | Primitive ramps, semantic roles, and the state channel. |
| Typography | Yes | Arabic-first. Family selection is a real decision, not a default, because the family must carry Arabic and Latin on the same line without a metric mismatch. |
| Spacing | Yes | One base unit, semantic aliases, density multiplier applied at the semantic layer. |
| Sizing | Yes | Control sizes, icon sizes, and the accessibility target floor as a token rather than a guideline. |
| Borders and radii | Yes | One radius language across all three platforms. |
| Elevation | Yes | Deliberately shallow. Most surfaces are flat. |
| Focus | Yes | A dedicated focus token set. Focus visibility is `NFR-PLATFORM-005` and must not be derived from the action colour. |
| Opacity | Yes | Disabled, overlay, scrim. Never used to encode a lifecycle state. |
| Motion | Yes | Duration and easing only, plus a reduced-motion equivalent for every one. |
| Breakpoints | Yes | Two distinct sets: Profile C size classes and the Profile A content grid. They are not the same scale and must not be merged. |
| Density | Yes | Three modes. See 5.6. |
| Gradients | **No** | Nothing in the direction uses one. Omitted rather than defined and then forbidden. |
| Blur | **No** | Same reason. |
| Data-visualisation palette | **Deferred to Phase 4** | Only the operational reporting screens need it, and charts are Phase 4 widgets. Defining a chart palette now would be speculative. |

### 5.3 The state channel

This is the most important token decision in Phase 3 and it has no equivalent in the generic kit.

`NFR-PLATFORM-005` requires that status, error, protection, eligibility and urgency never rely on colour alone. With 82 statuses across 18 machines, this cannot be enforced by review. It has to be enforced by structure.

**Proposal: a lifecycle status is a token triple, never a colour.**

```
state.<name>.tone      semantic colour role
state.<name>.icon      icon identifier from the governed set
state.<name>.emphasis  weight or fill treatment
```

A component consuming a status consumes the triple. It is then structurally impossible to render a status with only its tone, because the component's anatomy requires the icon and the label. This converts a rule that would otherwise be checked by a human 82 times into a rule checked once.

### 5.4 Dark mode — decided on evidence, not on convention

The question is not whether to add dark mode. It is that **one of the three platforms already has it and nobody has decided whether to keep it.**

| Platform | Current position | Decision required |
|---|---|---|
| **Clinic (Profile A)** | Filament ships a light and a dark theme and a user-facing toggle. If nothing is decided, the panel ships a dark theme nobody verified against 82 statuses in a product where colour-alone is prohibited. | **In scope.** Either define dark semantic overrides and verify them, or disable the toggle deliberately. Not deciding means shipping an unverified theme. |
| **Admin (Profile A)** | Same. | **In scope**, same reasoning. |
| **Patient (Profile C)** | React Native does not theme automatically. Dark mode is opt-in engineering work. No requirement asks for it. | **Out of scope for V1.** |

**Recommendation:** define and verify the dark semantic layer for Profile A; leave Profile C light-only for V1, with the token architecture built dark-capable so adding it later is a semantic-layer change rather than a re-tokenisation. Recommend against disabling the Filament toggle, because a trained operator working a long shift in a clinic is exactly the user who will look for it, and removing a framework affordance is a support cost.

This is a decision, not a default. It is recorded here so Session 2 does not relitigate it and Session 7 does not discover an unverified theme.

### 5.5 Where the tokens live, and why it matters

The design kit's token and contrast validators read the repository-root `tokens/` directory. The path is hardcoded and takes no argument. Both currently pass against the kit's own demonstration tokens.

**If Phase 3 emits UberTib tokens anywhere else and someone runs those scripts, they will report a green result for a set of tokens that are not this product's.** That is a false pass of exactly the kind the verification protocol exists to prevent.

Resolution: UberTib tokens live at `docs/ux/03-system/design_tokens/`, inside the UX chain's write scope and inside the phase that owns them, and Phase 3 ships a thin wrapper under `docs/ux/scripts/` running the same checks against that path. The wrapper adds a gate; it weakens nothing. The root `tokens/` directory stays as the kit's reference material and is never presented as UberTib's.

### 5.6 Density

The obvious answer is that Patient is spacious and the panels are compact. That answer is wrong, and the confirmed usage contexts say why.

`PO-UX-07` confirms that the clinic representative and invited staff work "desktop and laptop primary, tablet secondary, frequent daily use with a high interruption rate, especially front-desk and booking work", and that the treating dentist works "desktop and tablet inside the clinic, repeated but interruption-prone". A person interrupted constantly, working partly on a tablet, does not want a maximally dense grid; they want targets they can hit while looking away. Meanwhile the two genuinely dense surfaces in the product are Clinic workspaces — treatment-plan authoring and market-observation entry — and those are exactly 5 of 165 screens.

**Density is therefore a property of the archetype and profile, not of the platform.** Three modes:

| Mode | Applies to | Rationale |
|---|---|---|
| `reading` | All 47 Patient screens, every archetype | Episodic actor, never fluent, one reading column, smartphone in a variable environment, largest supported text must still work. |
| `operational` | Profile A default — detail, form, list-and-detail, dashboard | Trained but interrupted. Comfortable targets, stable positions, no ceremony on frequent tasks and full ceremony on irreversible ones. |
| `dense` | Profile A `workspace` archetype, and table regions inside `list-and-detail` only | 5 workspace screens plus table bodies. Density is earned by repeated structured entry, not granted by platform. |

Two hard floors density may never cross:

- No mode reduces an interactive target below the accessibility minimum.
- No mode reduces a Patient primary action below the 44 figure the v2.1 reference sets and the design kit recommends.

---

## 6. Proposed Component Taxonomy

### 6.1 The allocation rule

A pattern earns a `CMP-*` when all four hold:

1. It appears in at least two genuinely distinct contexts, not two instances of one context.
2. Its anatomy is the same in those contexts, even where its content differs.
3. Getting it wrong causes a documented harm — a requirement violation, a missed deadline, a wrong attribution, a misread price, an authorization leak.
4. It needs a home for a rule that would otherwise have to be remembered on every screen.

Criterion 4 separates a component from a convention. A status summary earns a component not because it repeats, but because the no-colour-alone rule needs somewhere structural to live.

### 6.2 The platform problem, and how `CMP-*` handles it

Patient is React Native. Clinic and Admin are Filament panels. Phase 1 forbids converging them. So a `CMP-*` cannot be one implementation.

**A `CMP-*` is a semantic component contract**: anatomy, variants, required states, token mapping, content obligations, accessibility obligations, traceability. Each block then carries a **realization row per profile**:

| Profile | Realization classification |
|---|---|
| C (Patient) | `Native` — a React Native component; or `n/a` where the component has no Patient surface |
| A (Clinic and Admin) | `Stock` — Filament as shipped; `Extended` — Filament with configuration; `Custom` — a custom view; or `n/a` |

This is the same Stock, Extended and Custom vocabulary `UX_FOUNDATION.md` section 7.1 already fixes for Profile A. It keeps the system honest: a component classified `Stock` is a contract about how the framework component is configured and what it must not do, not an instruction to rebuild it.

### 6.3 Domain keying

`CMP-*` uses the twelve product domains already in `docs/README.md`. Cross-cutting components use `PLATFORM`, which that registry already defines as owning right-to-left, accessibility and resilience. No thirteenth domain token is introduced.

### 6.4 Proposed cross-cutting components

Identifiers below are **proposed, not allocated**. Allocation happens in Session 3 with the registry update. They appear here because a taxonomy without identifiers cannot be reviewed for gaps or overlaps. Writing them in this plan creates no validator obligation, which was confirmed against the tooling.

| Proposed | Component | Why it earns one | Approximate reach |
|---|---|---|---|
| `CMP-PLATFORM-001` | State chip | One lifecycle status rendered as the tone-icon-label triple. The single most repeated element in the product. | 155 screens |
| `CMP-PLATFORM-002` | State summary | State, controlling reason, when it was assessed, what action is available. Principle 1 given an anatomy. | Every detail and dashboard archetype, 73 screens |
| `CMP-PLATFORM-003` | Subject context header | Whose case, which provider, which branch, on whose authority. Variants for Patient guardian context, Clinic panel-global provider and branch context, and Admin case subject. Safety-critical: acting on the wrong person's case is a named consequence of error for two actors. | Effectively every authenticated surface |
| `CMP-PLATFORM-004` | Action bar | State-aware and authorization-aware. Carries the rule that an action removed for authorization or lifecycle reasons is **absent and explained**, never rendered disabled — hiding is not an authorization control, and a disabled control implies an override exists. | All five archetypes |
| `CMP-PLATFORM-005` | Deadline indicator | Remaining time, approaching state, and whether expiry is recoverable. Carries Principle 4's hardest rule: an unrecoverable deadline must be visible as approaching, not reported as missed. | Booking alternatives, claim windows, appeal windows, provider response, evidence deadlines, eligibility review, code resend throttle |
| `CMP-PLATFORM-006` | Record list | Rows over a governed projection. Two rules: no generic edit or delete affordance over the 9 immutable entities, and row flags render independently of lifecycle state. | 29 list-and-detail screens plus embedded lists |
| `CMP-PLATFORM-007` | Filter and search bar | Carries the distinction between a filtered-empty result and a genuinely empty data set, which Phase 4 requires as two separate data states. | Discovery, queues, management lists |
| `CMP-PLATFORM-008` | Event timeline | Append-only history. No edit affordance is reachable from it, by construction. | Booking, case, financial, review, claim, audit |
| `CMP-PLATFORM-009` | Empty state | Required structural state on every screen. Variants for no-data and filtered-empty. Never an illustration in place of a recovery action. | 165 |
| `CMP-PLATFORM-010` | Recovery state | Variants for fetch failure, permission denial and unknown commit outcome. Permission denial is a designed state, not an assumed impossibility. | 165 |
| `CMP-PLATFORM-011` | Submission state indicator | Pending, failed, retrying, completed. The visible face of the idempotency contract and Principle 2. | Every mutating surface, Patient especially |
| `CMP-PLATFORM-012` | Evidence transfer item | The eight fixed session states, and the structural separation of retryable transfer failure from authoritative rejection. Low reach, very high consequence, fixed state machine. | 8 screens |
| `CMP-PLATFORM-013` | Human attribution | Who decided, when, on what basis. Principle 5 given an anatomy. Carries the inverse rule too: where the system computed an outcome, it must not be dressed as a human judgement. | Sensitive decisions, appeals, launch gates, verification, suspension review |
| `CMP-PLATFORM-014` | Sensitive confirmation | Reason capture, stated effect, stated irreversibility, and one action role reading the same way in the trigger and in its own confirmation. | Every irreversible or sensitive command |
| `CMP-PLATFORM-015` | Attention item | A durable, deadline-bearing item appearing on both the attention surface and the notification centre. That duplication is precisely what makes push, SMS and email optional adapters rather than load-bearing infrastructure. | 2 screens, load-bearing for 4 flows |

### 6.5 Proposed domain components

| Proposed | Component | Why it earns one |
|---|---|---|
| `CMP-ELIG-001` | Provider decision card | The highest-consequence Patient surface. Its attribute set is fixed by `PO-UX-04`, and it appears as a result row, as a decision card and as a comparison column with the same anatomy. Carries the prohibition on any composite score. |
| `CMP-ELIG-002` | Price display | The four governed display modes, currency and normalisation provenance, and the prohibitions: never a market average, a city average, a tariff or a recommended price; never a quoted total when the mode says otherwise; never an implication that the platform holds money. |
| `CMP-ELIG-003` | Eligibility explanation | The controlling reason in patient-actionable terms, with pending evaluation visibly distinct from a negative outcome, and no internal symbol reachable. |
| `CMP-CLINICAL-001` | Treatment line | Every amount names its category, its reason and what it covers. There is no surcharge, extra, adjustment or other. The rule needs a structural home or it will be papered over with a generic noun. |
| `CMP-CLINICAL-002` | Change disclosure | Original against amended. Two audiences, one anatomy: a patient deciding whether to re-accept, and an administrator inspecting a governed change. Variants, not two components. |
| `CMP-POLICY-001` | Governed version header | Version, effective period, review-gate status, and reachability of historical versions. Spans catalog, clinical, commercial and pricing governance. |
| `CMP-OPS-001` | Work item row | Five states plus two independent flags. The row a supervisor most needs to find is simultaneously in progress, escalated and overdue, so flags cannot be states. Landing surface for six roles. |
| `CMP-FINANCE-001` | External money boundary notice | **Candidate — resolve in Session 3.** The obligation is real and its measurement method explicitly includes copy verification. It may be better served as a content obligation attached to `CMP-PLATFORM-002` and `CMP-ELIG-002` than as a component of its own. Resolve one way; do not allocate both. |

**Proposed total: 22 allocated plus 1 candidate.**

### 6.6 Candidates deliberately not promoted

This is the part of the taxonomy that keeps it a system rather than a catalogue.

| Candidate | Disposition | Reason |
|---|---|---|
| Comparison view | **Phase 4 widget** | It is `CMP-ELIG-001` repeated in a column layout over transient state. Promoting it would create a component whose anatomy is another component. |
| Dashboard composition | **Phase 4** | Five screens, three of them Admin. That is a template, not a component. |
| Navigation chrome | **Not a component** | Framework-owned on Profile A, fixed by Phase 1 on Profile C. Phase 3 supplies tokens and accessibility obligations to it, not an anatomy. |
| Button, input, select, checkbox, date picker, modal shell, toast, banner, avatar, badge, tabs | **Not components in this system** | Profile A gets Filament as shipped; Profile C gets React Native primitives. Defining bespoke atoms would be phase bleed into implementation and would contradict the profile constraint that the framework supplies forms and notifications. They remain bound by the token layer, the eight required states and the accessibility obligations. |
| Error surfaces — inline field, action banner, unavailable state, full-page gate | **Owned by the content guide and the interaction patterns** | The error catalogue already fixes the surface vocabulary. What Phase 3 adds is the panel-native extension and the routing from each `ERR-*` to a surface, which is content and behavior, not anatomy. |
| Card | **Not a component** | The archetype distribution is dominated by detail and form. A card is a container decision made per surface in Phase 4, and promoting it invites the card-grid default the direction rejects. |

Phase 2 proposed twelve candidates. Ten survive in some form, two are absorbed as variants, and **five components Phase 2 did not list are proposed here**: deadline indicator, price display, human attribution, submission state, and attention item. Each carries a rule with a documented failure consequence and currently has no structural home.

---

## 7. Proposed Interaction-Pattern Taxonomy

`IX-*` describes how an interaction behaves, independent of which component renders it. Every one is derived from a canonical behavior rule rather than from interface convention. Identifiers are proposed, not allocated.

| Proposed | Pattern | Derived from |
|---|---|---|
| `IX-PLATFORM-001` | Server-committed mutation. No optimistic rendering of a clinical, financial or authorization outcome. | Principle 2; commit-is-truth |
| `IX-PLATFORM-002` | Idempotent retry. Retry reuses the original key; a new key is a new intent, never an automatic retry. | `ERR-AUDIT-001`; the idempotency contract |
| `IX-PLATFORM-003` | Authoritative read refresh on entry, on refocus, on explicit refresh, and after the surface's own mutation. | Cross-platform read refresh rules |
| `IX-PLATFORM-004` | Resume and reconcile after an unknown outcome, before offering a new command. | `SCR-PLATFORM-002`; weak-connectivity resilience |
| `IX-PLATFORM-005` | Draft save and resume that creates no submitted business record. | Weak-connectivity resilience; applicant draft resumption |
| `IX-PLATFORM-006` | Resumable evidence transfer across the eight session states, with retryable failure structurally distinct from rejection. | `API-PLATFORM-001`; `PO-UX-17` |
| `IX-PLATFORM-007` | Authorization loss while a surface is open. The next protected read or action fails, and no stale session mutates. | Access-change propagation |
| `IX-PLATFORM-008` | Progressive disclosure. Task first; history and advanced detail on demand. | Fixed by Phase 2 for all 165 wireframes |
| `IX-PLATFORM-009` | Progress disclosure for long reads. Provider search sits on the loosest latency budget and the most important discovery job, so it shows progress rather than appearing stalled. | `NFR-PLATFORM-001` |
| `IX-PLATFORM-010` | Bidirectional and mixed-direction content. Service codes, version numbers, amounts, dates and Latin clinic names inside Arabic text, isolated so they do not reorder. | `NFR-PLATFORM-005`; locale constraints |
| `IX-PLATFORM-011` | Text scaling and reflow. At the largest supported size, critical regions stack rather than truncate. | `NFR-PLATFORM-005`; the Phase 2 responsive rule |
| `IX-PLATFORM-012` | Input model per profile. No hover state is ever emitted for Profile C; press, long-press and swipe replace it. Profile A is keyboard-complete. | Platform profile constraints |
| `IX-PLATFORM-013` | Reduced-motion parity. Every motion has an equivalent preserving the feedback without the travel. | Accessibility; motion tokens |
| `IX-ELIG-001` | Revalidation at commit. The two highest-volatility records can change between a screen loading and the user acting, so every surface built on them has a staleness answer and a revalidation-failure path. | `ERR-ELIG-001`, `ERR-ELIG-002`, `ERR-BOOKING-001` |
| `IX-BOOKING-001` | Deadline countdown and expiry, distinguishing a recoverable lapse from an unrecoverable one, and never rendering a non-confirmation as a punitive cancellation. | `PO-UX-12`; copy obligation 1 |
| `IX-CLINICAL-001` | Re-acceptance after amendment. A superseding version discloses what changed before it can be accepted, and the prior accepted snapshot stays visible and immutable. | Disclosed amendment and re-acceptance |
| `IX-OPS-001` | Flag against state in queues. A row renders its lifecycle state and its escalated and overdue flags independently. | `PO-UX-08` |
| `IX-AUDIT-001` | Sensitive decision capture. Mandatory reason, stated effect, stated irreversibility, and the same action role wording in the trigger and the confirmation. | Sensitive-decision audit; the naming rules |

**Proposed total: 18.**

The Phase 3 validator does not check `IX-*` at all. The Phase 4 validator warns on an `IX-*` never applied to a widget. Phase 3 should therefore bind every `IX-*` to at least one `CMP-*` and one `FLOW-*` in its own block, so Phase 4 inherits a mapping rather than reconstructing one. Section 12 proposes making that a gate rather than a habit.

---

## 8. Content Architecture

### 8.1 What `TXT-*` owns and what it must not touch

| Owned by Phase 3 `TXT-*` | Owned elsewhere, referenced only |
|---|---|
| The Arabic label and required meaning for each of the 82 lifecycle statuses, per audience | The canonical Arabic `ERR-*` client-facing message, owned by the error catalogue |
| Recovery guidance for each `ERR-*` on each surface | The stable machine code and HTTP status |
| Audience translations of canonical terms | The canonical glossary term |
| Action-role labels, one label per role across all three platforms | Requirement and permission semantics |
| Empty-state and recovery copy per archetype | Per-screen final strings, which are Phase 4 |
| The prohibitions: what may never be said, and why | The rules the prohibitions enforce |

The distinction on errors matters most. The error catalogue already carries a safe Arabic message for every one of the 21 codes. **Phase 3 must not restate those strings**, because two copies of one string is two sources of truth and the canonical document wins by construction. Phase 3 owns what the catalogue deliberately does not: what the user does next.

### 8.2 Granularity

Per-string allocation would produce well over a hundred and forty identifiers and make the guide unreviewable. Per-family allocation matches how the rest of the chain works.

| Family | Basis | Estimated count |
|---|---|---:|
| Lifecycle status families | One per state machine, carrying all its statuses and their per-audience meanings in a table | 18 |
| Error recovery families | One per `ERR-*` | 21 |
| Audience translation families | One per canonical term with a differing audience rendering | about 12 |
| Action-role labels | One per action role appearing on more than one platform | about 12 |
| Structural state copy | Empty and recovery copy per archetype | about 10 |
| Named copy obligations | The seven from Phase 1 and the four from Phase 2, cross-referenced rather than duplicated | absorbed |

**Estimated 70 to 90 `TXT-*`. The exact count is fixed in Session 5, not here.**

### 8.3 The eleven named copy obligations

Carried forward verbatim as obligations, not suggestions. Each is a case where a literal rendering of the engineering state would tell the user something false.

1. A booking closed because an alternative was declined or expired must read as an appointment that was not confirmed, never as a cancellation carrying a penalty that does not exist.
2. Eligibility review must read as a hold pending a check. Never a provider accusation, never an instruction to attend.
3. Retryable transfer failure and authoritative rejection must stay distinct. Conflating them tells a patient on a weak connection that their document was refused when the network merely dropped, which is the most likely evidence failure in this product's conditions.
4. A starting-point price and a range must read as such, a free price as genuinely free rather than as missing data, and an examination-dependent price as a price only an examination can settle rather than as a refusal to disclose.
5. No price string may say market average, city average, tariff or recommended price on any platform. The product asserts the provider's own price and nothing else.
6. A clinical risk level is never abbreviated to a single letter that already means the verified review rating. Only its practical consequences are ever worded.
7. Every plan-line amount names its category, its reason and what it covers. There is no surcharge, extra, adjustment or other.
8. Internal classification, calibration and risk vocabulary is hidden or translated into practical meaning. This binds the Clinic panel as well as the Patient app.
9. No copy states or implies that the platform held, paid, insured or refunded money.
10. Protection is stated as its documented conditional meaning, never as insurance, reimbursement or a guaranteed result.
11. One action role keeps one label across all three platforms, including inside its own confirmation.

### 8.4 The surface vocabulary gap

The error catalogue defines five presentation surfaces and all five are client and API oriented. Staff panels reach the same error identifiers through in-process contracts, but the vocabulary does not describe panel-native presentation. Phase 1 recorded this as a Phase 3 input rather than an upstream question.

**Phase 3 closes it in the content guide** rather than by editing the canonical catalogue, because the mapping from an error to a Filament-native surface is a UX decision, not an API contract change. The content guide will carry a surface table with a Profile C column and a Profile A column for all 21 codes.

Note that the Phase 1 entry recording this gap counts nineteen codes. There are twenty-one. Two were allocated after it was written. Section 16 records this.

---

## 9. Accessibility Architecture

### 9.1 Position

Target is WCAG 2.2 AA, from `NFR-PLATFORM-005`. **Phase 3 specifies obligations. It does not and may not claim conformance.** Conformance is measured against a running interface, and there is no running interface at Phase 3.

### 9.2 `A11Y-*` shape

Each obligation carries: the WCAG criterion or product rule it comes from, the profiles it binds, the `CMP-*` and `IX-*` that carry it, how it is verified, and whether that verification is mechanical or manual. All are keyed to `PLATFORM`, because `NFR-PLATFORM-005` owns all of them.

**Estimated 25 to 30 obligations**, grouped:

| Group | Contents |
|---|---|
| Perceivable | Contrast for text, interface elements and focus. **No colour alone for status, error, protection, eligibility and urgency** — enforced structurally through the state triple in 5.3. Text scaling to 200% without loss. Reflow. Text-spacing survival. Icon labelling. |
| Operable | Target size, with the accessibility minimum as a floor and the higher Patient figure for primary actions. Keyboard completeness on Profile A. Focus visible and not obscured, which matters because both panels use a framework shell with sticky chrome. Input model per profile. No motion trap. |
| Understandable | Errors bound to their field and explaining the fix. Consistent action-role naming. Accessible authentication, directly load-bearing here because the Patient entry path is a code challenge with throttling, expiry and attempt limits, and a cognitive-function test is prohibited. |
| Robust | Name, role and state announced for every interactive element and every status. Live announcement of pending, failed, retrying and completed, since those change without user action. Right-to-left and bidirectional isolation. Forced-colours survival on Profile A. |

### 9.3 The two obligations this product cannot treat as routine

**No colour alone** is normally a checklist item. Here, eligibility, protection and urgency are precisely the concepts a designer encodes chromatically, there are 82 statuses, and the requirement names this explicitly. It is handled by making a colour-only rendering structurally impossible rather than by review.

**Right-to-left with mixed direction** is not a layout flip. Service codes, version identifiers, amounts with currency, dates and Latin clinic names appear inside Arabic text on the same line. Mixed-direction content that reorders is a correctness failure, not a cosmetic one, because a reordered code or amount is a wrong code or amount. This binds tokens — logical rather than physical spacing — components — every anatomy defined in start and end terms — and patterns.

### 9.4 Honest scope

Phase 3 can mechanically verify token contrast in every mode that ships, and that no colour-only status token exists. It cannot verify screen-reader announcement, focus order, keyboard completeness or forced-colours survival, because those need a rendered interface. Those obligations are specified in Phase 3 and verified in Phase 5. The handoff must say so rather than implying a green gate covers them.

---

## 10. Traceability Strategy

Every Phase 3 artifact traces upward. Nothing is defined because it is conventional.

| Artifact | Must name | Enforcement |
|---|---|---|
| `CMP-*` | At least one `WF-*` through the binding map; at least one of `FR-*`, `ERR-*` or `NFR-*`; its profile realizations; its required states; its token mapping | Wireframe binding is enforced by the existing validator. The rest is proposed as a new mechanical check. |
| `IX-*` | At least one `FLOW-*`, at least one `CMP-*`, and the canonical rule it implements | Proposed new check |
| `TXT-*` | Its source — an `ERR-*`, a lifecycle status, or an `FR-*` — and the audiences it serves | Proposed new check |
| `A11Y-*` | A WCAG criterion or `NFR-PLATFORM-005`; the `CMP-*` or `IX-*` that carries it; its verification method | Proposed new check |

Two traceability directions matter and only one is currently enforced.

- **Downward** — every `CMP-*` is used somewhere. The existing validator enforces this.
- **Upward** — every screen's structural needs are met by some component. Nothing enforces this, and nothing can until Phase 4 places widgets. The Phase 3 handoff must therefore report component coverage per archetype as a measured table and state explicitly that it is a coverage claim over archetypes, not over screens.

The binding map is the single artifact carrying the `WF-*` to `CMP-*` relation, so it is also the artifact that will rot first. Session 6 must regenerate the coverage table from it rather than maintaining a second copy.

---

## 11. `ERR-*` Coverage Strategy

### 11.1 What the gate actually requires

At Phase 3 the validator collects every `ERR-*` matching the canonical pattern across **all markdown under `docs/`**, not just under `docs/ux/`, and fails for each one absent from the content guide. Run against the current tree with no Phase 3 files present, it produces exactly 21 failures and nothing else. **This is the only mandatory Phase 3 gate that exists today.**

The 21:

```
ERR-AUDIT-001      ERR-BOOKING-001    ERR-BOOKING-002    ERR-BOOKING-003
ERR-CLAIMS-001     ERR-CLAIMS-002     ERR-CLINICAL-001   ERR-CLINICAL-002
ERR-ELIG-001       ERR-ELIG-002       ERR-FINANCE-001    ERR-IDENTITY-001
ERR-IDENTITY-002   ERR-IDENTITY-003   ERR-IDENTITY-004   ERR-PLATFORM-001
ERR-PLATFORM-002   ERR-PLATFORM-003   ERR-PLATFORM-004   ERR-PLATFORM-005
ERR-REVIEWS-001
```

The check is a substring test, so a table naming all 21 would satisfy it mechanically. That would be gaming the gate, and Phase 3 will not do it.

### 11.2 What each `ERR-*` block will carry

| Field | Content |
|---|---|
| Canonical message | Referenced, never restated. The error catalogue owns it. |
| Retry semantics | Taken from the catalogue's retry and recovery matrix, which distinguishes the codes by whether retry helps at all. Phase 3 renders that distinction rather than smoothing it. |
| Surface, Profile C | One of the five catalogue surfaces |
| Surface, Profile A | The panel-native equivalent. This closes the Phase 1 gap described in 8.4. |
| Recovery guidance | What the user does next, in the audience's terms. The part Phase 3 owns outright. |
| Prohibitions | What this error may never be allowed to imply |
| Screens reached | The `SCR-*` where this error is a designed state |

### 11.3 The three codes needing the most care

- **`ERR-IDENTITY-004`** covers invalid, expired, consumed and attempts-exhausted as one code with deliberately distinct recovery guidance. One code, four different next actions. The clearest case of the catalogue owning the message and Phase 3 owning the recovery.
- **`ERR-PLATFORM-005`** is evidence rejected or failed validation. Its guidance must never be reachable from a retryable transfer failure, which is copy obligation 3 and a structural rule at the same time.
- **`ERR-BOOKING-002`** is scoped to booking only, after the guardian-revocation conflict was resolved by settling the underlying rule. Phase 3 must not reintroduce it on any identity surface, and its recovery guidance must not be written generically enough to be reused there.

### 11.4 A caution for later sessions

Because the check sweeps all of `docs/`, **any new `ERR-*` referenced anywhere in the documentation set immediately becomes a Phase 3 obligation.** If an upstream change allocates a twenty-second error code, the UX gate fails until the content guide covers it. Session 7 should note this in the handoff so the dependency is visible rather than discovered.

---

## 12. Validator Strategy

### 12.1 What Phase 3 mechanically requires today

Read directly from `docs/ux/scripts/validate_ux_docs.py` and confirmed experimentally on a scratch copy of the tree.

| Check | Behavior | Consequence for Phase 3 |
|---|---|---|
| Component definition | `CMP-*` blocks are found by second- to fourth-level headings beginning with the identifier, in files whose path contains `COMPONENT_INVENTORY`. | Use third-level headings. Splitting across several files carrying that string is safe. |
| Component used | Every defined `CMP-*` must appear in a file whose path contains `WIREFRAME`, `WIDGET_SPECS` or `SCREEN_SPECS`. | The binding map. Section 3.1. |
| Component defined | Every `CMP-*` appearing in a wireframe-path file must be defined. | The map cannot reference an identifier the inventory has not allocated. Two-way closure, verified. |
| Error copy | Every `ERR-*` anywhere under `docs/` must appear in a content-guide-path file. | Section 11. |
| Raw values | Outside fenced blocks, and excluding lines containing the word "primitive", any hexadecimal colour or any pixel or millisecond literal fails, in every UX markdown file except those whose path contains `DESIGN_TOKENS` or `02-WIREFRAME`. | Every literal value lives in the token files or the token narrative. Prose uses token names. This document's palette audit sits inside a fenced block for exactly that reason. |
| Cumulative | Phase 1 and Phase 2 checks re-run in full at Phase 3. | See 12.2. |

### 12.2 Cumulative traps, and how the file structure avoids them

Because Phases 1 and 2 re-run, a carelessly named or headed Phase 3 file can fail a check belonging to an earlier phase. Four specific traps exist, and all four are avoided by construction:

1. A Phase 3 path containing `INFORMATION_ARCHITECTURE` or `SCREEN_INVENTORY` would add its `SCR-*` headings to the Phase 1 screen set, which then demands a job and a requirement. No proposed path contains either string.
2. A Phase 3 path containing `USER_FLOWS` would do the same for flows. None does.
3. A heading beginning with `WF-` inside the binding map would enter the Phase 2 wireframe set and demand a priority order and empty and error states. **The binding map must reference wireframes in table cells only, never as headings.** Tested: with wireframes referenced in cells, the wireframe count stayed at 165 and no new failure appeared.
4. Referencing a canonical identifier above its registry maximum fails the engineering validator from any file under `docs/`. This is why this plan describes the new open questions it raises without allocating identifiers for them.

### 12.3 What the gate does not check, stated honestly

The Phase 3 gate is thin. With no Phase 3 files at all it produces 21 failures and passes everything else. Specifically it does **not** check:

- that `IX-*`, `TXT-*` or `A11Y-*` exist at all, are traceable, or are used;
- anything inside the token JSON, which is not markdown and is never read;
- that a component declares its states, its tokens, its profiles or its accessibility obligations;
- that all 82 lifecycle statuses have copy;
- that any colour pair passes contrast;
- anything about colour words, which fail only at Phase 2 and only in wireframe files.

**A green Phase 3 gate would therefore prove very little. Phase 3 must not report it as if it proved a great deal.**

### 12.4 Proposed additions, all additive

No existing rule is weakened, no threshold lowered, no check removed. Proposed for Session 7, in a new file under `docs/ux/scripts/` so `validate_ux_docs.py` stays as Phase 1 wrote it.

| Proposed check | Why |
|---|---|
| Every `CMP-*` block declares profile realizations, the required states, a token mapping, an accessibility line, and at least one `FR-*`, `ERR-*` or `NFR-*` | Turns the component quality bar into a gate instead of a convention |
| Every `IX-*` names at least one `FLOW-*` and at least one `CMP-*` | Gives Phase 4 an inherited mapping, and pre-empts its unused-pattern warning |
| Every `TXT-*` names a source | Prevents copy that traces to nothing |
| Every `A11Y-*` names a criterion and a carrier | Prevents an obligation nobody owns |
| Every one of the 18 lifecycle machines has a status copy family | The mechanical proxy for the 82-status obligation |
| ~~Token JSON parses and every alias resolves, run against the UX token path~~ | **Delivered early in Session 2** — section 17.3. |
| ~~Required contrast pairs pass in every mode that ships, run against the UX token path~~ | **Delivered early in Session 2** — section 17.3. |
| No emoji anywhere under `docs/ux/` | Currently clean across 20 files. Keeping it clean is cheaper than fixing it. |

Two things stay manual and the handoff must say so: whether a status is genuinely distinguishable without colour, and whether the copy reads as accountable rather than merely correct.

### 12.5 CI

CI runs both validators, with the UX one pinned at `--phase 2`. **It stays at `--phase 2` until Session 7.** Flipping it earlier turns 21 known, expected, not-yet-authored obligations into a red build on every unrelated documentation change.

---

## 13. Known Dependencies

| Dependency | Effect on Phase 3 | Blocking |
|---|---|---|
| **Brand palette ratification** | Section 4.6. The palette exists and is documented but is not in the authority chain. Session 2 proceeds on it with the measured warning correction and records the dependency. | Not blocking. Only primitive values would change. |
| **`Q-CATALOG-001` and `Q-ELIG-001`** | Narrowed to their clinical residue. Production service and procedure content, and production formulas, thresholds, grade bands and calibration minimums, await licensed dental review. | Not blocking. They constrain content, not structure. Phase 3 must ensure no surface presents provisional catalog data as clinically approved. |
| **`Q-OPS-001`** | Owns storage, malware scanning, one-time-code and notification vendor selection. | Not blocking. The eight evidence session states are fixed and vendor-independent. |
| **`Q-PLATFORM-002`** | Final retention periods await legal validation. | Not blocking. Affects one screen's content. |
| **`Q-PLATFORM-001`** | The authoritative SRS text layer is scrambled at the word level. Independently confirmed during this audit. | Not blocking. Limits what may be claimed, not what may be built. |
| **`ASM-IDENTITY-001`, `ASM-ELIG-001`** | Both still in force. | Not blocking. Neither touches tokens, components or copy. |
| **Filament dark theme** | Section 5.4. Not deciding means shipping an unverified theme on two of three platforms. | **Decision required in Session 2.** |
| **Arabic type family** | No source names one. The choice affects the type scale, line height and the mixed-direction behavior of every screen. | **Decision required in Session 2.** A real decision with licensing and rendering consequences, not a default. |
| **Icon set** | No source names one. Every icon needs a label, and the state triple in 5.3 depends on a governed identifier space. | **Decision required in Session 2.** |
| **`Q-PLATFORM-007`** | No research inputs exist for any actor. Accepted as a limitation rather than an open decision. | Not blocking. Five usability sessions with clinic staff would still validate the prominence decisions Phase 2 rests on, at low cost. |

---

## 14. Explicit Non-Goals

Phase 3 does none of the following. Each is listed because it is a plausible thing to drift into.

1. **Re-decide anything Phases 1 and 2 settled.** The platform split, the navigation, the 165 screens, the 103 flows, the wireframe structure and priority order, the region vocabulary, the archetypes, the one-reading-column intent, the panel content grid, the fail-closed behaviors, the immutability of accepted treatment and financial history, the governed-data model, the two-layer catalog, the structural separation of retryable failure from rejection, and the labelling taxonomy. A needed change is an open question, not a Phase 3 decision.
2. **Produce screen layouts or widget specifications.** Phase 4.
3. **Produce framework code, an application theme file, or a Figma build manifest.** Phase 5.
4. **Define bespoke form controls, modals, toasts or navigation chrome.** Section 6.6.
5. **Expose internal classification, calibration, risk or confidence vocabulary to the Patient interface**, or introduce any control that selects one, on any platform.
6. **Introduce any payment, wallet, balance, top-up, withdraw or platform-refund affordance**, or any copy implying the platform held, paid, insured or refunded money.
7. **Invent clinical, financial, eligibility or business rules.** Where a rule is missing, Phase 3 records a question.
8. **Claim WCAG conformance.** Phase 3 specifies obligations against a documented target.
9. **Adopt a named design-system library wholesale.** Section 4.4.
10. **Add dark mode to the Patient app** merely because the token architecture supports it. Section 5.4.
11. **Weaken any existing validation rule**, lower any threshold, or narrow any check to make a gate pass.
12. **Restate the canonical Arabic error messages.** Reference them.
13. **Modify production application code.** No session in Phase 3 touches `UberTip-Backend/`.

---

## 15. Implementation Order, Sessions 2 to 7

Ordered so each session's output is the next session's input, and so the two riskiest decisions happen first.

### Session 2 — Tokens and direction
Emit the DTCG token set at `docs/ux/03-system/design_tokens/`, plus `DESIGN_TOKENS.md`. Decide and record the three open decisions from section 13: Filament dark theme, Arabic type family, icon set. Correct the warning role. Build the state triple for all 82 statuses. Raise the palette ratification question and register it.
**Done when:** every token file parses, every alias resolves, every required contrast pair passes in every mode that ships, and no status resolves to a colour without an icon and an emphasis. Report the actual output of each check, not a summary of it.

### Session 3 — Component taxonomy
Allocate the `CMP-*` set. Resolve the `CMP-FINANCE-001` candidate one way or the other. Write each block to the full quality bar: anatomy, variants, sizes, required states, token mapping, accessibility, content obligations, profile realizations, traceability.
**Done when:** every `CMP-*` has a complete block, and the taxonomy covers every region in the Phase 2 vocabulary across all five archetypes.

### Session 4 — Binding map and interaction patterns
Write `WIREFRAME_COMPONENT_MAP.md`, one row per `WF-*`, all 165. Write `INTERACTION_PATTERNS.md`. Bind every `IX-*` to at least one `CMP-*` and one `FLOW-*`.
**Done when:** the two-way component closure holds, and the map's coverage table shows no archetype with an unmet structural region.

### Session 5 — Content
Write the content guide and its two companions. All 18 status families. All 21 error families with both surface columns, closing the panel-native gap. The audience translations, the action-role labels, the structural state copy, and the eleven obligations as enforceable rules.
**Done when:** the Phase 3 error gate passes for a real reason, and every one of the 82 statuses has a label and a stated meaning per audience.

### Session 6 — Accessibility
Write `ACCESSIBILITY.md`. Bind every obligation to its carrier. Produce the component coverage table from the binding map rather than by hand. Separate mechanically verified obligations from those deferred to Phase 5, explicitly.
**Done when:** no obligation lacks a carrier and no carrier lacks its obligations.

### Session 7 — Gates and handoff
Add the proposed validator extensions. Update the registry line in `docs/README.md` within its line budget, including the `WF-*` correction. Flip CI to `--phase 3`. Write `PHASE_03_HANDOFF.md` with measured results, the carry-forward obligations for Phase 4, and an honest statement of what the gate does and does not prove.
**Done when:** both validators pass at `--phase 3` with zero failures, CI is green, and the handoff reports real numbers.

**Suggested gate between Sessions 4 and 5.** The component taxonomy and its binding are the decisions expensive to reverse. Content and accessibility are additive over them.

---

## 16. Findings From This Audit

Recorded here because they were found while producing this plan and would otherwise be lost.

1. **A documented UberTib visual system exists and was not in the Phase 3 authority chain.** Section 15 of the v2.1 UX reference PDF carries a palette, an accessibility bar, a writing register and a component list. It extracts cleanly. Section 4 states what is usable and what is superseded. Requires a Product Owner decision.
2. **One inherited brand colour fails WCAG 2.2 AA, and it is the deadline signal.** Measured at 2.15:1 on white against a 4.5 requirement for text and 3.0 for interface elements. Section 4.2 carries the measurement and two verified remediation candidates.
3. **The v2.1 reference contains a screen catalogue under a different identifier scheme.** Phase 1 ran in a mode premised on there being no inheritable screen inventory. A catalogue does exist in that PDF. This does not invalidate Phase 1's model, and adopting the PDF's would have imported a superseded financial and disclosure model, but the premise as recorded is inaccurate and worth correcting.
4. **`docs/README.md` still records `WF-*` as not yet allocated.** Phase 2 allocated 165. Section 15 folds the correction into Session 7, within the file's line budget.
5. **The Phase 1 gap entry on error surfaces counts nineteen `ERR-*`. There are twenty-one.** Two were allocated after it was written. Phase 3 must cover 21 regardless of what that entry says.
6. **The design kit's token validators are hardcoded to the repository-root token directory.** Running them against UberTib tokens placed anywhere else returns a green result for the wrong tokens. Section 5.5 resolves this. Anyone quoting those scripts' output before Session 2 is quoting the kit's demonstration tokens.
7. **The design kit's rendering gates skip silently when Playwright is absent.** They exit successfully having measured nothing. They are Phase 4 and Phase 5 tools and must not be cited at Phase 3.
8. **The wireframe artifacts carry archetype classification, not per-screen region detail.** All 165 blocks are generated from five templates, and the machine-readable manifest holds identifier, screen and platform only. The component analysis in section 6 is therefore derived from the Phase 1 screen catalogue and the archetype distribution, which is the correct source. Phase 4 should expect to do its own region work rather than reading it off the wireframes.

---

## 17. Corrections From Session 2

Recorded because implementation revealed them and a later session would otherwise repeat the
mistake. Each names the plan section it corrects. Nothing else in this plan changed.

### 17.1 A second documented role fails WCAG — corrects section 4.2

Section 4.2 measured all eight documented roles against white and found one failure. That
measurement set was too narrow: this product has three light surfaces, not one. Measured against
all three, the `Muted` role fails on the subtle surface.

```
Muted on surface.canvas    4.55:1   pass
Muted on surface.default   4.76:1   pass       <- the only pair section 4.2 measured
Muted on surface.subtle    4.34:1   FAIL
```

Secondary text unavoidably appears on the subtle surface: table headers, grouped panels, helper
text inside a filled field, and every read-only block. The role was moved down one ramp step for
text and **retained at its documented value as the strong border role**, where the bar is the
interface-element ratio and it clears on every surface. No third grey text level was introduced,
which removes the trap rather than working around it.

**Rule for later sessions: measure every foreground against every surface it can land on, not
against white.** The Session 2 gate does this by construction.

### 17.2 The warning remediation needs one more token — refines section 4.2

Section 4.2 proposed retaining the documented warning value as a large-area fill paired with the
text role over it. That pairing is correct and was implemented. It is not sufficient on its own:
the fill's **own boundary** against the page measures well below the interface-element minimum,
so a solid warning chip has an invisible edge.

Every tone therefore carries an `emphasis-border` token, applied uniformly rather than as a
warning-only exception, so there is no conditional rule to remember. For warning it is
load-bearing; for the other five it is comfortably satisfied anyway.

### 17.3 The token gate was needed in Session 2, not Session 7 — corrects section 12.4

Section 5.5 requires a wrapper running the kit's checks against the UX token path. Section 12.4
scheduled it for Session 7. Those are inconsistent: Session 2's own completion criterion in
section 15 is *measured* contrast in every mode that ships, and there was no honest way to
produce that without the wrapper.

`docs/ux/scripts/validate_ux_tokens.py` ships now. It is additive, weakens nothing, and goes
beyond the two rows section 12.4 listed: it also enforces the layering (a literal outside a
primitive group, or a component token reaching a primitive directly), requires a dark override
for every semantic colour, requires every status to carry a complete triple with a governed tone,
icon and emphasis, forbids a machine reusing one icon, and verifies every governed icon exists in
the installed icon package. The remaining section 12.4 rows stay with Session 7.

### 17.4 Two files added to the structure in section 3

- **`design_tokens/semantic.state.json`** — the state channel is split out of `semantic.json`.
  Section 5.3 fixes the triple but the plan's file list did not give it a home, and 82 statuses
  across 18 machines inside the semantic colour file would make both unreviewable.
- **`DESIGN_DIRECTION.md`** — section 4 of this plan fixes a direction, and Sessions 3 to 6 need
  to read it without reading a token document. Keeping direction and token values in one file
  would also force the direction narrative under the raw-value exemption, which is the wrong
  reason to structure a document.

Neither addition trips a validator trap: neither path contains a string the Phase 1 or Phase 2
checks match on, confirmed by running the cumulative validator.

### 17.5 Do not import a re-tuned third-party colour scale — new, affects Session 3 onward

Section 4.2 established that the documented palette is coherent. Session 2 additionally found
that seven of the eight roles sit at the exact lightness and hue of steps on a published tuned
scale, which is why completing the ramps from that shape was the right method.

It is **not** a reason to import that scale's current values. The obvious candidate has since
been re-tuned for a wider gamut, and its sRGB rendering moves every one of the eight anchors.
The ramps are therefore derived in OKLCH from the documented anchors, with shape borrowed and
values preserved, by `docs/ux/scripts/derive_primitive_ramps.py`, which fails if any anchor
drifts.

### 17.6 The open question raised by section 4.6 is allocated

`Q-PLATFORM-008`. Registered in `docs/README.md` within its line budget by extending the open-item
table and merging one redundant restatement of an existing entry, so the file remains at exactly
its budget. Severity Minor: it does not block, because only the primitive colour layer would
change if the palette is declined.

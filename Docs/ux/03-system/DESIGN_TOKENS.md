# UberTib Design Tokens

**Phase:** UX 3 — Design System, Session 2 of 7
**Source of truth:** `design_tokens/` (DTCG). This document is narrative; the JSON is normative.
**Gate:** `python docs/ux/scripts/validate_ux_tokens.py`
**Direction this serves:** `DESIGN_DIRECTION.md`

---

## 1. Layer contract

```
PRIMITIVE   ramps and scales. The ONLY layer carrying literal values.
            Never referenced by a component.
      |
SEMANTIC    purpose aliases: surface, text, border, action, focus, tone, state,
            plus type, space, size, radius, elevation, opacity.
            Plus the dark override map. This is the layer a theme change edits.
      |
COMPONENT   component-scoped tokens, one group per allocated CMP-*.
            Resolves to SEMANTIC only, never to a primitive.
```

Three rules this product adds to the standard three tiers:

1. **Every one of the 82 lifecycle statuses resolves to a semantic state *triple* plus a
   non-colour channel.** A status may not reach a component as a raw colour. Section 5.
2. **A component token exists only where a `CMP-*` exists.** No component tokens for
   framework-owned controls. `component.json` is therefore deliberately empty at Session 2 —
   the contract is fixed and the gate enforces it, but no `CMP-*` is allocated until Session 3,
   and inventing entries now would mean inventing components.
3. **One theme. Three platforms render from it.** A platform-specific value is a defect.

All three are mechanically enforced, not conventions.

### 1.1 Where the tokens live, and why that matters

The design kit ships `scripts/validate_tokens.py` and `scripts/validate_contrast.py`, and both
**hardcode the repository-root `tokens/` directory with no argument**. This was not assumed; both
were run this session and the false pass was reproduced:

```
$ python scripts/validate_tokens.py
Parsed 14/14 token files, 450 tokens defined.        <- the kit has 14 files; UberTib has 9
OK: all token files valid JSON.

$ python scripts/validate_contrast.py
PASS text on primary action: 5.17:1  [#ffffff on #2563eb]
OK: all required contrast pairs pass WCAG 2.2 minimums.
```

`#2563eb` is the kit's blue. **UberTib's primary action is the documented teal `#0F766E`.** Both
scripts report a confident green about a product that is not this one. Anyone quoting their
output as evidence about UberTib is quoting the wrong file.

`scripts/validate_theme_refs.py` is a third case and a different one: it needs a theme CSS file
plus code to check, its default target does not exist in this repository, and Phase 3 produces no
CSS at all — an application theme file is a Phase 5 artifact and an explicit Phase 3 non-goal.
**It is not applicable at this phase and was not run for show.**

So the UberTib source lives at `docs/ux/03-system/design_tokens/`, inside the phase that owns it,
and this session ships `docs/ux/scripts/validate_ux_tokens.py`, which runs the same checks plus
several the kit has no equivalent for, against that path. The root `tokens/` directory stays as
the kit's reference material and is never presented as this product's.

The Phase 3 plan scheduled that wrapper for Session 7. It had to exist now: Session 2's own
completion criterion is measured contrast, and there was no honest way to measure it otherwise.
Recorded in the plan as a sequencing correction.

---

## 2. The documented palette, measured

Section 15.1 of the v2.1 UX reference names eight roles. Every value below was read from the PDF
this session and every ratio was produced by running the kit's contrast script, not estimated.

```
role           value     documented purpose                    on white   AA text  AA UI
Primary        #0F766E   buttons and active headings            5.47:1     pass     pass
Primary Light  #E7F4F3   supporting backgrounds                   --        --       --
Text           #0F172A   primary text                          17.85:1     pass     pass
Muted          #64748B   secondary text                         4.76:1     pass     pass
Success        #15803D   completion and documentation           5.02:1     pass     pass
Warning        #F59E0B   waiting and action required            2.15:1     FAIL     FAIL
Danger         #DC2626   cancellation, failure, dispute         4.83:1     pass     pass
Info           #2563EB   classification, system information     5.17:1     pass     pass
```

Seven of eight pass as documented. Two corrections were required, and both were found by
measurement rather than judgement.

### 2.1 Correction 1 — the warning role

**The one role that fails is the worst one to fail.** Warning means "waiting and action
required", and in this product that role carries alternative-appointment deadlines the patient
did not choose, claim windows that cannot be reopened, appeal windows, provider response
deadlines and the eligibility-review deadline. A patient who cannot read the one signal that says
a deadline is running misses an obligation no later action repairs. Taste never overrides
accessibility, and an inherited brand value is not an exception.

```
candidate remediations, measured
#B45309 on white   5.02:1   pass          <- adopted
#92400E on white   7.09:1   pass          (rejected: darker than the family needs)
paired values
#0F172A on #F59E0B   8.31:1  pass         <- the pairing that keeps the documented value usable
```

**Rule adopted.** The documented `#F59E0B` survives **only as a large-area emphasis fill**, read
with the Text role over it at 8.31:1. `#B45309` carries every warning text, icon and border.

### 2.2 Correction 2 — the muted role, found this session

The Phase 3 plan measured `Muted #64748B` against white only, where it passes at 4.76:1. Measured
against **this product's own surfaces** it does not:

```
#64748B on surface.canvas  (#F8FAFC)   4.55:1   pass
#64748B on surface.default (#FFFFFF)   4.76:1   pass
#64748B on surface.subtle  (#F1F5F9)   4.34:1   FAIL
```

Secondary text unavoidably appears on the subtle surface — table headers, grouped panels, helper
text inside a filled field, and every read-only block.

**Rule adopted.** `text.secondary` moves down one step to `neutral.600` (`#46556B`), which
measures 6.91:1 at its worst across the three surfaces. The documented `#64748B` is **retained in
the palette and retained in use as `border.strong`**, where the bar is 3:1 and it clears
everywhere. It is prohibited for text.

**A third grey level was not added.** With `#64748B` no longer carrying text, a `text.tertiary`
would either duplicate secondary or reintroduce the same failure. Direction rule 3.7 says type
does the hierarchy work, so size and weight separate helper text from body text instead. This
removes a WCAG trap and a slop tell in one decision.

### 2.3 What the palette turned out to be

Converting each documented value to OKLCH shows that **seven of the eight sit at the exact
lightness and hue of steps on a published, perceptually tuned scale**, and that the adopted
warning correction sits on the same scale one step down. The palette's author was working from a
calibrated ramp, not picking values by eye. Only `Primary Light #E7F4F3` sits off it, and
deliberately: its chroma is far lower than the teal ramp reaches at any step.

That settled how to build the rest of each ramp — see section 3 — and it is also why the warning
correction changes nothing about the brand's character.

---

## 3. Primitive colour

Six 11-step ramps: `neutral`, `teal`, `green`, `amber`, `red`, `blue`. Plus
`brand.surface-tint` off-ramp, plus `white` and `black`.

`primitive.color.json` is **generated, not hand-edited**:

```bash
python docs/ux/scripts/derive_primitive_ramps.py --write
```

Method, and why it is this and not something simpler:

- Every documented value is an **anchor** and is reproduced bit-exact. The script exits non-zero
  if any anchor drifts, so a future edit cannot quietly move a brand colour.
- Unanchored steps are interpolated in **OKLCH** and clipped into the **sRGB** gamut, which is
  what both runtimes actually render in.
- The ramp *shape* — the darkness curve, the relative-chroma curve and the per-step hue drift —
  is a measured reference shape recorded inline in the script. Shape is borrowed; every value
  the product documented is preserved exactly.
- **Importing a third-party scale wholesale was rejected**, because the current release of the
  obvious candidate has been re-tuned for a wider gamut and its sRGB rendering would have moved
  every one of the eight documented anchors. Preserving the anchors is not negotiable.

Generated ramps, all anchors verified exact:

```
neutral  50:#F8FAFC 100:#F1F5F9 200:#E2E8F0 300:#CAD5E2 400:#91A1B8 500:#64748B
         600:#47556B 700:#344057 800:#1F283C 900:#0F172A 950:#020617
teal     50:#F1FDFA 100:#CDFBF1 200:#99F6E4 300:#51ECD4 400:#23D2BD 500:#1EB8A6
         600:#169488 700:#0F766E 800:#0A5E59 900:#104E4A 950:#052F2E
green    50:#F1FDF4 100:#DDFBE7 200:#BCF7D0 300:#82F0AA 400:#2EDE77 500:#26C55F
         600:#1EA24B 700:#15803D 800:#106532 900:#14532D 950:#062E16
amber    50:#FFFBEB 100:#FEF3C7 200:#FEE686 300:#FED23B 400:#F9BC0D 500:#F59E0B
         600:#D87800 700:#B45309 800:#943D02 900:#7A3308 950:#451902
red      50:#FDF2F2 100:#FDE3E3 200:#FCCBCB 300:#FAA6A6 400:#F86D6E 500:#F33E40
         600:#DC2626 700:#B81E1D 800:#991B1B 900:#7E201F 950:#440D0C
blue     50:#F0F6FE 100:#DDEAFC 200:#C1DBFA 300:#97C5F8 400:#62A3F4 500:#4083F1
         600:#2563EB 700:#1E4FD6 800:#2041AC 900:#203B85 950:#182650
brand.surface-tint  #E7F4F3   off-ramp, documented Primary Light, kept verbatim
```

---

## 4. The three decisions the plan required this session

### 4.1 Dark mode — in scope for Profile A, out of scope for Profile C

The question was never whether to add dark mode. It is that **one of the three platforms already
has it and nobody had decided whether to keep it.**

| Platform | Position | Decision |
|---|---|---|
| Clinic, Admin (Profile A) | Filament ships a light and a dark theme and a user-facing toggle. Doing nothing means shipping a dark theme nobody verified against 82 statuses in a product where colour-alone is prohibited. | **In scope.** A full dark semantic override map is defined and verified. |
| Patient (Profile C) | React Native does not theme automatically. Dark mode is opt-in engineering work and no requirement asks for it. | **Out of scope for V1**, architecture left dark-capable. |

**Disabling the Filament toggle was considered and rejected.** A trained operator working a long
shift in a clinic is exactly the user who will look for it, and removing a framework affordance is
a permanent support cost to avoid a one-session verification cost.

Adding dark mode to the Patient app later is a semantic-layer change, not a re-tokenisation. The
gate **requires** every semantic colour to have a dark override, so the map cannot silently rot:
a new semantic colour added in Session 3 without its dark value fails the build.

Measured: **114 of 114 required pairs pass in dark**, the same set as light.

### 4.2 Arabic type family — IBM Plex Sans Arabic

No canonical source names a family. The choice affects the type scale, the line height and the
mixed-direction behaviour of every screen, so it is a decision with consequences, not a default.

What the product actually needs, in order:

1. Arabic **and** Latin on the same line without a metric mismatch — service codes, version
   numbers, amounts, dates and Latin clinic names appear inside Arabic text, and a reordered or
   misaligned code is a *correctness* failure, not a cosmetic one.
2. Lining, tabular figures for financial and dense operational data.
3. Enough weights that type can carry hierarchy without a third grey.
4. A licence permitting embedding in a React Native app and a Filament panel.
5. Legibility at operational density.

**IBM Plex Sans Arabic** is selected: it is an Arabic companion designed inside a superfamily
with a Latin sibling, it is open-licensed, it carries the weight range, and it is built for UI
and technical contexts rather than display use.

Rejected, with reasons: **Cairo** and **Tajawal** are the default popular Arabic webfonts and
carry exactly the generic register the direction rejects, with weaker Latin companions;
**Noto Sans Arabic** has the coverage but little character; **Almarai** has too few weights for
type to carry hierarchy.

The stack is `["IBM Plex Sans Arabic", "IBM Plex Sans", "Segoe UI", "system-ui", "sans-serif"]`.

**Verification obligation carried to Phase 5, not claimed here:** that the Arabic and Latin faces
share usable vertical metrics on one line, and that `lineHeight.tight` clears Arabic diacritics
at heading sizes. Both need rendered text. Nothing in this session measured a glyph.

Two Arabic-specific rules follow, and both are in the token source:

- **Line heights are looser than a Latin scale.** The 1.25 heading leading a Latin system would
  use is deliberately absent; the tightest value here is 1.35, and Arabic body is 1.75.
- **Letter spacing has exactly one value: zero.** Non-zero tracking breaks Arabic glyph joining
  and turns a word into disconnected letterforms. No tracking scale is defined, for any surface.

A third family, `IBM Plex Mono`, is admitted for **machine identifiers on Admin and audit
surfaces only** — correlation and idempotency keys, content hashes. Never a label, a price, a
date or body copy, and never reachable from a Patient surface.

### 4.3 Icon set — Heroicons

Selected over the design kit's default. The kit is a method, not an authority, and here a
canonical constraint wins: **Filament ships Heroicons**, verified in this repository as
`blade-ui-kit/blade-heroicons` under `filament/filament v5.7.6`. Choosing anything else means
replacing the icon set on two of the three platforms to gain nothing, and the state channel needs
one governed identifier space across all three.

- Grid: 24, outline, as the default; the solid set is available for emphasis fills.
- **Every icon carries a text label.** An icon is never the only carrier of meaning.
- The governed vocabulary is **36 identifiers**, each with one documented meaning that holds in
  every machine. All 36 were verified to exist as real SVG files in the installed package, and
  the gate re-verifies this on every run when the package is present.

### 4.4 A fourth decision the plan did not list: numerals

`UX_FOUNDATION` section 7.3 explicitly delegates display convention to Phase 3.

**Western (ASCII) digits throughout, with lining tabular figures.** Reasons: canonical
identifiers such as service codes and version numbers are Latin-with-digits and must not render
their digits in one system and their letters in another; amounts have to match externally issued
receipts and clinic records; and one digit system removes an entire class of bidirectional
reordering bug.

**The numeral system is not a token.** It is a formatting decision, recorded here. What *is*
tokenised is the typographic requirement that every numeric style requests tabular and lining
figures, so columns of amounts align and a changing amount does not reflow.

---

## 5. The state channel

The most important token decision in Phase 3, and the one with no equivalent in the generic kit.

`NFR-PLATFORM-005` requires that status, error, protection, eligibility and urgency never rely on
colour alone. With **82 statuses across 18 machines**, that cannot be enforced by review 82 times.
It has to be enforced by structure.

**A lifecycle status is a triple, never a colour:**

```
state.<machine>.<STATUS>.tone       one of six semantic tone groups
state.<machine>.<STATUS>.icon       one of 36 governed icon identifiers
state.<machine>.<STATUS>.emphasis   one of four treatments
```

A component consuming a status consumes the triple. It is then structurally impossible to render
a status with only its tone, because the component's anatomy requires the icon and the label.
This converts a rule that would otherwise be checked by a human 82 times into a rule checked once
by a script.

### 5.1 The six tones

| Tone | Means | Chosen because |
|---|---|---|
| `neutral` | Inert, in hand, not started | Nobody has acted and nothing is running. |
| `info` | The system or a reviewer is working on it | Distinguishes "we are working" from "you must act". |
| `success` | Reached its intended outcome | v2.1 Success role. |
| `warning` | A deadline is running and somebody must act | v2.1 Warning role. Carries every unrecoverable window in the product. |
| `danger` | Ended badly or is contested | v2.1 Danger role. Distinct token from `action.destructive` — see below. |
| `restricted` | No longer available, and nothing went wrong | **Added.** The documented palette has no role for it, and using danger would alarm a patient for a provider merely being unavailable. |

`restricted` is deliberately achromatic and deliberately heavier than `neutral`. They are
separated by icon, emphasis and label rather than by hue — which is the state channel working as
designed, and is also the thing a human must confirm in Phase 5 rather than a script.

**Why there are two reds.** `action.destructive` is an **action role** — the colour of a command
that destroys something, and of the confirmation of that command. `tone.danger` is a **status
tone** — the colour of a record that ended badly. They resolve to the same hue family today and
are separate tokens on purpose, because they answer different questions and can diverge without
either following the other. The rule that matters is the one the direction fixes: a destructive
command uses `action.destructive` in the trigger **and** in its own confirmation modal, never
`action.primary`. A blue Delete is a bug, and so is a red Delete that turns blue when confirmed.

**One change was made because of looking, not measuring.** Every gate passed with
`tone.neutral.border` and `tone.restricted.border` set to the same ramp step; rendering the six
tones side by side at chip scale showed the two rows reading as one tone. `restricted.border`
moved two steps heavier in light and one lighter in dark. No ratio changed enough to matter and
no gate would ever have caught it — which is the argument for rendering the palette rather than
only measuring it.

### 5.2 The four emphases

`muted`, `subtle`, `outline`, `solid`. `solid` is governed by a **rule, not a quota**: it is
reserved for a status that both blocks the actor from proceeding **and** carries a deadline whose
lapse cannot be undone. A machine may have two, or none.

Twelve of the 82 qualify, and they are the twelve a reviewer should expect: onboarding
`CHANGES_REQUESTED`, invitation `PENDING`, eligibility `SUSPENDED`, booking
`ALTERNATIVE_PROPOSED` and `ELIGIBILITY_REVIEW`, reschedule `PENDING`, plan `PROPOSED`, financial
`DISPUTED`, claim `EVIDENCE_INCOMPLETE`, launch gate `expired`, and evidence `FAILED_RETRYABLE`
and `REJECTED`.

Measured distribution across the 82: emphasis `subtle` 53, `solid` 12, `outline` 11, `muted` 6;
tone `restricted` 19, `info` 18, `success` 16, `warning` 12, `neutral` 11, `danger` 6. The shape
is the one the product should have — most statuses are ordinary, `danger` is rare, and the
tones that dominate are the two that mean "we are working on it" and "this is closed".

### 5.3 Four safety-critical separations the channel makes structural

| Pair | Separation |
|---|---|
| `PENDING_EVALUATION` vs `NOT_ELIGIBLE` | Different tone **and** different icon. Conflating them is a requirement violation, not a copy preference. |
| `FAILED_RETRYABLE` vs `REJECTED` | Different tone, icon and emphasis. A dropped connection must never render as an authoritative refusal of the document. |
| `UPLOADED` vs `ACCEPTED` | Different tone and icon. Evidence stays quarantined until scanning and validation pass. |
| booking `CANCELLED` | Tone `restricted`, not `danger`. Three of its reason codes carry no patient penalty at all, and the tone must not assert a punitive outcome the reason may not support. |

### 5.4 Flags are not statuses

`ESCALATED` and `OVERDUE` live in a separate `state-flag` group. A work item may be
simultaneously `IN_PROGRESS`, escalated and overdue, so a flag renders in its own slot and never
replaces or recolours the status chip.

### 5.5 What the channel deliberately does not carry

**No labels, in any language.** Every user-facing string for these 82 statuses is a Session 5
`TXT-*` allocation against the content guide, and canonical Arabic error text already lives in
`docs/api/ERROR_CATALOG.md`. Putting a label here would create a second source of truth for a
string the content guide owns.

---

## 6. Density

Three modes. Density is a property of the **archetype and profile**, not the platform — see
`DESIGN_DIRECTION.md` section 3.8 for why the obvious answer is wrong.

| Mode | Applies to | Space scale | Control |
|---|---|---:|---|
| `reading` | All 47 Patient screens, every archetype | 1.0 | `control-lg` |
| `operational` | Profile A dashboard, detail, form, list-and-detail | 0.875 | `control-md` |
| `dense` | Profile A workspace (5 screens) and table bodies only | 0.75 | `control-sm` |

The multiplier applies to **layout spacing only**. It never applies to font size, line height,
the focus ring, the border width or the target floors. A dense table has tighter rows and the
same Arabic text size as everywhere else.

Two floors no mode may cross:

- **`size.target-minimum`** — WCAG 2.2 SC 2.5.8, on any platform, once the hit area is counted.
  A `control-sm` control in dense mode has an expanded hit area; a 32px control with a 32px hit
  area is a defect.
- **`size.target-comfortable`** — every Patient primary action, and every deadline-bearing action
  on any platform, in any mode.

---

## 7. Breakpoints — two scales, never merged

Profile C has **size classes** on a device viewport with no media queries available. Profile A
has a **content grid** measured on the panel content area, which is the viewport minus a
framework-owned shell whose width this chain does not control. A 1024px viewport on Profile A is
not a 1024px content area, so one shared scale would be wrong for both.

Profile C also carries a threshold that is **not a width**: at the largest supported text size,
critical regions **stack** rather than truncate, at every size class. Truncating an amount, a
deadline or a controlling reason is a correctness failure.

---

## 8. Coverage, and what is deliberately absent

| Group | In scope | Note |
|---|---|---|
| Colour | Yes | Primitive ramps, semantic roles, the state channel, light and dark. |
| Typography | Yes | Arabic-first. Family, scale, weights, leading, the single tracking value, composite styles. |
| Spacing | Yes | 4px base, semantic aliases, density multiplier at the semantic layer. |
| Sizing | Yes | Control sizes, icon sizes, and the accessibility target floors **as tokens rather than guidelines**. |
| Borders and radii | Yes | One radius language across all three platforms. |
| Elevation | Yes | Deliberately shallow. Most surfaces are flat. |
| Focus | Yes | A dedicated set, **not derived from the action colour**. |
| Opacity | Yes | Disabled, overlays, scrim. Never used to encode a lifecycle state. |
| Motion | Yes | Duration and easing, six presets, a reduced-motion equivalent for every one. |
| Breakpoints | Yes | Two distinct scales. |
| Density | Yes | Three modes. |
| Gradients | **No** | Nothing in the direction uses one. Omitted rather than defined and then forbidden. |
| Blur | **No** | Same reason. |
| Data-visualisation palette | **Deferred to Phase 4** | Only operational reporting screens need it, and charts are Phase 4 widgets. Defining one now would be speculative. |

### 8.1 Focus is its own colour, on purpose

`focus.ring` and `focus.ring-contrast` are a two-band ring using the darkest and lightest
neutrals, deliberately **not** derived from `action.primary`. Focus has to stay visible on top of
an action, a destructive control and every status emphasis fill alike, and a ring tinted with the
action colour disappears on the action. Measured: at least one of the two bands clears 3:1 on
every one of the eleven backgrounds a focused control can sit on, in both modes.

### 8.2 Disabled and read-only are different things

This product has **nine immutable or append-only entities** whose content is authoritative
history. It renders **read-only**, never disabled: `state.readonly.text` is full-contrast, and
`opacity.disabled` may not touch it. Dimming a financial snapshot because it cannot be edited
would make the record that matters most the hardest one to read.

---

## 9. The design / product configuration boundary

**A design token describes how something looks. It never carries a business, clinical, pricing or
policy value.** Those are governed product data with their own versioning, effective dates and
review gates, and copying one into the token source would fork it.

Explicitly **not** tokens, and never to become tokens:

| Not a token | Owner |
|---|---|
| Currency code, symbol, decimal places, exchange-rate source | Governed pricing policy |
| Price display modes — free, fixed, from, range, requires-plan | `CATALOG` / `ELIG` governance |
| The provider response deadline; the proposal validity period; the eligibility-review due time | Policy versions |
| When a deadline becomes "approaching" | Policy, not the deadline indicator's styling |
| Grade bands, price bands, risk thresholds, calibration minimums, market sample thresholds | Policy versions, pending licensed clinical approval |
| Retention and deletion periods | Legal, `Q-PLATFORM-002` |
| Slot capacity, throttle limits, attempt limits, code expiry | Configuration |
| Any label, message or Arabic string | `TXT-*`, Session 5, and `ERROR_CATALOG.md` |

The boundary cuts both ways, and the useful test is the **deadline indicator**: *how* an
approaching deadline looks is `tone.warning` plus its icon and emphasis — tokens. *When* it
becomes approaching is policy data. The same component reads both, and they never live in the
same file.

Similarly, the numeral system and currency formatting are decisions recorded in section 4.4; the
tokens carry only the typographic requirement that numeric styles use tabular lining figures.

---

## 10. Measured results

Produced by `python docs/ux/scripts/validate_ux_tokens.py` on the committed source. Not
estimated, not recalled.

```
UberTib UX token gate
Files: 9   Tokens: 721

=== state channel ===
  18 machines, 82 statuses, 36 governed icons, every status a complete triple

=== LIGHT - required pairs ===
  114/114 required pairs pass
=== DARK (Profile A only) - required pairs ===
  114/114 required pairs pass

note: icon existence verified against 36 names in the installed Heroicons package

OK: 0 failures.
```

Anchor reproduction, from `python docs/ux/scripts/derive_primitive_ramps.py`:

```
exact neutral.500  #64748B     exact amber.500  #F59E0B
exact neutral.900  #0F172A     exact amber.700  #B45309
exact teal.700     #0F766E     exact red.600    #DC2626
exact green.700    #15803D     exact blue.600   #2563EB
exact brand.surface-tint #E7F4F3
OK: every documented anchor reproduced bit-exact.
```

Advisory pairs, reported and never failed, because failing them would be wrong:
`border.subtle` and `border.default` are decorative dividers and card edges — any boundary that
identifies a control uses `border.strong`, which is required and passes. `text.disabled` is
exempt under WCAG 1.4.3 and nothing authoritative may use it.

Other gates run this session: `python docs/scripts/validate_docs.py` reports 0 failures and
0 warnings, with `docs/README.md` at exactly its 200-line budget after the `Q-PLATFORM-008`
allocation.

---

## 11. Accessibility position, stated honestly

Target is **WCAG 2.2 AA**, from `NFR-PLATFORM-005`. **This session specifies obligations and
measures token-level facts. It does not and may not claim conformance**, because conformance is
measured against a running interface and there is no running interface at Session 2.

**What was mechanically verified here:**

- every required foreground/background pair meets its minimum, in both modes that ship;
- every status carries a non-colour channel, so a colour-only status is structurally impossible;
- every governed icon exists in the installed icon package;
- every semantic colour has a dark value, so the panel dark theme is not an unverified accident;
- the target floors exist as tokens rather than as guidance somebody has to remember.

**What was rendered and looked at**, since gates do not prove pixels: the six ramps, the action
set in all three states plus focus, the six tones in all four emphases, and all 82 statuses as
their triples resolve — in both modes. That inspection produced one real change (section 5.1)
that no gate would have caught. It is a palette check, not a component check; there is no
component to render at Session 2.

**What was not verified, and cannot be at this layer:**

- screen-reader announcement, focus order, keyboard completeness, forced-colours survival;
- whether `neutral` and `restricted` are genuinely distinguishable to a real reader;
- whether Arabic diacritics clear at `lineHeight.tight` in the chosen family;
- whether the Arabic and Latin faces share usable metrics on one line;
- anything about beauty.

All of those need rendered output and are Phase 5 obligations. The design kit's rendering gates
(`measure_render.mjs`, `verify_states.mjs`, `axe_audit.mjs`) were **not** run and must not be
cited at this phase: they are Phase 4 and 5 tools, and they exit successfully having measured
nothing when their browser dependency is absent.

---

## 12. What Session 3 inherits

- A complete, gated token source. Add a semantic colour and the gate demands its dark value.
- A component tier whose contract is fixed and whose entries are empty by design. Every `CMP-*`
  allocated in Session 3 adds its token group in the same commit.
- The state channel, which fixes how every component that shows a status must be built: it
  consumes the triple whole, and the gate rejects a component that consumes a tone without the
  icon and the emphasis.
- Three density modes and two floors that bound every control size decision.
- The `Q-PLATFORM-008` dependency. It does not block: if the palette is declined, only
  `primitive.color.json` is regenerated from new anchors and nothing above it moves.

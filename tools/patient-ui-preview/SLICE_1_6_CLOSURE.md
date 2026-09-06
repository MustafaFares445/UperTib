# UberTib Slice 1.6 — continuation closure checkpoint

Date: 2026-09-06

Branch: `fix/patient-slice1-global-ux-remediation`

Continuation baseline: `37c03892a724f8060ce7fbfb58262f9d42a2b304`

Scope: `tools/patient-ui-preview/**` only. No Slice 2 work is included.

> **Status: NOT frozen.** This round found and fixed substantially more than the narrow delta the
> previous checkpoint anticipated, and it surfaced findings that belong to the canonical design
> system rather than to this preview. Those are listed under "Escalations" and are not resolved
> here. Read that section before treating Slice 1.6 as complete.

## What the previous checkpoint assumed, and what was actually true

The previous checkpoint recorded three remaining items: a 320 px price-wrapping polish item
(`PI-N01`), a slot disclosure-precision item, and re-verification. It also stated that no BLOCKER or
MAJOR finding remained.

Re-running the full gate suite and commissioning three independent adversarial reviews contradicted
that. Two defects were live in the committed baseline, and neither was visible to the gates that had
been run:

1. **`npm run test:e2e` was failing on the baseline.** The decorative-icon assertion queried
   `svg:not([aria-hidden="true"])` across the whole document, which also matches
   `#storybook-a11y-vision-filters` — an element the Storybook a11y addon injects into `<body>`
   asynchronously. The assertion was therefore wrong (it failed on preview tooling, not on product
   UI), timing-dependent, and vacuous on the one screen it ran against. CI runs only `test:smoke`,
   so it never surfaced there. The Patient UI itself was clean: every `svg` inside `#storybook-root`
   was correctly `aria-hidden` on every screen checked.

2. **The `PI-N01` fix committed in `37c0389` was itself broken.** `formatCurrency` emits an
   RTL-marked string, so concatenating `"– "` into it handed the en dash to bidi resolution inside
   the isolate, which resolved it to the far edge of the RTL row. The range rendered
   `40,000 ل.س. 80,000 ل.س. –`, with the separator orphaned at the end and separating nothing. The
   atomic-run and horizontal-overflow assertions added alongside it both passed while this was
   wrong, because neither checks order. It was found by rendering the component and looking at it.

The lesson recorded for the next task: the gates in this project prove token correctness, structural
accessibility and absence of overflow. They do not prove that a rendered screen reads correctly.
Rendering and inspecting is not optional.

## Verification gate — actual results on this tree

```text
npm ci                                          417 packages, 0 vulnerabilities
npm audit --omit=dev --audit-level=high         0 vulnerabilities
npm run typecheck                               pass
npm run storybook:build                         pass
npm run test:smoke                              pass
npx playwright test  (full e2e, 320/390/414)    64 passed, 0 failed, 68 skipped
python ../../docs/ux/scripts/validate_ux_tokens.py   0 failures; 114/114 required pairs, light + dark
python ../../docs/ux/scripts/validate_ux_docs.py     0 failures, 0 warnings
python ../../scripts/check_no_emoji.py               209 files scanned, clean
git diff --check                                clean
```

The 68 skips are intentional: functional assertions run once on `patient-390` rather than three
times, per the note at the top of `slice1.spec.ts`. Responsive and overflow assertions do run on all
three viewports.

## Evidence

`playwright/capture.spec.ts` is new. Review evidence was previously produced ad hoc, so a reviewer
could not tell whether two screenshots came from the same code, viewport or interaction. Evidence is
now a reproducible artifact of the repository:

```bash
CAPTURE=1 npx playwright test playwright/capture.spec.ts
```

It writes 36 full-page PNGs to `artifacts/final-review/{320,390,414}/` — twelve screens and states
per width, covering discovery, provider detail, comparison (default and selected), slot selection
(default and selected), request review, the three booking lifecycle states, and all five governed
price modes. It is gated behind `CAPTURE=1` so it does not run in, or slow, the normal suite.

`artifacts/` is gitignored; the evidence is local and CI-uploaded, not committed.

## Changes in this round

**Correctness**

- `PriceDisplay` — the range separator is a sibling flex item, so RTL layout order places it rather
  than bidi resolution. It travels in a no-wrap group with the lower amount so a wrap can never
  strand it alone. The range states its currency once (`40,000 – 80,000 ل.س.`); repeating it on both
  halves made the run too wide for a card's price cell, so it wrapped and left the dash abutting the
  neighbouring attribute tile. The row carries an accessible label announcing `من … إلى …`, because
  a bare dash does not say "to".
- `PriceDisplay` — `free` and `requires-plan` now use the same two-part anatomy as the other modes.
  `requires-plan` previously rendered as a bare `Helper` with no value line, so in a list it read as
  the caption of the row above it rather than as a price statement.
- `format.ts` — `formatDateTime` binds the middot to the date with a no-break space. With ordinary
  spaces it was its own wrap opportunity and stranded at line end, detached from both operands.
- `format.ts` — added `formatArabicCount`. Arabic counted nouns take different forms for 1, 2, 3–10
  and 11+, so a single "plural" string produced `19 ساعات` where Arabic requires `19 ساعة` — and
  intermittently, correct at 7 and wrong at 19. Applied to remaining-time, result counts and option
  counts.
- `ProviderDecisionCard` — the eligibility chip said `متاح للحجز` ("available for booking") while
  driven purely by the eligibility machine, which does not know whether the provider has a bookable
  time. On a provider with none, the card's loudest element contradicted its own appointment field.
  The chip now says `مؤهّل لهذه الخدمة` and speaks only about eligibility.
- `ProviderDecisionCard` — the availability advisory was gated behind `!isCompact`, so the results
  list stated exact appointment moments with no qualifier at any width. The advisory now travels
  with the value on the row variant.
- `ProviderResultsScreen` — the disabled compare button was labelled `اختر طبيبًا آخر`, an
  instruction to the user printed on a control that does nothing. It now names its own action; the
  precondition stays in the disabled reason.
- `BookingDetailScreen` — declining a proposed alternative closes the request. The copy said only
  that declining carries no penalty; it now states the outcome and the recovery path. No confirmation
  step was added: `IMPLEMENTATION_CONTRACTS.md` §27 explicitly prohibits "a second confirmation on
  decline", and §`IX-BOOKING-001` requires no-penalty framing.

**Accessibility and interaction**

- `SlotSelector` — date cards use a fixed two-up track. Previously `flexGrow: 1` plus a min width
  meant the selection icon grew the chosen card past the two-up threshold, so tapping a date
  reflowed the whole grid at 320 and every other date jumped under the patient's finger. Measured:
  all three cards changed position and width before; now one card shifts 2 px vertically.
- `SlotSelector` — dimming the whole disabled control also dimmed the unavailability reason, the
  only non-colour carrier of the disabled meaning. Measured 2.72:1. The surface and border now carry
  the dimming and the text stays at full strength: measured 6.90:1. A `minus-circle` icon was added
  so the state is not carried by tint alone.
- `SlotSelector` — a disabled day rendered two stacked reasons and announced the second one twice.
  One reason now, matching between the rendering and the accessible name. `لم يعد متاحًا` ("no longer
  available") became `غير متاح`, because the former asserts a history the system cannot know for a
  slot never offered to this patient.
- `SlotSelector` — the time chip is wrapped in `Bdi`, matching every other rendering of the same
  value in the codebase. `Bdi` was already imported and unused.
- `ActionBar` — inert controls use the governed `state.disabled.*` tokens instead of a blanket 0.45
  opacity. Washing a saturated primary fill out dropped its label to a measured 1.97:1 — less legible
  than the enabled secondary actions beside it, inverting the footer's own hierarchy. Now a measured
  2.40:1, matching the design system's own disabled pairing.
- `BookingReviewScreen` — the edit controls had `minHeight: target-floor` and no vertical padding, so
  height was purely line-box driven and measured 30 px at all three widths. These are the only way to
  correct a wrong date or doctor before submitting, so they now use `target-primary`: measured 46 px.
- `ProviderIdentity` — the avatar is top-aligned, so it anchors to the doctor's name rather than
  landing beside the clinic line. Initials use the opening of the given name: the previous rule took
  the first letter of each of the first two tokens, so "رنا الحلبي" yielded "را", whose second glyph
  is the alef of the definite article rather than any initial.

**Clarity**

- `SlotSelectionScreen` — the header carried the wayfinding clause and the commit boundary in one
  grey run-on that reached four lines at 320, putting the governed disclosure in the trailing clause
  of a paragraph that opened with navigation. The header now carries the disclosure alone, word for
  word; the wayfinding is stated next to the controls it describes. A duplicate section helper was
  removed, taking the same instruction from four restatements down to two distinct ones.
- `SlotSelectionScreen` — the pre-commit echo is the last thing read before Continue, and a tinted
  card carrying a bold date and time is the visual language of a booked slot. It now states
  `لم يُحجز بعد` inside the object making the claim. A separator was added between date and time,
  which previously ran together across a bare flex gap.

**Tests**

- The decorative-icon assertion is scoped to `#storybook-root`, is non-vacuous (it fails if a screen
  renders no icon at all), and now runs on the two screens that actually exercise the icon
  vocabulary rather than only on one that renders a single icon.
- A geometry-based regression guard pins the RTL order of the price range separator. It was verified
  to fail against the pre-fix component before the fix was restored — a guard that cannot fail is
  not a guard.

## Escalations — not resolved here, and blocking a genuine freeze

These came out of independent review, were confirmed against the canonical source, and are outside
`tools/patient-ui-preview/**`. They are design-system and product decisions, not preview bugs. The
preview is faithfully rendering what the governed tokens specify.

1. **`REQUESTED` is toned `warning`.** `docs/ux/03-system/design_tokens/semantic.state.json` maps
   `state/booking/REQUESTED` to `tone: warning`, `emphasis: subtle`. The screen contract says
   REQUESTED is routine waiting and must not read as a warning, and the screen's own copy says no
   action is needed. An amber pill contradicts both. Requires a token-owner decision.
2. **`ALTERNATIVE_PROPOSED` and `ELIGIBILITY_REVIEW` are indistinguishable by tone.** Both map to
   `warning` + `solid`. `REQUESTED` differs from `ALTERNATIVE_PROPOSED` only by emphasis, not hue —
   so the fastest glance channel does not separate "still waiting" from "the clinic moved your
   time", and a proposed alternative wears the same treatment as a genuine problem state.
3. **`StateSummary` in `hero` variant discards the resolved state colours** and always renders
   `surface.subtle`, so the largest block on all three lifecycle screens is identical regardless of
   state. Changing this interacts with (1) and (2) and should be decided with them.

Fixing any of these means editing the canonical token source, which governs 82 statuses across 18
machines product-wide. That is a governance change requiring design authority, not a closure-task
edit, and the previous checkpoint set the scope of this work at the preview only.

## Independent review status

Three independent adversarial reviews were commissioned this round, covering discovery and
comparison, scheduling and request review, and the booking lifecycle plus the price component. All
three returned FAIL. Their in-scope, source- or measurement-confirmed findings are addressed above.
Findings that contradicted the canonical contract were not applied, and are recorded with the
contract reference that governs them.

A fresh, independent final review of the corrected build is the remaining gate.

## Recommendation for the approver

CI (`.github/workflows/patient-ui-preview.yml`) runs `test:smoke` only. The `test:e2e` suite is what
caught the live baseline failure described above, and it is not in CI. Adding it would have caught
that defect at the point it was introduced. The previous checkpoint reserved workflow expansion for
an authorized task, so it was not done here — but it is the single highest-value follow-up.

## Freeze rule

Slice 1.6 is not frozen. It may be considered implementation-complete only once the three
escalations above have an owner decision and a fresh independent reviewer approves the corrected
build. Do not start Slice 2 under this closure task.

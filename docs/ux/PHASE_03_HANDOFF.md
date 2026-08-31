# UX Phase 3 Handoff — Design System to Widget and Screen Specifications

**From:** Phase 3 — Design System (Sessions 1–7)
**To:** Phase 4 — Widget and Screen Specifications
**Gate date:** 2026-08-31
**Gate owner:** Session 7 final senior architecture / product / design-system review
**Validator at this gate:** `python docs/ux/scripts/validate_ux_docs.py --phase 3`

---

## 1. Phase 3 status

**COMPLETE — final gate passed locally.** Every Phase 3 artifact exists at its canonical path, every
mandatory local gate is green, the component-token source regenerates with zero diff, and CI is
promoted to `--phase 3`.

Session 7 was a review session, not an authoring session. It re-measured the whole baseline
independently, audited the system against canonical product behavior, corrected the defects recorded
in section 23, extended the validator as recorded in section 21, and wrote this handoff. It allocated
no new `SCR-*`, `FLOW-*`, `WF-*`, `CMP-*`, `IX-*`, `TXT-*` or `A11Y-*`, and redesigned nothing.

One condition qualifies the word "complete" and is stated here rather than buried: `Q-PLATFORM-001`
still prevents any claim of complete reconciliation against readable authoritative SRS v1.1, and
`Q-PLATFORM-008` leaves the brand palette explicitly provisional. Neither invalidates the derivative
UX baseline that Phases 1 and 2 already had approved. See sections 15 and 23.

## 2. Authority baseline

Unchanged from `docs/ux/README.md` and reasserted here because Phase 4 inherits it whole.

1. Canonical engineering and product behavior: `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`,
   `docs/api/*`, `docs/database/*`, `docs/architecture/*`, `docs/ops/*`.
2. Product Owner decisions under `.spec/decisions/`, and the `.spec` functional and non-functional
   requirement set.
3. Phase 1 owns actors, jobs, information architecture, screen inventory and flows.
4. Phase 2 owns grey-box structure, hierarchy, priority order and interaction shape.
5. Phase 3 owns the design system: direction, tokens, components, interaction patterns, content
   rules, lifecycle status semantics, accessibility and right-to-left obligations.

The design kit at the repository root is a **method, not an authority**. Figma is derived. Framework
defaults are never proof. Where any of those and a canonical requirement disagree, the requirement
wins — which is why this system defines no button, input, select, modal, toast or navigation
component, and why `CMP-FINANCE-001` was deliberately **not** allocated.

## 3. Measured identifier baseline

Re-measured independently by Session 7 from the source documents, not copied from
`03-system/TRACEABILITY_AUDIT.md`.

| Family | Count | Measured from |
|---|---:|---|
| `SCR-*` | 165 | `01-foundation/INFORMATION_ARCHITECTURE.md` |
| `FLOW-*` | 103 | `01-foundation/USER_FLOWS.md` |
| `WF-*` | 165 | `02-wireframes/*` and `wireframe-manifest.json` |
| `CMP-*` allocated | 22 | `03-system/COMPONENT_INVENTORY*.md` headings |
| `IX-*` | 26 | `03-system/INTERACTION_PATTERNS*.md` headings |
| `TXT-*` | 60 | `03-system/CONTENT_GUIDE*.md` headings |
| `A11Y-*` | 40 | `03-system/ACCESSIBILITY.md` headings |
| `ERR-*` covered | 21 of 21 | `docs/api/ERROR_CATALOG.md`, canonical owner |
| Lifecycle machines | 18 | `design_tokens/semantic.state.json` and `CONTENT_GUIDE_STATES.md` |
| Lifecycle statuses | 82 | same, cross-checked row by row |
| `WGT-*` | 0 | Phase 4 has not started |

`CMP-*` measures 23 distinct identifiers across the Phase 3 corpus and **22 allocated components**.
The difference is `CMP-FINANCE-001`, a candidate the implementation plan raised and
`COMPONENT_INVENTORY.md` section 8 resolved as *not allocated* — its obligation lives inside every
component that renders an amount instead. It is a documented negative reference, not a component and
not a gap.

Two further cross-checks Session 7 ran, both exact:

- All 22 reach figures in the allocation registry match a fresh count from
  `WIREFRAME_COMPONENT_MAP.md`. Zero mismatches, zero components in the map absent from the registry.
- All 82 status triples in `CONTENT_GUIDE_STATES.md` match `design_tokens/semantic.state.json`
  exactly. Zero drift, zero statuses undocumented, zero documented statuses absent from the token
  source.

## 4. Platform baseline

| Platform | Runtime | Profile | `WF-*` |
|---|---|---|---:|
| Patient app | React Native, `/api/v1` | C — native, mobile-first | 47 |
| Clinic / Doctor | Filament panel | A — admin panel | 56 |
| Admin | Filament panel | A — admin panel | 62 |

Patient is Arabic-first and right-to-left, smartphone-first, and resilient to weak connectivity.
Clinic and Admin are desktop-first operational panels. **The three are not one interface at three
widths**, and Phase 1 forbids converging them. Density is a property of the archetype and profile,
never of the platform.

## 5. Artifacts produced

All under `docs/ux/03-system/`, all present at canonical lowercase paths and now asserted by the
validator:

| Artifact | Owns |
|---|---|
| `PHASE_03_IMPLEMENTATION_PLAN.md` | Session plan, scope boundaries, prohibitions |
| `DESIGN_DIRECTION.md` | The visual direction as rules, and the anti-slop check |
| `DESIGN_TOKENS.md` | Layer contract, palette corrections, the state channel, measured results |
| `design_tokens/*.json` | Nine token files, 935 leaf tokens, the machine-readable source |
| `COMPONENT_INVENTORY.md` | Allocation rule, the 22-component registry, states, coverage, rejections |
| `COMPONENT_INVENTORY_PLATFORM.md` | The 15 cross-cutting `CMP-PLATFORM-*` blocks |
| `COMPONENT_INVENTORY_DOMAIN.md` | The 7 domain `CMP-*` blocks |
| `WIREFRAME_COMPONENT_MAP.md` | One row per `WF-*`, all 165, bound to components |
| `INTERACTION_PATTERNS.md` | The 18 `IX-PLATFORM-*` patterns and the not-allocated table |
| `INTERACTION_PATTERNS_DOMAIN.md` | The 8 domain `IX-*` patterns |
| `CONTENT_GUIDE.md` | Voice, tone, the 21 `TXT-PLATFORM-*` rules, audience translation, prohibitions |
| `CONTENT_GUIDE_STATES.md` | 18 lifecycle families, 82 statuses, Arabic labels per audience |
| `CONTENT_GUIDE_ERRORS.md` | 21 `ERR-*` recovery families and the panel surface mapping |
| `ACCESSIBILITY.md` | The 40 `A11Y-*` obligations, data-state matrix, verification split |
| `TRACEABILITY_AUDIT.md` | Session 6 integration, traceability and mechanical audit |

Plus this handoff, at `docs/ux/PHASE_03_HANDOFF.md`.

## 6. Design direction summary

Ten rules, stated in `DESIGN_DIRECTION.md` section 3 and binding on Phase 4:

1. Evidence before decoration. Nothing exists to make a record *feel* reliable.
2. Neutrals carry the interface. The brand colour is the action colour and nothing else.
3. Status is never colour alone, on any platform, for any state.
4. Separation by hairline and surface, not by shadow.
5. Cards are a container of last resort.
6. No colour-tinted start-edge accent strips.
7. Type does the hierarchy work.
8. Density follows the archetype, not the platform.
9. A named prohibition list, including gradients as brand surface and computed composite scores.
10. Zero emoji, anywhere, in any form.

The direction is **derived**, anchored on the one documented UberTib visual decision — section 15.1
of the v2.1 UX reference — adopted with two measured accessibility corrections recorded in
`DESIGN_TOKENS.md` sections 2.1 and 2.2. That adoption is provisional pending `Q-PLATFORM-008`.

## 7. Token architecture summary

Three layers, one direction of reference, no cycles:

```
primitive   (primitive.color.json, primitive.space.json, primitive.type.json)
   -> semantic  (semantic.json, semantic.state.json, motion.json, density.json, breakpoints.json)
      -> component  (component.json, generated)
```

- 935 leaf tokens across nine files. Session 7 independently confirmed **zero alias cycles and zero
  unresolved references**.
- `component.json` is **generated** by `docs/ux/scripts/build_component_tokens.py` from the Token
  mapping blocks in the component inventory, so narrative and token source cannot drift. Session 7
  regenerated it: 22 groups, 199 concrete tokens, 8 tone-bound groups, **zero diff**.
- The state channel resolves every lifecycle status to a **triple** — tone, icon, emphasis — never to
  a colour alone. That is what makes a colour-only rendering structurally impossible rather than a
  rule 82 statuses have to remember.
- Contrast: 114 of 114 required pairs pass WCAG 2.2 AA in V1 light, and 114 of 114 in the retained
  dark compatibility override map. Three advisory pairs are reported and never failed.
- **No business value lives in a token.** Session 7 swept all nine files for pricing, catalog,
  clinical, grade, threshold, retention and deadline values and found none. Breakpoint thresholds are
  viewport measurements, not product policy.

## 8. `CMP-*` taxonomy summary

22 components: 15 cross-cutting `CMP-PLATFORM-*`, 7 domain. A pattern earned a component only when
all four allocation criteria held — two genuinely distinct contexts, the same anatomy, a documented
harm if got wrong, and a rule needing a structural home.

Eight components are composed of others rather than duplicating them, which is what keeps 22 from
behaving like 40. Three are deliberately **not** merged: `CMP-PLATFORM-009` (empty), `-010`
(recovery) and `-011` (submission) answer three different questions — nothing is here, we could not
tell you, your command has not landed. `COMPONENT_INVENTORY.md` records that merging them is the most
likely future simplification and that it would be wrong.

Session 7 reviewed all 22 for over- and under-generalization, screen-fragments masquerading as
components, semantic duplication, and business policy leaking into the design system. No merge, no
split and no reallocation was warranted.

## 9. `IX-*` taxonomy summary

26 patterns: 18 `IX-PLATFORM-*` cross-cutting, 8 domain. Session 7 verified the confusable set is
genuinely distinct rather than nominally distinct:

| Pattern | Owns, and only this |
|---|---|
| `IX-PLATFORM-001` | The commit contract: submitting is not submitted, read authoritative state back |
| `IX-PLATFORM-002` | Key reuse on retry: one intent, one key, zero duplicates |
| `IX-PLATFORM-003` | Refresh and staleness disclosure; stale-and-labelled beats blank |
| `IX-PLATFORM-004` | The write path's unknown outcome: reconcile, offer no new command |
| `IX-PLATFORM-006` | Resumable evidence transfer, and its two structurally separate exits |
| `IX-PLATFORM-007` | Authorization loss and permission denial as one server truth at two moments |
| `IX-PLATFORM-014` | Search and filter, with persistence required inside it, not beside it |
| `IX-PLATFORM-017` | The read path's structural-state precedence, fixed once for all 165 surfaces |
| `IX-PLATFORM-018` | Field-bound validation and correction |

`INTERACTION_PATTERNS.md` section 3 carries a **not-allocated table** giving the reason each rejected
candidate belongs inside an existing pattern rather than beside it — filter persistence, weak
network, stale data, destructive confirmation, permission denial, bulk operations, optimistic UI and
others. No repeated behavior is unowned and no pattern duplicates another.

## 10. `TXT-*` and content-system summary

60 families across three files: 21 `TXT-PLATFORM-*` cross-cutting rules, 18 `TXT-STATE-*` lifecycle
families, 21 `TXT-ERR-*` recovery families.

- Arabic-first Patient voice, modern standard Arabic, undiacritized, no dialect, Arabic comma and
  question mark, no terminal punctuation on labels.
- **The canonical Arabic `ERR-*` message is never restated.** `docs/api/ERROR_CATALOG.md` owns it;
  Phase 3 owns what the user does next. Session 7 checked all 21 quoted Arabic strings against the
  catalog: **21 of 21 verbatim, zero forked, zero invented.**
- `TXT-PLATFORM-018` is the prohibitions master list — 16 numbered rules covering internal-symbol
  leakage, market-average pricing language, implied money custody, guaranteed protection, unlabelled
  treatment amounts, punitive booking-closure wording, accusatory review wording, transfer failure
  read as rejection, implied authorization override, unsupported superiority claims, computed
  composite scores, tone-only irreversibility, leaked technical detail, emoji, and colour-alone
  communication.
- `TXT-PLATFORM-017` is the audience translation table: every canonical glossary term mapped to a
  Patient, Clinic and Admin rendering, with a structural-absence rule where the column says the term
  never appears.
- Two `TXT-ERR-*` families carry **no escalation route**, and that absence is stated rather than
  papered over with an invented one.

## 11. Lifecycle and status-system summary

18 machines, 82 statuses. Sixteen machines carry full transition tables in
`docs/domain/STATE_MACHINES.md`; onboarding application and staff invitation come from
`docs/domain/STAFF_INTERACTION_CONTRACTS.md`.

Session 7 verified there are **zero within-machine triple collisions** — no two statuses in one
machine share the same tone, icon and emphasis — and confirmed every high-risk pair is distinct in
more than one channel:

| Pair | Distinguished by |
|---|---|
| `PENDING_EVALUATION` / `NOT_ELIGIBLE` | Different tone and different icon; never the grade `F` |
| `FAILED_RETRYABLE` / `REJECTED` | Different tone and icon; reachable only from different paths |
| `UPLOADED` / `ACCEPTED` | Different tone and icon; uploaded is still quarantined |
| `UNDER_REVIEW` / `REJECTED` | Different tone and icon; review stays neutral |
| `SUSPENDED` / `REVOKED` | Different icon and emphasis within a shared tone |
| `CANCELLED` / `EXPIRED` | Different icon, emphasis and label within a shared tone |
| `COMPLETED` / `ACCEPTED` | Different icon within a shared tone |

Two lifecycle states may share a tone. They never collapse into one semantic meaning. `escalated` and
`overdue` are **flags in separate slots**, never statuses and never a recolouring of the status chip.

## 12. Accessibility and right-to-left summary

40 `A11Y-*` obligations, every one carrying the same fourteen fields, all unique, all referencing a
carrier component and pattern that resolves.

- Target is **WCAG 2.2 AA** from `NFR-PLATFORM-005`. Adopted AAA criteria are identified as such.
- **No conformance claim is made anywhere**, and Phase 4 must not introduce one. Conformance is
  measured against a running interface; there is no running interface at Phase 3.
- A four-category framework responsibility matrix. `"Filament handles accessibility"` and
  `"React Native handles accessibility"` are each treated as true only for a specific named slice.
- 200 percent resize (`A11Y-PLATFORM-019`) and reflow at the WCAG zoom target
  (`A11Y-PLATFORM-020`) stay distinct obligations, as do the Patient reading column
  (`-035`) and the operational panel (`-036`).
- Disabled, unavailable and hidden are three different accessibility-tree outcomes
  (`A11Y-PLATFORM-016`). Disabled is narrow and is never an authorization control.
- Profile C emits **no hover state**, ever.
- Profile A keyboard operability is first-class, including no focus obscured by sticky chrome.
- Right-to-left: visual mirroring and content direction are separate concepts
  (`A11Y-PLATFORM-032`). Machine identifiers, amounts with currency, dates, times, durations,
  phone numbers, service and procedure codes, IDs, content hashes, emails, URLs, Latin names and
  version identifiers are bidirectionally isolated. Directional icons mirror; status icons do not.
  Screen-reader spoken order is treated separately from visual order (`A11Y-PLATFORM-030`).
- The announcement policy (`A11Y-PLATFORM-011`) exists specifically to prevent announcement spam;
  focus movement is intentional and specified per trigger, not global.

## 13. Data-state system summary

Nine data states — loading-initial, loading-refresh, empty-no-data, empty-filtered, partial, stale,
error-fetch, error-permission, success — with a **fixed precedence** in `IX-PLATFORM-017` and a
per-state accessibility matrix in `ACCESSIBILITY.md` section 16.

Phase 3 fixed the precedence so Phase 4 inherits the decision instead of making it 165 times.
`error-permission` wins over everything; a permission failure must never read as a quiet empty queue.
A partial read is never presented as complete.

## 14. Traceability summary

- All 165 `SCR-*` have a wireframe. All 165 `WF-*` are bound to components in
  `WIREFRAME_COMPONENT_MAP.md`.
- Every `CMP-*` is used on at least four wireframes; none is used nowhere; no wireframe references an
  undefined component. Both directions of the mechanical check close.
- Every `IX-*` names at least one `CMP-*` and one `FLOW-*`. Every one of the 22 components is named
  by at least one pattern.
- All 21 `ERR-*` have user-facing recovery copy.
- Zero dangling `A11Y-*`, `IX-*` or `TXT-*` references anywhere under `docs/ux/`; zero duplicate
  definitions in any family. Now enforced permanently — see section 21.
- Coverage is claimed over **archetypes and regions, not screens**. `COMPONENT_INVENTORY.md`
  section 6 states this limitation explicitly and Phase 4 must preserve it: the table shows no
  archetype has a structural region with nothing to render it. It does **not** show that every
  screen's specific needs are met. That cannot be established until Phase 4 places widgets.

## 15. Unresolved `Q-*` dependencies

Seven open, re-verified against `docs/README.md`, `docs/SDD.md` and
`01-foundation/UPSTREAM_GAPS.md`. None blocks Phase 4 from starting; each constrains a specific
claim.

| ID | Severity | Classification | Effect on Phase 4 |
|---|---|---|---|
| `Q-PLATFORM-001` | Blocker | Production-only / source-availability | Limits completeness claims against readable SRS v1.1. Does not invalidate the approved derivative UX baseline. |
| `Q-CATALOG-001` | Major | **Clinical dependency** | Phase 4 may spec catalog surfaces. Production medical content still requires licensed clinical approval. **Must not be closed here.** |
| `Q-ELIG-001` | Major | **Clinical dependency** | Phase 4 may spec eligibility surfaces. Production S/H/I formulas, weights, thresholds, grade bands and calibration thresholds require licensed clinical approval. **Must not be closed here.** |
| `Q-PLATFORM-002` | Major | **Legal dependency** | Final retention and deletion periods require legal and compliance validation. |
| `Q-OPS-001` | Major | **Infrastructure dependency** | Hosting, topology, and the OTP/MFA, malware-scanning, private-evidence and notification vendors. **Must not be closed by selecting a vendor in a UX phase.** |
| `Q-PLATFORM-004` | Minor | Production-only | Expected launch load versus engineering headroom. |
| `Q-PLATFORM-008` | Minor | **Visual-brand ratification** | The palette is explicitly provisional. The token architecture is stable and ratification changes only the primitive colour layer. Phase 4 must keep referencing semantic tokens so this stays a one-layer change. |

`Q-PLATFORM-003` is **Resolved** for the provider-neutral evidence-transfer interaction contract by
`PO-UX-17`; concrete vendor selection is `Q-OPS-001`. Session 7 synchronized nine stale canonical
statements that still read it as an active provider-selection dependency — see section 23.

No product behavior was invented to close any remaining question.

## 16. Phase 4 inputs

Phase 4 reads, in this order, and treats each as settled:

1. `PHASE_01_HANDOFF.md`, `PHASE_02_HANDOFF.md`, and this file.
2. `01-foundation/INFORMATION_ARCHITECTURE.md` for the screen inventory and per-screen lifecycle
   statuses.
3. `02-wireframes/*` and `wireframe-manifest.json` for structure and priority order.
4. `03-system/DESIGN_TOKENS.md` and `design_tokens/*.json` for every value.
5. `03-system/COMPONENT_INVENTORY*.md` for anatomy, variants, states and realization per profile.
6. `03-system/WIREFRAME_COMPONENT_MAP.md` for the per-wireframe component binding it inherits.
7. `03-system/INTERACTION_PATTERNS*.md` for sequences, focus and keyboard behavior.
8. `03-system/CONTENT_GUIDE*.md` for voice, status labels and error recovery.
9. `03-system/ACCESSIBILITY.md` for the obligations it must bind to each widget and screen.
10. `03-system/TRACEABILITY_AUDIT.md` for what was already measured, and what was not.

## 17. Phase 4 must not re-decide

Phase 4 owns screen and widget specification. It does **not** own product architecture. The following
are settled, and a needed change is an open question raised against the canonical owner, never a
Phase 4 edit:

- information architecture and navigation, on all three platforms;
- the `SCR-*` inventory and the `FLOW-*` inventory;
- `WF-*` structure, region vocabulary, archetypes and priority order;
- the `CMP-*` taxonomy and the allocation rule that produced it;
- the `IX-*` taxonomy and the not-allocated decisions behind it;
- the token layer architecture and the state channel's triple;
- the Arabic content rules, the prohibitions master list and the audience translation table;
- lifecycle machine meanings, status labels and `ERR-*` semantics;
- the `A11Y-*` architecture and the framework responsibility matrix;
- hiding of internal `S`, `P`, `H`, `I`, calibration mechanics, risk codes and professional
  procedure-classification vocabulary from Patient surfaces;
- the structural separation of retryable transfer failure from authoritative rejection;
- eligibility fail-closed behavior, with no UI override designed at any role;
- guardian authorization revocation remaining reachable regardless of booking state, and a guardian
  never self-authorizing a legal-basis grant;
- reschedule proposal semantics — the original confirmed appointment is authoritative until
  acceptance and revalidation;
- immutability of accepted treatment and financial history, and amendment by new version only;
- the governed configuration and versioning model, including published and historical inspectability;
- the zero-direct-money-movement boundary;
- light-only V1 theme scope.

## 18. Phase 4 allowed responsibilities

Phase 4 may:

- allocate `WGT-*` where a widget genuinely requires its own identifier;
- define per-screen widget composition and per-screen responsive behavior;
- specify the exact component variant each surface uses;
- bind final `TXT-*` usage to surfaces, and place per-screen strings;
- bind `A11Y-*` obligations to individual widget and screen specifications;
- define implementation-facing widget behavior within the `IX-*` sequences;
- specify screen-specific loading, empty and error arrangements within the
  `IX-PLATFORM-017` precedence;
- specify Filament versus native realizations at widget and screen level, within the profile
  vocabulary the component inventory already fixes;
- write screen and widget acceptance criteria.

Phase 4 may not alter Phase 3 system semantics to make a screen easier to specify.

## 19. Phase 5-only rendered QA obligations

`ACCESSIBILITY.md` section 20 lists these obligation by obligation. Neither Phase 3 nor Phase 4 may
report them as satisfied, and no green mechanical gate implies them:

- actual keyboard focus order, focus trap behavior and return-focus correctness on every surface;
- actual screen-reader announcement correctness and composition, including live-region timing, and
  VoiceOver and TalkBack behavior specifically as distinct from generic ARIA correctness;
- rendered target size in real viewport measurements, once the hit area is counted;
- real computed contrast on rendered text, as distinct from the token-pair contrast already verified;
- forced-colours and high-contrast survival on Profile A;
- text scaling, reflow and text-spacing survival on a real device and browser, including the
  dual-script metric claim `DESIGN_TOKENS.md` section 4.2 already flags as unmeasured;
- reduced-motion behavior actually branching;
- whether `restricted` and `neutral`, deliberately close by design, are genuinely distinguishable to
  a real reader;
- bidi isolation's actual spoken pronunciation order;
- the data-state matrix's announcement and focus claims on real transitions;
- real accessibility-tree behavior for the disabled, unavailable and hidden distinction.

## 20. Dark-mode scope

**Dark mode is not V1 shipping scope.** Patient, Clinic and Admin are all light-only in V1, because
no canonical UberTib requirement requests dark mode.

The dark semantic override map is **retained and verified as future compatibility only**. It measures
114 of 114 required pairs passing, the same set as light. That measurement does not mean dark mode
ships. Phase 4 must not expose a dark-mode toggle, must not treat Filament's dark theme capability as
product scope, and must not remove the compatibility map either — a semantic colour without a dark
value would make a later decision an unverified accident rather than a token edit.

## 21. Validation results

Every mandatory local gate, run after all Session 7 changes. Exact output is recorded in the Session 7
report; the summary lines are:

| Gate | Result |
|---|---|
| `python docs/scripts/validate_docs.py` | 0 failures, 0 warnings |
| `python docs/ux/scripts/validate_ux_docs.py --phase 1` | 0 failures, 0 warnings |
| `python docs/ux/scripts/validate_ux_docs.py --phase 2` | 0 failures, 0 warnings |
| `python docs/ux/scripts/validate_ux_docs.py --phase 3` | 0 failures, 0 warnings |
| `python docs/ux/scripts/validate_ux_tokens.py` | 0 failures; 114/114 light, 114/114 dark map |
| `python scripts/check_no_emoji.py` | no emoji in 208 files scanned |
| `python docs/ux/scripts/build_component_tokens.py` | 22 groups, 199 tokens; **zero diff** |
| Tracked `Docs/` paths | 0 |

**Validator extension — added.** Session 7 extended the Phase 3 gate with three checks, all
referential or structural, none quantity-based:

1. **Required Phase 3 artifacts exist at canonical lowercase paths.** Every other Phase 3 check is
   conditional on content being *found*, so a deleted or mis-cased artifact left the gate green.
   Session 7 found exactly that defect.
2. **One obligation, one definition** for `A11Y-*`, `TXT-*`, `IX-*` and `CMP-*`. A duplicated heading
   silently forks a rule into two sources of truth.
3. **Every `A11Y-*`, `IX-*` and `TXT-*` reference under `docs/ux/` resolves to a definition.** This
   extends the pattern the validator already applied to components-in-wireframes and errors-in-content
   to the three families that had none. `CMP-*` is exempt from this direction because
   `COMPONENT_INVENTORY.md` section 8 deliberately names rejected candidates, and the existing
   wireframe-direction check already covers the binding that matters.

Each was negative-tested — a deliberately injected duplicate and injected dangling references were
confirmed to fail the gate before being reverted. **No count was hardcoded.** 22, 26, 40, 60 and 82
are current measurements of append-only families, not canonical invariants, and enforcing them would
turn ordinary growth into a red build.

## 22. CI gate result

`.github/workflows/docs-validation.yml` was promoted from `--phase 2` to `--phase 3`, with the
display labels and the report issue body updated from "UX Phase 2" to "UX Phase 3". No gate was
weakened and the engineering documentation validator was not removed.

The workflow's `docs/**` path trigger is now genuinely correct for the whole UX chain, which it was
not while two files were tracked under `Docs/`.

**Remote CI result:** see the Session 7 report. Where the executing environment cannot inspect
GitHub Actions, that is stated explicitly rather than assumed green.

## 23. Known limitations

Stated so Phase 4 does not inherit them as settled facts.

1. **`Q-PLATFORM-001` limits completeness claims.** The approved derivative UX baseline stands; a
   claim of complete SRS v1.1 reconciliation does not.
2. **`Q-PLATFORM-008` leaves the palette provisional.** Ratification or replacement changes the
   primitive colour layer only, provided Phase 4 keeps referencing semantic tokens.
3. **Coverage is over archetypes and regions, not screens.** Phase 4 is where per-screen sufficiency
   is established.
4. **No conformance claim, accessibility or otherwise.** The token gate proves token-level
   correctness; it does not prove a rendered screen is accessible.
5. **No user research exists.** Accepted as a research limitation by `PO-UX-18`, not a blocker.
   Usability testing remains recommended, not prerequisite.
6. **The dual-script type metric claim is unmeasured** until a rendered device pass.
7. **Six files were tracked under a capital `Docs/` prefix.** Session 6's path-case measurement was
   falsified by its own commit, and Session 7's first re-measurement was itself incomplete: `git
   ls-files` escapes non-ASCII paths under the default `core.quotepath=true`, hiding four Arabic-named
   source PDFs from any `^Docs/` pattern. The true set was the Session 6 audit artifact, the SRS PDF,
   and four Arabic-named source PDFs. All six resolved locally only because the working filesystem is
   case-insensitive, and all six would have been absent from `docs/**` on a case-sensitive CI checkout
   — taking the audit artifact outside the validator glob and outside the workflow's own path trigger.
   All six index paths were corrected by rename via `git update-index --cacheinfo`, which is the only
   instrument that writes the literal path while HEAD still holds the capital form. Every blob hash is
   unchanged; no file was added or lost. `TRACEABILITY_AUDIT.md` section 14 records all three traps.
   **Phase 4 must audit path case with `core.quotepath=false` and against `git archive` output, never
   against the working directory** — on a case-insensitive filesystem the working directory cannot show
   this class of defect at all.
8. **Nine stale canonical statements were synchronized.** `docs/SDD.md` (four, including its open-items
   register), `docs/diagrams/SEQUENCE_DIAGRAMS.md` (two), `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`
   (two) and `docs/domain/PERMISSIONS_MATRIX.md` (one) still read `Q-PLATFORM-003` as an active
   provider-selection dependency, in two cases contradicting the same file's own register. The
   contract was not redesigned; only the status wording was aligned to `PO-UX-17`.
9. **One drafting artifact was removed** from `CONTENT_GUIDE.md`, where a visible in-prose
   self-correction had been left in a canonical rule.

## 24. Stop

**Phase 3 is complete. Phase 4 has not been started.**

No `WGT-*` is allocated. No `04-specs/` or `05-build/` directory exists. No widget specification,
screen specification, build manifest or implementation contract has been written. No React Native
component, Filament component, page or resource, Laravel application code, API contract, database
schema or migration was created or modified by any Phase 3 session.

Phase 4 begins only on explicit approval.

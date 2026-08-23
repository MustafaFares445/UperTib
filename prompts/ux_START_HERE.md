# START HERE — Running the Docs → Design → Build Pipeline

Read this before opening any other file. It is the map: what exists, what order it runs in, what each gate decides, and what never bends.

---

## 1. What this system is

A chain of prompts that turns a project description into implementation-ready documentation, then into design documentation, then into a Figma build manifest and per-widget contracts a coding agent can work from.

It is built around one idea: **each stage produces evidence the next stage consumes, and nothing downstream invents what should have been decided upstream.** Agents are fluent enough to produce a confident-looking design for a product nobody specified. The gates exist to make that impossible.

---

## 2. The file set

| Order | File | Produces |
|---|---|---|
| 1 | `ai_project_docs_generation_prompt_v4.md` | `docs/` — the engineering truth |
| — | `ux_00_conventions.md` | *no output — the shared kernel, pasted before every UX phase* |
| 2 | `ux_01_discovery_ia_flows.md` | `docs/ux/01-foundation/` |
| 3 | `ux_02_wireframes.md` | `docs/ux/02-wireframes/` |
| 4 | `ux_03_design_system.md` | `docs/ux/03-system/` |
| 5 | `ux_04_widget_screen_specs.md` | `docs/ux/04-specs/` |
| 6 | `ux_05_build_handoff.md` | `docs/ux/05-build/` |

**Delete these — they are superseded and running one will produce the wrong sequence:**
`ai_project_docs_generation_prompt_v3.md` · `ai_uiux_docs_generation_prompt_v1.md` · `ai_uiux_docs_generation_prompt_v2.md`

Optional: [ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) installed via `npx ux-ui-agent-skills init`. The chain uses its tokens, component format, and gates when present, and degrades cleanly when absent.

---

## 3. Before session 1 — readiness

Have these ready. Missing items don't block the run, but each one you skip becomes an open question you'll answer later at higher cost.

- [ ] **Project description** — the fuller the better; this is the highest-leverage input in the whole chain
- [ ] **Authoritative sources named and ranked** — "the signed proposal is final; the July notes supersede the SRS on billing"
- [ ] **Target platform, stated once** — `Filament dashboard — Laravel 11, Filament 3` / `Web app — React 19 + Tailwind v4` / `Native app — SwiftUI 6`. This is Profile A / B / C and it propagates through every phase.
- [ ] **Repository path** if one exists
- [ ] **Accessibility target** — e.g. WCAG 2.2 AA
- [ ] **Audience and context of use** — "warehouse staff on shared tablets, gloved hands" changes density, target size, and confirmation friction more than any other single input
- [ ] **Design sources** — Figma, design system, brand guidelines, or an explicit "none"
- [ ] **Research inputs** — interviews, analytics, support tickets, or an explicit "none"

**Engineering docs the UX chain depends on.** These are conditional in the master prompt, but if the product has a UI and they're omitted, later checks pass on empty sets and the gap surfaces in build instead: `PERMISSIONS_MATRIX.md` (role sweep), `STATE_MACHINES.md` (lifecycle sweep), `ERROR_CATALOG.md` (every error needs copy), `API_CONTRACTS.md` (widget data contracts), `ERD.md` (realistic content). Ask for them explicitly in stage 1.

---

## 4. Run order

One phase per session. Each session runs several responses and ends at a gate.

| # | Session | Paste | Gate question | Rough effort |
|---|---|---|---|---|
| 1 | Engineering docs | `v4` + inputs | Are these the right requirements? | 1–3 sessions |
| 2 | Discovery, IA, flows | `00` + `01` | Is this the right structure and set of journeys? | 1–2 |
| 3 | Wireframes | `00` + `02` | Are the right things on each screen, in the right priority? | 1–3 |
| 4 | Design system | `00` + `03` | Is this the right visual and interaction language? | 1–2 |
| 5 | Widget & screen specs | `00` + `04` | Is every behavior fully specified? | 2–4 |
| 6 | Build & handoff | `00` + `05` | Is this ready to draw and build? | 1 |

Then: run the Figma agent on `BUILD_MANIFEST.json`, and hand `IMPLEMENTATION_CONTRACTS.md` to the coding agent in build order.

**Where things run:** stages 1–6 in Claude Code with the design kit installed. Figma via an agent or plugin consuming the manifest. Implementation in Codex from the contracts. Codex does not read the kit and does not read Figma for behavior.

---

## 5. Session bootstrap prompt

Paste this at the **start of every session**, before the phase file. It stops the most common failure: an agent doing phase-4 work in a phase-2 session because the request sounded like it wanted widgets.

```text
You are joining an in-progress documentation pipeline. Before doing any work:

1. Inventory what exists. List every file under docs/ and docs/ux/ with its size.
2. Read docs/ux/README.md and the highest-numbered PHASE_0N_HANDOFF.md.
3. Run: python3 docs/ux/scripts/validate_ux_docs.py --phase <N of the last completed
   phase>   — and paste the real output. If the script does not exist yet, say so.
4. Report back, and then STOP:
   - Which phase is complete, which is next
   - Platform profile and input mode in force
   - Open Blockers carried forward, by ID and severity
   - What the last handoff says must NOT be re-decided
   - What you are about to do in this session, in one sentence
5. Wait for my confirmation before producing anything.

Rules for this session:
- Work only within the phase I name. If the work needs something an earlier phase
  owns, stop and tell me which phase and what is missing. Do not fill the gap.
- One file per response. Never truncate, abbreviate, or write "the rest follow the
  same pattern." If a file will not fit, end with --- CONTINUED --- and resume.
- Never invent product behavior. Gaps become Q-* with a severity, not decisions.
- IDs are append-only. Never renumber, reuse, or repurpose an existing ID.
- End the session with the verification report and the handoff block.
```

For **session 1** replace steps 1–3 with: *"No pipeline exists yet. Confirm you have read the master prompt and list what you need from me before starting Phase 0."*

---

## 6. Binding rules that resolve overlaps

These settle real ambiguities in the file set. Treat them as part of the prompts.

**Screens.** In **New Project Mode**, the master prompt omits `SCREEN_INVENTORY.md` and the chain's Phase 1 derives screens in Docs-Partial mode. In **Existing Repository Mode**, the master prompt inventories the real screens as evidence and Phase 1 inherits them in Docs-Complete mode. Never both — the chain's validator reads screens from either file, and two sources means duplicate IDs.

**Flows and navigation** are always the chain's. The master prompt names journeys in the PRD and stops.

**ID registry.** `docs/README.md` holds the single registry of highest-allocated number per prefix per domain. Every chain handoff appends its allocations to it. Skipping this is how the second run collides with the first.

**Two validators, two scopes.** `docs/scripts/validate_docs.py` owns the engineering docs — run it at the end of stage 1 and again whenever requirements change. `docs/ux/scripts/validate_ux_docs.py` owns `docs/ux/` — run it at every chain gate with the current phase number. Don't read the first one's output as a verdict on design work.

**Figma is derived.** It is generated from the manifest, so it is authoritative over nothing. A human edit made in Figma is back-ported into the docs or lost at the next regeneration. Say this out loud to whoever opens the file.

---

## 7. New project vs. existing repository

| | New project | Existing repository |
|---|---|---|
| Master prompt mode | New Project | Existing Repository |
| `SCREEN_INVENTORY.md` | omitted | produced from real routes and resources |
| Chain input mode | Docs-Partial | Docs-Complete or Existing-UI |
| Phase 1 | derives screens | inventories, then classifies Existing / Change / New |
| Phase 2 | wireframes everything | wireframes only what changes; existing screens documented as-is |
| Phase 3 | proposes tokens `(Proposed)` | extracts the de-facto system; deviations need justification |
| Paths | all `(Proposed)` | real paths, verified commands |

In Profile A with an existing panel, the framework's resource, form, and table definitions *are* the screen and field inventory. Read them. Re-deriving screens from requirements when the code already answers the question wastes a session and produces a worse answer.

---

## 8. The light path

Six gates is right for a product a team will maintain for years. It is too much for a five-screen internal tool. For something small, merge:

- **Stages 2 + 3** into one session — IA, flows, and wireframes together, with a single gate. Keep the fidelity rule: still grey-box, still no colour.
- **Stages 4 + 5** into one session if you're adopting an existing design system rather than building one, since Phase 3 is then mostly a mapping exercise.

Never merge stage 1 into anything, and never skip stage 6's full-chain verification. Those are the two that catch the expensive mistakes.

What you lose by merging: the separate review conversation. A stakeholder looking at IA and wireframes together will talk about the wireframes and nod at the IA. That's an acceptable trade at small scale and a bad one at large scale.

---

## 9. Rules that never bend

1. **No invented product behavior.** Gaps are `Q-*` with a severity, never quiet decisions.
2. **One file per response, never truncated.** Abbreviated output looks complete and isn't; the gap surfaces in implementation.
3. **IDs are append-only**, across phases and across runs.
4. **Wireframes carry no colour, type, or brand.** Specs carry no raw values — tokens only, primitives excepted.
5. **Every gate is a stop.** The agent reports and waits.
6. **Verification means evidence.** Counts and named failures, or the check didn't happen.
7. **Blockers stop work on what they block** — they don't get worked around.

---

## 10. Failure modes worth watching for

**Silent thinning.** The most common failure. Output stays fluent while coverage drops — nine data states become "states: standard set," twenty widgets become twelve plus "similar patterns apply." The validator catches the mechanical cases; for the rest, check that counts in the verification report match what you actually see in the files.

**Phase bleed.** Phase 2 specifying component variants, Phase 4 redrawing layout. The handoff's "must NOT re-decide" list is the defense; read it when reviewing.

**Vacuous passes.** A check over an empty set passes. If a verification report shows `n/N` where N is suspiciously small, the input was missing, not clean.

**The plausible default.** Where the sources are silent on environment or expertise, the assumed user is a trained expert at a desk on a large monitor. That assumption is wrong more often than not and it silently sets density, target size, and confirmation friction. Phase 1 should be raising `Q-*` here, not filling it in.

**Framework fights.** In Profile A, a spec that would require overriding framework internals. The cost is real and belongs in a decision, not a spec.

---

## 11. Changing something later

The chain is only as trustworthy as its last full pass.

- Change a **requirement** → re-run stage 1's validator, then every chain phase's verification, in order. Use the master prompt's Update Mode: append-only IDs, deprecate rather than delete.
- Change a **flow or screen** → re-run from Phase 1, but only for what it touches; leave untouched files alone.
- Change a **token or component** → Phase 3 onward.
- Change a **widget** → Phase 4 onward, then regenerate the manifest and its contract.

Always finish with `--phase 5`. A partial re-run that ends green on phase 3 tells you nothing about phase 5.

---

## 12. First message of session 1

```text
[paste ai_project_docs_generation_prompt_v4.md]

PROJECT DESCRIPTION: …
REPOSITORY: …
FIXED STACK CONSTRAINTS: …
DESIGN SOURCES: …
AUTHORITATIVE SOURCES (highest first): …
SCALE / OPERATIONAL CONSTRAINTS: …
PRIORITIES FOR THIS RUN: …
MODE OVERRIDE: …

This is a new project with a UI. Skip SCREEN_INVENTORY.md and name journeys in the
PRD without expanding them — the UX chain owns screens and flows.

Produce PERMISSIONS_MATRIX.md, STATE_MACHINES.md, ERROR_CATALOG.md, API_CONTRACTS.md,
and ERD.md wherever they apply; the design chain depends on all five.

Start with Phase 0 and stop at the gate.
```

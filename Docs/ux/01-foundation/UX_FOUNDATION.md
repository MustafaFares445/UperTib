# UberTib UX Foundation

**Phase:** UX 1 — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25
**Input mode:** Docs-Partial (behavioral engineering docs complete; no screen inventory to inherit)
**Platform profiles:** Patient = C · Clinic/Doctor = A · Admin = A
**Accessibility target:** WCAG 2.2 AA — sourced from `NFR-PLATFORM-005`, not chosen by this chain
**Authority:** engineering docs are canonical for behavior; this chain is canonical for structure and experience

## 1. Purpose and Boundary

This document establishes the human model of UberTib: who acts in it, what they are trying to accomplish, what they encounter, and the constraints every downstream phase must respect.

It contains no visual design, no layout, no components, and no copy. Those belong to UX Phases 2, 3 and 4.

Everything here is derived from evidence. Where the sources establish no trait, no trait is asserted.

### 1.1 Source authority used by this file

| Priority | Source | Used for |
|---|---|---|
| 1 | `.spec/decisions/PO-2026-08-23-confirmed-defaults.md`, `.spec/decisions/PO-2026-08-25-ux-gap-resolution.md` | Confirmed product decisions, including clinic onboarding, doctor comparison, staff contract model, three-platform scope |
| 2 | `Docs/UberTib_SRS_Etkan_v1.1.pdf` | Authoritative SRS — not machine-readable, see `Q-PLATFORM-001` |
| 3 | Approved `.spec/` requirements and traceability | Requirement identity and acceptance criteria |
| 4 | `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`, `docs/diagrams/*` | Behavior, lifecycle, authorization, contracts, data |
| 5 | Verified `UberTip-Backend/` behavior | Implementation evidence |
| 6 | `docs/implementation/*`, `CLAUDE_UI_UX_HANDOFF.md` | Functional ownership and platform runtime |
| 7 | Clearly labelled design inference | Structure and presentation only |

### 1.2 What this phase is allowed to decide

Structure, grouping, navigation position, task sequence, and prominence are design decisions and are made here.

Product behavior is not. Any behavioral gap becomes a `GAP-*` in `UPSTREAM_GAPS.md` raised as a `Q-*` or `CONFLICT-*`. The four gaps raised at the Phase 1 inventory gate — staff-facing data contracts, clinic onboarding, doctor comparison, and run scope — are resolved product behavior under `PO-2026-08-25` and are implemented here as confirmed, not questioned.

## 2. Actors and Working Personas

Derived from `docs/domain/PERMISSIONS_MATRIX.md` section 4 (20-row actor catalog), reconciled against `docs/PRD.md` section 3 and the three implementation plans' actor models.

These are evidence-based working personas. There are no names, no biographies, and no invented characteristics.

**Environment and expertise are undocumented for every actor.** No research inputs exist for this product — no interviews, no analytics, no support tickets. Rather than assume the statistically common default of a trained expert at a desk on a large monitor, this is raised as `Q-PLATFORM-006` (Major). What the sources *do* establish is context of use: Aleppo only, Arabic-first, right-to-left, weak and intermittent connectivity, low thousands of users.

### 2.1 Patient platform actors

### ACTOR — Public visitor
**Source:** `PERMISSIONS_MATRIX` section 4, section 5; `FR-CATALOG-001`, `FR-ELIG-001`
**Platform:** Patient app (Profile C), unauthenticated
**Accountable for:** nothing. Evaluating whether UberTib can help before committing identity.
**Primary jobs:** JTBD-CATALOG-001, JTBD-ELIG-001, JTBD-ELIG-002, JTBD-ELIG-003
**Frequency of use:** rarely — a pre-account state, not a recurring role
**Environment:** undocumented (`Q-PLATFORM-006`). Established: mobile, Arabic-first, RTL, weak connectivity.
**Expertise:** first-time. No product knowledge can be assumed.
**Consequence of error:** abandonment before account creation. No authoritative state can be damaged — every action available is read-only.
**Hard constraint:** may read only explicitly public audience-safe catalog and eligible-provider discovery data. Never internal risk `I`, never private evidence.

### ACTOR — Patient
**Source:** `PERMISSIONS_MATRIX` sections 6, 9–13; `FR-IDENTITY-002`
**Platform:** Patient app (Profile C), authenticated
**Accountable for:** their own care decisions — choosing a provider, accepting clinician-authored treatment and financial terms, reporting money they paid outside the platform, reviewing what they received, raising claims.
**Primary jobs:** JTBD-IDENTITY-001, JTBD-ELIG-001 through JTBD-ELIG-003, JTBD-BOOKING-001 through JTBD-BOOKING-003, JTBD-CLINICAL-002, JTBD-CLINICAL-004, JTBD-CLINICAL-006, JTBD-FINANCE-001 through JTBD-FINANCE-004, JTBD-FINANCE-006, JTBD-REVIEWS-001, JTBD-CLAIMS-001 through JTBD-CLAIMS-003, JTBD-CLAIMS-006, JTBD-PLATFORM-001
**Frequency of use:** episodic and bursty. Intense during an active case (daily), silent between cases (monthly or less). This is the single most important fact about the patient's usage shape and it means the app cannot rely on learned navigation.
**Environment:** undocumented (`Q-PLATFORM-006`). Established: personal mobile device, Arabic-first, RTL, weak and intermittent connectivity (`NFR-PLATFORM-006`).
**Expertise:** first-time to occasional. Assumed to have no dental training and no knowledge of internal classification concepts (`BP-11`, `FR-CATALOG-001`).
**Consequence of error:** accepting terms they did not understand; a booking they believe is confirmed when it is not; a duplicate financial assertion; a missed claim deadline that cannot be recovered (`FR-CLAIMS-003`). For the business: disputes, unverifiable financial history, and loss of the operational trust the product exists to build.
**Hard constraint:** never sees or sets `S`, `P`, `H`, `I`, `K`, `EU`, scientific grade, or final eligibility (`PERMISSIONS_MATRIX` section 5; `PO-UX-04`).

### ACTOR — Guardian / family grantee
**Source:** `PERMISSIONS_MATRIX` section 6; `FR-IDENTITY-003`
**Platform:** Patient app (Profile C), authenticated as themselves
**Accountable for:** acting for another patient strictly inside an active grant covering exact patient, actions, data scope, purpose and effective period.
**Primary jobs:** JTBD-IDENTITY-002, JTBD-IDENTITY-003, plus any patient job the grant explicitly permits
**Frequency of use:** episodic, same shape as the patient
**Environment:** undocumented (`Q-PLATFORM-006`). Established: mobile, Arabic-first, RTL.
**Expertise:** first-time to occasional
**Consequence of error:** acting for the wrong person, or believing authority persists after revocation or expiry. Both are authorization failures with clinical and financial consequences.
**Hard constraint:** actions are attributed to the guardian, never to the patient. Masquerading as the patient is denied (`PERMISSIONS_MATRIX` section 6). Changing a local active-patient selection grants no authority — every request re-evaluates the grant.

### 2.2 Clinic / Doctor platform actors

### ACTOR — Prospective provider applicant
**Source:** `PO-UX-02`; `SDC-IDENTITY-001`; `FR-IDENTITY-001`
**Platform:** Clinic portal (Profile A), public then verified pre-authentication
**Accountable for:** the truthfulness and completeness of the source facts and evidence in their application to join UberTib as an individual dentist or a clinic/dental centre.
**Primary jobs:** JTBD-IDENTITY-004, JTBD-IDENTITY-005
**Frequency of use:** once, plus correction cycles. This is a one-time high-stakes task performed by someone who will never become fluent in it.
**Environment:** undocumented (`Q-PLATFORM-006`). Likely desktop given evidence upload, but this is inference and must not harden into a mobile-hostile design.
**Expertise:** first-time, permanently. No amount of product use makes an applicant expert at applying.
**Consequence of error:** a rejected or stalled application; correction cycles that cost the applicant and the reviewer time; for the business, provider supply that never activates.
**Hard constraint:** the applicant supplies facts only. No control anywhere in onboarding selects a scientific grade, `P`, `H`, `I`, or service eligibility (`PO-UX-02`; `SDC-IDENTITY-001`).

### ACTOR — Treating dentist
**Source:** `PERMISSIONS_MATRIX` section 10; `SDC-CLINICAL-001`; `FR-CLINICAL-001`
**Platform:** Clinic panel (Profile A), authenticated
**Accountable for:** the clinical content of treatment plans, stage evidence, completion declarations, and follow-up for cases where they hold an active treating relationship.
**Primary jobs:** JTBD-ELIG-004 through JTBD-ELIG-006, JTBD-CLINICAL-001, JTBD-CLINICAL-003, JTBD-CLINICAL-005, JTBD-CLINICAL-006, JTBD-BOOKING-004
**Frequency of use:** many times a day during clinic hours
**Environment:** undocumented (`Q-PLATFORM-006`). A clinical setting with interruptions is likely but not evidenced.
**Expertise:** trained operator, high domain expertise, low patience for ceremony
**Consequence of error:** an incorrect clinical plan reaching a patient for acceptance; a stage marked complete without required evidence; for the patient, treatment decisions taken on wrong information. These are the highest-severity errors in the product.
**Hard constraint:** the platform never authors a diagnosis or treatment plan. The dentist is identified as author (`FR-CLINICAL-001`). Accepted snapshots are never edited; amendment creates a new version.

### ACTOR — Clinic / provider representative
**Source:** `PERMISSIONS_MATRIX` sections 8, 9, 11; `SDC-IDENTITY-003`, `SDC-BOOKING-001`
**Platform:** Clinic panel (Profile A), authenticated
**Accountable for:** provider and branch operations — booking responses within the deadline, availability, prices, activation submissions, external financial assertions, and delegating staff access.
**Primary jobs:** JTBD-IDENTITY-006, JTBD-IDENTITY-008, JTBD-IDENTITY-011, JTBD-BOOKING-004 through JTBD-BOOKING-006, JTBD-ELIG-004 through JTBD-ELIG-006, JTBD-FINANCE-002, JTBD-FINANCE-003, JTBD-REVIEWS-002, JTBD-CLAIMS-004, JTBD-OPS-001
**Frequency of use:** many times a day. The booking response deadline — 12 hours, or two hours before the appointment, whichever is earlier (`FR-BOOKING-003`) — makes this the most time-pressured recurring task in the product.
**Environment:** undocumented (`Q-PLATFORM-006`). Front-desk conditions with interruptions are likely but not evidenced.
**Expertise:** trained operator after onboarding; first-time during it
**Consequence of error:** a missed response deadline loses the booking and the patient; an over-broad staff grant is an authorization breach; a wrong external financial assertion creates a dispute.
**Hard constraint:** cannot delegate a capability or branch scope they do not hold (`PO-UX-03`). Cannot see raw internal `I`. Cannot edit computed outcomes.

### ACTOR — Invited clinic staff member
**Source:** `PO-UX-03`; `SDC-IDENTITY-003`
**Platform:** Clinic panel (Profile A), pre-authentication then authenticated
**Accountable for:** work inside the exact provider, branches, capabilities and effective period their accepted invitation granted.
**Primary jobs:** JTBD-IDENTITY-007, JTBD-IDENTITY-011, plus whichever clinic jobs the grant covers
**Frequency of use:** acceptance once; scoped work thereafter at the cadence of their capability
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** first-time at acceptance; trained thereafter
**Consequence of error:** believing they hold access they do not; attempting work outside scope and being denied without understanding why.
**Hard constraint:** acceptance creates a scoped grant and nothing more. Being invited as a treating dentist does not confer authority to author clinical treatment — professional verification and a case relationship are still required (`PO-UX-03`).

### 2.3 Admin platform actors

### ACTOR — Verification staff
**Source:** `PERMISSIONS_MATRIX` sections 4, 8; `SDC-IDENTITY-002`, `SDC-ELIG-002`; `FR-ELIG-007`, `FR-ELIG-008`
**Platform:** Admin panel (Profile A)
**Accountable for:** deciding whether submitted source facts and evidence are valid — for provider onboarding applications and for service activation requests.
**Primary jobs:** JTBD-IDENTITY-009, JTBD-ELIG-007, JTBD-OPS-001
**Frequency of use:** many times a day — this is queue work
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator, high throughput expectations
**Consequence of error:** approving a false fact admits an unqualified provider; rejecting a valid one blocks legitimate supply. Both are visible to patients through eligibility.
**Hard constraint:** verifies facts and evidence only. Never edits computed final `S`, `P`, `H`, `I` or eligibility (`PERMISSIONS_MATRIX` section 8; `SDC-ELIG-002`).

### ACTOR — Licensed clinical reviewer
**Source:** `PERMISSIONS_MATRIX` sections 4, 7, 8, 13; `FR-OPS-003`, `FR-CLAIMS-004`
**Platform:** Admin panel (Profile A)
**Accountable for:** medical launch approval and medically sensitive review, under a current independently verified dental credential.
**Primary jobs:** JTBD-CATALOG-003, JTBD-ELIG-007, JTBD-CLAIMS-005
**Frequency of use:** weekly to rarely — low volume, highest consequence
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained clinical professional; occasional product user
**Consequence of error:** production activation of clinically unready content, or a wrong medically sensitive claim decision affecting a patient and a provider.
**Hard constraint:** an expired or revoked credential cannot support a current medical approval (`STATE_MACHINES` section 5). A clinical credential cannot be used on a non-medical gate (`PERMISSIONS_MATRIX` section 7). Both are fail-closed.

### ACTOR — Review integrity reviewer
**Source:** `PERMISSIONS_MATRIX` section 12; `SDC-REVIEWS-001`; `FR-REVIEWS-002`
**Platform:** Admin panel (Profile A)
**Accountable for:** review publication and eligibility decisions, and review appeals.
**Primary jobs:** JTBD-REVIEWS-003, JTBD-OPS-001
**Frequency of use:** weekly
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator
**Consequence of error:** removing a legitimate review, or leaving a policy-violating one published. Either damages the verified-experience signal the product depends on.
**Hard constraint:** may decide eligibility and policy compliance. May never rewrite rating content, and `R` never feeds `S`, `P`, `H` or `I` (`PERMISSIONS_MATRIX` section 12).

### ACTOR — Claim / dispute reviewer
**Source:** `PERMISSIONS_MATRIX` section 13; `SDC-CLAIMS-001`; `FR-CLAIMS-004`, `FR-CLAIMS-005`
**Platform:** Admin panel (Profile A)
**Accountable for:** reasoned human decisions on refund requests, protection claims and disputes within their required subject-matter scope, and appeals under separation of duties.
**Primary jobs:** JTBD-CLAIMS-005, JTBD-CLAIMS-007, JTBD-OPS-001
**Frequency of use:** daily
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator with subject-matter competence requirements
**Consequence of error:** an unjustified decision against a patient or provider, with an appeal path but no way to erase the original. Decisions are immutable by design.
**Hard constraint:** cannot decide a medically sensitive claim without the required clinical competence. Cannot approve a decision they originated where separation of duties forbids it (`PERMISSIONS_MATRIX` sections 13, 17). System automation cannot make this decision at all.

### ACTOR — Finance reviewer
**Source:** `PERMISSIONS_MATRIX` section 11; `SDC-FINANCE-001`; `FR-FINANCE-003`
**Platform:** Admin panel (Profile A)
**Accountable for:** reviewing recorded external financial events and resolving disputed records within scope.
**Primary jobs:** JTBD-FINANCE-005, JTBD-OPS-001
**Frequency of use:** daily
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator
**Consequence of error:** an unresolved dispute leaves a case's financial history ambiguous, which is exactly what the record-only model exists to prevent.
**Hard constraint:** never moves money. No command in this role authorizes, captures, holds, transfers, settles or refunds funds (`NFR-FINANCE-001`; `SDC-FINANCE-001`).

### ACTOR — Policy owner / reviewer
**Source:** `PERMISSIONS_MATRIX` section 7; `SDC-POLICY-001`; `FR-POLICY-001`, `FR-POLICY-002`
**Platform:** Admin panel (Profile A)
**Accountable for:** the versioned lifecycle of classification, eligibility, deadline, evidence, financial and launch policies within their owned domain.
**Primary jobs:** JTBD-CATALOG-002, JTBD-POLICY-001
**Frequency of use:** weekly to rarely
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator, deep policy knowledge, infrequent product use
**Consequence of error:** activating a policy version that silently changes outcomes; or believing a change applies retroactively when it does not.
**Hard constraint:** activated historical content is immutable. Changes apply prospectively and never rewrite accepted snapshots or prior decisions (`FR-POLICY-001`, `FR-POLICY-002`).

### ACTOR — Product / operations owner
**Source:** `PERMISSIONS_MATRIX` sections 7, 14; `FR-OPS-002`, `FR-OPS-003`
**Platform:** Admin panel (Profile A)
**Accountable for:** the operational launch gate and operational governance and reporting.
**Primary jobs:** JTBD-OPS-002, JTBD-OPS-003, JTBD-CATALOG-003
**Frequency of use:** weekly
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator
**Consequence of error:** approving an operational gate the operation cannot actually support, or misreading provisional data as confirmed.
**Hard constraint:** the implemented accountable role key is `product_and_operations_owner`. Cannot satisfy the medical, legal or technical gate.

### ACTOR — Legal accountable owner
**Source:** `PERMISSIONS_MATRIX` section 7; `FR-OPS-003`
**Platform:** Admin panel (Profile A)
**Accountable for:** the legal launch gate and explicitly assigned legal review.
**Primary jobs:** JTBD-CATALOG-003
**Frequency of use:** rarely
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained professional, rare product user — this role needs a guided, discoverable path, not a memorised one
**Consequence of error:** a legal gate approved without basis, or a launch blocked because the decision surface was not findable.
**Hard constraint:** legal gate scope only. Implemented role key `legal_accountable_owner`.

### ACTOR — Technical accountable owner
**Source:** `PERMISSIONS_MATRIX` section 7; `FR-OPS-003`, `NFR-PLATFORM-008`
**Platform:** Admin panel (Profile A)
**Accountable for:** the technical launch gate and assigned technical review.
**Primary jobs:** JTBD-CATALOG-003, JTBD-PLATFORM-003
**Frequency of use:** rarely
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained professional, rare product user
**Consequence of error:** a technical gate approved without evidence.
**Hard constraint:** technical gate scope only. Implemented role key `technical_accountable_owner`.

### ACTOR — Operations staff
**Source:** `PERMISSIONS_MATRIX` section 14; `SDC-OPS-001`; `FR-OPS-001`
**Platform:** Admin panel (Profile A)
**Accountable for:** working scoped queues — deadlines, exceptions, escalations, follow-up, and booking and eligibility exception handling.
**Primary jobs:** JTBD-OPS-001, JTBD-BOOKING-007, JTBD-ELIG-008, JTBD-CLINICAL-007, JTBD-AUDIT-002
**Frequency of use:** many times a day. The queue is this actor's home screen, not a report.
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator, highest throughput requirement in the product
**Consequence of error:** an unworked deadline breach; or closing a work item without resolving the underlying condition, which is explicitly forbidden.
**Hard constraint:** completing a work item does not change the source domain record. Only an authorized domain action does (`CROSS_PLATFORM_BEHAVIOR` sections 3.5, 18.2). Work assignment never grants source-data access.

### ACTOR — System administrator
**Source:** `PERMISSIONS_MATRIX` sections 5, 6; `FR-IDENTITY-001`
**Platform:** Admin panel (Profile A)
**Accountable for:** staff accounts, coarse role and capability assignment, and scoped staff grants.
**Primary jobs:** JTBD-IDENTITY-010, JTBD-OPS-001
**Frequency of use:** weekly
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained operator
**Consequence of error:** an over-broad grant is a direct authorization breach across every interface.
**Hard constraint:** administration is not a universal data override. No automatic clinical, financial, legal, claim or case-data access. No `super_admin` bypass exists (`PERMISSIONS_MATRIX` sections 5, 20). Cannot self-grant a scope to bypass a policy requiring another accountable reviewer.

### ACTOR — Authorized auditor
**Source:** `PERMISSIONS_MATRIX` section 14; `SDC-AUDIT-001`; `FR-AUDIT-001`, `FR-AUDIT-002`, `FR-POLICY-002`
**Platform:** Admin panel (Profile A)
**Accountable for:** tracing sensitive actions and reproducing historical decisions within an explicit purpose and target scope.
**Primary jobs:** JTBD-AUDIT-001, JTBD-POLICY-002
**Frequency of use:** rarely, and usually under time pressure when it happens
**Environment:** undocumented (`Q-PLATFORM-006`)
**Expertise:** trained professional, rare product user
**Consequence of error:** an unanswerable audit question, or audit access that leaks unrelated protected payload.
**Hard constraint:** audit records cannot be edited or deleted. Audit access never grants unrelated protected data access (`SDC-AUDIT-001`).

### 2.4 Non-human actor — must appear in flows, is not a persona

### ACTOR — System automation
**Source:** `PERMISSIONS_MATRIX` section 16; `CROSS_PLATFORM_BEHAVIOR` section 16
**Platform:** none — it is depicted in flows, it has no screens
**May:** compute and recompute `S`, `P`, `H`, `I` and eligibility; suspend affected eligibility; revalidate a booking before confirmation; expire a provider response or alternative window; derive follow-up obligations; derive financial timelines; create notification intents and work items; process governed retention.
**May not:** execute payment or refund; close a sensitive claim with an autonomous high-impact decision; author a diagnosis or treatment plan; make a final medical, punitive or reputation-damaging decision.
**Why it matters to UX:** every cross-platform flow must visually distinguish automatic action from human action, and must never portray the system as making a decision the requirements reserve for a human.

### 2.5 Explicit non-roles

`PERMISSIONS_MATRIX` section 22 establishes no standing production application access for external regulators, external auditors, developers, testers, database administrators, infrastructure administrators or support engineers. The default is deny. No screen is designed for them.

## 3. Jobs To Be Done

62 jobs, phrased in the actor's terms, each traced to requirements. `Current pain` has no research behind it for any job — no interviews, analytics or support tickets exist for this product. That is recorded once as `Q-PLATFORM-007` (Major) rather than repeated as a fabricated insight per job.

### 3.1 IDENTITY

### JTBD-IDENTITY-001 — When I decide to use UberTib, I want to prove this phone is mine and get an account, so I can book and keep my own case history
**Actors:** Patient
**Requirements:** FR-IDENTITY-002; NFR-IDENTITY-002; API-IDENTITY-001, API-IDENTITY-002
**Frequency:** once per patient, plus session recovery
**Criticality:** blocking — nothing else in the product is reachable without it
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** an active patient identity exists, bound to a verified contact, with no duplicate active identity created by a retry

### JTBD-IDENTITY-002 — When I manage care for a family member, I want to set up explicit authority to act for them, so I can handle their treatment without pretending to be them
**Actors:** Patient (as grantor); Guardian
**Requirements:** FR-IDENTITY-003; API-IDENTITY-004
**Frequency:** rarely — once per relationship
**Criticality:** blocking for dependent care; not reachable any other way
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a grant exists naming exact patient, actions, data scope, purpose and effective period, and the grantee can perform exactly those actions and no others

### JTBD-IDENTITY-003 — When I am acting for someone I represent, I want it to be unmistakable whose care I am looking at, so I do not act on the wrong person's case
**Actors:** Guardian
**Requirements:** FR-IDENTITY-003; NFR-IDENTITY-001
**Frequency:** every session in which representation is used
**Criticality:** blocking — a wrong-subject action is a clinical and authorization failure
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the acting identity and the subject patient are both continuously evident, and every action is attributed to the guardian

### JTBD-IDENTITY-004 — When I want to offer my dental services through UberTib, I want to apply with my real credentials and get a decision, so I can start receiving patients
**Actors:** Prospective provider applicant
**Requirements:** FR-IDENTITY-001; PO-UX-02; SDC-IDENTITY-001
**Frequency:** once per provider
**Criticality:** blocking — there is no other route into the Clinic platform
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a submitted application containing every required source fact and evidence item, with a clear status the applicant can return to

### JTBD-IDENTITY-005 — When a reviewer asks me to fix something in my application, I want to see exactly what and change only that, so I do not redo the whole form
**Actors:** Prospective provider applicant
**Requirements:** FR-IDENTITY-001; PO-UX-02; SDC-IDENTITY-001
**Frequency:** zero to several times per application
**Criticality:** blocking for a stalled application
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** only the itemised requested sections are editable, the reason for each is visible, and resubmission returns the application to review

### JTBD-IDENTITY-006 — When my clinic needs more people on UberTib, I want to invite them with exactly the access they need, so nobody has more reach than their job requires
**Actors:** Clinic / provider representative
**Requirements:** FR-IDENTITY-001; NFR-IDENTITY-001; PO-UX-03; SDC-IDENTITY-003
**Frequency:** weekly to rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** an invitation exists naming provider, branches, capability and effective period, all within what the inviter may delegate

### JTBD-IDENTITY-007 — When I am invited to work in a clinic on UberTib, I want to verify who I am and accept, so I can start doing my job
**Actors:** Invited clinic staff member
**Requirements:** FR-IDENTITY-001; PO-UX-03; SDC-IDENTITY-003
**Frequency:** once per invitation
**Criticality:** blocking for that staff member
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** identity verified, invitation accepted, an explicit scoped grant created, and Clinic access limited to that grant

### JTBD-IDENTITY-008 — When someone leaves or changes role, I want their access to stop right away, so they cannot act on our patients afterwards
**Actors:** Clinic / provider representative
**Requirements:** FR-IDENTITY-001; NFR-IDENTITY-001; FR-AUDIT-001; SDC-IDENTITY-003
**Frequency:** rarely, and urgent when it happens
**Criticality:** blocking — a delay here is an active security exposure
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the next protected read or action by that user is denied, an open session cannot continue mutating, and historical attribution is preserved

### JTBD-IDENTITY-009 — When an application arrives, I want to judge whether this applicant is genuinely who and what they claim, so we do not admit an unqualified provider
**Actors:** Verification staff
**Requirements:** FR-IDENTITY-001; FR-AUDIT-001; PO-UX-02; SDC-IDENTITY-002
**Frequency:** many times a day
**Criticality:** blocking for provider supply; high consequence if wrong
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** every submitted fact and evidence item carries a verification outcome with provenance, and the decision is approve, request itemised changes, or reject with a reason

### JTBD-IDENTITY-010 — When staff need system access, I want to grant exactly the scope their work requires, so administration never becomes a universal override
**Actors:** System administrator
**Requirements:** FR-IDENTITY-001; NFR-IDENTITY-001; FR-AUDIT-001
**Frequency:** weekly
**Criticality:** blocking for staff onboarding; high consequence if over-broad
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** each grant states organization, branch, capability, subject scope, purpose and effective period, and the change is audited

### JTBD-IDENTITY-011 — When I work across more than one branch, I want to know which provider and branch I am acting in, so I do not apply an action to the wrong place
**Actors:** Clinic / provider representative; Treating dentist; Invited clinic staff member
**Requirements:** FR-IDENTITY-001; NFR-IDENTITY-001; SDC-IDENTITY-004
**Frequency:** every session, many times a day for multi-branch users
**Criticality:** blocking — wrong-branch actions are authorization and operational failures
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** active provider and branch context is continuously evident, switching creates no authority, and only granted contexts are selectable

### 3.2 CATALOG

### JTBD-CATALOG-001 — When I have a dental problem, I want to understand what services exist and what they actually mean, so I can tell what I need
**Actors:** Public visitor; Patient
**Requirements:** FR-CATALOG-001; API-CATALOG-001
**Frequency:** once to a few times per care episode
**Criticality:** blocking — it is the entry to discovery
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the patient can name the service they want in plain Arabic without knowing any internal classification symbol

### JTBD-CATALOG-002 — When a service definition needs to change, I want to move a version through review and scheduling, so production content changes without breaking past cases
**Actors:** Policy owner / reviewer
**Requirements:** FR-CATALOG-001; FR-POLICY-001; SDC-CATALOG-001
**Frequency:** weekly to rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a version advances only through permitted transitions, and activated historical content is untouched

### JTBD-CATALOG-003 — When a service is proposed for production, I want to record my accountable decision with evidence, so nothing goes live without my gate
**Actors:** Licensed clinical reviewer; Legal accountable owner; Product / operations owner; Technical accountable owner
**Requirements:** FR-OPS-003; SDC-CATALOG-001
**Frequency:** rarely
**Criticality:** blocking for production publication
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** an append-only decision bound to the exact content, with reason, evidence and expiry where applicable, and a clinical credential usable only on the medical gate

### 3.3 ELIG

### JTBD-ELIG-001 — When I know what treatment I need, I want to see dentists who can actually do it now, so I do not waste time on someone unavailable
**Actors:** Public visitor; Patient
**Requirements:** FR-ELIG-001, FR-ELIG-005, FR-ELIG-006, FR-ELIG-016; API-ELIG-001
**Frequency:** several times per care episode
**Criticality:** blocking — the core discovery job
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** every returned option currently passes all mandatory gates, and nothing failing a gate is offered as bookable

### JTBD-ELIG-002 — When a dentist I wanted is not available, I want to understand why in terms I can act on, so I know whether to wait or choose someone else
**Actors:** Public visitor; Patient
**Requirements:** FR-ELIG-017, FR-ELIG-008; API-ELIG-002
**Frequency:** occasionally within discovery
**Criticality:** important — its absence produces distrust and support load
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the patient reads a practical reason and the assessment date, can distinguish still-being-assessed from assessed-and-failed, and sees no confidential evidence or internal risk value

### JTBD-ELIG-003 — When two or three options look reasonable, I want to see them side by side on the things that matter to me, so I can choose without guessing
**Actors:** Public visitor; Patient
**Requirements:** FR-ELIG-016, FR-ELIG-017; PO-UX-04; API-ELIG-001
**Frequency:** once or twice per care episode
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** two or three options from the same requested service are compared on patient-safe attributes, with no composite score, no internal risk, no formulas, and no stale option left bookable

### JTBD-ELIG-004 — When I want to offer a service at my branch, I want to submit the facts and evidence it requires, so the system can assess me for it
**Actors:** Treating dentist; Clinic / provider representative
**Requirements:** FR-ELIG-007, FR-ELIG-008; SDC-ELIG-001
**Frequency:** weekly during setup, rarely thereafter
**Criticality:** blocking — no service, no bookings
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a request bound to one dentist, one service-definition version and one branch, containing facts and evidence only, with no control anywhere for choosing a grade, `P`, `H` or `I`

### JTBD-ELIG-005 — When I am not eligible yet, I want to know exactly what is blocking me and what to do about it, so I can fix it instead of guessing
**Actors:** Treating dentist; Clinic / provider representative
**Requirements:** FR-ELIG-008, FR-ELIG-003, FR-ELIG-002; SDC-ELIG-003
**Frequency:** daily while activating, then on any change
**Criticality:** blocking — the single most important clinic-side explanation in the product
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** each blocker names the missing or invalid item and the action that resolves it, still-being-assessed is visibly distinct from grade `F`, and no override control exists

### JTBD-ELIG-006 — When my price for a service changes, I want to record it as a fact, so patients see accurate cost and the system derives whatever it derives
**Actors:** Treating dentist; Clinic / provider representative
**Requirements:** FR-ELIG-009, FR-ELIG-014; SDC-ELIG-001
**Frequency:** monthly to rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the price is stored with service, branch, currency, amount, effective period and provenance, and `P` is never presented to the provider as a quality grade

### JTBD-ELIG-007 — When facts and evidence arrive for assessment, I want to verify or reject each one with a reason, so the computed outcome rests on approved truth
**Actors:** Verification staff; Licensed clinical reviewer
**Requirements:** FR-ELIG-007, FR-ELIG-008, FR-AUDIT-001; SDC-ELIG-002
**Frequency:** many times a day
**Criticality:** blocking for provider activation
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** each item has an outcome and provenance, evaluation is requeued after approved changes, and no final computed value was edited by hand

### JTBD-ELIG-008 — When eligibility is suspended automatically, I want to see the affected scope and the invalid dependency, so I can drive it to resolution
**Actors:** Operations staff; Verification staff
**Requirements:** FR-ELIG-003, FR-ELIG-004; SDC-ELIG-002, SDC-OPS-001
**Frequency:** weekly
**Criticality:** blocking — new bookings in that scope stop immediately
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the exact provider, service and branch scope, the controlling dependency, and the work required are all visible, and existing bookings are not silently rewritten

### 3.4 BOOKING

### JTBD-BOOKING-001 — When I have chosen a dentist, I want to book a time and know whether it is really mine, so I can plan around it
**Actors:** Patient; Guardian
**Requirements:** FR-BOOKING-001, FR-ELIG-006, FR-AUDIT-003; API-BOOKING-001
**Frequency:** once to a few times per care episode
**Criticality:** blocking — the product's central conversion
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** exactly one booking request exists after any number of retries, its state is unambiguous, and the response deadline is visible

### JTBD-BOOKING-002 — When the clinic offers me a different time, I want to understand it and decide before it lapses, so I do not lose the appointment
**Actors:** Patient; Guardian
**Requirements:** FR-BOOKING-003; API-BOOKING-004
**Frequency:** occasionally per booking
**Criticality:** blocking for that booking
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the proposal, its deadline and the consequence of inaction are clear, and acceptance either confirms after revalidation or fails with a reason

### JTBD-BOOKING-003 — When my plans change, I want to cancel cleanly and know what follows, so I am not penalised by surprise
**Actors:** Patient; Guardian
**Requirements:** FR-BOOKING-002; API-BOOKING-005
**Frequency:** occasionally
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** cancellation is recorded with actor, reason, prior state and governing policy, and any downstream consequence is stated before confirming

### JTBD-BOOKING-004 — When a request comes in, I want to accept, decline or offer another time before the deadline, so we do not lose the patient
**Actors:** Clinic / provider representative; Treating dentist
**Requirements:** FR-BOOKING-003, FR-BOOKING-001; SDC-BOOKING-001
**Frequency:** many times a day, under a hard deadline
**Criticality:** blocking — the most time-pressured recurring task in the product
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** remaining time is unmissable, one action resolves the request, and confirmation only succeeds when eligibility, readiness and capacity revalidate

### JTBD-BOOKING-005 — When our schedule changes, I want our availability to reflect reality, so we do not receive requests we cannot serve
**Actors:** Clinic / provider representative
**Requirements:** FR-BOOKING-001; SDC-BOOKING-001
**Frequency:** daily
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** configured capacity is accurate and concurrent requests can never confirm beyond it

### JTBD-BOOKING-006 — When a patient does not attend, I want to record it correctly and only when allowed, so consequences are fair and defensible
**Actors:** Clinic / provider representative
**Requirements:** FR-BOOKING-002; SDC-BOOKING-001
**Frequency:** weekly
**Criticality:** important — premature or wrong recording harms the patient
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the action is unavailable before the policy threshold, and once recorded it carries actor, time and policy and moves no money

### JTBD-BOOKING-007 — When a booking goes wrong, I want to investigate and escalate it, so an exception does not silently become a bad outcome
**Actors:** Operations staff
**Requirements:** FR-OPS-001, FR-BOOKING-002, FR-BOOKING-003; SDC-OPS-001
**Frequency:** daily
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the exception, its deadline history and provenance are visible, and no force-confirm override exists

### 3.5 CLINICAL

### JTBD-CLINICAL-001 — When I have examined a patient, I want to put my proposed treatment and its cost in front of them, so they can decide with full information
**Actors:** Treating dentist
**Requirements:** FR-CLINICAL-001, FR-FINANCE-001; SDC-CLINICAL-001
**Frequency:** many times a day
**Criticality:** blocking — treatment cannot proceed without an accepted plan
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a versioned plan naming service, stages, stage prices, inclusions, exclusions and applicable terms, attributed to the dentist as author, not to the platform

### JTBD-CLINICAL-002 — When my dentist proposes treatment, I want to understand what I am agreeing to before I agree, so I am not committing blind
**Actors:** Patient; Guardian
**Requirements:** FR-CLINICAL-001, FR-CLINICAL-002, FR-FINANCE-001; API-CLINICAL-002, API-CLINICAL-003
**Frequency:** once to a few times per case
**Criticality:** blocking — and the highest-consequence patient decision in the product
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the patient reads the exact proposed version, acceptance is refused when required information is missing, and acceptance creates immutable clinical and financial snapshots exactly once

### JTBD-CLINICAL-003 — When I complete part of a treatment, I want to record it with the evidence required, so the case history is real and the patient can see progress
**Actors:** Treating dentist
**Requirements:** FR-CLINICAL-003; NFR-PLATFORM-003; SDC-CLINICAL-001
**Frequency:** many times a day
**Criticality:** blocking for case progression
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** completion is refused while any mandatory stage field, acknowledgment or evidence item is absent or invalid, and completion records actor, time, reason and the evidence set evaluated

### JTBD-CLINICAL-004 — When I am partway through treatment, I want to see what has happened and what is next, so I know where I stand
**Actors:** Patient; Guardian
**Requirements:** FR-CLINICAL-005; API-CLINICAL-001, API-CLINICAL-004
**Frequency:** several times a week during an active case
**Criticality:** important — the trust surface of the whole product
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** one ordered timeline spanning booking, terms, stages, follow-ups, finance, reviews and claims, where corrections appear as later events rather than erasing history

### JTBD-CLINICAL-005 — When treatment needs to change after the patient accepted, I want to propose an amendment, so we agree again without falsifying what was already agreed
**Actors:** Treating dentist
**Requirements:** FR-CLINICAL-002; NFR-AUDIT-003; SDC-CLINICAL-001
**Frequency:** occasionally per case
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a new plan version is created, the prior accepted snapshot is untouched, and the patient accepts the new version explicitly

### JTBD-CLINICAL-006 — When follow-up is due, I want it to surface for whoever must act, so treatment does not stall silently
**Actors:** Patient; Guardian; Treating dentist; Clinic / provider representative
**Requirements:** FR-CLINICAL-004; SDC-CLINICAL-001, SDC-OPS-001
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the obligation is derived from the accepted plan, its due state is visible to the responsible party, and a failed delivery does not duplicate or cancel the obligation

### JTBD-CLINICAL-007 — When operations must look into a case, I want authorized oversight of it, so I can resolve a problem without becoming the clinician
**Actors:** Operations staff; Claim / dispute reviewer
**Requirements:** FR-CLINICAL-001, FR-CLINICAL-005, FR-AUDIT-001; SDC-OPS-001
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** purpose-scoped read access with role field filtering, and no authoring capability of any kind

### 3.6 FINANCE

### JTBD-FINANCE-001 — When I accept treatment, I want a permanent record of exactly what I agreed to pay, so nobody can change it later
**Actors:** Patient; Guardian; Clinic / provider representative
**Requirements:** FR-FINANCE-001, FR-CLINICAL-002; API-FINANCE-001; SDC-FINANCE-001
**Frequency:** once per accepted plan version
**Criticality:** blocking for every later financial and claim action
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** an immutable snapshot with service, stages, amounts, currency, due structure, cancellation and refund terms, protection state and governing policy versions

### JTBD-FINANCE-002 — When I have paid outside the app, I want to record that fact, so my case history reflects what really happened
**Actors:** Patient; Guardian; Clinic / provider representative
**Requirements:** FR-FINANCE-002, FR-FINANCE-005, FR-FINANCE-007; API-FINANCE-002; SDC-FINANCE-001
**Frequency:** once to a few times per case
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** one appended unconfirmed assertion per identical command, awaiting counterparty response, with no language implying UberTib received or moved the money

### JTBD-FINANCE-003 — When the other party records a payment, I want to confirm or dispute it, so the record is jointly true
**Actors:** Patient; Guardian; Clinic / provider representative
**Requirements:** FR-FINANCE-003, FR-FINANCE-005; API-FINANCE-003; SDC-FINANCE-001
**Frequency:** once per reported event
**Criticality:** important — an unanswered assertion leaves the case ambiguous
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a response event is appended, the original assertion is unchanged, and a dispute carries a reason

### JTBD-FINANCE-004 — When money matters get complicated, I want to see the whole money story for my case, so I can tell agreed from claimed from confirmed
**Actors:** Patient; Guardian; Clinic / provider representative; Finance reviewer
**Requirements:** FR-FINANCE-006, FR-FINANCE-005; API-FINANCE-005; SDC-FINANCE-001
**Frequency:** several times per case
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** agreed, reported, confirmed, disputed, refunded and pending-external-execution values are visibly distinct and every one derives from immutable terms plus ordered events

### JTBD-FINANCE-005 — When a financial record is disputed, I want to review the recorded facts and resolve it, so the case does not stay stuck
**Actors:** Finance reviewer
**Requirements:** FR-FINANCE-003, FR-FINANCE-005; SDC-FINANCE-001, SDC-OPS-001
**Frequency:** daily
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** resolution is an appended event with reasoning; no earlier record is edited; no funds move

### JTBD-FINANCE-006 — When an approved refund has actually been paid outside the app, I want to record and have it confirmed, so the obligation is visibly closed
**Actors:** Patient; Guardian; Clinic / provider representative; Finance reviewer
**Requirements:** FR-FINANCE-004, FR-FINANCE-007, FR-CLAIMS-001; API-FINANCE-004; SDC-FINANCE-001
**Frequency:** rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the assertion references the approved refund decision with exact amount and currency, and remains an assertion until the counterparty responds

### 3.7 REVIEWS

### JTBD-REVIEWS-001 — When my treatment is done, I want to review the dentist I actually saw, so other patients get honest information
**Actors:** Patient; Guardian
**Requirements:** FR-REVIEWS-001; API-REVIEWS-001
**Frequency:** once per completed eligible experience
**Criticality:** convenience for the patient, important for the product's trust signal
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** exactly one active review per verified completed experience, inside the review window, with `R` kept entirely separate from `S`, `P`, `H` and `I`

### JTBD-REVIEWS-002 — When a review about us breaks the rules, I want to challenge it on policy grounds, so we are not damaged by an ineligible review
**Actors:** Clinic / provider representative; Treating dentist
**Requirements:** FR-REVIEWS-002; SDC-REVIEWS-001
**Frequency:** rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** an appeal records appellant, review, policy-grounded reason, evidence and time, and cannot alter the rating text

### JTBD-REVIEWS-003 — When a review's eligibility is questioned, I want to decide it with reasons on record, so publication is defensible
**Actors:** Review integrity reviewer
**Requirements:** FR-REVIEWS-001, FR-REVIEWS-002; SDC-REVIEWS-001, SDC-OPS-001
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** a reasoned decision changing publication or eligibility only, never rating content, and never classification

### 3.8 CLAIMS

### JTBD-CLAIMS-001 — When I believe I am owed money back, I want to ask for it against what I agreed, so my request is taken seriously
**Actors:** Patient; Guardian
**Requirements:** FR-CLAIMS-001, FR-FINANCE-007; API-CLAIMS-001
**Frequency:** rarely
**Criticality:** blocking when it happens
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** validated against the accepted terms snapshot and deadline policy, with an amount due for external execution if approved and no promise of platform payment

### JTBD-CLAIMS-002 — When something went wrong and I was told I had protection, I want to claim it, so the promise means something
**Actors:** Patient; Guardian
**Requirements:** FR-CLAIMS-002, FR-ELIG-010; API-CLAIMS-002
**Frequency:** rarely
**Criticality:** blocking when it happens
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** submission allowed only when the immutable accepted terms contain applicable active protection, with no implication of insurance or funded guarantee

### JTBD-CLAIMS-003 — When my claim needs more from me, I want to know exactly what and by when, so it is not rejected on a technicality
**Actors:** Patient; Guardian
**Requirements:** FR-CLAIMS-003; NFR-PLATFORM-003; API-CLAIMS-004
**Frequency:** once to a few times per claim
**Criticality:** blocking — a missed deadline is unrecoverable
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** missing, rejected, expired and accepted evidence states are distinguishable with reasons, and remaining time is unambiguous

### JTBD-CLAIMS-004 — When a claim names my clinic, I want to respond with our side and evidence, so the decision is not one-sided
**Actors:** Clinic / provider representative; Treating dentist
**Requirements:** FR-CLAIMS-003, FR-CLAIMS-001, FR-CLAIMS-002; SDC-CLAIMS-001
**Frequency:** rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** only requirements assigned to the clinic are visible, the response appends to the same claim, and no duplicate clinic-side claim record is created

### JTBD-CLAIMS-005 — When a sensitive claim is ready, I want to decide it with the evidence and policy in front of me, so the decision holds up later
**Actors:** Claim / dispute reviewer; Licensed clinical reviewer
**Requirements:** FR-CLAIMS-004; SDC-CLAIMS-001
**Frequency:** daily
**Criticality:** blocking — and reserved for humans by requirement
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the decision requires the reviewer's subject-matter scope, refuses prohibited self-approval, and retains findings, reasons, evidence references, policy, actor, time and required external actions

### JTBD-CLAIMS-006 — When a decision went against me and I think it is wrong, I want to appeal it, so there is a second look
**Actors:** Patient; Guardian; Clinic / provider representative
**Requirements:** FR-CLAIMS-005; API-CLAIMS-005; SDC-CLAIMS-001
**Frequency:** rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the appeal references the original decision, uses the governing policy snapshot, and leaves the original decision intact

### JTBD-CLAIMS-007 — When an appeal reaches me, I want to decide it independently, so the second look is genuinely independent
**Actors:** Claim / dispute reviewer
**Requirements:** FR-CLAIMS-005, FR-CLAIMS-004; SDC-CLAIMS-001
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** separation-of-duties assignment passes, and the appeal decision is appended without rewriting the original

### 3.9 OPS

### JTBD-OPS-001 — When I start my shift, I want to know what I should work on next, so nothing breaches while I guess
**Actors:** Operations staff; Verification staff; Finance reviewer; Claim / dispute reviewer; Review integrity reviewer; Clinic / provider representative
**Requirements:** FR-OPS-001; SDC-OPS-001
**Frequency:** many times a day — the home screen for every staff role
**Criticality:** blocking
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** work is filtered to the actor's active scope, ordered by policy priority and deadline, and each item shows type, linked resource, state, due time and blocking reason

### JTBD-OPS-002 — When I am accountable for operations, I want to see how we are actually performing, so I can act before it becomes a problem
**Actors:** Product / operations owner; Operations staff
**Requirements:** FR-OPS-002; SDC-OPS-002
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** every metric declares population, time window, status rules and last-refreshed time, and provisional or disputed data is visibly distinct from confirmed facts

### JTBD-OPS-003 — When we consider going live with a scope, I want to see whether every required approval is current, so we do not launch on an expired gate
**Actors:** Product / operations owner
**Requirements:** FR-OPS-003; SDC-CATALOG-001
**Frequency:** rarely
**Criticality:** blocking for production activation
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** each required gate shows accountable role, decision, evidence, expiry and current effective state, and a missing, expired, revoked or rejected gate blocks discoverability and new bookings

### 3.10 POLICY

### JTBD-POLICY-001 — When a rule must change, I want to publish a new version without disturbing past decisions, so history stays true
**Actors:** Policy owner / reviewer
**Requirements:** FR-POLICY-001; SDC-POLICY-001
**Frequency:** monthly to rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** at most one version effective per key, scope and instant; activation and retirement never mutate historical cases or decisions

### JTBD-POLICY-002 — When someone questions a past decision, I want to reproduce it exactly as it was made, so I can show why
**Actors:** Authorized auditor; Policy owner / reviewer
**Requirements:** FR-POLICY-002, FR-AUDIT-002; SDC-POLICY-001, SDC-AUDIT-001
**Frequency:** rarely
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** reproduction uses historical snapshots rather than current configuration, matches stored history, and raises an auditable exception on mismatch

### 3.11 AUDIT

### JTBD-AUDIT-001 — When a sensitive action is questioned, I want to trace who did what, when and why, so accountability is real
**Actors:** Authorized auditor
**Requirements:** FR-AUDIT-001, FR-AUDIT-002; SDC-AUDIT-001
**Frequency:** rarely, usually urgent
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** actor, effective role and scope, action, resource, time, outcome and correlation are retrievable within an explicit purpose, without granting unrelated protected payload access

### JTBD-AUDIT-002 — When a retry or integrity problem is flagged, I want to resolve it without editing history, so the fix does not become the next problem
**Actors:** Operations staff; Technical accountable owner
**Requirements:** FR-AUDIT-003, FR-POLICY-002; SDC-AUDIT-001, SDC-OPS-001
**Frequency:** weekly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** the conflicting command and its scope are visible, resolution is a later auditable action, and no stored record is rewritten

### 3.12 PLATFORM

### JTBD-PLATFORM-001 — When my connection drops mid-task, I want to not lose my work or accidentally do it twice, so I can trust the app on a bad network
**Actors:** Patient; Guardian
**Requirements:** FR-AUDIT-003; NFR-PLATFORM-006; NFR-AUDIT-002
**Frequency:** many times a day in the target environment
**Criticality:** blocking — weak connectivity is an established condition of use, not an edge case
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** in-progress work is recoverable without creating a submitted record, pending, failed, retrying and completed states are visible, and a retry of an already committed command creates no duplicate

### JTBD-PLATFORM-002 — When retention becomes due, I want deletion to happen only when it is lawful, so we neither hoard nor destroy wrongly
**Actors:** Operations staff; Authorized auditor
**Requirements:** FR-AUDIT-001; NFR-PLATFORM-004
**Frequency:** monthly
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** no deletion occurs while a legal hold is active, every destruction is audited, and failures surface as operational exceptions

### JTBD-PLATFORM-003 — When the platform degrades, I want to see it in the signals before users report it, so we act first
**Actors:** Technical accountable owner; Operations staff
**Requirements:** FR-OPS-002; NFR-PLATFORM-008, NFR-PLATFORM-002
**Frequency:** daily
**Criticality:** important
**Current pain:** no research (`Q-PLATFORM-007`)
**Success looks like:** queue age, retry and failure counts, deadline breaches, scan backlog, notification failures, recalculation delay and backup status each have a visible state, and delayed background work is never shown as a completed business outcome

## 4. Task Frequency by Criticality Matrix

Every one of the 62 jobs is plotted. This is the artifact that decides prominence in UX Phase 2, so it is placed here rather than being rediscovered later.

Placement rule used, from `ux_01`:

| | Blocking | Important | Convenience |
|---|---|---|---|
| **Daily+** | zero-friction, always visible | one action away | in a menu |
| **Weekly** | one action away | in a menu | in a menu |
| **Rare** | discoverable, guided | in a menu | search or settings |

### 4.1 The plot

| Frequency | Blocking | Important | Convenience |
|---|---|---|---|
| **Daily+** | IDENTITY-003, IDENTITY-009, IDENTITY-011, ELIG-005, ELIG-007, BOOKING-004, CLINICAL-001, CLINICAL-003, CLAIMS-005, OPS-001, PLATFORM-001 | BOOKING-005, BOOKING-007, FINANCE-005, PLATFORM-003 | — |
| **Weekly** | IDENTITY-010, ELIG-004, ELIG-008, CLINICAL-002, BOOKING-001 | IDENTITY-006, CLINICAL-004, CLINICAL-006, CLINICAL-007, FINANCE-003, FINANCE-004, REVIEWS-003, CLAIMS-004, CLAIMS-007, OPS-002, AUDIT-002, PLATFORM-002 | CATALOG-001 |
| **Rare** | IDENTITY-001, IDENTITY-004, IDENTITY-005, IDENTITY-007, IDENTITY-008, IDENTITY-002, CATALOG-003, OPS-003, CLAIMS-001, CLAIMS-002, CLAIMS-003, BOOKING-002 | ELIG-001, ELIG-002, ELIG-006, BOOKING-003, BOOKING-006, CLINICAL-005, FINANCE-001, FINANCE-002, FINANCE-006, REVIEWS-002, CLAIMS-006, CATALOG-002, POLICY-001, POLICY-002, AUDIT-001 | ELIG-003, REVIEWS-001 |

### 4.2 Findings from the plot

These are findings, not details. Each one constrains UX Phase 2.

**Finding 1 — Eleven jobs land in daily-and-blocking and every one of them must be zero-friction and always visible.** Three belong to the Clinic panel (IDENTITY-011, BOOKING-004, CLINICAL-001 and CLINICAL-003), four to the Admin panel (IDENTITY-009, ELIG-007, CLAIMS-005, OPS-001), and two are cross-cutting patient conditions (IDENTITY-003, PLATFORM-001). No patient *feature* is daily-and-blocking; two patient *conditions* are. That asymmetry should shape all three platforms differently and is the strongest argument against a shared IA.

**Finding 2 — The literal frequency axis understates patient jobs, and prominence must not follow it blindly.** The patient is an episodic actor: intense during an active case, silent for months between cases. `BOOKING-001` and `CLINICAL-002` are rare per user and simultaneously the two highest-consequence patient actions in the product. Raw frequency would bury them.

**Design principle derived:** for episodic actors, prominence follows position in the active journey, not raw frequency. See principle 3 in section 6.

**Finding 3 — Six rare-and-blocking jobs are performed by actors who will never become fluent.** IDENTITY-001, IDENTITY-004, IDENTITY-005, IDENTITY-007, CATALOG-003 and OPS-003 are each done once or a handful of times by someone with no accumulated product knowledge. `CATALOG-003` is the sharpest case: the legal and technical accountable owners approve a gate perhaps twice a year, and a missing or expired gate blocks production launch. These need discoverable, guided paths — never memorised ones.

**Finding 4 — Three rare-and-blocking patient jobs have unrecoverable deadlines.** CLAIMS-001, CLAIMS-002 and CLAIMS-003 are governed by versioned policy windows that are rejected rather than silently extended (`STATE_MACHINES` section 14). An expired window cannot be retried. Remaining time must be unambiguous wherever these appear, and it must be visible before the deadline is close, not only when it is.

**Finding 5 — `BOOKING-002` is rare, blocking, and externally timed.** The alternative-acceptance deadline is set by the provider response rule — 12 hours or two hours before the appointment, whichever is earlier. The patient did not choose this deadline and may not be in the app when it starts running. Combined with `Q-PLATFORM-005` (no confirmed patient notification surface), this is the weakest re-entry path in the product and is recorded as such.

**Finding 6 — `OPS-001` is the true home screen for six distinct staff roles.** Operations staff, verification staff, finance reviewer, claim reviewer, review integrity reviewer and clinic representative all begin work from a scoped queue. That makes the queue an organism-level surface on two platforms, not a report, and it makes the unfinalized work-item state vocabulary (`Q-OPS-002`) a structural problem rather than a labelling one.

## 5. Content and Data Inventory

From `docs/database/ERD.md` and `docs/api/API_CONTRACTS.md` — only the entities users actually encounter. Cardinality is structure: one-to-many means a list, table or repeater exists downstream.

Volume figures are scaled to the established operating envelope: Aleppo only, low thousands of users (`PO-2026-08-23` decision 7), with `NFR-PLATFORM-001` providing engineering headroom of 10,000 identities, 3,000 monthly and 500 daily active users.

| Entity | Schema status | Encountered by | Volume per parent | Volatility | Identifying field |
|---|---|---|---|---|---|
| `service_groups` | Existing | All | 4 (G01–G04) | very low | `code` |
| `services` | Existing | All | 26 provisional across 4 groups | very low | `code`, `slug` |
| `service_definitions` | Existing | Admin; Clinic | many versions per service, one active | low | `version` + audience |
| `service_launch_gates` | Existing | Admin | 4 gate types, append-only decisions per definition | low, expiry-driven | gate type + sequence |
| `clinical_reviewer_credentials` | Existing | Admin | 1 current per reviewer, immutable snapshots | low, expiry-driven | reviewer + snapshot |
| `identity_contacts` | Proposed | Patient; Applicant | 1–2 per identity | very low | verified contact |
| `contact_verification_challenges` | Proposed | Patient; Applicant | short-lived, throttled to 3 per 15 minutes | very high, expires in 5 minutes | challenge id |
| `guardian_grants` | Proposed | Patient; Guardian; Admin | 0–few per patient | low, revocation is immediate | grant id + effective period |
| `clinics` | Proposed | Clinic; Admin | low thousands platform-wide | very low | display name |
| `branches` | Proposed | All | 1–few per clinic; primary Aleppo branch required at onboarding | very low | branch name + area |
| `providers` | Proposed | All | 1–many per clinic | very low | provider name |
| `provider_branch_assignments` | Proposed | Clinic; Admin | many-to-many | low | provider + branch |
| `staff_scope_grants` | Proposed | Clinic; Admin | few per staff identity | low, revocation immediate | grant + effective period |
| `policy_versions` | Proposed | Admin | many per policy key, one effective | low | key + scope + version |
| `service_activation_requests` | Proposed | Clinic; Admin | one per provider + service + branch | medium during onboarding | request id |
| `approved_facts` | Proposed | Clinic; Admin | many per provider/branch | medium | fact type + scope |
| `provider_service_prices` | Proposed | All | one effective per provider + service + branch | medium | amount + currency + effective period |
| `evidence_items` | Proposed | All, scope-filtered | up to 10 files per action | medium; quarantined until scan passes | opaque UUID |
| `evidence_bindings` | Proposed | Clinic; Admin | many per owning record | medium | binding id |
| `eligibility_decisions` | Proposed, immutable | All, role-filtered | many per provider + service + branch, one effective | high — recomputed on any influential change | decision id + evaluated at |
| `eligibility_gate_results` | Proposed | Admin; Clinic (safe subset) | many per decision | high | gate type |
| `appointment_slots` | Proposed | All | many per branch per day | very high | slot id + time |
| `bookings` | Proposed | All | many per patient and per branch | high | booking id |
| `booking_alternatives` | Proposed | Patient; Clinic | 0–few per booking | high, deadline-bound | proposal id |
| `booking_events` | Proposed, append-only | All, role-filtered | many per booking | append-only | event id + occurred at |
| `cases` | Proposed | All, role-filtered | one per treatment episode | medium | case id |
| `treatment_plan_versions` | Proposed | Patient; Clinic; Admin | many per case, one accepted at a time | medium | version |
| `treatment_plan_stages` | Proposed | Patient; Clinic | several per plan version | medium | stage order + name |
| `accepted_treatment_snapshots` | Proposed, immutable | All, role-filtered | one per acceptance | immutable | snapshot id |
| `case_treatment_stages` | Proposed | Patient; Clinic | several per case | high during treatment | stage id |
| `follow_ups` | Proposed | Patient; Clinic; Admin | few per case | medium, due-date driven | follow-up id + due at |
| `financial_terms_snapshots` | Proposed, immutable | All, role-filtered | one per accepted version | immutable | snapshot id + version |
| `financial_events` | Proposed, append-only | All, role-filtered | many per case | append-only | event id + occurred at |
| `reviews` | Proposed | All | at most one active per verified experience | low | review id |
| `review_appeals` | Proposed | Clinic; Admin; Patient where policy permits | 0–few per review | low | appeal id |
| `claims` | Proposed | All, role-filtered | 0–few per case | low but deadline-driven | claim id |
| `claim_deadline_events` | Proposed, append-only | All, role-filtered | many per claim | append-only | event id |
| `claim_decisions` | Proposed, immutable | All, role-filtered | one per decided path | immutable | decision id |
| `claim_appeals` | Proposed | All, role-filtered | 0–few per decision | low | appeal id |
| `work_items` | Proposed | Clinic; Admin | many per staff scope | very high | work item id + due at |
| `audit_events` | Proposed, append-only | Admin (auditor) | very many | append-only | event id + correlation |
| `idempotency_records` | Proposed | Admin (technical) | one per sensitive command | high | key + scope |
| `integrity_exceptions` | Proposed | Admin | few | low | exception id |
| `notification_intents` | Proposed | Admin; recipients where a surface exists | many per domain event | high | intent id |
| `legal_holds` | Proposed | Admin | few | very low | hold id |

### 5.1 Structural consequences

**Nine entities are immutable or append-only.** `eligibility_decisions`, `accepted_treatment_snapshots`, `financial_terms_snapshots`, `financial_events`, `booking_events`, `claim_decisions`, `claim_deadline_events`, `audit_events` and launch-gate decisions can never be edited or deleted through any interface. No screen in this product may present a generic edit or delete affordance for them. Corrections are new versions, appended events or state transitions (`CROSS_PLATFORM_BEHAVIOR` section 4).

**Two entities are the highest-volatility things a user looks at.** `eligibility_decisions` and `appointment_slots` can change between a screen loading and the user acting on it. Every surface built on them needs a staleness answer and a revalidation-failure path — this is why `ERR-ELIG-001`, `ERR-ELIG-002` and `ERR-BOOKING-001` exist.

**One entity is deliberately partly invisible.** `eligibility_decisions` carries gate results including internal risk `I`, which is never exposed to patients or to ordinary provider actors. The same record produces three materially different projections. That is a field-filtering requirement, not a screen-splitting one.

**Worst-case content is a real risk and must be sized for in UX Phase 2.** Arabic service and group names at the largest supported text size; mixed Arabic and Latin codes such as `G01-S01` inside right-to-left text; long clinic legal names; amounts with currency and thousands separators; eleven-word status explanations; and a case timeline with dozens of ordered events.

## 6. Design Principles for UberTib

Five principles. Each is derived from something specific in the sources and each resolves a real trade-off. None is a platitude.

### Principle 1 — Practical meaning before internal symbols, everywhere, for everyone

**Derived from:** `BP-11`; `FR-CATALOG-001`; `FR-ELIG-016`; `FR-ELIG-017`; `PERMISSIONS_MATRIX` section 5; `PO-UX-04` prohibitions.

Users encounter what a thing means for their decision. They never encounter the mechanism that produced it. This is not only a patient rule: `FR-ELIG-007` forbids the activation interface itself from offering a control that chooses a grade, `P`, `H` or `I`, so it binds the Clinic panel too. Only explicitly authorized internal Admin roles see internal components, and no interface anywhere exposes raw `I` to a patient or an ordinary provider actor.

**Trade-off it resolves:** transparency versus comprehension. The temptation is to show the whole computation as proof of fairness. The requirements resolve it the other way — show the practical outcome, the controlling reason, the assessment date, and the action available. `PENDING_EVALUATION` and grade `F` get visibly different treatments because conflating them is a requirement violation, not a copy preference (`BP-05`, `FR-ELIG-008`, `FR-ELIG-013`).

### Principle 2 — Never claim a state the server has not committed

**Derived from:** `CROSS_PLATFORM_BEHAVIOR` sections 3.2, 3.4, 20; `NFR-PLATFORM-006`; `FR-AUDIT-003`; `NFR-AUDIT-002`.

Eleven named mutations are final only when Laravel commits them. A notification that fails to deliver never reverses a committed state, and a committed state is never presented as pending because a notification did not arrive. On a weak connection the honest states are pending, failed, retrying and completed — never an optimistic guess about a safety-critical outcome.

**Trade-off it resolves:** responsiveness versus truth. Optimistic UI is correct for a filter and dangerous for a booking confirmation, a plan acceptance, or a financial assertion. The line is drawn at whether a wrong guess would mislead someone about a clinical, financial or authorization fact.

### Principle 3 — For episodic actors, prominence follows the journey, not the frequency

**Derived from:** finding 2 in section 4.2; the patient's bursty usage shape; `FR-CLINICAL-005`.

The patient opens the app because something is happening. What is prominent is what their case needs from them right now — a plan awaiting acceptance, an alternative time about to lapse, claim evidence due, a financial event awaiting their response. Between cases, the same surface is near-empty and should say so plainly rather than manufacturing activity.

**Trade-off it resolves:** stable navigation versus relevant navigation. A fixed information architecture is easier to learn, but the patient never uses it often enough to learn it. Attention-driven prominence wins for the patient and loses for staff, who work the same queue every day and benefit from stability. This is a second concrete reason the three platforms cannot share one IA.

### Principle 4 — Recoverable, and honest about what cannot be recovered

**Derived from:** `NFR-PLATFORM-006`; `STATE_MACHINES` section 14 deadline behavior; `FR-CLAIMS-003`; `ERROR_CATALOG` section 13 retry matrix.

Most failures in this product are recoverable and the interface should make recovery obvious — retry with the same idempotency key, choose another slot, correct a field, resume a draft. A few genuinely are not: an expired claim window, an expired appeal window, a lapsed provider response deadline, an immutable decision already issued. Those must be visible as approaching, not merely reported as missed.

**Trade-off it resolves:** reassurance versus accuracy. A uniformly encouraging interface would imply everything can be fixed later. The retry matrix in `ERROR_CATALOG` distinguishes 19 failures by whether retry helps at all, and the interface must reflect that distinction rather than smoothing it.

### Principle 5 — Show the human in every decision that a human owns

**Derived from:** `BP-09`; `BP-10`; `FR-CLAIMS-004`; `FR-CLINICAL-001`; `PERMISSIONS_MATRIX` section 16; `CROSS_PLATFORM_BEHAVIOR` section 16.

Where the requirements reserve a decision for an accountable person — a diagnosis, a treatment plan, a medical launch approval, a sensitive claim outcome, an appeal, a suspension review — the interface must attribute it to that person and must never present it as something the system concluded. Conversely, where the system genuinely did compute an outcome, it must not be dressed up as a human judgement.

**Trade-off it resolves:** the appearance of objectivity versus accountability. An outcome framed as an impartial calculation is easier to deliver and impossible to appeal. Naming the accountable human is what makes the appeal paths in `FR-REVIEWS-002` and `FR-CLAIMS-005` mean anything.

## 7. Constraints

### 7.1 Platform profile constraints

| Platform | Profile | What the profile forecloses |
|---|---|---|
| Patient app | **C** — React Native | No hover state exists; press, long-press and swipe replace it. Platform navigation paradigm, not a ported web sidebar. Platform touch minimums. Platform text scaling at maximum size. Safe areas. Additional required states: offline, background-refresh, pull-to-refresh, permission-prompt. |
| Clinic / Doctor | **A** — Filament 5 panel | The framework supplies the shell, navigation, tables, forms, notifications and authorization hooks. This chain specifies configuration and targeted custom views, and classifies every unit Stock, Extended or Custom. A specification that would require overriding framework internals is a cost that belongs in a decision, not in a spec. |
| Admin | **A** — Filament 5 panel | Same as Clinic. The panel shell already exists at `/admin` with panel id `admin`; it currently registers only stock pages and widgets. Everything domain-specific is new. |

Emitting a specification that does not apply to the declared profile is a defect caught at every verification gate. In particular, no hover row may ever be emitted for the Patient app.

### 7.2 Accessibility

**Target: WCAG 2.2 AA**, from `NFR-PLATFORM-005`. This chain specifies obligations; it never claims conformance.

The same requirement adds product-specific obligations beyond the standard: 100% of production labels, validation, states and recovery guidance avoid untranslated internal codes, and status, error, protection, eligibility and urgency never rely on colour alone. The second is unusually load-bearing here, because eligibility and protection states are exactly the things a designer would naturally encode chromatically.

### 7.3 Locale, direction and formatting

Arabic-first and right-to-left for production patient and staff journeys (`NFR-PLATFORM-005`). Mixed-direction content is unavoidable and must be handled deliberately: service codes such as `G01-S01`, version numbers, amounts, dates and Latin clinic names appear inside Arabic text.

Single operating locale — Aleppo, Syria (`PRD` section 4.1). One timezone. No multi-region formatting requirement in V1. Currency handling follows the amount plus currency pairing that `financial_terms_snapshots` and `financial_events` carry; the sources fix no display convention, so that is a UX Phase 3 decision.

### 7.4 Performance budgets

From `NFR-PLATFORM-001`, these bound what the interface may ask for:

- ordinary API reads at the 95th percentile within 500 milliseconds; writes within 800 milliseconds; provider search within 1 second;
- 100 concurrent authenticated sessions; 75 requests per second burst within the same latency and error thresholds;
- 100 concurrent attempts on a single slot must never exceed configured capacity.

The provider-search budget is the loosest and it sits on the patient's most important discovery job, so search must show progress rather than appear stalled. The capacity guarantee is why a booking can fail at the last step with `ERR-BOOKING-001` and why that path is designed, not treated as an anomaly.

### 7.5 Connectivity

Weak and intermittent connectivity is an established condition of use, not an edge case (`NFR-PLATFORM-006`). Eligible in-progress data must be recoverable without creating a submitted record; interrupted operations must expose pending, failed, retrying and completed states; and a network retry of an already committed command must create zero duplicate bookings, evidence, claims or financial events.

There is no assumed real-time transport (`CROSS_PLATFORM_BEHAVIOR` section 3.7). No WebSocket, push, SMS or email delivery may be relied on for correctness. Every platform refreshes authoritative state on entry, on refocus, on explicit refresh and after its own mutations.

### 7.6 Financial boundary — a hard interface constraint

V1 performs no electronic payment, wallet, escrow, custody, transfer, settlement or automated refund (`FR-FINANCE-007`, `NFR-FINANCE-001`, `PO-2026-08-23` decision 9).

This is a design constraint, not only an engineering one. No screen may contain a pay, wallet, balance, top-up, withdraw or platform-refund affordance. No copy may state or imply that UberTib held, paid, insured or refunded money. `NFR-FINANCE-001` explicitly makes UX copy verification part of its measurement method.

### 7.7 Medical and clinical boundary

The 26 dental service records are provisional evaluation records, not clinically approved production content (`Q-CATALOG-001`). Production `S`, `P`, `H` and `I` values await licensed clinical approval (`Q-ELIG-001`). No interface may present provisional catalog data as clinically production-approved, and no interface may imply UberTib diagnoses, treats, insures or guarantees an outcome.

Protection must be presented as its documented meaning with funded monetary protection disabled — never as insurance, reimbursement or a guaranteed result (`FR-ELIG-010`).

### 7.8 Authorization is server-side and interface-independent

Hiding an action is never an authorization control (`PERMISSIONS_MATRIX` section 1). The same decision is enforced across REST endpoints, both Filament panels, evidence paths, queued jobs, work queues, reports, exports and notifications (`PERMISSIONS_MATRIX` section 19).

For this chain that means two things. Permission-denied is a designed state on every protected surface, not an assumed impossibility. And a revoked grant must stop an already-open page from continuing to mutate — a stale session is not a valid authorization context (`CROSS_PLATFORM_BEHAVIOR` section 6.1).

### 7.9 Open constraints carried into this phase

| ID | Severity | Constraint on UX |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Complete reconciliation against the authoritative SRS cannot be claimed. Journey coverage here is against the approved `.spec` baseline. |
| `Q-BOOKING-001` | Major | The canonical booking state after an alternative expires or is declined must not be inferred. No terminal node may be drawn for it. |
| `Q-BOOKING-002` | Major | The existing-booking review workflow after eligibility suspension has no defined actor, state effect, deadline or outcome. That branch cannot be completed. |
| `Q-PLATFORM-003` | Major | No evidence binary-transfer contract exists. Every upload step is defined up to the point of transfer and no further. |
| `Q-CATALOG-001`, `Q-ELIG-001` | Major | Production clinical content and classification policy are ungated. Constrains content, not structure. |
| `Q-PLATFORM-002` | Major | Final retention and deletion periods await legal validation. |
| `Q-OPS-001` | Major | Hosting topology unresolved; no base URL or environment can be fixed. |
| `Q-PLATFORM-004` | Minor | Expected population versus engineering envelope. |

New open items raised by this phase are recorded in `UPSTREAM_GAPS.md`: `Q-OPS-002`, `Q-PLATFORM-005`, `Q-PLATFORM-006`, `Q-PLATFORM-007`, `Q-IDENTITY-001`, `Q-REVIEWS-001`, `Q-BOOKING-003`, `Q-CLINICAL-001`, and `CONFLICT-BOOKING-001`.

## 8. What This Phase Did Not Decide

No layout, no region, no component, no token, no colour, no type, no icon, no final copy string, no widget, no data-state behavior. Those belong to UX Phases 2, 3 and 4 and reopening them here would be phase bleed in the opposite direction.

State meanings are recorded as *what must be communicated to which actor*. The final Arabic label for every state is a UX Phase 3 `TXT-*` allocation against `CONTENT_GUIDE.md`, and canonical Arabic error text already lives in `docs/api/ERROR_CATALOG.md`.




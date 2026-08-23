# Data Model

## Catalog identity

`service_groups` stores immutable public `code` plus mutable names, descriptions, ordering, and activation state. `services` stores immutable `code`, `slug`, and group membership plus mutable patient-facing copy, ordering, and activation state. Database triggers enforce the identity boundary even for bulk writes.

## Versioned definitions

`service_definitions` stores service-scoped `version`, lifecycle `status`, Evaluation/Production `audience`, provenance, JSON card, canonical SHA-256 `content_hash`, and effective period.

- Draft -> Reviewed -> Scheduled -> Active is the controlled forward lifecycle.
- Active may become Retired or Superseded; terminal states cannot reactivate.
- Activated identity/content is immutable at model and database boundaries.
- A production activation requires a complete card and the non-funded V1 boundary.

## Clinical reviewer credential snapshots

`clinical_reviewer_credentials` is append-only and contains:

- reviewer and independent verifier users;
- Verified, Revoked, or Expired status;
- issuing authority and `dentistry` practice scope;
- hashed registration identifier, never a public license number;
- verification evidence reference, verification time, and expiry;
- optional `supersedes_credential_id` for an append-only status change.

A verified snapshot is current only if it is unexpired and has no successor status snapshot.

## Launch gate decisions

`service_launch_gates` is an append-only decision log. Each record contains definition, gate type, sequence, state, actor, accountable role, immutable definition hash, evidence reference, reason, decision time, expiry, and an optional clinical credential for Medical decisions.

The unique key is `(service_definition_id, type, sequence)`. The current state is the highest sequence for each type; prior decisions remain auditable.

## Derived readiness

`ProductionReady(definition, at)` is true only when:

- the definition is Active and Production;
- the card is structurally complete and explicitly non-funded;
- the latest Medical, Legal, Operational, and Technical decisions are Approved, current, evidence-backed, role-correct, and hash-bound;
- the Medical actor owns a current independently verified dental credential snapshot.

The value is derived and never persisted as a mutable boolean.

# Tasks

## Delivered

- [x] T001 Register the versioned public catalog route and explicit resources.
- [x] T002 Add server-only catalog and record-only/non-funded modes.
- [x] T003 Persist stable groups, services, versioned definitions, clinical credential snapshots, and append-only gate decisions.
- [x] T004 Seed the SRS-derived provisional G01-G04 evaluation baseline with useful Arabic purpose copy.
- [x] T005 Preserve operational deactivation during idempotent reseeding.
- [x] T006 Validate complete production service-card payloads.
- [x] T007 Bind approvals to actor, accountable role, evidence, decision time, expiry, and immutable content hash.
- [x] T008 Require a current independently verified dental credential for Medical approval.
- [x] T009 Invalidate credentials through append-only successor status snapshots.
- [x] T010 Publish/supersede production definitions transactionally.
- [x] T011 Select the highest applicable version without unsafe fallback.
- [x] T012 Enforce stable identity, activated-definition immutability, and append-only history at model and database boundaries.
- [x] T013 Reject funded protection in every V1 definition state at model and database boundaries.
- [x] T014 Add public throttling and bounded cache headers.
- [x] T015 Add contract, safety, lifecycle, negative-path, and bulk-write regression tests.

## Deferred bounded work

- [ ] T016 Implement authenticated scoped staff roles and separation of duties for decision commands.
- [ ] T017 Implement Filament approval and evidence workflows; expose no generic CRUD.
- [ ] T018 Persist private evidence metadata/bytes and immutable audit events.
- [ ] T019 Obtain product and licensed clinical approval for final service granularity and each complete production card.
- [x] T020 Verify migrations, triggers, seeding, and focused tests on a disposable MySQL 8.4 database.
- [ ] T021 Extend launch scopes to providers and geographic expansion.
- [x] T022 Preserve a configurable MySQL test profile for local and CI execution.

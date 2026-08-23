# Non-Functional Requirements Index

**Baseline:** Approved  
**Date:** 2026-08-23  
**Count:** 14 measurable quality requirements

| Requirement | Title | Source | Customer Needs |
|---|---|---|---|
| [NFR.01](NFR.01-performance-and-scale.md) | Performance and Scale | SRS §18 and PO-2026-08-23 | CN.01.1, CN.04.1, CN.10.1, CN.14.1 |
| [NFR.02](NFR.02-availability-backup-and-recovery.md) | Availability, Backup, and Recovery | SRS §18 and PO-2026-08-23 | CN.04.1, CN.07.2, CN.13.2, CN.14.2 |
| [NFR.03](NFR.03-authorization-and-tenant-isolation.md) | Authorization and Tenant Isolation | SRS §§15–18 | CN.10.2, CN.11.1, CN.11.2 |
| [NFR.04](NFR.04-authentication-mfa-and-otp.md) | Authentication, MFA, and OTP Safety | SRS §15 and PO-2026-08-23 | CN.11.1, CN.12.1 |
| [NFR.05](NFR.05-private-file-and-evidence-security.md) | Private File and Evidence Security | SRS §§15–18 and PO-2026-08-23 | CN.02.1, CN.07.1, CN.09.2, CN.11.1 |
| [NFR.06](NFR.06-privacy-retention-and-deletion.md) | Privacy, Retention, and Deletion | SRS §§15–18 and PO-2026-08-23 | CN.11.1, CN.11.2, CN.13.2 |
| [NFR.07](NFR.07-audit-and-provenance-integrity.md) | Audit and Provenance Integrity | SRS §§15–18 | CN.11.2, CN.13.2 |
| [NFR.08](NFR.08-concurrency-and-idempotency.md) | Concurrency and Idempotency | SRS FR-045 and §18 | CN.04.1, CN.06.1, CN.12.1 |
| [NFR.09](NFR.09-arabic-rtl-and-accessibility.md) | Arabic, RTL, and Accessibility | SRS §§6–18 | CN.03.1, CN.12.2 |
| [NFR.10](NFR.10-weak-connectivity-resilience.md) | Weak-Connectivity Resilience | SRS §§6–18 | CN.12.1, CN.12.2 |
| [NFR.11](NFR.11-maintainability-and-contract-versioning.md) | Maintainability and Contract Versioning | Approved architecture constraint PO-2026-08-23 | CN.12.1, CN.13.1, CN.14.2 |
| [NFR.12](NFR.12-observability-and-queue-operations.md) | Observability and Queue Operations | SRS §§14–18 | CN.10.1, CN.14.1, CN.14.2 |
| [NFR.13](NFR.13-zero-money-movement-safety.md) | Zero-Money-Movement Safety | SRS FR-047 and PO-2026-08-23 | CN.06.1, CN.06.2, CN.09.2 |
| [NFR.14](NFR.14-immutable-snapshot-and-event-integrity.md) | Immutable Snapshot and Event Integrity | SRS FR-043, FR-044, and FR-046 | CN.05.2, CN.06.1, CN.13.2 |

## Governance

- Numeric operational values confirmed on 2026-08-23 are provisional, versioned defaults.
- Production activation remains subject to the medical, legal, operational, security, recovery, and technical readiness gates.
- Quality criteria apply consistently to the REST API, Filament workspaces, React Native client, background processing, private files, reports, and exports.


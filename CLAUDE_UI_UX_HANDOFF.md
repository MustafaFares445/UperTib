# Claude UI/UX Handoff

## Feature

SRS-derived Arabic dental service catalog evaluation and production-readiness visibility.

This handoff is limited to the first verified backend slice. The current 26 service records are a provisional evaluation decomposition of the examples on SRS page 10. They are not a final clinically approved production catalog.

## Product Goal

Let the product owner and customer inspect an understandable Arabic G01-G04 dental catalog while ensuring that no clinically incomplete service appears ready for real patients. The interface must communicate evaluation, pending clinical review, non-funded protection, and temporary unavailability without implying diagnosis, booking eligibility, payment execution, or medical approval.

## Relevant SRS Requirements

- Authoritative source: `Docs/UberTib_SRS_Etkan_v1.1.pdf`, especially page 10 and FR-002.
- [`FR.12.2.1`](.spec/functional-requirements/FR.12.2.1-understandable-service-catalog.md): understandable Arabic catalog.
- [`FR.14.2.1`](.spec/functional-requirements/FR.14.2.1-launch-readiness-gate.md): current Medical, Legal, Operational, and Technical gates.
- [`FR.13.1.1`](.spec/functional-requirements/FR.13.1.1-policy-version-lifecycle.md): versioned policy lifecycle.
- [`NFR.09`](.spec/non-functional-requirements/NFR.09-arabic-rtl-and-accessibility.md): Arabic, RTL, and accessibility.
- [`NFR.10`](.spec/non-functional-requirements/NFR.10-weak-connectivity-resilience.md): weak-connectivity resilience.
- [`NFR.13`](.spec/non-functional-requirements/NFR.13-zero-money-movement-safety.md): no platform money movement.
- Product decision [`PO-2026-08-23`](.spec/decisions/PO-2026-08-23-confirmed-defaults.md).

## User Roles

- Product evaluator or customer reviewer: may inspect the Evaluation catalog in a non-production environment.
- Patient or guardian: may eventually see only Production-ready services; the current slice does not provide search, provider selection, booking, or service detail.
- Anonymous public client: may call the read endpoint selected by server mode.
- Product, medical, legal, operational, and technical staff: their future approval interfaces are not available in this slice and must not be simulated with generic CRUD.

## Completed Backend Work

- Stable G01-G04 groups and 26 provisional evaluation records with Arabic and English names.
- A useful non-diagnostic Arabic purpose for every provisional service.
- Versioned Evaluation and Production service definitions.
- Complete production-card validation.
- Append-only, content-hash-bound readiness decisions.
- Current, independently verified dental credential requirement for Medical approval.
- Append-only credential revocation/expiry snapshots.
- Transactional publication and supersession with no older-version fallback.
- Stable public identity and immutable history at model and database-trigger boundaries.
- Server-only Evaluation/Production mode, with Evaluation forbidden under `APP_ENV=production`.
- V1 `record_only_non_funded` mode; funded protection is rejected.
- Public rate limiting and a 60-second bounded cache policy.
- SQLite and MySQL 8.4 verification.

## Available Endpoints

### List visible service groups

- Method: `GET`
- Path: `/api/v1/catalog/service-groups`
- Authentication: none
- Permission: public read; the server configuration chooses Evaluation or Production
- Request body: none
- Query parameters: none; clients cannot select catalog mode
- Rate limit: 60 requests per minute per IP
- Cache policy: public, maximum age 60 seconds, ETag enabled

Successful response:

```json
{
  "data": [
    {
      "code": "G01",
      "name": {
        "ar": "الجراحة واللثة وزراعة الأسنان",
        "en": "Oral Surgery, Periodontics and Dental Implants"
      },
      "description_ar": "مجموعة أولية لخدمات جراحة الفم واللثة وزراعة الأسنان، وتخضع تفاصيل كل خدمة للمراجعة.",
      "services": [
        {
          "code": "G01-S01",
          "slug": "tooth-extraction",
          "name": {
            "ar": "القلع",
            "en": "Tooth Extraction"
          },
          "description_ar": "إزالة سن يقرر طبيب الأسنان بعد الفحص أنه يحتاج إلى القلع، مع توضيح التحضير والمتابعة المتوقعة.",
          "definition": {
            "version": 1,
            "audience": "evaluation",
            "clinical_review_state": "pending",
            "production_ready": false,
            "protection": {
              "funded": false
            }
          }
        }
      ]
    }
  ],
  "meta": {
    "mode": "evaluation"
  }
}
```

Response fields are intentionally limited. The client receives no database IDs, reviewer identity, reason, evidence location, credential, price, risk tier, internal classification value, or full clinical card.

Errors:

- `429 Too Many Requests`: the public rate limit was exceeded. Laravel currently supplies the transport response; there is not yet a stable domain error code.
- `500 Internal Server Error`: fail-closed server misconfiguration or unexpected processing error. Production UI must show a neutral retryable service-unavailable state and must not expose exception details.
- Network/offline: client-side transport state. The API has a 60-second cache directive, but no mobile persistence contract has yet been approved.

Authoritative contract: [`openapi.yaml`](UberTip-Backend/specs/001-service-catalog-launch-readiness/contracts/openapi.yaml).

## Domain States

### Catalog mode

- `evaluation`: provisional definitions may be displayed to product evaluators; this mode cannot run in the production application environment.
- `production`: only the highest applicable complete and fully approved Production definition is returned.

### Service definition summary

- `audience`: `evaluation` or `production`.
- `clinical_review_state`: `pending` or `approved`.
- `production_ready`: boolean derived at the captured request time.
- `protection.funded`: always `false` in V1.

### Important combinations

- Evaluation baseline: `evaluation`, `pending`, `production_ready=false`, `funded=false`.
- Production-published service: `production`, `approved`, `production_ready=true`, `funded=false`.
- Production with no ready services: successful `200` with an empty `data` array.
- Inactive group/service: omitted from the response.

## Allowed State Transitions

These transitions exist in the backend but have no public write interface yet:

- Service definition: `Draft -> Reviewed -> Scheduled -> Active`.
- Active definition: `Active -> Retired` or `Active -> Superseded`.
- Retired and Superseded definitions cannot become Active again.
- A newer production publication supersedes an older active version transactionally.
- Gate decisions are append-only sequences; Pending, Approved, Rejected, Revoked, and Expired history is retained. The latest sequence governs.
- Clinical credential status changes are append-only snapshots. A later Revoked or Expired snapshot invalidates an earlier Verified snapshot.

Do not design direct edit/delete controls for active definitions, gate decisions, or credential snapshots.

## Required Screens

### Evaluation catalog screen

- Profile: React Native, Profile C in the UX prompt conventions.
- Audience: product/customer evaluator in a non-production build.
- Purpose: review the provisional Arabic group and service structure and report catalog feedback.
- Required visible qualification: an explicit non-production/evaluation context and pending clinical review where applicable.
- Prohibited implications: no Book, Choose doctor, Pay, Protected amount, Guaranteed result, or clinical recommendation action.

### Production catalog availability state

- Profile: React Native, Profile C.
- Audience: future patient/guardian discovery shell.
- Purpose in this slice: render the returned production list or a safe empty/unavailable state.
- Do not invent provider, search, price comparison, booking, or service-detail behavior; their APIs do not exist yet.

### Approval and catalog-governance screens

- Profile: Filament, Profile A.
- Status: blocked for UI implementation in this slice.
- Reason: authenticated scoped roles, private evidence records, stable approval errors, and staff write endpoints are deferred.
- Claude may document upstream UX questions, but must not create a generic CRUD workflow that bypasses the domain actions.

## Data Displayed on Each Screen

Evaluation and production catalog:

- `meta.mode` as environment/context information.
- Group code, Arabic name, optional English name, and Arabic description.
- Ordered services: stable code, slug, Arabic name, optional English name, and Arabic purpose.
- Definition version.
- Human-readable clinical review state.
- Human-readable production readiness only when useful to the evaluation context.
- Non-funded status only where it prevents a misleading protection/payment interpretation.

Internal symbols, IDs, hashes, approval evidence, credentials, reviewer names, and empty clinical-rule arrays are not available and must not be fabricated.

## Available Actions

- Load and retry the catalog.
- Pull to refresh if selected by the React Native design workflow.
- Navigate among groups or reveal service purpose using only the single response payload.
- Provide external evaluation feedback only if another approved channel already exists; no feedback API exists in this slice.

There is no supported mutation, booking, payment, provider-selection, approval, activation, edit, or delete action.

## Form Fields

None. The available endpoint is read-only and accepts no request fields.

## Validation Rules

- The client must not send or expose a catalog-mode selector to the endpoint.
- Treat codes and slugs as stable identifiers, not editable labels.
- Do not infer clinical approval from an Active evaluation definition.
- Do not turn missing fields into invented defaults.
- Do not display `protection.funded=false` as a financial guarantee; it means the platform provides no funded protection.

## Loading States

- Initial full-screen or content-region loading state.
- Pull-to-refresh/background refresh state without replacing already readable content, if that behavior is selected in Phase 1/2.
- Avoid a loading state that resembles a confirmed list of services.
- Respect RTL reading order, text scaling, reduced motion, and native safe areas.

## Empty States

- Evaluation mode empty: configuration/data problem; show a retryable neutral message and report the environment context without implying there are no dental services in Aleppo.
- Production mode empty: no service currently satisfies publication requirements. Use plain language such as services are not available through UberTib yet; do not present pending services as selectable.
- Group omission: normal filtering behavior; do not render empty group containers unless UX research justifies them.

Final Arabic copy belongs to the UX writing workflow and must be reviewed; the examples above define meaning, not final wording.

## Success States

- Catalog loads with groups and services in backend order.
- Evaluation mode remains visibly distinguishable from a real-patient production experience.
- A refreshed version may change service membership/version; stable codes should preserve list identity where appropriate.

No toast is required merely because a read succeeded.

## Error States

- Offline or timeout: preserve safe previously loaded content only under a documented cache policy; otherwise offer Retry.
- `429`: explain that requests are temporarily limited and retry later; repeated automatic retry must use backoff.
- `500`: generic service-unavailable state with Retry. Do not display server messages or stack details.
- Invalid/malformed response: fail safely and show unavailable; do not partially enable actions from incomplete data.
- Partial group/service parsing: the current response is atomic. Prefer rejecting a malformed response over mixing valid-looking and unknown clinical states.

## Permission-Based UI Behavior

- The read endpoint is anonymous, so this screen has no permission-denied state.
- Evaluation mode is a deployment context, not a user permission and not an in-app toggle.
- Do not reveal staff approval controls based only on client role labels; future staff actions require backend authorization.

## Edge Cases

- Long Arabic service and group names at large text sizes.
- Mixed Arabic/English names, codes, and numerals in RTL layout.
- Zero groups, one group, or all four groups.
- A group with many future services beyond the current provisional counts.
- Catalog changes after the 60-second cache interval.
- A higher production version becomes unready; the service disappears instead of falling back to an older version.
- Operational deactivation removes a group or service without deleting its history.
- An approval expires during a later request; treat each response as a complete snapshot.
- Weak connection, duplicate refresh gestures, app background/resume, and stale local content.
- `funded` must never be represented as a wallet, coverage balance, reimbursement promise, or payment feature.

## Existing Components That Can Be Reused

There is no React Native application or existing Filament catalog resource in the repository.

Claude should use the repository design-kit sources only after following the UX pipeline gates:

- `components/navigation.md`
- `components/data-display.md`
- `components/feedback.md`
- `components/templates.md`
- `accessibility/i18n-rtl.md`
- `accessibility/cognitive.md`
- `frameworks/adapters/react-native.md`
- `tokens/*.json`

These are design inputs, not implemented UberTib components.

## Relevant Files

- Pipeline entry: [`ux_START_HERE.md`](prompts/ux_START_HERE.md)
- Shared UX rules: [`ux_00_conventions.md`](prompts/ux_00_conventions.md)
- Requirements baseline: [`.spec`](.spec)
- Feature specification: [`spec.md`](UberTip-Backend/specs/001-service-catalog-launch-readiness/spec.md)
- API contract: [`openapi.yaml`](UberTip-Backend/specs/001-service-catalog-launch-readiness/contracts/openapi.yaml)
- Query behavior: [`ListVisibleServiceGroups.php`](UberTip-Backend/app/Actions/Catalog/ListVisibleServiceGroups.php)
- Public resources: [`ServiceGroupResource.php`](UberTip-Backend/app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php)
- Catalog seed copy: [`ServiceSeeder.php`](UberTip-Backend/database/seeders/ServiceSeeder.php)
- API behavior tests: [`ListServiceGroupsTest.php`](UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php)

## Unresolved UI/UX Decisions

These are deliberately not decided by Codex:

- Phase 1 information architecture and whether this is a standalone evaluation route or part of a future discovery journey.
- Evaluation-context banner, wording, and persistence.
- Group navigation pattern and service-purpose disclosure pattern.
- Whether English names are visible, secondary, or accessibility metadata.
- Final Arabic labels for Pending, Approved, unavailable, and non-funded state.
- Mobile cache persistence duration and stale-content treatment beyond the HTTP 60-second directive.
- Skeleton versus progress treatment under weak connectivity.
- Analytics for evaluation review; no analytics contract exists.
- Final accessibility target must be declared in the UX pipeline; the requirements baseline expects Arabic RTL and accessible semantics.

## Recommended Implementation Order for Claude

1. Treat this as a new React Native UI project with Profile C and no existing screen inventory.
2. Run the prompt pipeline from `ux_START_HERE.md`; do not skip Phase 1 or its human gate.
3. Register this handoff, the `.spec` baseline, and the OpenAPI file as engineering inputs.
4. Limit the first UX scope to the Evaluation catalog and the Production empty/list state.
5. Raise upstream questions for any desired provider, search, price, booking, payment, service-detail, feedback, or staff-approval behavior; those contracts do not exist.
6. Complete content-first structure, IA, flows, and wireframes before choosing visual tokens or components.
7. Use the React Native adapter, RTL guidance, text scaling, offline state, pull-to-refresh, safe-area, and reduced-motion checks required by Profile C.
8. Run the repository design verification commands required by `CLAUDE.md` before any visual implementation is reported complete.

Codex intentionally stopped before UI/UX design or implementation, as required by the project boundary.

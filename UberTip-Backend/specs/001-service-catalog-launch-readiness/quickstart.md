# Quickstart

## Local evaluation

Configure:

```dotenv
APP_ENV=local
UBERTIB_CATALOG_MODE=evaluation
UBERTIB_FINANCIAL_MODE=record_only_non_funded
```

Then run:

```text
php artisan migrate:fresh --seed
php artisan serve
```

Request `GET /api/v1/catalog/service-groups` to inspect the provisional Arabic evaluation catalog. The seeded definitions remain clinically pending and never qualify for production.

## Production safety

Production operators must use:

```dotenv
APP_ENV=production
UBERTIB_CATALOG_MODE=production
UBERTIB_FINANCIAL_MODE=record_only_non_funded
```

The application rejects Evaluation mode in the production environment. Production mode returns only the highest applicable version, and only when its complete card and all current evidence-bound approvals pass.

No production service card, clinical credential, or approval is seeded. The complete production payloads used in automated tests are fixtures, not medical or commercial defaults.

## Verification

```text
php artisan test --compact tests/Feature/Api/V1/Catalog tests/Feature/Models
composer test
composer validate --strict
composer audit --locked
```

Before deployment, also run `migrate:fresh --seed` and the focused catalog/persistence tests against a disposable MySQL 8 database.

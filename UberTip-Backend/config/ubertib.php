<?php

declare(strict_types=1);

return [
    'catalog_mode' => env('UBERTIB_CATALOG_MODE', 'production'),
    'financial_mode' => env('UBERTIB_FINANCIAL_MODE', 'record_only_non_funded'),
];

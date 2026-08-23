<?php

declare(strict_types=1);

namespace App\Domain\Catalog;

final class ServiceDefinitionPayload
{
    /**
     * @param array<array-key, mixed> $payload
     */
    public static function isCompleteForProduction(array $payload): bool
    {
        $referencePrice = data_get($payload, 'reference_price');

        return data_get($payload, 'schema_version') === 1
            && self::isNonEmptyString(data_get($payload, 'patient_purpose_ar'))
            && data_get($payload, 'clinical_review_state') === 'approved'
            && in_array(data_get($payload, 'risk.tier'), ['low', 'medium', 'high'], true)
            && self::isNonEmptyStringList(data_get($payload, 'doctor_requirements'))
            && self::isNonEmptyStringList(data_get($payload, 'branch_requirements'))
            && self::isNonEmptyStringList(data_get($payload, 'required_evidence'))
            && self::isNonEmptyStringList(data_get($payload, 'follow_up_rules'))
            && self::isNonEmptyStringList(data_get($payload, 'completion_rules'))
            && is_array($referencePrice)
            && data_get($referencePrice, 'currency') === 'SYP'
            && is_int(data_get($referencePrice, 'amount_minor'))
            && data_get($referencePrice, 'amount_minor') > 0
            && self::isNonEmptyString(data_get($referencePrice, 'source_reference'))
            && data_get($payload, 'protection.level') === 'none'
            && data_get($payload, 'protection.funded') === false
            && self::isNonEmptyStringList(data_get($payload, 'complaint_refund_escalation_rules'))
            && self::isNonEmptyString(data_get($payload, 'catalog_decision_reference'));
    }

    private static function isNonEmptyString(mixed $value): bool
    {
        return is_string($value) && mb_trim($value) !== '';
    }

    private static function isNonEmptyStringList(mixed $value): bool
    {
        if (! is_array($value) || $value === [] || ! array_is_list($value)) {
            return false;
        }

        foreach ($value as $item) {
            if (! self::isNonEmptyString($item)) {
                return false;
            }
        }

        return true;
    }
}

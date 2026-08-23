<?php

declare(strict_types=1);

namespace App\Enums;

enum ServiceLaunchGateType: string
{
    case Medical = 'medical';
    case Legal = 'legal';
    case Operational = 'operational';
    case Technical = 'technical';

    public function responsibleRole(): string
    {
        return match ($this) {
            self::Medical => 'licensed_clinical_reviewer',
            self::Legal => 'legal_accountable_owner',
            self::Operational => 'product_and_operations_owner',
            self::Technical => 'technical_accountable_owner',
        };
    }
}

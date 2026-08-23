<?php

declare(strict_types=1);

namespace App\Enums;

enum ServiceDefinitionStatus: string
{
    case Draft = 'draft';
    case Reviewed = 'reviewed';
    case Scheduled = 'scheduled';
    case Active = 'active';
    case Retired = 'retired';
    case Superseded = 'superseded';
}

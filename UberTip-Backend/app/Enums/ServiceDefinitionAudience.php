<?php

declare(strict_types=1);

namespace App\Enums;

enum ServiceDefinitionAudience: string
{
    case Evaluation = 'evaluation';
    case Production = 'production';
}

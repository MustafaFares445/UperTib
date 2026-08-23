<?php

declare(strict_types=1);

namespace App\Enums;

enum ClinicalReviewerCredentialStatus: string
{
    case Verified = 'verified';
    case Revoked = 'revoked';
    case Expired = 'expired';
}

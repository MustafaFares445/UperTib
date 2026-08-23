<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ServiceDefinitionAudience;
use App\Enums\ServiceDefinitionStatus;
use App\Models\Service;
use App\Models\ServiceDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceDefinition>
 */
final class ServiceDefinitionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'version' => 1,
            'status' => ServiceDefinitionStatus::Draft,
            'audience' => ServiceDefinitionAudience::Evaluation,
            'source_reference' => 'test-source',
            'definition' => self::pendingClinicalDefinition(),
            'effective_from' => null,
            'effective_until' => null,
        ];
    }

    public function activeEvaluation(): static
    {
        return $this->state(fn (): array => [
            'status' => ServiceDefinitionStatus::Active,
            'audience' => ServiceDefinitionAudience::Evaluation,
            'effective_from' => now(),
        ]);
    }

    public function activeProduction(): static
    {
        return $this->state(fn (): array => [
            'status' => ServiceDefinitionStatus::Active,
            'audience' => ServiceDefinitionAudience::Production,
            'definition' => self::completeProductionDefinition(),
            'effective_from' => now(),
        ]);
    }

    public function productionCandidate(): static
    {
        return $this->state(fn (): array => [
            'status' => ServiceDefinitionStatus::Scheduled,
            'audience' => ServiceDefinitionAudience::Production,
            'definition' => self::completeProductionDefinition(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public static function pendingClinicalDefinition(): array
    {
        return [
            'schema_version' => 1,
            'clinical_review_state' => 'pending',
            'risk' => [
                'tier' => 'pending_clinical_review',
            ],
            'doctor_requirements' => [],
            'branch_requirements' => [],
            'required_evidence' => [],
            'follow_up_rules' => [],
            'completion_rules' => [],
            'reference_price' => null,
            'protection' => [
                'level' => 'none',
                'funded' => false,
            ],
            'complaint_refund_escalation_rules' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function completeProductionDefinition(): array
    {
        return [
            'schema_version' => 1,
            'patient_purpose_ar' => 'وصف عربي واضح لغرض الخدمة دون تقديم تشخيص آلي للمريض.',
            'clinical_review_state' => 'approved',
            'risk' => [
                'tier' => 'medium',
            ],
            'doctor_requirements' => ['ترخيص مهني ساري ضمن نطاق طب الأسنان.'],
            'branch_requirements' => ['فرع موثق ومجهز لتقديم الخدمة المعتمدة.'],
            'required_evidence' => ['توثيق الحالة قبل الإجراء وبعده حسب البروتوكول.'],
            'follow_up_rules' => ['متابعة موثقة خلال المدة المحددة في البروتوكول.'],
            'completion_rules' => ['اكتمال الأدلة والمتابعة المطلوبة قبل إغلاق الحالة.'],
            'reference_price' => [
                'currency' => 'SYP',
                'amount_minor' => 10000000,
                'source_reference' => 'approved-test-price-reference',
            ],
            'protection' => [
                'level' => 'none',
                'funded' => false,
            ],
            'complaint_refund_escalation_rules' => [
                'تسجل الشكوى والحركة المالية للمراجعة التشغيلية خارج المنصة.',
            ],
            'catalog_decision_reference' => 'approved-product-and-clinical-test-decision',
        ];
    }
}

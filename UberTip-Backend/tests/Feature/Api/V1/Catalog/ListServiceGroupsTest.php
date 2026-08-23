<?php

declare(strict_types=1);

use App\Actions\Catalog\ListVisibleServiceGroups;
use App\Actions\Catalog\PublishServiceDefinition;
use App\Actions\Catalog\RecordServiceLaunchGateApproval;
use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\Service;
use App\Models\ServiceDefinition;
use App\Models\ServiceGroup;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(DatabaseSeeder::class);
});

it('seeds the SRS-derived provisional evaluation catalog with stable ordered codes', function (): void {
    $groups = ServiceGroup::query()
        ->withCount('services')
        ->orderBy('display_order')
        ->get();

    expect($groups->pluck('code')->all())
        ->toBe(['G01', 'G02', 'G03', 'G04'])
        ->and($groups->pluck('services_count')->all())
        ->toBe([8, 5, 6, 7])
        ->and(Service::query()->count())
        ->toBe(26)
        ->and(ServiceDefinition::query()->count())
        ->toBe(26)
        ->and(ServiceLaunchGate::query()->count())
        ->toBe(104);

    expect($groups->mapWithKeys(
        static fn (ServiceGroup $group): array => [
            $group->code => $group->services()->pluck('code')->all(),
        ],
    )->all())->toBe([
        'G01' => ['G01-S01', 'G01-S02', 'G01-S03', 'G01-S04', 'G01-S05', 'G01-S06', 'G01-S07', 'G01-S08'],
        'G02' => ['G02-S01', 'G02-S02', 'G02-S03', 'G02-S04', 'G02-S05'],
        'G03' => ['G03-S01', 'G03-S02', 'G03-S03', 'G03-S04', 'G03-S05', 'G03-S06'],
        'G04' => ['G04-S01', 'G04-S02', 'G04-S03', 'G04-S04', 'G04-S05', 'G04-S06', 'G04-S07'],
    ]);

    expect(Service::query()->where('code', 'G01-S01')->value('description_ar'))
        ->toBe('إزالة سن يقرر طبيب الأسنان بعد الفحص أنه يحتاج إلى القلع، مع توضيح التحضير والمتابعة المتوقعة.')
        ->and(Service::query()->where('description_ar', 'like', 'معلومات ومتطلبات خدمة%')->count())
        ->toBe(0);
});

it('reseeds without duplicates or reactivating an operationally disabled entry', function (): void {
    ServiceGroup::query()->where('code', 'G02')->update(['is_active' => false]);
    Service::query()->where('code', 'G01-S01')->update(['is_active' => false]);

    $this->seed(DatabaseSeeder::class);

    expect(ServiceGroup::query()->count())->toBe(4)
        ->and(Service::query()->count())->toBe(26)
        ->and(ServiceDefinition::query()->count())->toBe(26)
        ->and(ServiceLaunchGate::query()->count())->toBe(104)
        ->and(ServiceGroup::query()->where('code', 'G02')->value('is_active'))->toBeFalse()
        ->and(Service::query()->where('code', 'G01-S01')->value('is_active'))->toBeFalse();
});

it('returns the Arabic-first evaluation catalog without internal fields', function (): void {
    config(['ubertib.catalog_mode' => 'evaluation']);

    $response = $this->getJson(route('api.v1.catalog.service-groups.index'));

    $response
        ->assertOk()
        ->assertJsonPath('meta.mode', 'evaluation')
        ->assertJsonCount(4, 'data')
        ->assertJsonCount(8, 'data.0.services')
        ->assertJsonCount(5, 'data.1.services')
        ->assertJsonCount(6, 'data.2.services')
        ->assertJsonCount(7, 'data.3.services')
        ->assertJsonPath('data.0.code', 'G01')
        ->assertJsonPath('data.0.name.ar', 'الجراحة واللثة وزراعة الأسنان')
        ->assertJsonPath('data.0.services.0.code', 'G01-S01')
        ->assertJsonPath('data.0.services.0.name.ar', 'القلع')
        ->assertJsonPath('data.0.services.0.description_ar', 'إزالة سن يقرر طبيب الأسنان بعد الفحص أنه يحتاج إلى القلع، مع توضيح التحضير والمتابعة المتوقعة.')
        ->assertJsonPath('data.0.services.0.definition.audience', 'evaluation')
        ->assertJsonPath('data.0.services.0.definition.clinical_review_state', 'pending')
        ->assertJsonPath('data.0.services.0.definition.production_ready', false)
        ->assertJsonPath('data.0.services.0.definition.protection.funded', false);

    $firstGroup = $response->json('data.0');
    $firstService = $response->json('data.0.services.0');
    $firstDefinition = $response->json('data.0.services.0.definition');

    expect($firstGroup)->toBeArray()
        ->and(array_keys($firstGroup))->toBe(['code', 'name', 'description_ar', 'services'])
        ->and($firstService)->toBeArray()
        ->and(array_keys($firstService))->toBe(['code', 'slug', 'name', 'description_ar', 'definition'])
        ->and($firstDefinition)->toBeArray()
        ->and(array_keys($firstDefinition))->toBe([
            'version',
            'audience',
            'clinical_review_state',
            'production_ready',
            'protection',
        ]);
});

it('publishes no evaluation-only definitions in production mode', function (): void {
    config(['ubertib.catalog_mode' => 'production']);

    $this->getJson(route('api.v1.catalog.service-groups.index'))
        ->assertOk()
        ->assertJsonPath('meta.mode', 'production')
        ->assertJsonCount(0, 'data');
});

it('publishes only a production definition with complete evidence-bound readiness approvals', function (): void {
    config(['ubertib.catalog_mode' => 'production']);

    $service = Service::query()->where('code', 'G01-S01')->sole();
    $definition = ServiceDefinition::factory()
        ->for($service)
        ->productionCandidate()
        ->create([
            'version' => 2,
            'source_reference' => 'licensed-production-test',
        ]);
    $medicalReviewer = User::factory()->create();
    $credential = ClinicalReviewerCredential::factory()->create([
        'user_id' => $medicalReviewer->getKey(),
    ]);
    $approval = resolve(RecordServiceLaunchGateApproval::class);

    foreach (ServiceLaunchGateType::cases() as $type) {
        $approval->handle(
            $definition,
            $type,
            $type === ServiceLaunchGateType::Medical ? $medicalReviewer : User::factory()->create(),
            'Approved for the production contract test.',
            'contract-test-evidence/'.$type->value,
            now()->addYear(),
            $type === ServiceLaunchGateType::Medical ? $credential : null,
        );
    }

    resolve(PublishServiceDefinition::class)->handle($definition);

    $this->getJson(route('api.v1.catalog.service-groups.index'))
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonCount(1, 'data.0.services')
        ->assertJsonPath('data.0.code', 'G01')
        ->assertJsonPath('data.0.services.0.code', 'G01-S01')
        ->assertJsonPath('data.0.services.0.definition.version', 2)
        ->assertJsonPath('data.0.services.0.definition.audience', 'production')
        ->assertJsonPath('data.0.services.0.definition.clinical_review_state', 'approved')
        ->assertJsonPath('data.0.services.0.definition.production_ready', true);
});

it('keeps the prior production version visible until its replacement becomes effective', function (): void {
    config(['ubertib.catalog_mode' => 'production']);
    $this->travelTo(now()->startOfSecond());

    $service = Service::query()->where('code', 'G01-S01')->sole();
    $approve = function (ServiceDefinition $definition): void {
        $medicalReviewer = User::factory()->create();
        $credential = ClinicalReviewerCredential::factory()->create([
            'user_id' => $medicalReviewer->getKey(),
        ]);
        $approval = resolve(RecordServiceLaunchGateApproval::class);

        foreach (ServiceLaunchGateType::cases() as $type) {
            $approval->handle(
                $definition,
                $type,
                $type === ServiceLaunchGateType::Medical ? $medicalReviewer : User::factory()->create(),
                'Approved for the version-handover contract test.',
                'contract-test-evidence/handover/'.$type->value,
                now()->addYear(),
                $type === ServiceLaunchGateType::Medical ? $credential : null,
            );
        }
    };

    $versionTwo = ServiceDefinition::factory()->for($service)->activeProduction()->create(['version' => 2]);
    $approve($versionTwo);
    $versionThree = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 3]);
    $approve($versionThree);

    resolve(PublishServiceDefinition::class)->handle($versionThree);

    $this->getJson(route('api.v1.catalog.service-groups.index'))
        ->assertOk()
        ->assertJsonPath('data.0.services.0.definition.version', 2)
        ->assertJsonPath('data.0.services.0.definition.production_ready', true);

    $this->travel(1)->second();

    $this->getJson(route('api.v1.catalog.service-groups.index'))
        ->assertOk()
        ->assertJsonPath('data.0.services.0.definition.version', 3)
        ->assertJsonPath('data.0.services.0.definition.production_ready', true);

    $this->travelBack();
});

it('never falls back to an older production version when the highest applicable version is not ready', function (): void {
    config(['ubertib.catalog_mode' => 'production']);

    $service = Service::query()->where('code', 'G01-S01')->sole();
    $versionOne = ServiceDefinition::factory()->for($service)->activeProduction()->create([
        'version' => 2,
    ]);
    $versionTwo = ServiceDefinition::factory()->for($service)->activeProduction()->create([
        'version' => 3,
    ]);

    foreach ([$versionOne, $versionTwo] as $definition) {
        $reviewer = User::factory()->create();
        $credential = ClinicalReviewerCredential::factory()->create([
            'user_id' => $reviewer->getKey(),
        ]);

        foreach (ServiceLaunchGateType::cases() as $type) {
            ServiceLaunchGate::factory()
                ->for($definition)
                ->forType($type)
                ->approved(
                    $definition,
                    $reviewer,
                    $type === ServiceLaunchGateType::Medical ? $credential : null,
                )
                ->create();
        }
    }

    ServiceLaunchGate::factory()
        ->for($versionTwo)
        ->forType(ServiceLaunchGateType::Technical)
        ->create([
            'sequence' => 3,
            'status' => ServiceLaunchGateStatus::Revoked,
        ]);

    $this->getJson(route('api.v1.catalog.service-groups.index'))
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

it('excludes inactive groups and services from evaluation mode', function (): void {
    config(['ubertib.catalog_mode' => 'evaluation']);

    ServiceGroup::query()->where('code', 'G02')->update(['is_active' => false]);
    Service::query()->where('code', 'G01-S01')->update(['is_active' => false]);

    $response = $this->getJson(route('api.v1.catalog.service-groups.index'));

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonCount(7, 'data.0.services');

    expect(collect($response->json('data'))->pluck('code')->all())
        ->toBe(['G01', 'G03', 'G04']);
});

it('rejects a non-string server catalog mode', function (): void {
    config(['ubertib.catalog_mode' => ['evaluation']]);

    expect(fn (): mixed => resolve(ListVisibleServiceGroups::class)->handle())
        ->toThrow(RuntimeException::class, 'must be a string');
});

it('rejects an unknown server catalog mode', function (): void {
    config(['ubertib.catalog_mode' => 'client-selected']);

    expect(fn (): mixed => resolve(ListVisibleServiceGroups::class)->handle())
        ->toThrow(RuntimeException::class, 'evaluation or production');
});

it('forbids evaluation catalog mode in the production environment', function (): void {
    resolve(Application::class)->detectEnvironment(
        static fn (): string => 'production',
    );
    config(['ubertib.catalog_mode' => 'evaluation']);

    expect(fn (): mixed => resolve(ListVisibleServiceGroups::class)->handle())
        ->toThrow(RuntimeException::class, 'forbidden in production');
});

it('applies bounded public caching and rate limiting middleware', function (): void {
    config(['ubertib.catalog_mode' => 'evaluation']);

    $response = $this->getJson(route('api.v1.catalog.service-groups.index'));

    $response->assertOk();

    expect($response->headers->get('Cache-Control'))
        ->toContain('public')
        ->toContain('max-age=60');

    $middleware = resolve('router')->getRoutes()
        ->getByName('api.v1.catalog.service-groups.index')
        ?->gatherMiddleware();

    expect($middleware)->toContain('throttle:public-catalog');
});

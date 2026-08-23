<?php

declare(strict_types=1);
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

arch()->preset()->php();
arch()->preset()->security();

arch('models are final and extend Eloquent Model')
    ->expect('App\Models')
    ->toExtend(Model::class)
    ->ignoring('App\Models\Concerns');

arch('no debugging leftovers')
    ->expect(['dd', 'dump', 'ray', 'var_dump'])
    ->not->toBeUsed();

arch('controllers delegate persistence to application actions')
    ->expect('App\Http\Controllers')
    ->not->toUse([DB::class, 'App\Models']);

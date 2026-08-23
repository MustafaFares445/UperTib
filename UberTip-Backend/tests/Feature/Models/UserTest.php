<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('casts email_verified_at to a datetime and hashes the password', function (): void {
    $user = User::factory()->create([
        'password' => 'secret-password',
    ]);

    expect($user->email_verified_at)->toBeInstanceOf(DateTimeInterface::class)
        ->and($user->password)->not->toBe('secret-password');
});

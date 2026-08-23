<?php declare(strict_types = 1);

// odsl-C:\laragon\www\UberTip\UberTip-Backend\app\Models\ClinicalReviewerCredential.php-PHPStan\BetterReflection\Reflection\ReflectionClass-App\Models\ClinicalReviewerCredential
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v2-6.70.0.3-8.4.14-e66e9a80423b16aeed8f8f091f267434ce1ba7af993f43525e109e2906eb1c70',
   'data' => 
  array (
    'locatedSource' => 
    array (
      'class' => 'PHPStan\\BetterReflection\\SourceLocator\\Located\\LocatedSource',
      'data' => 
      array (
        'name' => 'App\\Models\\ClinicalReviewerCredential',
        'filename' => 'C:/laragon/www/UberTip/UberTip-Backend/app/Models/ClinicalReviewerCredential.php',
      ),
    ),
    'namespace' => 'App\\Models',
    'name' => 'App\\Models\\ClinicalReviewerCredential',
    'shortName' => 'ClinicalReviewerCredential',
    'isInterface' => false,
    'isTrait' => false,
    'isEnum' => false,
    'isBackedEnum' => false,
    'modifiers' => 32,
    'docComment' => '/**
 * @property int|null $supersedes_credential_id
 * @property int $user_id
 * @property int $verified_by_user_id
 * @property ClinicalReviewerCredentialStatus $status
 * @property string $issuing_authority
 * @property string $practice_scope
 * @property string $registration_hash
 * @property string $verification_evidence_reference
 * @property CarbonImmutable $verified_at
 * @property CarbonImmutable $expires_at
 * @property-read ClinicalReviewerCredential|null $supersededBy
 */',
    'attributes' => 
    array (
      0 => 
      array (
        'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
        'isRepeated' => false,
        'arguments' => 
        array (
          0 => 
          array (
            'code' => '[\'*\']',
            'attributes' => 
            array (
              'startLine' => 30,
              'endLine' => 30,
              'startTokenPos' => 65,
              'startFilePos' => 937,
              'endTokenPos' => 67,
              'endFilePos' => 941,
            ),
          ),
        ),
      ),
    ),
    'startLine' => 30,
    'endLine' => 103,
    'startColumn' => 1,
    'endColumn' => 1,
    'parentClassName' => 'Illuminate\\Database\\Eloquent\\Model',
    'implementsClassNames' => 
    array (
    ),
    'traitClassNames' => 
    array (
      0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
    ),
    'immediateConstants' => 
    array (
    ),
    'immediateProperties' => 
    array (
    ),
    'immediateMethods' => 
    array (
      'booted' => 
      array (
        'name' => 'booted',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'void',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => NULL,
        'startLine' => 36,
        'endLine' => 63,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => true,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 18,
        'namespace' => 'App\\Models',
        'declaringClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'implementingClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'currentClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'aliasName' => NULL,
      ),
      'supersededBy' => 
      array (
        'name' => 'supersededBy',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'Illuminate\\Database\\Eloquent\\Relations\\HasOne',
            'isIdentifier' => false,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * @return HasOne<ClinicalReviewerCredential, $this>
 */',
        'startLine' => 68,
        'endLine' => 71,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'App\\Models',
        'declaringClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'implementingClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'currentClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'aliasName' => NULL,
      ),
      'isCurrentFor' => 
      array (
        'name' => 'isCurrentFor',
        'parameters' => 
        array (
          'reviewer' => 
          array (
            'name' => 'reviewer',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'App\\Models\\User',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 73,
            'endLine' => 73,
            'startColumn' => 34,
            'endColumn' => 47,
            'parameterIndex' => 0,
            'isOptional' => false,
          ),
          'at' => 
          array (
            'name' => 'at',
            'default' => NULL,
            'type' => 
            array (
              'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
              'data' => 
              array (
                'name' => 'Carbon\\CarbonInterface',
                'isIdentifier' => false,
              ),
            ),
            'isVariadic' => false,
            'byRef' => false,
            'isPromoted' => false,
            'attributes' => 
            array (
            ),
            'startLine' => 73,
            'endLine' => 73,
            'startColumn' => 50,
            'endColumn' => 68,
            'parameterIndex' => 1,
            'isOptional' => false,
          ),
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'bool',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => NULL,
        'startLine' => 73,
        'endLine' => 87,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 1,
        'namespace' => 'App\\Models',
        'declaringClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'implementingClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'currentClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'aliasName' => NULL,
      ),
      'casts' => 
      array (
        'name' => 'casts',
        'parameters' => 
        array (
        ),
        'returnsReference' => false,
        'returnType' => 
        array (
          'class' => 'PHPStan\\BetterReflection\\Reflection\\ReflectionNamedType',
          'data' => 
          array (
            'name' => 'array',
            'isIdentifier' => true,
          ),
        ),
        'attributes' => 
        array (
        ),
        'docComment' => '/**
 * @return array<string, string>
 */',
        'startLine' => 92,
        'endLine' => 102,
        'startColumn' => 5,
        'endColumn' => 5,
        'couldThrow' => false,
        'isClosure' => false,
        'isGenerator' => false,
        'isVariadic' => false,
        'modifiers' => 2,
        'namespace' => 'App\\Models',
        'declaringClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'implementingClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'currentClassName' => 'App\\Models\\ClinicalReviewerCredential',
        'aliasName' => NULL,
      ),
    ),
    'traitsData' => 
    array (
      'aliases' => 
      array (
      ),
      'modifiers' => 
      array (
      ),
      'precedences' => 
      array (
      ),
      'hashes' => 
      array (
      ),
    ),
  ),
));
<?php declare(strict_types = 1);

return [
	'lastFullAnalysisTime' => 1787487515,
	'meta' => array (
  'cacheVersion' => 'v14-relativePaths',
  'phpstanVersion' => '2.2.9',
  'fnsr' => false,
  'metaExtensions' => 
  array (
  ),
  'phpVersion' => 80414,
  'projectConfig' => '{conditionalTags: {Larastan\\Larastan\\Rules\\NoEnvCallsOutsideOfConfigRule: {phpstan.rules.rule: %noEnvCallsOutsideOfConfig%}, Larastan\\Larastan\\Rules\\NoModelMakeRule: {phpstan.rules.rule: %noModelMake%}, Larastan\\Larastan\\Rules\\NoUnnecessaryCollectionCallRule: {phpstan.rules.rule: %noUnnecessaryCollectionCall%}, Larastan\\Larastan\\Rules\\NoUnnecessaryEnumerableToArrayCallsRule: {phpstan.rules.rule: %noUnnecessaryEnumerableToArrayCalls%}, Larastan\\Larastan\\Rules\\OctaneCompatibilityRule: {phpstan.rules.rule: %checkOctaneCompatibility%}, Larastan\\Larastan\\Rules\\UnusedViewsRule: {phpstan.rules.rule: %checkUnusedViews%}, Larastan\\Larastan\\Rules\\NoMissingTranslationsRule: {phpstan.rules.rule: %checkMissingTranslations%}, Larastan\\Larastan\\Rules\\ModelAppendsRule: {phpstan.rules.rule: %checkModelAppends%}, Larastan\\Larastan\\Rules\\NoPublicModelScopeAndAccessorRule: {phpstan.rules.rule: %checkModelMethodVisibility%}, Larastan\\Larastan\\Rules\\NoAuthFacadeInRequestScopeRule: {phpstan.rules.rule: %checkAuthCallsWhenInRequestScope%}, Larastan\\Larastan\\Rules\\NoAuthHelperInRequestScopeRule: {phpstan.rules.rule: %checkAuthCallsWhenInRequestScope%}, Larastan\\Larastan\\ReturnTypes\\Helpers\\EnvFunctionDynamicFunctionReturnTypeExtension: {phpstan.broker.dynamicFunctionReturnTypeExtension: %generalizeEnvReturnType%}, Larastan\\Larastan\\ReturnTypes\\Helpers\\ConfigFunctionDynamicFunctionReturnTypeExtension: {phpstan.broker.dynamicFunctionReturnTypeExtension: %checkConfigTypes%}, Larastan\\Larastan\\ReturnTypes\\ConfigRepositoryDynamicMethodReturnTypeExtension: {phpstan.broker.dynamicMethodReturnTypeExtension: %checkConfigTypes%}, Larastan\\Larastan\\ReturnTypes\\ConfigFacadeCollectionDynamicStaticMethodReturnTypeExtension: {phpstan.broker.dynamicStaticMethodReturnTypeExtension: %checkConfigTypes%}, Larastan\\Larastan\\Rules\\ConfigCollectionRule: {phpstan.rules.rule: %checkConfigTypes%}}, parameters: {universalObjectCratesClasses: [Illuminate\\Http\\Request, Illuminate\\Support\\Optional], earlyTerminatingFunctionCalls: [abort, dd], mixinExcludeClasses: [Eloquent], bootstrapFiles: [bootstrap.php], checkOctaneCompatibility: false, noEnvCallsOutsideOfConfig: true, noModelMake: true, noUnnecessaryCollectionCall: true, noUnnecessaryCollectionCallOnly: [], noUnnecessaryCollectionCallExcept: [], noUnnecessaryEnumerableToArrayCalls: false, squashedMigrationsPath: [], databaseMigrationsPath: [], disableMigrationScan: false, disableSchemaScan: false, configDirectories: [], viewDirectories: [], translationDirectories: [], checkModelProperties: false, checkUnusedViews: false, checkMissingTranslations: false, checkModelAppends: true, checkModelMethodVisibility: false, generalizeEnvReturnType: false, checkConfigTypes: false, checkAuthCallsWhenInRequestScope: false, parseModelCastsMethod: false, enableMigrationCache: false, level: max, paths: [../../../app, ../../../bootstrap/app.php, ../../../config, ../../../database, ../../../routes], excludePaths: {analyseAndScan: [app/**/*.blade.php], analyse: []}, tmpDir: ../../../storage/framework/phpstan}, rules: [Larastan\\Larastan\\Rules\\UselessConstructs\\NoUselessWithFunctionCallsRule, Larastan\\Larastan\\Rules\\UselessConstructs\\NoUselessValueFunctionCallsRule, Larastan\\Larastan\\Rules\\DeferrableServiceProviderMissingProvidesRule, Larastan\\Larastan\\Rules\\ConsoleCommand\\UndefinedArgumentOrOptionRule], services: {{class: Larastan\\Larastan\\Methods\\RelationForwardsCallsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\ModelForwardsCallsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\EloquentBuilderForwardsCallsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\HigherOrderTapProxyExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\HigherOrderCollectionProxyExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\StorageMethodsClassReflectionExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\ContractsMethodsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\FacadesMethodsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\ManagersMethodsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\AuthsMethodsExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\ModelFactoryMethodsClassReflectionExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\RedirectResponseMethodsClassReflectionExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\MacroMethodsClassReflectionExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Methods\\ViewWithMethodsClassReflectionExtension, tags: [phpstan.broker.methodsClassReflectionExtension]}, {class: Larastan\\Larastan\\Properties\\ModelAccessorExtension, tags: [phpstan.broker.propertiesClassReflectionExtension]}, {class: Larastan\\Larastan\\Properties\\ModelPropertyExtension, tags: [phpstan.broker.propertiesClassReflectionExtension]}, {class: Larastan\\Larastan\\Properties\\HigherOrderCollectionProxyPropertyExtension, tags: [phpstan.broker.propertiesClassReflectionExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\HigherOrderTapProxyExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ContainerArrayAccessDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {className: Illuminate\\Contracts\\Container\\Container}}, {class: Larastan\\Larastan\\ReturnTypes\\ContainerArrayAccessDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {className: Illuminate\\Container\\Container}}, {class: Larastan\\Larastan\\ReturnTypes\\ContainerArrayAccessDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {className: Illuminate\\Foundation\\Application}}, {class: Larastan\\Larastan\\ReturnTypes\\ContainerArrayAccessDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {className: Illuminate\\Contracts\\Foundation\\Application}}, {class: Larastan\\Larastan\\Properties\\ModelRelationsExtension, tags: [phpstan.broker.propertiesClassReflectionExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ModelOnlyDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ModelFactoryDynamicStaticMethodReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ModelDynamicStaticMethodReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\AppMakeDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\AuthExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\GuardDynamicStaticMethodReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\AuthManagerExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\DateExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\GuardExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\RequestFileExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\RequestRouteExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\RequestUserExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\EloquentBuilderExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\RelationCollectionExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\TestCaseExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\Support\\CollectionHelper}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\AuthExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\CollectExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\NowAndTodayExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\ResponseExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\ValidatorExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\LiteralExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\CollectionFilterRejectDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\CollectionWhereNotNullDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\NewModelQueryDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\FactoryDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\Types\\AbortIfFunctionTypeSpecifyingExtension, tags: [phpstan.typeSpecifier.functionTypeSpecifyingExtension], arguments: {methodName: abort, negate: false}}, {class: Larastan\\Larastan\\Types\\AbortIfFunctionTypeSpecifyingExtension, tags: [phpstan.typeSpecifier.functionTypeSpecifyingExtension], arguments: {methodName: abort, negate: true}}, {class: Larastan\\Larastan\\Types\\AbortIfFunctionTypeSpecifyingExtension, tags: [phpstan.typeSpecifier.functionTypeSpecifyingExtension], arguments: {methodName: throw, negate: false}}, {class: Larastan\\Larastan\\Types\\AbortIfFunctionTypeSpecifyingExtension, tags: [phpstan.typeSpecifier.functionTypeSpecifyingExtension], arguments: {methodName: throw, negate: true}}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\AppExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\ValueExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\StrExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\TapExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\StorageDynamicStaticMethodReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\Types\\GenericEloquentCollectionTypeNodeResolverExtension, tags: [phpstan.phpDoc.typeNodeResolverExtension]}, {class: Larastan\\Larastan\\Types\\ViewStringTypeNodeResolverExtension, tags: [phpstan.phpDoc.typeNodeResolverExtension]}, {class: Larastan\\Larastan\\Rules\\OctaneCompatibilityRule}, {class: Larastan\\Larastan\\Rules\\NoEnvCallsOutsideOfConfigRule, arguments: {configDirectories: %configDirectories%}}, {class: Larastan\\Larastan\\Rules\\NoModelMakeRule}, {class: Larastan\\Larastan\\Rules\\NoUnnecessaryCollectionCallRule, arguments: {onlyMethods: %noUnnecessaryCollectionCallOnly%, excludeMethods: %noUnnecessaryCollectionCallExcept%}}, {class: Larastan\\Larastan\\Rules\\NoUnnecessaryEnumerableToArrayCallsRule}, {class: Larastan\\Larastan\\Rules\\ModelAppendsRule}, {class: Larastan\\Larastan\\Rules\\NoPublicModelScopeAndAccessorRule}, {class: Larastan\\Larastan\\Types\\GenericEloquentBuilderTypeNodeResolverExtension, tags: [phpstan.phpDoc.typeNodeResolverExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\AppEnvironmentReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {class: Illuminate\\Foundation\\Application}}, {class: Larastan\\Larastan\\ReturnTypes\\AppEnvironmentReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension], arguments: {class: Illuminate\\Contracts\\Foundation\\Application}}, {class: Larastan\\Larastan\\ReturnTypes\\AppFacadeEnvironmentReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\Types\\ModelProperty\\ModelPropertyTypeNodeResolverExtension, tags: [phpstan.phpDoc.typeNodeResolverExtension], arguments: {active: %checkModelProperties%}}, {class: Larastan\\Larastan\\Types\\CollectionOf\\CollectionOfTypeNodeResolverExtension, tags: [phpstan.phpDoc.typeNodeResolverExtension]}, {class: Larastan\\Larastan\\Properties\\MigrationHelper, arguments: {databaseMigrationPath: %databaseMigrationsPath%, disableMigrationScan: %disableMigrationScan%, parser: @migrationsParser, reflectionProvider: @reflectionProvider}}, iamcalSqlParser: {class: Larastan\\Larastan\\SQL\\IamcalSqlParser, autowired: false}, sqlParserFactory: {class: Larastan\\Larastan\\SQL\\SqlParserFactory, arguments: {iamcalSqlParser: @iamcalSqlParser}}, sqlParser: {type: Larastan\\Larastan\\SQL\\SqlParser, factory: [@sqlParserFactory, create]}, {class: Larastan\\Larastan\\Properties\\SquashedMigrationHelper, arguments: {schemaPaths: %squashedMigrationsPath%, disableSchemaScan: %disableSchemaScan%}}, {class: Larastan\\Larastan\\Properties\\ModelCastHelper, arguments: {parser: @currentPhpVersionSimpleDirectParser, parseModelCastsMethod: %parseModelCastsMethod%}}, {class: Larastan\\Larastan\\Properties\\MigrationCache, arguments: {cacheDirectory: %tmpDir%, enabled: %enableMigrationCache%}}, {class: Larastan\\Larastan\\Properties\\ModelPropertyHelper}, {class: Larastan\\Larastan\\Rules\\ModelRuleHelper}, {class: Larastan\\Larastan\\Methods\\BuilderHelper, arguments: {checkProperties: %checkModelProperties%}}, {class: Larastan\\Larastan\\Rules\\RelationExistenceRule, tags: [phpstan.rules.rule]}, {class: Larastan\\Larastan\\Rules\\CheckDispatchArgumentTypesCompatibleWithClassConstructorRule, arguments: {dispatchableClass: Illuminate\\Foundation\\Bus\\Dispatchable}, tags: [phpstan.rules.rule]}, {class: Larastan\\Larastan\\Rules\\CheckDispatchArgumentTypesCompatibleWithClassConstructorRule, arguments: {dispatchableClass: Illuminate\\Foundation\\Events\\Dispatchable}, tags: [phpstan.rules.rule]}, {class: Larastan\\Larastan\\Properties\\Schema\\MySqlDataTypeToPhpTypeConverter}, {class: Larastan\\Larastan\\LarastanStubFilesExtension, tags: [phpstan.stubFilesExtension]}, {class: Larastan\\Larastan\\Rules\\UnusedViewsRule}, {class: Larastan\\Larastan\\Collectors\\UsedViewFunctionCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedEmailViewCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedViewMakeCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedViewFacadeMakeCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedRouteFacadeViewCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedViewInAnotherViewCollector}, {class: Larastan\\Larastan\\Support\\ViewFileHelper, arguments: {viewDirectories: %viewDirectories%}}, {class: Larastan\\Larastan\\Support\\ViewParser, arguments: {parser: @currentPhpVersionSimpleDirectParser}}, {class: Larastan\\Larastan\\Rules\\NoMissingTranslationsRule, arguments: {translationDirectories: %translationDirectories%}}, {class: Larastan\\Larastan\\Collectors\\UsedTranslationFunctionCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedTranslationTranslatorCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedTranslationFacadeCollector, tags: [phpstan.collector]}, {class: Larastan\\Larastan\\Collectors\\UsedTranslationViewCollector}, {class: Larastan\\Larastan\\ReturnTypes\\ApplicationMakeDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ContainerMakeDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ConsoleCommand\\ArgumentDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ConsoleCommand\\HasArgumentDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ConsoleCommand\\OptionDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\ConsoleCommand\\HasOptionDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\TranslatorGetReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\LangGetReturnTypeExtension, tags: [phpstan.broker.dynamicStaticMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\TransHelperReturnTypeExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\DoubleUnderscoreHelperReturnTypeExtension, tags: [phpstan.broker.dynamicFunctionReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\AppMakeHelper}, {class: Larastan\\Larastan\\Internal\\ConsoleApplicationResolver}, {class: Larastan\\Larastan\\Internal\\ConsoleApplicationHelper}, {class: Larastan\\Larastan\\Support\\HigherOrderCollectionProxyHelper}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\ConfigFunctionDynamicFunctionReturnTypeExtension}, {class: Larastan\\Larastan\\ReturnTypes\\ConfigRepositoryDynamicMethodReturnTypeExtension}, {class: Larastan\\Larastan\\ReturnTypes\\ConfigFacadeCollectionDynamicStaticMethodReturnTypeExtension}, {class: Larastan\\Larastan\\Support\\ConfigParser, arguments: {parser: @currentPhpVersionSimpleDirectParser, configPaths: %configDirectories%, treatPhpDocTypesAsCertain: %treatPhpDocTypesAsCertain%}}, {class: Larastan\\Larastan\\Internal\\ConfigHelper}, {class: Larastan\\Larastan\\ReturnTypes\\Helpers\\EnvFunctionDynamicFunctionReturnTypeExtension}, {class: Larastan\\Larastan\\ReturnTypes\\FormRequestSafeDynamicMethodReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\ReturnTypes\\EloquentCollectionMapDynamicReturnTypeExtension, tags: [phpstan.broker.dynamicMethodReturnTypeExtension]}, {class: Larastan\\Larastan\\Rules\\NoAuthFacadeInRequestScopeRule}, {class: Larastan\\Larastan\\Rules\\NoAuthHelperInRequestScopeRule}, {class: Larastan\\Larastan\\Rules\\ConfigCollectionRule}, {class: Illuminate\\Filesystem\\Filesystem, autowired: self}, migrationsParser: {class: PHPStan\\Parser\\CachedParser, arguments: {originalParser: @currentPhpVersionSimpleDirectParser, cachedNodesByStringCountMax: %cache.nodesByStringCountMax%}, autowired: false}}}',
  'analysedPaths' => 
  array (
    0 => '../../../app',
    1 => '../../../bootstrap/app.php',
    2 => '../../../config',
    3 => '../../../database',
    4 => '../../../routes',
  ),
  'scannedFiles' => 
  array (
  ),
  'composerLocks' => 
  array (
    '../../../composer.lock' => '3c240a0a4ee5d38de34387639177a77638631f60119cf9f86acbaf92b8a287bd',
  ),
  'composerInstalled' => 
  array (
    '../../composer/installed.php' => 
    array (
      'versions' => 
      array (
        'anourvalar/eloquent-serialize' => 
        array (
          'pretty_version' => '1.3.11',
          'version' => '1.3.11.0',
          'reference' => 'abd890c4d1ad8e90dd454d01283fbf342f80f1e5',
          'type' => 'library',
          'install_path' => '../../composer/../anourvalar/eloquent-serialize',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'blade-ui-kit/blade-heroicons' => 
        array (
          'pretty_version' => '2.7.0',
          'version' => '2.7.0.0',
          'reference' => '66fa8ba09dba12e0cdb410b8cb94f3b890eca440',
          'type' => 'library',
          'install_path' => '../../composer/../blade-ui-kit/blade-heroicons',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'blade-ui-kit/blade-icons' => 
        array (
          'pretty_version' => '1.10.1',
          'version' => '1.10.1.0',
          'reference' => '6e072d021ea6249986c330b93293c33d0c4f0e34',
          'type' => 'library',
          'install_path' => '../../composer/../blade-ui-kit/blade-icons',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'brianium/paratest' => 
        array (
          'pretty_version' => 'v7.20.0',
          'version' => '7.20.0.0',
          'reference' => '81c80677c9ec0ed4ef16b246167f11dec81a6e3d',
          'type' => 'library',
          'install_path' => '../../composer/../brianium/paratest',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'brick/math' => 
        array (
          'pretty_version' => '0.18.0',
          'version' => '0.18.0.0',
          'reference' => '82944324d1c1bdb2c2618e89978d4e2ad78d69ad',
          'type' => 'library',
          'install_path' => '../../composer/../brick/math',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'carbonphp/carbon-doctrine-types' => 
        array (
          'pretty_version' => '3.2.0',
          'version' => '3.2.0.0',
          'reference' => '18ba5ddfec8976260ead6e866180bd5d2f71aa1d',
          'type' => 'library',
          'install_path' => '../../composer/../carbonphp/carbon-doctrine-types',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'chillerlan/php-qrcode' => 
        array (
          'pretty_version' => '5.0.5',
          'version' => '5.0.5.0',
          'reference' => '7b66282572fc14075c0507d74d9837dab25b38d6',
          'type' => 'library',
          'install_path' => '../../composer/../chillerlan/php-qrcode',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'chillerlan/php-settings-container' => 
        array (
          'pretty_version' => '3.3.0',
          'version' => '3.3.0.0',
          'reference' => 'a0a487cbf5344f721eb504bf0f59bada40c381b7',
          'type' => 'library',
          'install_path' => '../../composer/../chillerlan/php-settings-container',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'composer/pcre' => 
        array (
          'pretty_version' => '3.4.0',
          'version' => '3.4.0.0',
          'reference' => 'd5a341b3fb61f3001970940afb1d332968a183ed',
          'type' => 'library',
          'install_path' => '../../composer/./pcre',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'composer/semver' => 
        array (
          'pretty_version' => '3.4.4',
          'version' => '3.4.4.0',
          'reference' => '198166618906cb2de69b95d7d47e5fa8aa1b2b95',
          'type' => 'library',
          'install_path' => '../../composer/./semver',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'composer/xdebug-handler' => 
        array (
          'pretty_version' => '3.0.5',
          'version' => '3.0.5.0',
          'reference' => '6c1925561632e83d60a44492e0b344cf48ab85ef',
          'type' => 'library',
          'install_path' => '../../composer/./xdebug-handler',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'cordoval/hamcrest-php' => 
        array (
          'dev_requirement' => true,
          'replaced' => 
          array (
            0 => '*',
          ),
        ),
        'danharrin/date-format-converter' => 
        array (
          'pretty_version' => 'v0.3.1',
          'version' => '0.3.1.0',
          'reference' => '7c31171bc981e48726729a5f3a05a2d2b63f0b1e',
          'type' => 'library',
          'install_path' => '../../composer/../danharrin/date-format-converter',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'danharrin/livewire-rate-limiting' => 
        array (
          'pretty_version' => 'v2.2.1',
          'version' => '2.2.1.0',
          'reference' => '69436717dc70e30f80d7f8fd02504c22992a9ad5',
          'type' => 'library',
          'install_path' => '../../composer/../danharrin/livewire-rate-limiting',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'davedevelopment/hamcrest-php' => 
        array (
          'dev_requirement' => true,
          'replaced' => 
          array (
            0 => '*',
          ),
        ),
        'dedoc/scramble' => 
        array (
          'pretty_version' => 'v0.13.42',
          'version' => '0.13.42.0',
          'reference' => 'c5b8ad69dfbe259f822f5ef507d479a55ab790f7',
          'type' => 'library',
          'install_path' => '../../composer/../dedoc/scramble',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'dflydev/dot-access-data' => 
        array (
          'pretty_version' => 'v3.0.3',
          'version' => '3.0.3.0',
          'reference' => 'a23a2bf4f31d3518f3ecb38660c95715dfead60f',
          'type' => 'library',
          'install_path' => '../../composer/../dflydev/dot-access-data',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'doctrine/deprecations' => 
        array (
          'pretty_version' => '1.1.6',
          'version' => '1.1.6.0',
          'reference' => 'd4fe3e6fd9bb9e72557a19674f44d8ac7db4c6ca',
          'type' => 'library',
          'install_path' => '../../composer/../doctrine/deprecations',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'doctrine/inflector' => 
        array (
          'pretty_version' => '2.1.0',
          'version' => '2.1.0.0',
          'reference' => '6d6c96277ea252fc1304627204c3d5e6e15faa3b',
          'type' => 'library',
          'install_path' => '../../composer/../doctrine/inflector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'doctrine/lexer' => 
        array (
          'pretty_version' => '3.0.1',
          'version' => '3.0.1.0',
          'reference' => '31ad66abc0fc9e1a1f2d9bc6a42668d2fbbcd6dd',
          'type' => 'library',
          'install_path' => '../../composer/../doctrine/lexer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'dragonmantank/cron-expression' => 
        array (
          'pretty_version' => 'v3.6.0',
          'version' => '3.6.0.0',
          'reference' => 'd61a8a9604ec1f8c3d150d09db6ce98b32675013',
          'type' => 'library',
          'install_path' => '../../composer/../dragonmantank/cron-expression',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'driftingly/rector-laravel' => 
        array (
          'pretty_version' => '2.5.0',
          'version' => '2.5.0.0',
          'reference' => '0dbdd842dfdbc821cfe5f47ca7326e2502b2a107',
          'type' => 'rector-extension',
          'install_path' => '../../composer/../driftingly/rector-laravel',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'egulias/email-validator' => 
        array (
          'pretty_version' => '4.0.4',
          'version' => '4.0.4.0',
          'reference' => 'd42c8731f0624ad6bdc8d3e5e9a4524f68801cfa',
          'type' => 'library',
          'install_path' => '../../composer/../egulias/email-validator',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'fakerphp/faker' => 
        array (
          'pretty_version' => 'v1.24.1',
          'version' => '1.24.1.0',
          'reference' => 'e0ee18eb1e6dc3cda3ce9fd97e5a0689a88a64b5',
          'type' => 'library',
          'install_path' => '../../composer/../fakerphp/faker',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'fidry/cpu-core-counter' => 
        array (
          'pretty_version' => '1.3.0',
          'version' => '1.3.0.0',
          'reference' => 'db9508f7b1474469d9d3c53b86f817e344732678',
          'type' => 'library',
          'install_path' => '../../composer/../fidry/cpu-core-counter',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'filament/actions' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'da3ed6cc03bd604b8b875ea03d4e9ef02c279eb2',
          'type' => 'library',
          'install_path' => '../../composer/../filament/actions',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/filament' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => '7e75d8da9b907ead7d618ce8237228316d08ae43',
          'type' => 'library',
          'install_path' => '../../composer/../filament/filament',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/forms' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => '3295b3acfe81dc75faa3a6dbbfea551e4df10887',
          'type' => 'library',
          'install_path' => '../../composer/../filament/forms',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/infolists' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'dca2f115006b716f2293e29042f9c9b410fc3548',
          'type' => 'library',
          'install_path' => '../../composer/../filament/infolists',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/notifications' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'f188823f2e681883e1fa419af7e2f2a17d4c63c5',
          'type' => 'library',
          'install_path' => '../../composer/../filament/notifications',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/query-builder' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'd658205b135ef364c992f5d5d518e9463099aab4',
          'type' => 'library',
          'install_path' => '../../composer/../filament/query-builder',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/schemas' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => '3e191f49090645685a34560f5a3e1ba28ed3e7bc',
          'type' => 'library',
          'install_path' => '../../composer/../filament/schemas',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/support' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'b6a33dd2af46160abe73226d671b1bc490a84a27',
          'type' => 'library',
          'install_path' => '../../composer/../filament/support',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/tables' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'be471ed4a9f2e7dcbbb134db622a03d4e89f7a21',
          'type' => 'library',
          'install_path' => '../../composer/../filament/tables',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filament/widgets' => 
        array (
          'pretty_version' => 'v5.7.6',
          'version' => '5.7.6.0',
          'reference' => 'e500c98debe26112008398933fcf3ed50ee103f7',
          'type' => 'library',
          'install_path' => '../../composer/../filament/widgets',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'filp/whoops' => 
        array (
          'pretty_version' => '2.18.4',
          'version' => '2.18.4.0',
          'reference' => 'd2102955e48b9fd9ab24280a7ad12ed552752c4d',
          'type' => 'library',
          'install_path' => '../../composer/../filp/whoops',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'fruitcake/php-cors' => 
        array (
          'pretty_version' => 'v1.4.0',
          'version' => '1.4.0.0',
          'reference' => '38aaa6c3fd4c157ffe2a4d10aa8b9b16ba8de379',
          'type' => 'library',
          'install_path' => '../../composer/../fruitcake/php-cors',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'graham-campbell/result-type' => 
        array (
          'pretty_version' => 'v1.1.4',
          'version' => '1.1.4.0',
          'reference' => 'e01f4a821471308ba86aa202fed6698b6b695e3b',
          'type' => 'library',
          'install_path' => '../../composer/../graham-campbell/result-type',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'guzzlehttp/guzzle' => 
        array (
          'pretty_version' => '8.0.2',
          'version' => '8.0.2.0',
          'reference' => 'd1cbca76970939a9c2ced55b1e25ea26f34fc773',
          'type' => 'library',
          'install_path' => '../../composer/../guzzlehttp/guzzle',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'guzzlehttp/promises' => 
        array (
          'pretty_version' => '3.0.1',
          'version' => '3.0.1.0',
          'reference' => '64f38b87fa7d371853804161bfc701c9bc2cc00a',
          'type' => 'library',
          'install_path' => '../../composer/../guzzlehttp/promises',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'guzzlehttp/psr7' => 
        array (
          'pretty_version' => '3.0.0',
          'version' => '3.0.0.0',
          'reference' => 'b094ded77ee97a6027ad6cf0e8c7b9f88381814c',
          'type' => 'library',
          'install_path' => '../../composer/../guzzlehttp/psr7',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'guzzlehttp/uri-template' => 
        array (
          'pretty_version' => 'v2.0.0',
          'version' => '2.0.0.0',
          'reference' => '516c3bf2af176c532d5b59b3430292f7e9ecccb1',
          'type' => 'library',
          'install_path' => '../../composer/../guzzlehttp/uri-template',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'hamcrest/hamcrest-php' => 
        array (
          'pretty_version' => 'v3.0.0',
          'version' => '3.0.0.0',
          'reference' => 'b61cd040da1a4925bc90a51c074f5297e7c0fa52',
          'type' => 'library',
          'install_path' => '../../composer/../hamcrest/hamcrest-php',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'iamcal/sql-parser' => 
        array (
          'pretty_version' => 'v0.7',
          'version' => '0.7.0.0',
          'reference' => '610392f38de49a44dab08dc1659960a29874c4b8',
          'type' => 'library',
          'install_path' => '../../composer/../iamcal/sql-parser',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'illuminate/auth' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/broadcasting' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/bus' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/cache' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/collections' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/concurrency' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/conditionable' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/config' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/console' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/container' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/contracts' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/cookie' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/database' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/encryption' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/events' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/filesystem' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/hashing' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/http' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/image' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/json-schema' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/log' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/macroable' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/mail' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/notifications' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/pagination' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/pipeline' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/process' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/queue' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/redis' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/reflection' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/routing' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/session' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/support' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/testing' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/translation' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/validation' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'illuminate/view' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => 'v13.26.1',
          ),
        ),
        'jean85/pretty-package-versions' => 
        array (
          'pretty_version' => '2.1.1',
          'version' => '2.1.1.0',
          'reference' => '4d7aa5dab42e2a76d99559706022885de0e18e1a',
          'type' => 'library',
          'install_path' => '../../composer/../jean85/pretty-package-versions',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'kirschbaum-development/eloquent-power-joins' => 
        array (
          'pretty_version' => '4.3.3',
          'version' => '4.3.3.0',
          'reference' => 'c609dbbe4ad2051b667e937f1ab554067519d64b',
          'type' => 'library',
          'install_path' => '../../composer/../kirschbaum-development/eloquent-power-joins',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'kodova/hamcrest-php' => 
        array (
          'dev_requirement' => true,
          'replaced' => 
          array (
            0 => '*',
          ),
        ),
        'larastan/larastan' => 
        array (
          'pretty_version' => 'v3.10.0',
          'version' => '3.10.0.0',
          'reference' => '2970f83398154178a739609c244577267c7ee8eb',
          'type' => 'phpstan-extension',
          'install_path' => '../../composer/../larastan/larastan',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/agent-detector' => 
        array (
          'pretty_version' => 'v2.0.2',
          'version' => '2.0.2.0',
          'reference' => '90694b9256099591cf9e55d08c18ba7a00bf099f',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/agent-detector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/boost' => 
        array (
          'pretty_version' => 'v2.5.5',
          'version' => '2.5.5.0',
          'reference' => 'a6c798975a893d3c0a609ebc6ed37a007ecbedec',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/boost',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/framework' => 
        array (
          'pretty_version' => 'v13.26.1',
          'version' => '13.26.1.0',
          'reference' => 'e4a1bc52ef551d52e60244bb004256d6861da7ab',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/framework',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'laravel/mcp' => 
        array (
          'pretty_version' => 'v0.9.4',
          'version' => '0.9.4.0',
          'reference' => '7ca5b923630118696602d14348cd0466a5e853ec',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/mcp',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/pail' => 
        array (
          'pretty_version' => 'v1.2.7',
          'version' => '1.2.7.0',
          'reference' => '2f7d27dada8effc48b8c424445a69cca7007daaa',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/pail',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/pao' => 
        array (
          'pretty_version' => 'v1.1.4',
          'version' => '1.1.4.0',
          'reference' => '5aee99c8c37565e9c457c33f4d36aa363a389dc8',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/pao',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/pint' => 
        array (
          'pretty_version' => 'v1.30.5',
          'version' => '1.30.5.0',
          'reference' => 'fe4148c503a0e266353d61396b79bbf7f35122df',
          'type' => 'project',
          'install_path' => '../../composer/../laravel/pint',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/prompts' => 
        array (
          'pretty_version' => 'v0.3.23',
          'version' => '0.3.23.0',
          'reference' => 'b7b4c35e5bc47450f6b6238c6cc9c47ba19b2221',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/prompts',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'laravel/roster' => 
        array (
          'pretty_version' => 'v1.0.0',
          'version' => '1.0.0.0',
          'reference' => '89e518bd88ae98ff50f6082f6b517c8d8e8245fa',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/roster',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'laravel/serializable-closure' => 
        array (
          'pretty_version' => 'v2.0.15',
          'version' => '2.0.15.0',
          'reference' => 'dccd8bcb851bb03fcc005df650b708b57cc52661',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/serializable-closure',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'laravel/tinker' => 
        array (
          'pretty_version' => 'v3.0.2',
          'version' => '3.0.2.0',
          'reference' => '4faba77764bd33411735936acdf30446d058c78b',
          'type' => 'library',
          'install_path' => '../../composer/../laravel/tinker',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/commonmark' => 
        array (
          'pretty_version' => '2.10.0',
          'version' => '2.10.0.0',
          'reference' => 'd2d1aa8b35e072966c89bc0c66cf926e56767dc4',
          'type' => 'library',
          'install_path' => '../../composer/../league/commonmark',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/config' => 
        array (
          'pretty_version' => 'v1.2.0',
          'version' => '1.2.0.0',
          'reference' => '754b3604fb2984c71f4af4a9cbe7b57f346ec1f3',
          'type' => 'library',
          'install_path' => '../../composer/../league/config',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/csv' => 
        array (
          'pretty_version' => '9.28.0',
          'version' => '9.28.0.0',
          'reference' => '6582ace29ae09ba5b07049d40ea13eb19c8b5073',
          'type' => 'library',
          'install_path' => '../../composer/../league/csv',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/flysystem' => 
        array (
          'pretty_version' => '3.35.3',
          'version' => '3.35.3.0',
          'reference' => '5fc8404762179ae514678487b23494fd69b2309c',
          'type' => 'library',
          'install_path' => '../../composer/../league/flysystem',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/flysystem-local' => 
        array (
          'pretty_version' => '3.35.3',
          'version' => '3.35.3.0',
          'reference' => 'a099b24dce160f3b2239043d13d47c4a1a214ea4',
          'type' => 'library',
          'install_path' => '../../composer/../league/flysystem-local',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/mime-type-detection' => 
        array (
          'pretty_version' => '1.17.0',
          'version' => '1.17.0.0',
          'reference' => 'f5f47eff7c48ed1003069a2ca67f316fb4021c76',
          'type' => 'library',
          'install_path' => '../../composer/../league/mime-type-detection',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/uri' => 
        array (
          'pretty_version' => '7.8.1',
          'version' => '7.8.1.0',
          'reference' => '08cf38e3924d4f56238125547b5720496fac8fd4',
          'type' => 'library',
          'install_path' => '../../composer/../league/uri',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/uri-components' => 
        array (
          'pretty_version' => '7.8.1',
          'version' => '7.8.1.0',
          'reference' => '848ff9db2f0be06229d6034b7c2e33d41b4fd675',
          'type' => 'library',
          'install_path' => '../../composer/../league/uri-components',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'league/uri-interfaces' => 
        array (
          'pretty_version' => '7.8.1',
          'version' => '7.8.1.0',
          'reference' => '85d5c77c5d6d3af6c54db4a78246364908f3c928',
          'type' => 'library',
          'install_path' => '../../composer/../league/uri-interfaces',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'livewire/livewire' => 
        array (
          'pretty_version' => 'v4.4.1',
          'version' => '4.4.1.0',
          'reference' => '0c925c55b4a5c134f2fb147efa4b9f53a837d866',
          'type' => 'library',
          'install_path' => '../../composer/../livewire/livewire',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'maennchen/zipstream-php' => 
        array (
          'pretty_version' => '3.2.2',
          'version' => '3.2.2.0',
          'reference' => '77bebeb4c6c340bb3c11c843b2cffd8bbfde4d5e',
          'type' => 'library',
          'install_path' => '../../composer/../maennchen/zipstream-php',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'mockery/mockery' => 
        array (
          'pretty_version' => '1.6.15',
          'version' => '1.6.15.0',
          'reference' => '967a801bd188989a5669bd280f252d51c0fdc9ee',
          'type' => 'library',
          'install_path' => '../../composer/../mockery/mockery',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'monolog/monolog' => 
        array (
          'pretty_version' => '3.10.0',
          'version' => '3.10.0.0',
          'reference' => 'b321dd6749f0bf7189444158a3ce785cc16d69b0',
          'type' => 'library',
          'install_path' => '../../composer/../monolog/monolog',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'mtdowling/cron-expression' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => '^1.0',
          ),
        ),
        'myclabs/deep-copy' => 
        array (
          'pretty_version' => '1.14.0',
          'version' => '1.14.0.0',
          'reference' => '8680aa248f8e07bc8fb43f56f0f5fc77a0c96aae',
          'type' => 'library',
          'install_path' => '../../composer/../myclabs/deep-copy',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nesbot/carbon' => 
        array (
          'pretty_version' => '3.13.2',
          'version' => '3.13.2.0',
          'reference' => 'a1c54919f5fff9800cd03c32bd01defd5a4061cb',
          'type' => 'library',
          'install_path' => '../../composer/../nesbot/carbon',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nette/php-generator' => 
        array (
          'pretty_version' => 'v4.2.2',
          'version' => '4.2.2.0',
          'reference' => '0d7060926f5c3e8c488b9b9ced42d857f12a34b5',
          'type' => 'library',
          'install_path' => '../../composer/../nette/php-generator',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nette/schema' => 
        array (
          'pretty_version' => 'v1.3.6',
          'version' => '1.3.6.0',
          'reference' => 'c54350438cd6914616f790a49cb424605f421562',
          'type' => 'library',
          'install_path' => '../../composer/../nette/schema',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nette/utils' => 
        array (
          'pretty_version' => 'v4.1.5',
          'version' => '4.1.5.0',
          'reference' => 'b043439dbdf954e6c28b5ea7e34b0100f83165e0',
          'type' => 'library',
          'install_path' => '../../composer/../nette/utils',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nikic/php-parser' => 
        array (
          'pretty_version' => 'v5.8.0',
          'version' => '5.8.0.0',
          'reference' => '044a6a392ff8ad0d61f14370a5fbbd0a0107152f',
          'type' => 'library',
          'install_path' => '../../composer/../nikic/php-parser',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'nunomaduro/collision' => 
        array (
          'pretty_version' => 'v8.9.5',
          'version' => '8.9.5.0',
          'reference' => 'fb53eacd509a1d303858e2d20cfebf2d630254ec',
          'type' => 'library',
          'install_path' => '../../composer/../nunomaduro/collision',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'nunomaduro/pokio' => 
        array (
          'pretty_version' => 'v1.0.1',
          'version' => '1.0.1.0',
          'reference' => 'fc7884ebc5b0fabd6e267c0b4e6f750ba69cee5b',
          'type' => 'library',
          'install_path' => '../../composer/../nunomaduro/pokio',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'nunomaduro/termwind' => 
        array (
          'pretty_version' => 'v2.4.0',
          'version' => '2.4.0.0',
          'reference' => '712a31b768f5daea284c2169a7d227031001b9a8',
          'type' => 'library',
          'install_path' => '../../composer/../nunomaduro/termwind',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'openspout/openspout' => 
        array (
          'pretty_version' => 'v4.32.0',
          'version' => '4.32.0.0',
          'reference' => '41f045c1f632e1474e15d4c7bc3abcb4a153563d',
          'type' => 'library',
          'install_path' => '../../composer/../openspout/openspout',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'paragonie/constant_time_encoding' => 
        array (
          'pretty_version' => 'v3.1.3',
          'version' => '3.1.3.0',
          'reference' => 'd5b01a39b3415c2cd581d3bd3a3575c1ebbd8e77',
          'type' => 'library',
          'install_path' => '../../composer/../paragonie/constant_time_encoding',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'pestphp/pest' => 
        array (
          'pretty_version' => 'v4.7.8',
          'version' => '4.7.8.0',
          'reference' => '5b2293f67adcf1b2320b33f521b94a692d18f360',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin' => 
        array (
          'pretty_version' => 'v4.0.0',
          'version' => '4.0.0.0',
          'reference' => '9d4b93d7f73d3f9c3189bb22c220fef271cdf568',
          'type' => 'composer-plugin',
          'install_path' => '../../composer/../pestphp/pest-plugin',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin-arch' => 
        array (
          'pretty_version' => 'v4.0.2',
          'version' => '4.0.2.0',
          'reference' => '3fb0d02a91b9da504b139dc7ab2a31efb7c3215c',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest-plugin-arch',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin-laravel' => 
        array (
          'pretty_version' => 'v4.1.0',
          'version' => '4.1.0.0',
          'reference' => '3057a36669ff11416cc0dc2b521b3aec58c488d0',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest-plugin-laravel',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin-mutate' => 
        array (
          'pretty_version' => 'v4.0.1',
          'version' => '4.0.1.0',
          'reference' => 'd9b32b60b2385e1688a68cc227594738ec26d96c',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest-plugin-mutate',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin-profanity' => 
        array (
          'pretty_version' => 'v4.2.1',
          'version' => '4.2.1.0',
          'reference' => '343cfa6f3564b7e35df0ebb77b7fa97039f72b27',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest-plugin-profanity',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pestphp/pest-plugin-type-coverage' => 
        array (
          'pretty_version' => 'v4.0.4',
          'version' => '4.0.4.0',
          'reference' => 'f485d40ec4e2081f9d3456c00f2c008f145d7896',
          'type' => 'library',
          'install_path' => '../../composer/../pestphp/pest-plugin-type-coverage',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phar-io/manifest' => 
        array (
          'pretty_version' => '2.0.4',
          'version' => '2.0.4.0',
          'reference' => '54750ef60c58e43759730615a392c31c80e23176',
          'type' => 'library',
          'install_path' => '../../composer/../phar-io/manifest',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phar-io/version' => 
        array (
          'pretty_version' => '3.2.1',
          'version' => '3.2.1.0',
          'reference' => '4f7fd7836c6f332bb2933569e566a0d6c4cbed74',
          'type' => 'library',
          'install_path' => '../../composer/../phar-io/version',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpdocumentor/reflection-common' => 
        array (
          'pretty_version' => '2.2.0',
          'version' => '2.2.0.0',
          'reference' => '1d01c49d4ed62f25aa84a747ad35d5a16924662b',
          'type' => 'library',
          'install_path' => '../../composer/../phpdocumentor/reflection-common',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'phpdocumentor/reflection-docblock' => 
        array (
          'pretty_version' => '6.0.3',
          'version' => '6.0.3.0',
          'reference' => '7bae67520aa9f5ecc506d646810bd40d9da54582',
          'type' => 'library',
          'install_path' => '../../composer/../phpdocumentor/reflection-docblock',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'phpdocumentor/type-resolver' => 
        array (
          'pretty_version' => '2.0.0',
          'version' => '2.0.0.0',
          'reference' => '327a05bbee54120d4786a0dc67aad30226ad4cf9',
          'type' => 'library',
          'install_path' => '../../composer/../phpdocumentor/type-resolver',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'phpoption/phpoption' => 
        array (
          'pretty_version' => '1.9.5',
          'version' => '1.9.5.0',
          'reference' => '75365b91986c2405cf5e1e012c5595cd487a98be',
          'type' => 'library',
          'install_path' => '../../composer/../phpoption/phpoption',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'phpstan/phpdoc-parser' => 
        array (
          'pretty_version' => '2.3.3',
          'version' => '2.3.3.0',
          'reference' => 'fb19eedd2bb67ff8cf7a5502ad329e701d6398a3',
          'type' => 'library',
          'install_path' => '../../composer/../phpstan/phpdoc-parser',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'phpstan/phpstan' => 
        array (
          'pretty_version' => '2.2.9',
          'version' => '2.2.9.0',
          'reference' => '13d6b4f347bad222da436580c8304fa6f83e6bd0',
          'type' => 'library',
          'install_path' => '../../composer/../phpstan/phpstan',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/php-code-coverage' => 
        array (
          'pretty_version' => '12.5.7',
          'version' => '12.5.7.0',
          'reference' => '186dab580576598076de6818596d12b61801880e',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/php-code-coverage',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/php-file-iterator' => 
        array (
          'pretty_version' => '6.0.1',
          'version' => '6.0.1.0',
          'reference' => '3d1cd096ef6bea4bf2762ba586e35dbd317cbfd5',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/php-file-iterator',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/php-invoker' => 
        array (
          'pretty_version' => '6.0.0',
          'version' => '6.0.0.0',
          'reference' => '12b54e689b07a25a9b41e57736dfab6ec9ae5406',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/php-invoker',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/php-text-template' => 
        array (
          'pretty_version' => '5.0.0',
          'version' => '5.0.0.0',
          'reference' => 'e1367a453f0eda562eedb4f659e13aa900d66c53',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/php-text-template',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/php-timer' => 
        array (
          'pretty_version' => '8.0.0',
          'version' => '8.0.0.0',
          'reference' => 'f258ce36aa457f3aa3339f9ed4c81fc66dc8c2cc',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/php-timer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'phpunit/phpunit' => 
        array (
          'pretty_version' => '12.5.33',
          'version' => '12.5.33.0',
          'reference' => 'b98e028a26c5c5ba7e4a54be96ccf35f2914d184',
          'type' => 'library',
          'install_path' => '../../composer/../phpunit/phpunit',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'pragmarx/google2fa' => 
        array (
          'pretty_version' => 'v9.1.0',
          'version' => '9.1.0.0',
          'reference' => 'f00bc788c555adfb6765c437ff3538e59cd88af1',
          'type' => 'library',
          'install_path' => '../../composer/../pragmarx/google2fa',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'pragmarx/google2fa-qrcode' => 
        array (
          'pretty_version' => 'v4.0.0',
          'version' => '4.0.0.0',
          'reference' => '16159f84fa0838c276f35d46de57fd90dfbb385c',
          'type' => 'library',
          'install_path' => '../../composer/../pragmarx/google2fa-qrcode',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/clock' => 
        array (
          'pretty_version' => '1.0.0',
          'version' => '1.0.0.0',
          'reference' => 'e41a24703d4560fd0acb709162f73b8adfc3aa0d',
          'type' => 'library',
          'install_path' => '../../composer/../psr/clock',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/clock-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.0',
          ),
        ),
        'psr/container' => 
        array (
          'pretty_version' => '2.0.2',
          'version' => '2.0.2.0',
          'reference' => 'c71ecc56dfe541dbd90c5360474fbc405f8d5963',
          'type' => 'library',
          'install_path' => '../../composer/../psr/container',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/container-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.1 || 2.0',
          ),
        ),
        'psr/event-dispatcher' => 
        array (
          'pretty_version' => '1.0.0',
          'version' => '1.0.0.0',
          'reference' => 'dbefd12671e8a14ec7f180cab83036ed26714bb0',
          'type' => 'library',
          'install_path' => '../../composer/../psr/event-dispatcher',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/event-dispatcher-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.0',
          ),
        ),
        'psr/http-client' => 
        array (
          'pretty_version' => '1.0.3',
          'version' => '1.0.3.0',
          'reference' => 'bb5906edc1c324c9a05aa0873d40117941e5fa90',
          'type' => 'library',
          'install_path' => '../../composer/../psr/http-client',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/http-client-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.0',
          ),
        ),
        'psr/http-factory' => 
        array (
          'pretty_version' => '1.1.0',
          'version' => '1.1.0.0',
          'reference' => '2b4765fddfe3b508ac62f829e852b1501d3f6e8a',
          'type' => 'library',
          'install_path' => '../../composer/../psr/http-factory',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/http-factory-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.1',
          ),
        ),
        'psr/http-message' => 
        array (
          'pretty_version' => '2.0',
          'version' => '2.0.0.0',
          'reference' => '402d35bcb92c70c026d1a6a9883f06b2ead23d71',
          'type' => 'library',
          'install_path' => '../../composer/../psr/http-message',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/http-message-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '2.0',
          ),
        ),
        'psr/log' => 
        array (
          'pretty_version' => '3.0.2',
          'version' => '3.0.2.0',
          'reference' => 'f16e1d5863e37f8d8c2a01719f5b34baa2b714d3',
          'type' => 'library',
          'install_path' => '../../composer/../psr/log',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/log-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.0 || 2.0 || 3.0',
            1 => '1.0|2.0|3.0',
            2 => '3.0.0',
          ),
        ),
        'psr/simple-cache' => 
        array (
          'pretty_version' => '3.0.0',
          'version' => '3.0.0.0',
          'reference' => '764e0b3939f5ca87cb904f570ef9be2d78a07865',
          'type' => 'library',
          'install_path' => '../../composer/../psr/simple-cache',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'psr/simple-cache-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '1.0 || 2.0 || 3.0',
          ),
        ),
        'psy/psysh' => 
        array (
          'pretty_version' => 'v0.12.24',
          'version' => '0.12.24.0',
          'reference' => 'ca0fdcf8a7617afa3adfdf1b5fef573dffb69ca1',
          'type' => 'library',
          'install_path' => '../../composer/../psy/psysh',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'ramsey/collection' => 
        array (
          'pretty_version' => '2.1.1',
          'version' => '2.1.1.0',
          'reference' => '344572933ad0181accbf4ba763e85a0306a8c5e2',
          'type' => 'library',
          'install_path' => '../../composer/../ramsey/collection',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'ramsey/uuid' => 
        array (
          'pretty_version' => '4.9.3',
          'version' => '4.9.3.0',
          'reference' => '1df15849d00943a67d677dc9cfd80795f038c9f8',
          'type' => 'library',
          'install_path' => '../../composer/../ramsey/uuid',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'rector/rector' => 
        array (
          'pretty_version' => '2.6.3',
          'version' => '2.6.3.0',
          'reference' => '7e46709996a4b3dc59e1d6ecbb6a38ace335bd58',
          'type' => 'library',
          'install_path' => '../../composer/../rector/rector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'rhumsaa/uuid' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => '4.9.3',
          ),
        ),
        'roave/security-advisories' => 
        array (
          'pretty_version' => 'dev-latest',
          'version' => 'dev-latest',
          'reference' => '6c0be3a74b4e70c18693ae5dc183132b4d17603a',
          'type' => 'metapackage',
          'install_path' => NULL,
          'aliases' => 
          array (
            0 => '9999999-dev',
          ),
          'dev_requirement' => true,
        ),
        'ryangjchandler/blade-capture-directive' => 
        array (
          'pretty_version' => 'v1.1.1',
          'version' => '1.1.1.0',
          'reference' => '3f9e80b56ff60b78755ef320e3e16d88850101d6',
          'type' => 'library',
          'install_path' => '../../composer/../ryangjchandler/blade-capture-directive',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'scrivo/highlight.php' => 
        array (
          'pretty_version' => 'v9.18.1.10',
          'version' => '9.18.1.10',
          'reference' => '850f4b44697a2552e892ffe71490ba2733c2fc6e',
          'type' => 'library',
          'install_path' => '../../composer/../scrivo/highlight.php',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'sebastian/cli-parser' => 
        array (
          'pretty_version' => '4.2.1',
          'version' => '4.2.1.0',
          'reference' => '7d05781b13f7dec9043a629a21d086ed74582a15',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/cli-parser',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/comparator' => 
        array (
          'pretty_version' => '7.1.8',
          'version' => '7.1.8.0',
          'reference' => '7c65c1e79836812819705b473a90c12399542485',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/comparator',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/complexity' => 
        array (
          'pretty_version' => '5.0.0',
          'version' => '5.0.0.0',
          'reference' => 'bad4316aba5303d0221f43f8cee37eb58d384bbb',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/complexity',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/diff' => 
        array (
          'pretty_version' => '7.0.0',
          'version' => '7.0.0.0',
          'reference' => '7ab1ea946c012266ca32390913653d844ecd085f',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/diff',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/environment' => 
        array (
          'pretty_version' => '8.1.2',
          'version' => '8.1.2.0',
          'reference' => '9d32c685773823b1983e256ae4ecd48a10d6e439',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/environment',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/exporter' => 
        array (
          'pretty_version' => '7.0.3',
          'version' => '7.0.3.0',
          'reference' => 'c5e21b5de653ce0a769fb36f5cdfcb5e7a32cf23',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/exporter',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/global-state' => 
        array (
          'pretty_version' => '8.0.3',
          'version' => '8.0.3.0',
          'reference' => 'b164d3274d6537ab462591c5755f76a8f5b1aae9',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/global-state',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/lines-of-code' => 
        array (
          'pretty_version' => '4.0.1',
          'version' => '4.0.1.0',
          'reference' => 'd543b8ef219dcd8da262cbb958639a96bedba10e',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/lines-of-code',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/object-enumerator' => 
        array (
          'pretty_version' => '7.0.0',
          'version' => '7.0.0.0',
          'reference' => '1effe8e9b8e068e9ae228e542d5d11b5d16db894',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/object-enumerator',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/object-reflector' => 
        array (
          'pretty_version' => '5.0.0',
          'version' => '5.0.0.0',
          'reference' => '4bfa827c969c98be1e527abd576533293c634f6a',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/object-reflector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/recursion-context' => 
        array (
          'pretty_version' => '7.0.1',
          'version' => '7.0.1.0',
          'reference' => '0b01998a7d5b1f122911a66bebcb8d46f0c82d8c',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/recursion-context',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/type' => 
        array (
          'pretty_version' => '6.0.4',
          'version' => '6.0.4.0',
          'reference' => '82ff822c2edc46724be9f7411d3163021f602773',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/type',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'sebastian/version' => 
        array (
          'pretty_version' => '6.0.0',
          'version' => '6.0.0.0',
          'reference' => '3e6ccf7657d4f0a59200564b08cead899313b53c',
          'type' => 'library',
          'install_path' => '../../composer/../sebastian/version',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'spatie/guidelines-skills' => 
        array (
          'pretty_version' => '1.1.0',
          'version' => '1.1.0.0',
          'reference' => 'c31006972d0b8c8db71e7b75c1b1d505b479023d',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/guidelines-skills',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'spatie/image' => 
        array (
          'pretty_version' => '3.9.6',
          'version' => '3.9.6.0',
          'reference' => 'f6f2c785fb6e2f27cf05e48d6fe0e3feea0b421f',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/image',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/image-optimizer' => 
        array (
          'pretty_version' => '1.10.0',
          'version' => '1.10.0.0',
          'reference' => '333c03952289dc2df0a91874636a0dffeb5b6aec',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/image-optimizer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/invade' => 
        array (
          'pretty_version' => '2.1.0',
          'version' => '2.1.0.0',
          'reference' => 'b920f6411d21df4e8610a138e2e87ae4957d7f63',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/invade',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/laravel-activitylog' => 
        array (
          'pretty_version' => '5.1.0',
          'version' => '5.1.0.0',
          'reference' => '97c9f7e82033b18dc9db25de276f9b71e01449ea',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/laravel-activitylog',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/laravel-data' => 
        array (
          'pretty_version' => '4.23.0',
          'version' => '4.23.0.0',
          'reference' => '230543769c996e407fec2873930626aed7dd0d3b',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/laravel-data',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/laravel-medialibrary' => 
        array (
          'pretty_version' => '11.23.5',
          'version' => '11.23.5.0',
          'reference' => '8ca16954d607de1853c9609e88eb91eab43d67b9',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/laravel-medialibrary',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/laravel-package-tools' => 
        array (
          'pretty_version' => '1.93.1',
          'version' => '1.93.1.0',
          'reference' => 'd5552849801f2642aea710557463234b59ef65eb',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/laravel-package-tools',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/laravel-permission' => 
        array (
          'pretty_version' => '8.3.0',
          'version' => '8.3.0.0',
          'reference' => '60e8ed5b2fbf043c2264433fc2680c76b8b66aa6',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/laravel-permission',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/once' => 
        array (
          'dev_requirement' => false,
          'replaced' => 
          array (
            0 => '*',
          ),
        ),
        'spatie/php-structure-discoverer' => 
        array (
          'pretty_version' => '2.4.4',
          'version' => '2.4.4.0',
          'reference' => 'fa2b7dae8e8a22c0306154c4b052420e054f7e2b',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/php-structure-discoverer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/shiki-php' => 
        array (
          'pretty_version' => '2.4.0',
          'version' => '2.4.0.0',
          'reference' => 'b8b0ca32d3a82bc5c533e68ffab96c5d4ec1b9ba',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/shiki-php',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'spatie/temporary-directory' => 
        array (
          'pretty_version' => '2.4.0',
          'version' => '2.4.0.0',
          'reference' => '32cbb9645b28839cf4f476708e99a2c70e6802c9',
          'type' => 'library',
          'install_path' => '../../composer/../spatie/temporary-directory',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'staabm/side-effects-detector' => 
        array (
          'pretty_version' => '1.0.5',
          'version' => '1.0.5.0',
          'reference' => 'd8334211a140ce329c13726d4a715adbddd0a163',
          'type' => 'library',
          'install_path' => '../../composer/../staabm/side-effects-detector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'symfony/clock' => 
        array (
          'pretty_version' => 'v8.1.0',
          'version' => '8.1.0.0',
          'reference' => '701ef4de9705d6c32292ebee5e8044094a09fbf6',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/clock',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/console' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'd07c06839e33047e2c894a6793248f3fb66c8129',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/console',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/css-selector' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'a291fb5adb65f52a4bb315db2d803698315dc64d',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/css-selector',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/deprecation-contracts' => 
        array (
          'pretty_version' => 'v3.7.1',
          'version' => '3.7.1.0',
          'reference' => 'f3202fa1b5097b0af062dc978b32ecf63404e31d',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/deprecation-contracts',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/error-handler' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '8b2a4289ffe5e2dc8fcf645b8e7870e1fa0325ce',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/error-handler',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/event-dispatcher' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '7458da64220376b2e0dc2d8451bf43382c1ad297',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/event-dispatcher',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/event-dispatcher-contracts' => 
        array (
          'pretty_version' => 'v3.7.1',
          'version' => '3.7.1.0',
          'reference' => 'c7de7a00ffb67842132da02ea92988a39ccd9f4e',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/event-dispatcher-contracts',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/event-dispatcher-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '2.0|3.0',
          ),
        ),
        'symfony/finder' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '8d7acede2b2ae07605783d1c43e49b5767036474',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/finder',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/html-sanitizer' => 
        array (
          'pretty_version' => 'v8.1.1',
          'version' => '8.1.1.0',
          'reference' => '09e1f2f9a3c8dcdca072587dc71999c1921c07cb',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/html-sanitizer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/http-foundation' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'ee16f97e95cfa011a742714d7c8c8f70fe7423f4',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/http-foundation',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/http-kernel' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '0306e1e65b90023fe40de6c6be95d06396bcb2e6',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/http-kernel',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/mailer' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '89f43137da74b8f1aab37c99926482b7084f51b9',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/mailer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/mime' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '1b36ccfd7ccb9ad1d6eafb9024b3dd3d9606b15f',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/mime',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-ctype' => 
        array (
          'pretty_version' => 'v1.37.0',
          'version' => '1.37.0.0',
          'reference' => '141046a8f9477948ff284fa65be2095baafb94f2',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-ctype',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-intl-grapheme' => 
        array (
          'pretty_version' => 'v1.41.0',
          'version' => '1.41.0.0',
          'reference' => 'bb899c1db0aa8127dc3afe8cda4a67eb24915f8d',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-intl-grapheme',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-intl-idn' => 
        array (
          'pretty_version' => 'v1.38.1',
          'version' => '1.38.1.0',
          'reference' => 'dc21118016c039a66235cf93d96b435ffb282412',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-intl-idn',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-intl-normalizer' => 
        array (
          'pretty_version' => 'v1.38.0',
          'version' => '1.38.0.0',
          'reference' => '2d446c214bdbe5b71bde5011b060a05fece3ae6b',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-intl-normalizer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-mbstring' => 
        array (
          'pretty_version' => 'v1.38.2',
          'version' => '1.38.2.0',
          'reference' => 'd3d318bad5e7a1bfbd026009c8bfb8d8f99ae6b6',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-mbstring',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-php80' => 
        array (
          'pretty_version' => 'v1.37.0',
          'version' => '1.37.0.0',
          'reference' => 'dfb55726c3a76ea3b6459fcfda1ec2d80a682411',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-php80',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-php82' => 
        array (
          'pretty_version' => 'v1.38.1',
          'version' => '1.38.1.0',
          'reference' => '002dc0cfe5fd4ed6033d48f27d4f19a486c4b04b',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-php82',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-php84' => 
        array (
          'pretty_version' => 'v1.38.1',
          'version' => '1.38.1.0',
          'reference' => 'f4e1dfaee5b74aba5964fe1fd4dfc7ba5e3085fa',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-php84',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-php85' => 
        array (
          'pretty_version' => 'v1.41.0',
          'version' => '1.41.0.0',
          'reference' => '255fab485aaa1006ed411040c42aecd7b5302d7a',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-php85',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-php86' => 
        array (
          'pretty_version' => 'v1.41.0',
          'version' => '1.41.0.0',
          'reference' => '6bc356ed3d8dbfeea8f0de235e34d670704e880e',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-php86',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/polyfill-uuid' => 
        array (
          'pretty_version' => 'v1.37.0',
          'version' => '1.37.0.0',
          'reference' => '26dfec253c4cf3e51b541b52ddf7e42cb0908e94',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/polyfill-uuid',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/process' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'd863f5e70d7c87abb906ac11b61f83036093000b',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/process',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/routing' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '3c188091b6b4fa2e4bc83a135caede12deb8576c',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/routing',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/service-contracts' => 
        array (
          'pretty_version' => 'v3.7.1',
          'version' => '3.7.1.0',
          'reference' => 'c0a284bab1ed8aa0417e3d69250ab437739563a0',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/service-contracts',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/string' => 
        array (
          'pretty_version' => 'v8.1.2',
          'version' => '8.1.2.0',
          'reference' => '286a76b7255e5cc4bf0101a0bc5388ecf1c38ccc',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/string',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/translation' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'd9e1caba0d6b6f9a26710af8a2f88d37f001215a',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/translation',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/translation-contracts' => 
        array (
          'pretty_version' => 'v3.7.1',
          'version' => '3.7.1.0',
          'reference' => 'ccb206b98faccc511ebae8e5fad50f2dc0b30621',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/translation-contracts',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/translation-implementation' => 
        array (
          'dev_requirement' => false,
          'provided' => 
          array (
            0 => '2.3|3.0',
          ),
        ),
        'symfony/uid' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'a08aef47989093f32fe50fd11859be1b427df389',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/uid',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/var-dumper' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => '61743d9bc7ab23b194527ca1be2fafd7dc93b74a',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/var-dumper',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'symfony/yaml' => 
        array (
          'pretty_version' => 'v8.1.5',
          'version' => '8.1.5.0',
          'reference' => 'b3fc9e8888eeb9daddc33bfbd15d282a61f543cd',
          'type' => 'library',
          'install_path' => '../../composer/../symfony/yaml',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'ta-tikoma/phpunit-architecture-test' => 
        array (
          'pretty_version' => '0.8.7',
          'version' => '0.8.7.0',
          'reference' => '1248f3f506ca9641d4f68cebcd538fa489754db8',
          'type' => 'library',
          'install_path' => '../../composer/../ta-tikoma/phpunit-architecture-test',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'theseer/tokenizer' => 
        array (
          'pretty_version' => '2.0.1',
          'version' => '2.0.1.0',
          'reference' => '7989e43bf381af0eac72e4f0ca5bcbfa81658be4',
          'type' => 'library',
          'install_path' => '../../composer/../theseer/tokenizer',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'tijsverkoyen/css-to-inline-styles' => 
        array (
          'pretty_version' => 'v2.4.0',
          'version' => '2.4.0.0',
          'reference' => 'f0292ccf0ec75843d65027214426b6b163b48b41',
          'type' => 'library',
          'install_path' => '../../composer/../tijsverkoyen/css-to-inline-styles',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'tomasvotruba/type-coverage' => 
        array (
          'pretty_version' => '2.3.4',
          'version' => '2.3.4.0',
          'reference' => '7b4aec57af15514dac9a3c5a9671da501444ecd0',
          'type' => 'phpstan-extension',
          'install_path' => '../../composer/../tomasvotruba/type-coverage',
          'aliases' => 
          array (
          ),
          'dev_requirement' => true,
        ),
        'ueberdosis/tiptap-php' => 
        array (
          'pretty_version' => '2.1.1',
          'version' => '2.1.1.0',
          'reference' => '74bfb7be1c8c6102b240f3879b7f984a6ab87b97',
          'type' => 'library',
          'install_path' => '../../composer/../ueberdosis/tiptap-php',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'vlucas/phpdotenv' => 
        array (
          'pretty_version' => 'v5.6.4',
          'version' => '5.6.4.0',
          'reference' => '416df702837983f8d5ff48c9c3fee4f5f57b980b',
          'type' => 'library',
          'install_path' => '../../composer/../vlucas/phpdotenv',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'voku/portable-ascii' => 
        array (
          'pretty_version' => '2.1.1',
          'version' => '2.1.1.0',
          'reference' => '8e1051fe39379367aecf014f41744ce7539a856f',
          'type' => 'library',
          'install_path' => '../../composer/../voku/portable-ascii',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
        'webmozart/assert' => 
        array (
          'pretty_version' => '2.4.1',
          'version' => '2.4.1.0',
          'reference' => '2ccb7c2e821038c03a3e6e1700c570c158c55f70',
          'type' => 'library',
          'install_path' => '../../composer/../webmozart/assert',
          'aliases' => 
          array (
          ),
          'dev_requirement' => false,
        ),
      ),
    ),
  ),
  'executedFilesHashes' => 
  array (
    '../../larastan/larastan/bootstrap.php' => '4d59a39a23add7ce7f84aa0d71575602b6c81fb005368bc8e0b1d79f98e34d62',
    'phar://phpstan.phar/stubs/runtime/Attribute85.php' => 'cb8b31e82c61ce197871c9e8a6f122256751f2ab606dd2be90846d4fa5f8933e',
    'phar://phpstan.phar/stubs/runtime/ReflectionAttribute.php' => 'c0068e383717870a304781d462f7e2afe1c6f24e9133851852a2aca96b4fa26f',
    'phar://phpstan.phar/stubs/runtime/ReflectionIntersectionType.php' => '65fe0a8bc6fe285d8ddc8798ab5b9299920af70db5ad74596bc08df823e7c5d9',
    'phar://phpstan.phar/stubs/runtime/ReflectionUnionType.php' => '1e2fe940e4ba4e00d9ee6adb2af3ee1bf333e6f8afe61c61deb038886d293427',
  ),
  'phpExtensions' => 
  array (
    0 => 'Core',
    1 => 'PDO',
    2 => 'Phar',
    3 => 'Reflection',
    4 => 'SPL',
    5 => 'SimpleXML',
    6 => 'bcmath',
    7 => 'calendar',
    8 => 'ctype',
    9 => 'curl',
    10 => 'date',
    11 => 'dom',
    12 => 'exif',
    13 => 'fileinfo',
    14 => 'filter',
    15 => 'gd',
    16 => 'hash',
    17 => 'iconv',
    18 => 'imagick',
    19 => 'intl',
    20 => 'json',
    21 => 'libxml',
    22 => 'mbstring',
    23 => 'mysqli',
    24 => 'mysqlnd',
    25 => 'openssl',
    26 => 'pcre',
    27 => 'pdo_mysql',
    28 => 'pdo_sqlite',
    29 => 'random',
    30 => 'readline',
    31 => 'session',
    32 => 'sockets',
    33 => 'sodium',
    34 => 'sqlite3',
    35 => 'standard',
    36 => 'tokenizer',
    37 => 'xml',
    38 => 'xmlreader',
    39 => 'xmlwriter',
    40 => 'xsl',
    41 => 'zip',
    42 => 'zlib',
  ),
  'stubFiles' => 
  array (
  ),
  'level' => 'max',
),
	'projectExtensionFiles' => array (
),
	'errorsCallback' => static function (): array { return array (
); },
	'locallyIgnoredErrorsCallback' => static function (): array { return array (
); },
	'linesToIgnore' => array (
),
	'unmatchedLineIgnores' => array (
),
	'collectedDataCallback' => static function (): array { return array (
  '../../../app/Actions/Catalog/ListVisibleServiceGroups.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$definition->isProductionReady($at):88',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'is_string($mode):118',
        3 => NULL,
      ),
      2 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->application->environment(\'production\'):127',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\ConstructorWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Actions\\Catalog\\ListVisibleServiceGroups',
        1 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureMethodCallCollector' => 
    array (
      0 => 
      array (
        0 => 
        array (
          0 => 'App\\Models\\ServiceDefinition',
        ),
        1 => 'useCatalogEvaluationTime',
        2 => 84,
      ),
    ),
  ),
  '../../../app/Actions/Catalog/PublishServiceDefinition.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$locked->isEligibleForProductionPublication($at):34',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => '$activeDefinitions->contains(static fn(\\App\\Models\\ServiceDefinition $active): bool => $active->versionNumber() >= $locked->versionNumber()):51',
        3 => NULL,
      ),
      2 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\TernaryOperatorConstantConditionRule',
        1 => NULL,
        2 => '$activeDefinitions->isEmpty():57',
        3 => NULL,
      ),
      3 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$effectiveFrom->isBefore($transitionAt):64',
        3 => NULL,
      ),
      4 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$locked->isEligibleForProductionPublication($transitionAt):70',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureMethodCallCollector' => 
    array (
      0 => 
      array (
        0 => 
        array (
          0 => 'Illuminate\\Database\\Eloquent\\Model',
        ),
        1 => 'update',
        2 => 75,
      ),
      1 => 
      array (
        0 => 
        array (
          0 => 'Illuminate\\Database\\Eloquent\\Model',
        ),
        1 => 'update',
        2 => 81,
      ),
    ),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\ConstructorWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Actions\\Catalog\\RecordServiceLaunchGateApproval',
        1 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Actions\\Catalog\\RecordServiceLaunchGateApproval',
        1 => 'handle',
        2 => 'App\\Actions\\Catalog\\RecordServiceLaunchGateApproval',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\actions\\catalog\\recordservicelaunchgatedecision' . "\0" . 'handle',
        ),
      ),
    ),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$expiresAt->isAfter($now):41',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$clinicalCredential->isCurrentFor($actor, $now):48',
        3 => NULL,
      ),
    ),
  ),
  '../../../app/Data/Catalog/CatalogListing.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\ConstructorWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Data\\Catalog\\CatalogListing',
        1 => 
        array (
        ),
      ),
    ),
  ),
  '../../../app/Domain/Catalog/ServiceDefinitionPayload.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyString(data_get($payload, \'patient_purpose_ar\')):17',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'in_array(data_get($payload, \'risk.tier\'), [\'low\', \'medium\', \'high\'], true):19',
        3 => NULL,
      ),
      2 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'doctor_requirements\')):20',
        3 => NULL,
      ),
      3 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'branch_requirements\')):21',
        3 => NULL,
      ),
      4 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'required_evidence\')):22',
        3 => NULL,
      ),
      5 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'follow_up_rules\')):23',
        3 => NULL,
      ),
      6 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'completion_rules\')):24',
        3 => NULL,
      ),
      7 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'is_array($referencePrice):25',
        3 => NULL,
      ),
      8 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'is_int(data_get($referencePrice, \'amount_minor\')):27',
        3 => NULL,
      ),
      9 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyString(data_get($referencePrice, \'source_reference\')):29',
        3 => NULL,
      ),
      10 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyStringList(data_get($payload, \'complaint_refund_escalation_rules\')):32',
        3 => NULL,
      ),
      11 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyString(data_get($payload, \'catalog_decision_reference\')):33',
        3 => NULL,
      ),
      12 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'is_string($value):38',
        3 => NULL,
      ),
      13 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'is_array($value):43',
        3 => NULL,
      ),
      14 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'array_is_list($value):43',
        3 => NULL,
      ),
      15 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'self::isNonEmptyString($item):48',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        1 => 'isCompleteForProduction',
        2 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        3 => 
        array (
          0 => 'f' . "\0" . 'data_get',
          1 => 'm' . "\0" . 'app\\domain\\catalog\\servicedefinitionpayload' . "\0" . 'isnonemptystring',
          2 => 'm' . "\0" . 'app\\domain\\catalog\\servicedefinitionpayload' . "\0" . 'isnonemptystringlist',
        ),
      ),
      1 => 
      array (
        0 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        1 => 'isNonEmptyString',
        2 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        3 => 
        array (
        ),
      ),
      2 => 
      array (
        0 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        1 => 'isNonEmptyStringList',
        2 => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
        3 => 
        array (
          0 => 'f' . "\0" . 'array_is_list',
          1 => 'm' . "\0" . 'app\\domain\\catalog\\servicedefinitionpayload' . "\0" . 'isnonemptystring',
        ),
      ),
    ),
  ),
  '../../../app/Enums/ServiceLaunchGateType.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Enums\\ServiceLaunchGateType',
        1 => 'responsibleRole',
        2 => 'App\\Enums\\ServiceLaunchGateType',
        3 => 
        array (
        ),
      ),
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceDefinitionSummaryResource',
        1 => 'toArray',
        2 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceDefinitionSummaryResource',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'versionnumber',
          1 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'audience',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'clinicalreviewstate',
          3 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'isproductionready',
          4 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'hasfundedprotection',
        ),
      ),
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceGroupResource',
        1 => 'toArray',
        2 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceGroupResource',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\http\\resources\\json\\jsonresource' . "\0" . 'collection',
        ),
      ),
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceResource',
        1 => 'toArray',
        2 => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceResource',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\http\\resources\\json\\jsonresource' . "\0" . '__construct',
          1 => 'm' . "\0" . 'app\\models\\service' . "\0" . 'visibledefinition',
        ),
      ),
    ),
  ),
  '../../../app/Models/ClinicalReviewerCredential.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$this->verified_at->isAfter($at):85',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->expires_at->isAfter($at):86',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\ClinicalReviewerCredential',
        1 => 'supersededBy',
        2 => 'App\\Models\\ClinicalReviewerCredential',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'hasone',
        ),
      ),
      1 => 
      array (
        0 => 'App\\Models\\ClinicalReviewerCredential',
        1 => 'casts',
        2 => 'App\\Models\\ClinicalReviewerCredential',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
    ),
  ),
  '../../../app/Models/Service.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => '$service->isDirty([\'service_group_id\', \'code\', \'slug\']):34',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$this->relationLoaded(\'serviceDefinitions\'):58',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\Service',
        1 => 'serviceGroup',
        2 => 'App\\Models\\Service',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'belongsto',
        ),
      ),
      1 => 
      array (
        0 => 'App\\Models\\Service',
        1 => 'casts',
        2 => 'App\\Models\\Service',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
    ),
  ),
  '../../../app/Models/ServiceDefinition.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => '$serviceDefinition->isDirty(\'definition\'):64',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$serviceDefinition->hasCompleteProductionCard():72',
        3 => NULL,
      ),
      2 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => 'in_array($originalStatus, [\\App\\Enums\\ServiceDefinitionStatus::Active, \\App\\Enums\\ServiceDefinitionStatus::Retired, \\App\\Enums\\ServiceDefinitionStatus::Superseded], true):82',
        3 => NULL,
      ),
      3 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$serviceDefinition->isDirty(self::IMMUTABLE_AFTER_ACTIVATION):91',
        3 => NULL,
      ),
      4 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'in_array($serviceDefinition->status(), $allowedStatuses, true):120',
        3 => NULL,
      ),
      5 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'array_is_list($values):367',
        3 => NULL,
      ),
      6 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => 'is_array($value):372',
        3 => NULL,
      ),
      7 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$this->hasCompleteProductionCard():159',
        3 => NULL,
      ),
      8 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanOrConstantConditionRule',
        1 => NULL,
        2 => '$this->hasFundedProtection():160',
        3 => NULL,
      ),
      9 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->isPublishedAt($evaluatedAt):172',
        3 => NULL,
      ),
      10 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->isEligibleForProductionPublication($evaluatedAt):173',
        3 => NULL,
      ),
      11 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$medicalGate->isCurrentApproval($at ?? $this->evaluationTime(), $this->contentHash()):185',
        3 => NULL,
      ),
      12 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$gate->isCurrentApproval($at, $this->contentHash()):247',
        3 => NULL,
      ),
      13 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'is_array($definition):277',
        3 => NULL,
      ),
      14 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'in_array($this->status(), [\\App\\Enums\\ServiceDefinitionStatus::Active, \\App\\Enums\\ServiceDefinitionStatus::Superseded], true):291',
        3 => NULL,
      ),
      15 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->effective_from->isAfter($at):301',
        3 => NULL,
      ),
      16 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanOrConstantConditionRule',
        1 => NULL,
        2 => '$this->effective_until->isAfter($at):307',
        3 => NULL,
      ),
      17 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => '$this->hasFundedProtection():316',
        3 => NULL,
      ),
      18 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->effective_until->lessThanOrEqualTo($this->effective_from):330',
        3 => NULL,
      ),
      19 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'is_string($status):340',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'normalizeForHash',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'f' . "\0" . 'array_is_list',
          1 => 'f' . "\0" . 'ksort',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'normalizeforhash',
        ),
      ),
      1 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'service',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'belongsto',
        ),
      ),
      2 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'isEligibleForProductionPublication',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'audience',
          1 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'hascompleteproductioncard',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'hasfundedprotection',
          3 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'hascurrentlaunchapprovals',
          4 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'evaluationtime',
        ),
      ),
      3 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'isProductionReady',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'evaluationtime',
          1 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'ispublishedat',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'iseligibleforproductionpublication',
        ),
      ),
      4 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'clinicalReviewState',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'definitionpayload',
          1 => 'f' . "\0" . 'data_get',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'currentlaunchgate',
          3 => 'm' . "\0" . 'app\\models\\servicelaunchgate' . "\0" . 'iscurrentapproval',
          4 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'evaluationtime',
          5 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'contenthash',
        ),
      ),
      5 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'hasCompleteProductionCard',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\domain\\catalog\\servicedefinitionpayload' . "\0" . 'iscompleteforproduction',
          1 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'definitionpayload',
        ),
      ),
      6 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'hasFundedProtection',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'definitionpayload',
          1 => 'f' . "\0" . 'data_get',
        ),
      ),
      7 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'contentHash',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      8 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'versionNumber',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      9 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'serviceId',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      10 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'status',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      11 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'audience',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      12 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'casts',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
        ),
      ),
      13 => 
      array (
        0 => 'App\\Models\\ServiceDefinition',
        1 => 'hasCurrentLaunchApprovals',
        2 => 'App\\Models\\ServiceDefinition',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'currentlaunchgate',
          1 => 'm' . "\0" . 'app\\models\\servicelaunchgate' . "\0" . 'iscurrentapproval',
          2 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'contenthash',
        ),
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureFuncCallCollector' => 
    array (
      0 => 
      array (
        0 => 'ksort',
        1 => 368,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureMethodCallCollector' => 
    array (
      0 => 
      array (
        0 => 
        array (
          0 => 'Illuminate\\Database\\Eloquent\\Model',
        ),
        1 => 'setAttribute',
        2 => 66,
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
    ),
  ),
  '../../../app/Models/ServiceGroup.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\IfConstantConditionRule',
        1 => NULL,
        2 => '$group->isDirty(\'code\'):30',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\ServiceGroup',
        1 => 'casts',
        2 => 'App\\Models\\ServiceGroup',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
    ),
  ),
  '../../../app/Models/ServiceLaunchGate.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => 'hash_equals($contentHash, $this->approved_content_hash):81',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanOrConstantConditionRule',
        1 => NULL,
        2 => '$this->decided_at->isAfter($at):87',
        3 => NULL,
      ),
      2 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$this->expires_at->isAfter($at):88',
        3 => NULL,
      ),
      3 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanNotConstantConditionRule',
        1 => NULL,
        2 => '$this->expires_at->isAfter($this->decided_at):89',
        3 => NULL,
      ),
      4 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanAndConstantConditionRule',
        1 => NULL,
        2 => '$this->clinicalReviewerCredential->isCurrentFor($this->approvedBy, $at):102',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'serviceDefinition',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'belongsto',
        ),
      ),
      1 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'approvedBy',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'belongsto',
        ),
      ),
      2 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'clinicalReviewerCredential',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\model' . "\0" . 'belongsto',
        ),
      ),
      3 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'sequenceNumber',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
        ),
      ),
      4 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'type',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
        ),
      ),
      5 => 
      array (
        0 => 'App\\Models\\ServiceLaunchGate',
        1 => 'casts',
        2 => 'App\\Models\\ServiceLaunchGate',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
    ),
  ),
  '../../../app/Models/User.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'App\\Models\\User',
        1 => 'casts',
        2 => 'App\\Models\\User',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\Traits\\TraitUseCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
      1 => 
      array (
        0 => 'Illuminate\\Notifications\\Notifiable',
      ),
    ),
  ),
  '../../../app/Providers/AppServiceProvider.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Support\\Facades\\RateLimiter',
        1 => 'for',
        2 => 27,
      ),
    ),
  ),
  '../../../app/Providers/Filament/AdminPanelProvider.php' => 
  array (
    'PHPStan\\Rules\\Methods\\NamedArgumentParameterMethodCallsCollector' => 
    array (
      0 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverResources',
        2 => 'in',
        3 => 36,
      ),
      1 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverResources',
        2 => 'for',
        3 => 36,
      ),
      2 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverPages',
        2 => 'in',
        3 => 37,
      ),
      3 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverPages',
        2 => 'for',
        3 => 37,
      ),
      4 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverWidgets',
        2 => 'in',
        3 => 41,
      ),
      5 => 
      array (
        0 => 'Filament\\Panel',
        1 => 'discoverWidgets',
        2 => 'for',
        3 => 41,
      ),
    ),
  ),
  '../../../bootstrap/app.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanOrConstantConditionRule',
        1 => NULL,
        2 => '$request->is(\'api/*\'):22',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\BooleanOrConstantConditionRule',
        1 => NULL,
        2 => '$request->expectsJson():22',
        3 => NULL,
      ),
    ),
    'PHPStan\\Rules\\Methods\\NamedArgumentParameterMethodCallsCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Foundation\\Configuration\\ApplicationBuilder',
        1 => 'withRouting',
        2 => 'web',
        3 => 12,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Foundation\\Configuration\\ApplicationBuilder',
        1 => 'withRouting',
        2 => 'api',
        3 => 13,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Foundation\\Configuration\\ApplicationBuilder',
        1 => 'withRouting',
        2 => 'commands',
        3 => 14,
      ),
      3 => 
      array (
        0 => 'Illuminate\\Foundation\\Configuration\\ApplicationBuilder',
        1 => 'withRouting',
        2 => 'health',
        3 => 15,
      ),
    ),
  ),
  '../../../config/database.php' => 
  array (
    'PHPStan\\Rules\\Comparison\\FunctionCallConstantConditionCollector' => 
    array (
      0 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\TernaryOperatorConstantConditionRule',
        1 => NULL,
        2 => '\\extension_loaded(\'pdo_mysql\'):64',
        3 => NULL,
      ),
      1 => 
      array (
        0 => 'PHPStan\\Rules\\Comparison\\TernaryOperatorConstantConditionRule',
        1 => NULL,
        2 => '\\extension_loaded(\'pdo_mysql\'):84',
        3 => NULL,
      ),
    ),
  ),
  '../../../database/factories/ServiceDefinitionFactory.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'pendingClinicalDefinition',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
        ),
      ),
      1 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'completeProductionDefinition',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
        ),
      ),
      2 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'definition',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\service' . "\0" . 'factory',
          1 => 'm' . "\0" . 'database\\factories\\servicedefinitionfactory' . "\0" . 'pendingclinicaldefinition',
        ),
      ),
      3 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'activeEvaluation',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
      4 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'activeProduction',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
      5 => 
      array (
        0 => 'Database\\Factories\\ServiceDefinitionFactory',
        1 => 'productionCandidate',
        2 => 'Database\\Factories\\ServiceDefinitionFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
    ),
  ),
  '../../../database/factories/ServiceFactory.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Factories\\ServiceFactory',
        1 => 'inactive',
        2 => 'Database\\Factories\\ServiceFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
    ),
  ),
  '../../../database/factories/ServiceGroupFactory.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Factories\\ServiceGroupFactory',
        1 => 'inactive',
        2 => 'Database\\Factories\\ServiceGroupFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
    ),
  ),
  '../../../database/factories/ServiceLaunchGateFactory.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Factories\\ServiceLaunchGateFactory',
        1 => 'definition',
        2 => 'Database\\Factories\\ServiceLaunchGateFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'app\\models\\servicedefinition' . "\0" . 'factory',
          1 => 'm' . "\0" . 'app\\enums\\servicelaunchgatetype' . "\0" . 'responsiblerole',
        ),
      ),
      1 => 
      array (
        0 => 'Database\\Factories\\ServiceLaunchGateFactory',
        1 => 'forType',
        2 => 'Database\\Factories\\ServiceLaunchGateFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
      2 => 
      array (
        0 => 'Database\\Factories\\ServiceLaunchGateFactory',
        1 => 'approved',
        2 => 'Database\\Factories\\ServiceLaunchGateFactory',
        3 => 
        array (
          0 => 'm' . "\0" . 'illuminate\\database\\eloquent\\factories\\factory' . "\0" . 'state',
        ),
      ),
    ),
  ),
  '../../../database/migrations/2026_08_23_125412_create_service_groups_table.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 26,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 28,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 34,
      ),
    ),
  ),
  '../../../database/migrations/2026_08_23_125413_create_services_table.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 33,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 35,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 41,
      ),
    ),
  ),
  '../../../database/migrations/2026_08_23_125414_create_service_definitions_table.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 46,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 55,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 64,
      ),
      3 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 90,
      ),
      4 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 104,
      ),
      5 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 114,
      ),
      6 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 124,
      ),
      7 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 151,
      ),
      8 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 166,
      ),
      9 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 167,
      ),
      10 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 168,
      ),
      11 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 169,
      ),
    ),
  ),
  '../../../database/migrations/2026_08_23_125415_create_clinical_reviewer_credentials_table.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 47,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 48,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 54,
      ),
      3 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 55,
      ),
      4 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 61,
      ),
      5 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 62,
      ),
    ),
  ),
  '../../../database/migrations/2026_08_23_125416_create_service_launch_gates_table.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 57,
      ),
      1 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 58,
      ),
      2 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 64,
      ),
      3 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 65,
      ),
      4 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 71,
      ),
      5 => 
      array (
        0 => 'Illuminate\\Database\\Connection',
        1 => 'unprepared',
        2 => 72,
      ),
    ),
  ),
  '../../../database/seeders/ServiceDefinitionSeeder.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Seeders\\ServiceDefinitionSeeder',
        1 => 'definitionFor',
        2 => 'Database\\Seeders\\ServiceDefinitionSeeder',
        3 => 
        array (
        ),
      ),
    ),
  ),
  '../../../database/seeders/ServiceGroupSeeder.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\PossiblyPureMethodCallCollector' => 
    array (
      0 => 
      array (
        0 => 
        array (
          0 => 'Illuminate\\Database\\Eloquent\\Model',
        ),
        1 => 'save',
        2 => 52,
      ),
    ),
  ),
  '../../../database/seeders/ServiceSeeder.php' => 
  array (
    'PHPStan\\Rules\\DeadCode\\MethodWithoutImpurePointsCollector' => 
    array (
      0 => 
      array (
        0 => 'Database\\Seeders\\ServiceSeeder',
        1 => 'catalog',
        2 => 'Database\\Seeders\\ServiceSeeder',
        3 => 
        array (
        ),
      ),
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureMethodCallCollector' => 
    array (
      0 => 
      array (
        0 => 
        array (
          0 => 'Illuminate\\Database\\Eloquent\\Model',
        ),
        1 => 'save',
        2 => 27,
      ),
    ),
  ),
  '../../../routes/web.php' => 
  array (
    'Larastan\\Larastan\\Collectors\\UsedViewFunctionCollector' => 
    array (
      0 => 'welcome',
    ),
    'PHPStan\\Rules\\DeadCode\\PossiblyPureStaticCallCollector' => 
    array (
      0 => 
      array (
        0 => 'Illuminate\\Support\\Facades\\Route',
        1 => 'get',
        2 => 9,
      ),
    ),
  ),
); },
	'dependencies' => array (
  '../../../app/Actions/Catalog/ListVisibleServiceGroups.php' => 
  array (
    'fileHash' => 'b64aa852f6f0486a10629797b39399ac132921b05b687411714c30dcac960425',
    'dependentFiles' => 
    array (
      0 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
    ),
  ),
  '../../../app/Actions/Catalog/PublishServiceDefinition.php' => 
  array (
    'fileHash' => 'cbe6837686b3a5c504e215da645ded79bf85e27c7718e74788b534140799e667',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php' => 
  array (
    'fileHash' => 'b41524053b3763c66c32102953d4c44903ecd62bb31c8ff828327d25416f6e34',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php' => 
  array (
    'fileHash' => 'aeacbb9b04367fcf5f8f9eb4893c0add40a011543ec6a9dece8e3c2fd30e95ff',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
    ),
  ),
  '../../../app/Data/Catalog/CatalogListing.php' => 
  array (
    'fileHash' => 'c58709bf0b76ad69b89bb164111ae64ba0f169b329ac32744961124536b1bf19',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
    ),
  ),
  '../../../app/Domain/Catalog/ServiceDefinitionPayload.php' => 
  array (
    'fileHash' => 'd110d386c89a4ae8cab891ed63cf0c6354b5a8e20863165c08836d2c52257faf',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/ServiceDefinition.php',
    ),
  ),
  '../../../app/Enums/ClinicalReviewerCredentialStatus.php' => 
  array (
    'fileHash' => '48bbb65906f49584e26cf1cfae8553f7c3538f333c5f6ec6daa1cbfe0ab78582',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ClinicalReviewerCredential.php',
      3 => '../../../app/Models/ServiceLaunchGate.php',
      4 => '../../../database/factories/ClinicalReviewerCredentialFactory.php',
      5 => '../../../database/factories/ServiceLaunchGateFactory.php',
    ),
  ),
  '../../../app/Enums/ServiceDefinitionAudience.php' => 
  array (
    'fileHash' => 'c166db4bb1f5d0a34550ac968ade123dd6df58f6671f9344016ee7c9d23ef0ba',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Actions/Catalog/PublishServiceDefinition.php',
      2 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      3 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      4 => '../../../app/Data/Catalog/CatalogListing.php',
      5 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
      6 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php',
      7 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php',
      8 => '../../../app/Models/Service.php',
      9 => '../../../app/Models/ServiceDefinition.php',
      10 => '../../../app/Models/ServiceLaunchGate.php',
      11 => '../../../database/factories/ServiceDefinitionFactory.php',
      12 => '../../../database/factories/ServiceLaunchGateFactory.php',
      13 => '../../../database/seeders/ServiceDefinitionSeeder.php',
      14 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Enums/ServiceDefinitionStatus.php' => 
  array (
    'fileHash' => '5ab22126797da36b2a56d307b704774ba39c8c83480586ad730e39b508de5ba3',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Actions/Catalog/PublishServiceDefinition.php',
      2 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      3 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      4 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php',
      5 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php',
      6 => '../../../app/Models/Service.php',
      7 => '../../../app/Models/ServiceDefinition.php',
      8 => '../../../app/Models/ServiceLaunchGate.php',
      9 => '../../../database/factories/ServiceDefinitionFactory.php',
      10 => '../../../database/factories/ServiceLaunchGateFactory.php',
      11 => '../../../database/seeders/ServiceDefinitionSeeder.php',
      12 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Enums/ServiceLaunchGateStatus.php' => 
  array (
    'fileHash' => '2ae74e17a2453bcdd351f0dadb8e95bdccf539f045d21ad47727d00b9a1a8ca9',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ServiceDefinition.php',
      3 => '../../../app/Models/ServiceLaunchGate.php',
      4 => '../../../database/factories/ServiceLaunchGateFactory.php',
      5 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Enums/ServiceLaunchGateType.php' => 
  array (
    'fileHash' => '9050419ac1d61f0385ecfd7ebf1c594ab219501f919f90a7fb5529fa8df6fa9e',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ServiceDefinition.php',
      3 => '../../../app/Models/ServiceLaunchGate.php',
      4 => '../../../database/factories/ServiceLaunchGateFactory.php',
      5 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php' => 
  array (
    'fileHash' => '222b7aadcea78ae460e7e0f6bb220b137a8635eca4bca8164658ad2d21717ab1',
    'dependentFiles' => 
    array (
      0 => '../../../routes/api.php',
    ),
  ),
  '../../../app/Http/Controllers/Controller.php' => 
  array (
    'fileHash' => '09e5cac5a69959ccf23d756cda697b993df937c106655d124ff27ca5fe24a705',
    'dependentFiles' => 
    array (
      0 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
      1 => '../../../routes/api.php',
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php' => 
  array (
    'fileHash' => '191783c7e384873bb802a1c3bb72f69fb80c4276a54c75887b70009bcd287f74',
    'dependentFiles' => 
    array (
      0 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php',
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php' => 
  array (
    'fileHash' => 'fcb5990de1b845aaf93384d4aa6b6c06095e3b82e1cc3faa61e4713a9cd1ecb6',
    'dependentFiles' => 
    array (
      0 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
    ),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php' => 
  array (
    'fileHash' => '5772043786027e48a98288ae6260e71fde093544071ba09b3e6e5332eba396c4',
    'dependentFiles' => 
    array (
      0 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php',
    ),
  ),
  '../../../app/Models/ClinicalReviewerCredential.php' => 
  array (
    'fileHash' => 'e66e9a80423b16aeed8f8f091f267434ce1ba7af993f43525e109e2906eb1c70',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ServiceDefinition.php',
      3 => '../../../app/Models/ServiceLaunchGate.php',
      4 => '../../../database/factories/ClinicalReviewerCredentialFactory.php',
      5 => '../../../database/factories/ServiceLaunchGateFactory.php',
      6 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Models/Service.php' => 
  array (
    'fileHash' => 'd4c33c6e49984c315cbe5be89f343d80c3fe7e2cca509480889eddba29109652',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Actions/Catalog/PublishServiceDefinition.php',
      2 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php',
      3 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php',
      4 => '../../../app/Models/ServiceDefinition.php',
      5 => '../../../app/Models/ServiceGroup.php',
      6 => '../../../database/factories/ServiceDefinitionFactory.php',
      7 => '../../../database/factories/ServiceFactory.php',
      8 => '../../../database/seeders/ServiceDefinitionSeeder.php',
      9 => '../../../database/seeders/ServiceSeeder.php',
    ),
  ),
  '../../../app/Models/ServiceDefinition.php' => 
  array (
    'fileHash' => '4c6a8c719adcd4ca73660fadb2498f31efaa82bf7f5378818388ad2a08c47ceb',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Actions/Catalog/PublishServiceDefinition.php',
      2 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      3 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      4 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php',
      5 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php',
      6 => '../../../app/Models/Service.php',
      7 => '../../../app/Models/ServiceLaunchGate.php',
      8 => '../../../database/factories/ServiceDefinitionFactory.php',
      9 => '../../../database/factories/ServiceLaunchGateFactory.php',
      10 => '../../../database/seeders/ServiceDefinitionSeeder.php',
      11 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Models/ServiceGroup.php' => 
  array (
    'fileHash' => 'd491a36826bf616e265581d78c3f40aa648991d4b5c232ca6dc7530116857994',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/ListVisibleServiceGroups.php',
      1 => '../../../app/Data/Catalog/CatalogListing.php',
      2 => '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php',
      3 => '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php',
      4 => '../../../app/Models/Service.php',
      5 => '../../../database/factories/ServiceFactory.php',
      6 => '../../../database/factories/ServiceGroupFactory.php',
      7 => '../../../database/seeders/ServiceGroupSeeder.php',
      8 => '../../../database/seeders/ServiceSeeder.php',
    ),
  ),
  '../../../app/Models/ServiceLaunchGate.php' => 
  array (
    'fileHash' => '9e866b4acfa0f86696724b2c350ee033d8390e431e56eb2fe27b02bd90b07930',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ServiceDefinition.php',
      3 => '../../../database/factories/ServiceLaunchGateFactory.php',
      4 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Models/User.php' => 
  array (
    'fileHash' => '321620e10c8e143943e46427a92018ec6964b00b72fa83a708adcfc2aca6524c',
    'dependentFiles' => 
    array (
      0 => '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php',
      1 => '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php',
      2 => '../../../app/Models/ClinicalReviewerCredential.php',
      3 => '../../../app/Models/ServiceDefinition.php',
      4 => '../../../app/Models/ServiceLaunchGate.php',
      5 => '../../../config/auth.php',
      6 => '../../../database/factories/ClinicalReviewerCredentialFactory.php',
      7 => '../../../database/factories/ServiceLaunchGateFactory.php',
      8 => '../../../database/factories/UserFactory.php',
      9 => '../../../database/seeders/ServiceLaunchGateSeeder.php',
    ),
  ),
  '../../../app/Providers/AppServiceProvider.php' => 
  array (
    'fileHash' => 'fe1671a04136f7c62bfbbc070ad236b16061e98cfab7435d336241545e0e834e',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../app/Providers/Filament/AdminPanelProvider.php' => 
  array (
    'fileHash' => '9ae6dd5d0f7a389a1420e1b30bedd6b62b5025c51787304efc0b666e656d6780',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../bootstrap/app.php' => 
  array (
    'fileHash' => 'c34ef848a9b9cadd17f54a5902fda342491ba823f156694be4b0200f63f9eb7b',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/app.php' => 
  array (
    'fileHash' => '4c39ce5adbd62bcb033e1c1fe41121b4ad987b86516bbbd39057b50e3a0a08c4',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/auth.php' => 
  array (
    'fileHash' => '4c3c04aea0426b878bafe2e873a1d16b1df56be4d8e2060d9e16367bb8b0b059',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/cache.php' => 
  array (
    'fileHash' => 'c3d513579bba5963c2bd4e48c36dd96340ba62a42cc35357a4b47f737ee21c62',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/database.php' => 
  array (
    'fileHash' => '7b111f04d86b501ff87f2e0612ea51a1459167f236dcbc155fcf3a72349a26d9',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/filesystems.php' => 
  array (
    'fileHash' => '47fad3643442b952e77bbf45153f972e6b4ad655048911543a6efdb8b7afcf1e',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/logging.php' => 
  array (
    'fileHash' => '8a37135575bbc70eedaabdc2e5cf45349ee50bbfe330109dcf4fa8e46a9a4384',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/mail.php' => 
  array (
    'fileHash' => '9e13b4fef803c10ce9b2fb6c72e3d35d6048dda1dc3d9080844adb66678fbb79',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/queue.php' => 
  array (
    'fileHash' => '726a1f09999779c025cba796df9e0d174955f752f7256e4b1cb699519a89e916',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/services.php' => 
  array (
    'fileHash' => '4ecc3653f6dd437b8f3d21d4cc2ed5a5ca9f0d66cfc41a1ac95e65ba948d478a',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/session.php' => 
  array (
    'fileHash' => '4c927c57036186c4ebac15ba850f99f3e02817c515c75c13c74c542c32035851',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../config/ubertib.php' => 
  array (
    'fileHash' => 'b61828bfd9acef8167f9211130fa42be2353b2ed310d5018f2d87921258f04b5',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/factories/ClinicalReviewerCredentialFactory.php' => 
  array (
    'fileHash' => '870c8faa4c752a652c1bdd5122109c3ffc10cc06eaba5a75ccde651c8b33d9a0',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/ClinicalReviewerCredential.php',
    ),
  ),
  '../../../database/factories/ServiceDefinitionFactory.php' => 
  array (
    'fileHash' => '0ae839491d7bf3fba07cd94e9b75b3609caaa3023a96ce527ca30a5eab343dc9',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/ServiceDefinition.php',
      1 => '../../../database/factories/ServiceLaunchGateFactory.php',
    ),
  ),
  '../../../database/factories/ServiceFactory.php' => 
  array (
    'fileHash' => '79ba1968b7bbae96a9478f9a41e349df01c381a9bf4ceca97eaf1ba5eeac8e2a',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/Service.php',
      1 => '../../../database/factories/ServiceDefinitionFactory.php',
    ),
  ),
  '../../../database/factories/ServiceGroupFactory.php' => 
  array (
    'fileHash' => 'c1a7e3e20657b82bae72ecae15ea7ba1a18ce59f5e9e2a3fddb773f39839b297',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/ServiceGroup.php',
      1 => '../../../database/factories/ServiceFactory.php',
    ),
  ),
  '../../../database/factories/ServiceLaunchGateFactory.php' => 
  array (
    'fileHash' => '8fa43ae2811ca3ac1c8f7c4ee1f0edb5ecff4ad9cdc571e1a4ec20a380c70fcd',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/ServiceLaunchGate.php',
    ),
  ),
  '../../../database/factories/UserFactory.php' => 
  array (
    'fileHash' => 'ca14b46916063e2eb24d58da2659116423049cc421b4c082ce9157d8f6b52cfd',
    'dependentFiles' => 
    array (
      0 => '../../../app/Models/User.php',
      1 => '../../../database/factories/ClinicalReviewerCredentialFactory.php',
    ),
  ),
  '../../../database/migrations/0001_01_01_000000_create_users_table.php' => 
  array (
    'fileHash' => 'b984044d9eb78972aa3ed8079d643aa648ea6e91b80d7a5fa6429464a83f0e2b',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/0001_01_01_000001_create_cache_table.php' => 
  array (
    'fileHash' => 'f3cc0728860ab6c0b5c29328f26ee393d90a7e7c94452d5394840e3ead2f0c44',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/0001_01_01_000002_create_jobs_table.php' => 
  array (
    'fileHash' => '8e0f23e6b1f94196d447e9513769cf6ab674b89abb4b8e3b89fb78b62b896973',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/2026_08_23_125412_create_service_groups_table.php' => 
  array (
    'fileHash' => 'bc532ed29e8532a300499d0585e931d2338bf19a02339ed04e2354c1eeaf32ad',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/2026_08_23_125413_create_services_table.php' => 
  array (
    'fileHash' => 'cb1a9c3222fc8c7b611e3d9a69b024cce2dd13235c6918e7da3a0d4ee66b6a9e',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/2026_08_23_125414_create_service_definitions_table.php' => 
  array (
    'fileHash' => '1871cca96c423a1e5eb5b45d1128ee7ebb9ecfd4afd78b5a92f02b32a59716df',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/2026_08_23_125415_create_clinical_reviewer_credentials_table.php' => 
  array (
    'fileHash' => 'dd72a07819e3515666d945a3b89db10f2430d0c03694110ad625e9669a6922d1',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/migrations/2026_08_23_125416_create_service_launch_gates_table.php' => 
  array (
    'fileHash' => 'a61261fd64eef2019927dac95c39f4486c9b645a0ddf73cb2d23a217a43e0a90',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/seeders/DatabaseSeeder.php' => 
  array (
    'fileHash' => 'fe922a392b151c7174cdcf59708b08463499fe1764d1f2cd96a236bcde4a90a4',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../database/seeders/ServiceDefinitionSeeder.php' => 
  array (
    'fileHash' => '79da35fe12f0c4922d79fae563ba7fc489d710708b9ab92ac8290b4dba701322',
    'dependentFiles' => 
    array (
      0 => '../../../database/seeders/DatabaseSeeder.php',
    ),
  ),
  '../../../database/seeders/ServiceGroupSeeder.php' => 
  array (
    'fileHash' => '14e6f042fc41d10e10745bbed38531198efe7531af56720f3ea0d78944637dfc',
    'dependentFiles' => 
    array (
      0 => '../../../database/seeders/DatabaseSeeder.php',
    ),
  ),
  '../../../database/seeders/ServiceLaunchGateSeeder.php' => 
  array (
    'fileHash' => 'f6b78902e1182a71262270980e7afdf52d245b2dbb8f35412280211e22460044',
    'dependentFiles' => 
    array (
      0 => '../../../database/seeders/DatabaseSeeder.php',
    ),
  ),
  '../../../database/seeders/ServiceSeeder.php' => 
  array (
    'fileHash' => '69152590d900dcd3dcd3d485159b87f1d3b097cebbd9db161bd8989e45c0090a',
    'dependentFiles' => 
    array (
      0 => '../../../database/seeders/DatabaseSeeder.php',
    ),
  ),
  '../../../routes/api.php' => 
  array (
    'fileHash' => 'aed0cf73fc90a16ffa130dd281dfdaaa507efa65483e35bfd4a9de409869ee29',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../routes/console.php' => 
  array (
    'fileHash' => 'ed7498862cfa2ee95b008becf1abdd58feab37be1cb414d441de43aaa6feb395',
    'dependentFiles' => 
    array (
    ),
  ),
  '../../../routes/web.php' => 
  array (
    'fileHash' => '9ffea1e9cc29c9de2bf3bc3d0b4267a448bad4dadc8a2722f83bf5cc6bc273cd',
    'dependentFiles' => 
    array (
    ),
  ),
),
	'packageDependencies' => array (
  '../../../app/Providers/AppServiceProvider.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
  ),
  '../../../bootstrap/app.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
    2 => 'symfony/http-kernel',
    3 => 'psr/container',
  ),
  '../../../config/app.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/auth.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/filesystems.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/logging.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'monolog/monolog',
  ),
  '../../../config/session.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/factories/UserFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'fakerphp/faker',
    2 => 'nesbot/carbon',
  ),
  '../../../database/migrations/0001_01_01_000001_create_cache_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/0001_01_01_000002_create_jobs_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../routes/web.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
  ),
  '../../../app/Http/Controllers/Controller.php' => 
  array (
  ),
  '../../../app/Models/User.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../app/Providers/Filament/AdminPanelProvider.php' => 
  array (
    0 => 'filament/filament',
    1 => 'laravel/framework',
    2 => 'filament/support',
    3 => 'filament/actions',
    4 => 'filament/schemas',
    5 => 'danharrin/livewire-rate-limiting',
    6 => 'livewire/livewire',
    7 => 'filament/widgets',
  ),
  '../../../config/cache.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/database.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/mail.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/queue.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../config/services.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/0001_01_01_000000_create_users_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/seeders/DatabaseSeeder.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../routes/console.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/console',
  ),
  '../../../app/Actions/Catalog/ListVisibleServiceGroups.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-kernel',
    2 => 'psr/container',
    3 => 'nesbot/carbon',
  ),
  '../../../app/Data/Catalog/CatalogListing.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../app/Enums/ServiceDefinitionAudience.php' => 
  array (
  ),
  '../../../app/Enums/ServiceDefinitionStatus.php' => 
  array (
  ),
  '../../../app/Enums/ServiceLaunchGateStatus.php' => 
  array (
  ),
  '../../../app/Enums/ServiceLaunchGateType.php' => 
  array (
  ),
  '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
    2 => 'nesbot/carbon',
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
    2 => 'nesbot/carbon',
  ),
  '../../../app/Models/Service.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../app/Models/ServiceDefinition.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
    2 => 'mockery/mockery',
  ),
  '../../../app/Models/ServiceGroup.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../app/Models/ServiceLaunchGate.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../config/ubertib.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/factories/ServiceDefinitionFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../database/factories/ServiceFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'fakerphp/faker',
  ),
  '../../../database/factories/ServiceGroupFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'fakerphp/faker',
  ),
  '../../../database/factories/ServiceLaunchGateFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
    2 => 'fakerphp/faker',
  ),
  '../../../database/migrations/2026_08_23_125412_create_service_groups_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/2026_08_23_125413_create_services_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/2026_08_23_125414_create_service_definitions_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/2026_08_23_125415_create_service_launch_gates_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/seeders/ServiceDefinitionSeeder.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../database/seeders/ServiceGroupSeeder.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/seeders/ServiceLaunchGateSeeder.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../database/seeders/ServiceSeeder.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../routes/api.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'symfony/http-foundation',
  ),
  '../../../app/Actions/Catalog/PublishServiceDefinition.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../app/Domain/Catalog/ServiceDefinitionPayload.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'mockery/mockery',
  ),
  '../../../app/Enums/ClinicalReviewerCredentialStatus.php' => 
  array (
  ),
  '../../../app/Models/ClinicalReviewerCredential.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
  '../../../database/factories/ClinicalReviewerCredentialFactory.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'fakerphp/faker',
    2 => 'nesbot/carbon',
  ),
  '../../../database/migrations/2026_08_23_125415_create_clinical_reviewer_credentials_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../database/migrations/2026_08_23_125416_create_service_launch_gates_table.php' => 
  array (
    0 => 'laravel/framework',
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php' => 
  array (
    0 => 'laravel/framework',
    1 => 'nesbot/carbon',
  ),
),
	'exportedNodesCallback' => static function (): array { return array (
  '../../../app/Actions/Catalog/ListVisibleServiceGroups.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Actions\\Catalog\\ListVisibleServiceGroups',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => '__construct',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => NULL,
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'application',
               'type' => 'Illuminate\\Foundation\\Application',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 68,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'handle',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Data\\Catalog\\CatalogListing',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Actions/Catalog/PublishServiceDefinition.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Actions\\Catalog\\PublishServiceDefinition',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'handle',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Models\\ServiceDefinition',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'definition',
               'type' => 'App\\Models\\ServiceDefinition',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateApproval.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Actions\\Catalog\\RecordServiceLaunchGateApproval',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => '__construct',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => NULL,
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'recordDecision',
               'type' => 'App\\Actions\\Catalog\\RecordServiceLaunchGateDecision',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 4,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'handle',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Models\\ServiceLaunchGate',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'definition',
               'type' => 'App\\Models\\ServiceDefinition',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'type',
               'type' => 'App\\Enums\\ServiceLaunchGateType',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            2 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'actor',
               'type' => 'App\\Models\\User',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            3 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'reason',
               'type' => 'string',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            4 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'evidenceReference',
               'type' => 'string',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            5 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'expiresAt',
               'type' => 'Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            6 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'clinicalCredential',
               'type' => '?App\\Models\\ClinicalReviewerCredential',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Actions/Catalog/RecordServiceLaunchGateDecision.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Actions\\Catalog\\RecordServiceLaunchGateDecision',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'handle',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Models\\ServiceLaunchGate',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'definition',
               'type' => 'App\\Models\\ServiceDefinition',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'type',
               'type' => 'App\\Enums\\ServiceLaunchGateType',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            2 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'status',
               'type' => 'App\\Enums\\ServiceLaunchGateStatus',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            3 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'actor',
               'type' => 'App\\Models\\User',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            4 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'reason',
               'type' => 'string',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            5 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'evidenceReference',
               'type' => 'string',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            6 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'expiresAt',
               'type' => '?Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            7 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'clinicalCredential',
               'type' => '?App\\Models\\ClinicalReviewerCredential',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Data/Catalog/CatalogListing.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Data\\Catalog\\CatalogListing',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => '__construct',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @param Collection<int, ServiceGroup> $groups
     */',
             'namespace' => 'App\\Data\\Catalog',
             'uses' => 
            array (
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicegroup' => 'App\\Models\\ServiceGroup',
              'collection' => 'Illuminate\\Database\\Eloquent\\Collection',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => NULL,
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'mode',
               'type' => 'App\\Enums\\ServiceDefinitionAudience',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 1,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'groups',
               'type' => 'Illuminate\\Database\\Eloquent\\Collection',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 1,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Domain/Catalog/ServiceDefinitionPayload.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'isCompleteForProduction',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @param array<array-key, mixed> $payload
     */',
             'namespace' => 'App\\Domain\\Catalog',
             'uses' => 
            array (
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'bool',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'payload',
               'type' => 'array',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Enums/ClinicalReviewerCredentialStatus.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedEnumNode::__set_state(array(
       'name' => 'App\\Enums\\ClinicalReviewerCredentialStatus',
       'scalarType' => 'string',
       'phpDoc' => NULL,
       'implements' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Verified',
           'value' => '\'verified\'',
           'phpDoc' => NULL,
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Revoked',
           'value' => '\'revoked\'',
           'phpDoc' => NULL,
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Expired',
           'value' => '\'expired\'',
           'phpDoc' => NULL,
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Enums/ServiceDefinitionAudience.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedEnumNode::__set_state(array(
       'name' => 'App\\Enums\\ServiceDefinitionAudience',
       'scalarType' => 'string',
       'phpDoc' => NULL,
       'implements' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Evaluation',
           'value' => '\'evaluation\'',
           'phpDoc' => NULL,
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Production',
           'value' => '\'production\'',
           'phpDoc' => NULL,
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Enums/ServiceDefinitionStatus.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedEnumNode::__set_state(array(
       'name' => 'App\\Enums\\ServiceDefinitionStatus',
       'scalarType' => 'string',
       'phpDoc' => NULL,
       'implements' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Draft',
           'value' => '\'draft\'',
           'phpDoc' => NULL,
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Reviewed',
           'value' => '\'reviewed\'',
           'phpDoc' => NULL,
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Scheduled',
           'value' => '\'scheduled\'',
           'phpDoc' => NULL,
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Active',
           'value' => '\'active\'',
           'phpDoc' => NULL,
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Retired',
           'value' => '\'retired\'',
           'phpDoc' => NULL,
        )),
        5 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Superseded',
           'value' => '\'superseded\'',
           'phpDoc' => NULL,
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Enums/ServiceLaunchGateStatus.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedEnumNode::__set_state(array(
       'name' => 'App\\Enums\\ServiceLaunchGateStatus',
       'scalarType' => 'string',
       'phpDoc' => NULL,
       'implements' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Pending',
           'value' => '\'pending\'',
           'phpDoc' => NULL,
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Approved',
           'value' => '\'approved\'',
           'phpDoc' => NULL,
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Rejected',
           'value' => '\'rejected\'',
           'phpDoc' => NULL,
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Revoked',
           'value' => '\'revoked\'',
           'phpDoc' => NULL,
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Expired',
           'value' => '\'expired\'',
           'phpDoc' => NULL,
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Enums/ServiceLaunchGateType.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedEnumNode::__set_state(array(
       'name' => 'App\\Enums\\ServiceLaunchGateType',
       'scalarType' => 'string',
       'phpDoc' => NULL,
       'implements' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Medical',
           'value' => '\'medical\'',
           'phpDoc' => NULL,
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Legal',
           'value' => '\'legal\'',
           'phpDoc' => NULL,
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Operational',
           'value' => '\'operational\'',
           'phpDoc' => NULL,
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedEnumCaseNode::__set_state(array(
           'name' => 'Technical',
           'value' => '\'technical\'',
           'phpDoc' => NULL,
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'responsibleRole',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'string',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Http/Controllers/Api/V1/Catalog/ListServiceGroupsController.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Http\\Controllers\\Api\\V1\\Catalog\\ListServiceGroupsController',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'App\\Http\\Controllers\\Controller',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => '__invoke',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Http\\Resources\\Json\\AnonymousResourceCollection',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'listVisibleServiceGroups',
               'type' => 'App\\Actions\\Catalog\\ListVisibleServiceGroups',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Http/Controllers/Controller.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Http\\Controllers\\Controller',
       'phpDoc' => NULL,
       'abstract' => true,
       'final' => false,
       'extends' => NULL,
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceDefinitionSummaryResource.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceDefinitionSummaryResource',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @mixin ServiceDefinition
 */',
         'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
         'uses' => 
        array (
          'servicedefinition' => 'App\\Models\\ServiceDefinition',
          'request' => 'Illuminate\\Http\\Request',
          'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'toArray',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, mixed>
     */',
             'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
             'uses' => 
            array (
              'servicedefinition' => 'App\\Models\\ServiceDefinition',
              'request' => 'Illuminate\\Http\\Request',
              'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'request',
               'type' => 'Illuminate\\Http\\Request',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceGroupResource.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceGroupResource',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @mixin ServiceGroup
 */',
         'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
         'uses' => 
        array (
          'servicegroup' => 'App\\Models\\ServiceGroup',
          'request' => 'Illuminate\\Http\\Request',
          'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'toArray',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, mixed>
     */',
             'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
             'uses' => 
            array (
              'servicegroup' => 'App\\Models\\ServiceGroup',
              'request' => 'Illuminate\\Http\\Request',
              'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'request',
               'type' => 'Illuminate\\Http\\Request',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Http/Resources/Api/V1/Catalog/ServiceResource.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Http\\Resources\\Api\\V1\\Catalog\\ServiceResource',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @mixin Service
 */',
         'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
         'uses' => 
        array (
          'service' => 'App\\Models\\Service',
          'request' => 'Illuminate\\Http\\Request',
          'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'toArray',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, mixed>
     */',
             'namespace' => 'App\\Http\\Resources\\Api\\V1\\Catalog',
             'uses' => 
            array (
              'service' => 'App\\Models\\Service',
              'request' => 'Illuminate\\Http\\Request',
              'jsonresource' => 'Illuminate\\Http\\Resources\\Json\\JsonResource',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'request',
               'type' => 'Illuminate\\Http\\Request',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Models/ClinicalReviewerCredential.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\ClinicalReviewerCredential',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
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
         'namespace' => 'App\\Models',
         'uses' => 
        array (
          'clinicalreviewercredentialstatus' => 'App\\Enums\\ClinicalReviewerCredentialStatus',
          'carbonimmutable' => 'Carbon\\CarbonImmutable',
          'carboninterface' => 'Carbon\\CarbonInterface',
          'clinicalreviewercredentialfactory' => 'Database\\Factories\\ClinicalReviewerCredentialFactory',
          'domainexception' => 'DomainException',
          'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
          'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
          'model' => 'Illuminate\\Database\\Eloquent\\Model',
          'hasone' => 'Illuminate\\Database\\Eloquent\\Relations\\HasOne',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Model',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'booted',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'supersededBy',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return HasOne<ClinicalReviewerCredential, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'clinicalreviewercredentialstatus' => 'App\\Enums\\ClinicalReviewerCredentialStatus',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'clinicalreviewercredentialfactory' => 'Database\\Factories\\ClinicalReviewerCredentialFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'hasone' => 'Illuminate\\Database\\Eloquent\\Relations\\HasOne',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\HasOne',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'isCurrentFor',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'reviewer',
               'type' => 'App\\Models\\User',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => 'Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'clinicalreviewercredentialstatus' => 'App\\Enums\\ClinicalReviewerCredentialStatus',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'clinicalreviewercredentialfactory' => 'Database\\Factories\\ClinicalReviewerCredentialFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'hasone' => 'Illuminate\\Database\\Eloquent\\Relations\\HasOne',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
           'args' => 
          array (
            0 => '[\'*\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Models/Service.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\Service',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Model',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'booted',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'serviceGroup',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return BelongsTo<ServiceGroup, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicefactory' => 'Database\\Factories\\ServiceFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'logicexception' => 'LogicException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'serviceDefinitions',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return HasMany<ServiceDefinition, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicefactory' => 'Database\\Factories\\ServiceFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'logicexception' => 'LogicException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'visibleDefinition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Models\\ServiceDefinition',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicefactory' => 'Database\\Factories\\ServiceFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'logicexception' => 'LogicException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
           'args' => 
          array (
            0 => '[\'service_group_id\', \'code\', \'slug\', \'name_ar\', \'name_en\', \'description_ar\', \'display_order\', \'is_active\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Models/ServiceDefinition.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\ServiceDefinition',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @property int $service_id
 * @property int $version
 * @property ServiceDefinitionStatus $status
 * @property ServiceDefinitionAudience $audience
 * @property array<array-key, mixed> $definition
 * @property string $content_hash
 * @property CarbonImmutable|null $effective_from
 * @property CarbonImmutable|null $effective_until
 */',
         'namespace' => 'App\\Models',
         'uses' => 
        array (
          'servicedefinitionpayload' => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
          'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
          'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
          'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
          'carbonimmutable' => 'Carbon\\CarbonImmutable',
          'carboninterface' => 'Carbon\\CarbonInterface',
          'servicedefinitionfactory' => 'Database\\Factories\\ServiceDefinitionFactory',
          'domainexception' => 'DomainException',
          'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
          'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
          'model' => 'Illuminate\\Database\\Eloquent\\Model',
          'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
          'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
          'unexpectedvalueexception' => 'UnexpectedValueException',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Model',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'booted',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'service',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return BelongsTo<Service, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicedefinitionpayload' => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicedefinitionfactory' => 'Database\\Factories\\ServiceDefinitionFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'unexpectedvalueexception' => 'UnexpectedValueException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'launchGates',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return HasMany<ServiceLaunchGate, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicedefinitionpayload' => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicedefinitionfactory' => 'Database\\Factories\\ServiceDefinitionFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'unexpectedvalueexception' => 'UnexpectedValueException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'useCatalogEvaluationTime',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'self',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => 'Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'isEligibleForProductionPublication',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => '?Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        5 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'isProductionReady',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => '?Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        6 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'clinicalReviewState',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'string',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => '?Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        7 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'hasCompleteProductionCard',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        8 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'hasFundedProtection',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        9 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'contentHash',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'string',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        10 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'versionNumber',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'int',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        11 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'serviceId',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'int',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        12 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'status',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Enums\\ServiceDefinitionStatus',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        13 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'audience',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Enums\\ServiceDefinitionAudience',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        14 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicedefinitionpayload' => 'App\\Domain\\Catalog\\ServiceDefinitionPayload',
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicedefinitionfactory' => 'Database\\Factories\\ServiceDefinitionFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
              'unexpectedvalueexception' => 'UnexpectedValueException',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
           'args' => 
          array (
            0 => '[\'service_id\', \'version\', \'status\', \'audience\', \'source_reference\', \'definition\', \'effective_from\', \'effective_until\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Models/ServiceGroup.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\ServiceGroup',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Model',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'booted',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'services',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return HasMany<Service, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicegroupfactory' => 'Database\\Factories\\ServiceGroupFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicegroupfactory' => 'Database\\Factories\\ServiceGroupFactory',
              'domainexception' => 'DomainException',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'hasmany' => 'Illuminate\\Database\\Eloquent\\Relations\\HasMany',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
           'args' => 
          array (
            0 => '[\'code\', \'name_ar\', \'name_en\', \'description_ar\', \'display_order\', \'is_active\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Models/ServiceLaunchGate.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\ServiceLaunchGate',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @property ServiceLaunchGateType $type
 * @property int $sequence
 * @property ServiceLaunchGateStatus $status
 * @property int|null $approved_by_user_id
 * @property int|null $clinical_reviewer_credential_id
 * @property string $responsible_role
 * @property string|null $approved_content_hash
 * @property string|null $approval_evidence_reference
 * @property string|null $decision_reason
 * @property CarbonImmutable|null $decided_at
 * @property CarbonImmutable|null $expires_at
 * @property-read User|null $approvedBy
 * @property-read ClinicalReviewerCredential|null $clinicalReviewerCredential
 */',
         'namespace' => 'App\\Models',
         'uses' => 
        array (
          'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
          'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
          'carbonimmutable' => 'Carbon\\CarbonImmutable',
          'carboninterface' => 'Carbon\\CarbonInterface',
          'servicelaunchgatefactory' => 'Database\\Factories\\ServiceLaunchGateFactory',
          'domainexception' => 'DomainException',
          'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
          'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
          'model' => 'Illuminate\\Database\\Eloquent\\Model',
          'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Model',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'booted',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'serviceDefinition',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return BelongsTo<ServiceDefinition, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicelaunchgatefactory' => 'Database\\Factories\\ServiceLaunchGateFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'approvedBy',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return BelongsTo<User, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicelaunchgatefactory' => 'Database\\Factories\\ServiceLaunchGateFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'clinicalReviewerCredential',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return BelongsTo<ClinicalReviewerCredential, $this>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicelaunchgatefactory' => 'Database\\Factories\\ServiceLaunchGateFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'isCurrentApproval',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'bool',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'at',
               'type' => 'Carbon\\CarbonInterface',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'contentHash',
               'type' => 'string',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        5 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'sequenceNumber',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'int',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        6 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'type',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'App\\Enums\\ServiceLaunchGateType',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        7 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
              'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
              'carbonimmutable' => 'Carbon\\CarbonImmutable',
              'carboninterface' => 'Carbon\\CarbonInterface',
              'servicelaunchgatefactory' => 'Database\\Factories\\ServiceLaunchGateFactory',
              'domainexception' => 'DomainException',
              'guarded' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'model' => 'Illuminate\\Database\\Eloquent\\Model',
              'belongsto' => 'Illuminate\\Database\\Eloquent\\Relations\\BelongsTo',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Guarded',
           'args' => 
          array (
            0 => '[\'*\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Models/User.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Models\\User',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => false,
       'extends' => 'Illuminate\\Foundation\\Auth\\User',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
        0 => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
        1 => 'Illuminate\\Notifications\\Notifiable',
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'casts',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */',
             'namespace' => 'App\\Models',
             'uses' => 
            array (
              'userfactory' => 'Database\\Factories\\UserFactory',
              'fillable' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
              'hidden' => 'Illuminate\\Database\\Eloquent\\Attributes\\Hidden',
              'hasfactory' => 'Illuminate\\Database\\Eloquent\\Factories\\HasFactory',
              'authenticatable' => 'Illuminate\\Foundation\\Auth\\User',
              'notifiable' => 'Illuminate\\Notifications\\Notifiable',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => false,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Fillable',
           'args' => 
          array (
            0 => '[\'name\', \'email\', \'password\']',
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedAttributeNode::__set_state(array(
           'name' => 'Illuminate\\Database\\Eloquent\\Attributes\\Hidden',
           'args' => 
          array (
            0 => '[\'password\', \'remember_token\']',
          ),
        )),
      ),
    )),
  ),
  '../../../app/Providers/AppServiceProvider.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Providers\\AppServiceProvider',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => false,
       'extends' => 'Illuminate\\Support\\ServiceProvider',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'register',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * Register any application services.
     */',
             'namespace' => 'App\\Providers',
             'uses' => 
            array (
              'limit' => 'Illuminate\\Cache\\RateLimiting\\Limit',
              'request' => 'Illuminate\\Http\\Request',
              'ratelimiter' => 'Illuminate\\Support\\Facades\\RateLimiter',
              'serviceprovider' => 'Illuminate\\Support\\ServiceProvider',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'boot',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * Bootstrap any application services.
     */',
             'namespace' => 'App\\Providers',
             'uses' => 
            array (
              'limit' => 'Illuminate\\Cache\\RateLimiting\\Limit',
              'request' => 'Illuminate\\Http\\Request',
              'ratelimiter' => 'Illuminate\\Support\\Facades\\RateLimiter',
              'serviceprovider' => 'Illuminate\\Support\\ServiceProvider',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../app/Providers/Filament/AdminPanelProvider.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'App\\Providers\\Filament\\AdminPanelProvider',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => false,
       'extends' => 'Filament\\PanelProvider',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'panel',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'Filament\\Panel',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'panel',
               'type' => 'Filament\\Panel',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/ClinicalReviewerCredentialFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\ClinicalReviewerCredentialFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<ClinicalReviewerCredential>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'clinicalreviewercredentialstatus' => 'App\\Enums\\ClinicalReviewerCredentialStatus',
          'clinicalreviewercredential' => 'App\\Models\\ClinicalReviewerCredential',
          'user' => 'App\\Models\\User',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/ServiceDefinitionFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\ServiceDefinitionFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<ServiceDefinition>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
          'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
          'service' => 'App\\Models\\Service',
          'servicedefinition' => 'App\\Models\\ServiceDefinition',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'activeEvaluation',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'activeProduction',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        3 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'productionCandidate',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        4 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'pendingClinicalDefinition',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, mixed>
     */',
             'namespace' => 'Database\\Factories',
             'uses' => 
            array (
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
              'service' => 'App\\Models\\Service',
              'servicedefinition' => 'App\\Models\\ServiceDefinition',
              'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        5 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'completeProductionDefinition',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * @return array<string, mixed>
     */',
             'namespace' => 'Database\\Factories',
             'uses' => 
            array (
              'servicedefinitionaudience' => 'App\\Enums\\ServiceDefinitionAudience',
              'servicedefinitionstatus' => 'App\\Enums\\ServiceDefinitionStatus',
              'service' => 'App\\Models\\Service',
              'servicedefinition' => 'App\\Models\\ServiceDefinition',
              'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => true,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/ServiceFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\ServiceFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<Service>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'service' => 'App\\Models\\Service',
          'servicegroup' => 'App\\Models\\ServiceGroup',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'inactive',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/ServiceGroupFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\ServiceGroupFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<ServiceGroup>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'servicegroup' => 'App\\Models\\ServiceGroup',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'inactive',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/ServiceLaunchGateFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\ServiceLaunchGateFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<ServiceLaunchGate>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'servicelaunchgatestatus' => 'App\\Enums\\ServiceLaunchGateStatus',
          'servicelaunchgatetype' => 'App\\Enums\\ServiceLaunchGateType',
          'clinicalreviewercredential' => 'App\\Models\\ClinicalReviewerCredential',
          'servicedefinition' => 'App\\Models\\ServiceDefinition',
          'servicelaunchgate' => 'App\\Models\\ServiceLaunchGate',
          'user' => 'App\\Models\\User',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'forType',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'type',
               'type' => 'App\\Enums\\ServiceLaunchGateType',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'approved',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
            0 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'definition',
               'type' => 'App\\Models\\ServiceDefinition',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            1 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'approvedBy',
               'type' => 'App\\Models\\User',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => false,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
            2 => 
            \PHPStan\Dependency\ExportedNode\ExportedParameterNode::__set_state(array(
               'name' => 'credential',
               'type' => '?App\\Models\\ClinicalReviewerCredential',
               'byRef' => false,
               'variadic' => false,
               'hasDefault' => true,
               'attributes' => 
              array (
              ),
               'phpDoc' => NULL,
               'flags' => 0,
            )),
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/factories/UserFactory.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Factories\\UserFactory',
       'phpDoc' => 
      \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
         'phpDocString' => '/**
 * @extends Factory<User>
 */',
         'namespace' => 'Database\\Factories',
         'uses' => 
        array (
          'user' => 'App\\Models\\User',
          'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
          'hash' => 'Illuminate\\Support\\Facades\\Hash',
          'str' => 'Illuminate\\Support\\Str',
        ),
         'constUses' => 
        array (
        ),
      )),
       'abstract' => false,
       'final' => false,
       'extends' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedPropertiesNode::__set_state(array(
           'names' => 
          array (
            0 => 'password',
          ),
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * The current password being used by the factory.
     */',
             'namespace' => 'Database\\Factories',
             'uses' => 
            array (
              'user' => 'App\\Models\\User',
              'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
              'hash' => 'Illuminate\\Support\\Facades\\Hash',
              'str' => 'Illuminate\\Support\\Str',
            ),
             'constUses' => 
            array (
            ),
          )),
           'type' => '?string',
           'public' => false,
           'private' => false,
           'static' => true,
           'readonly' => false,
           'abstract' => false,
           'final' => false,
           'publicSet' => false,
           'protectedSet' => false,
           'privateSet' => false,
           'virtual' => false,
           'attributes' => 
          array (
          ),
           'hooks' => 
          array (
          ),
        )),
        1 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'definition',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * Define the model\'s default state.
     *
     * @return array<string, mixed>
     */',
             'namespace' => 'Database\\Factories',
             'uses' => 
            array (
              'user' => 'App\\Models\\User',
              'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
              'hash' => 'Illuminate\\Support\\Facades\\Hash',
              'str' => 'Illuminate\\Support\\Str',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'array',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
        2 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'unverified',
           'phpDoc' => 
          \PHPStan\Dependency\ExportedNode\ExportedPhpDocNode::__set_state(array(
             'phpDocString' => '/**
     * Indicate that the model\'s email address should be unverified.
     */',
             'namespace' => 'Database\\Factories',
             'uses' => 
            array (
              'user' => 'App\\Models\\User',
              'factory' => 'Illuminate\\Database\\Eloquent\\Factories\\Factory',
              'hash' => 'Illuminate\\Support\\Facades\\Hash',
              'str' => 'Illuminate\\Support\\Str',
            ),
             'constUses' => 
            array (
            ),
          )),
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'static',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/seeders/DatabaseSeeder.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Seeders\\DatabaseSeeder',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Seeder',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'run',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/seeders/ServiceDefinitionSeeder.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Seeders\\ServiceDefinitionSeeder',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Seeder',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'run',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/seeders/ServiceGroupSeeder.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Seeders\\ServiceGroupSeeder',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Seeder',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'run',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/seeders/ServiceLaunchGateSeeder.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Seeders\\ServiceLaunchGateSeeder',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Seeder',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'run',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
  '../../../database/seeders/ServiceSeeder.php' => 
  array (
    0 => 
    \PHPStan\Dependency\ExportedNode\ExportedClassNode::__set_state(array(
       'name' => 'Database\\Seeders\\ServiceSeeder',
       'phpDoc' => NULL,
       'abstract' => false,
       'final' => true,
       'extends' => 'Illuminate\\Database\\Seeder',
       'implements' => 
      array (
      ),
       'usedTraits' => 
      array (
      ),
       'traitUseAdaptations' => 
      array (
      ),
       'statements' => 
      array (
        0 => 
        \PHPStan\Dependency\ExportedNode\ExportedMethodNode::__set_state(array(
           'name' => 'run',
           'phpDoc' => NULL,
           'byRef' => false,
           'public' => true,
           'private' => false,
           'abstract' => false,
           'final' => false,
           'static' => false,
           'returnType' => 'void',
           'parameters' => 
          array (
          ),
           'attributes' => 
          array (
          ),
        )),
      ),
       'attributes' => 
      array (
      ),
    )),
  ),
); },
];

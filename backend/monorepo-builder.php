<?php

declare(strict_types=1);

use Symplify\ComposerJsonManipulator\ValueObject\ComposerJsonSection;
use Symplify\MonorepoBuilder\Config\MBConfig;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\PushNextDevReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\PushTagReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\SetCurrentMutualDependenciesReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\SetNextMutualDependenciesReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\TagVersionReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\UpdateBranchAliasReleaseWorker;
use Symplify\MonorepoBuilder\Release\ReleaseWorker\UpdateReplaceReleaseWorker;

return static function (MBConfig $mBConfig): void {

    $mBConfig->packageDirectories([
        __DIR__ . '/packages',
    ]);

    $mBConfig->dataToAppend([
        ComposerJsonSection::REQUIRE_DEV => [
            'ergebnis/composer-normalize' => '^2.2',
            'friendsofphp/php-cs-fixer' => '^3.0',
            'phpstan/phpstan' => '^1.0',
            'phpstan/phpstan-doctrine' => '^1.0',
            'phpstan/phpstan-phpunit' => '^1.0',
            'phpstan/phpstan-symfony' => '^1.0',
            'phpstan/phpstan-strict-rules' => '^1.0',
            'psalm/plugin-phpunit' => '^0.17',
            'psalm/plugin-symfony' => '^3.0',
            'symplify/monorepo-builder' => '^11.0',
            'vimeo/psalm' => '^4.0',
            'weirdan/doctrine-psalm-plugin' => '^2.0',
        ],
    ]);

    $mBConfig->workers([
        UpdateReplaceReleaseWorker::class,
        SetCurrentMutualDependenciesReleaseWorker::class,
        TagVersionReleaseWorker::class,
        PushTagReleaseWorker::class,
        SetNextMutualDependenciesReleaseWorker::class,
        UpdateBranchAliasReleaseWorker::class,
        PushNextDevReleaseWorker::class,
    ]);
};

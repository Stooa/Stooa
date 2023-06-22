<?php

declare(strict_types=1);

/*
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App;

use App\Core\JWT\TokenGenerator\JaasTokenGenerator;
use App\Core\JWT\TokenGenerator\SelfHostedTokenGenerator;
use App\Core\JWT\TokenGenerator\TokenGeneratorInterface;
use App\WorldCafe\WorldCafeBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\BundleInterface;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

final class Kernel extends BaseKernel implements CompilerPassInterface
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $contents = require $this->getProjectDir() . '/config/bundles.php';

        if ('false' === $_ENV['WORLD_CAFE']) {
            unset($contents[WorldCafeBundle::class]);
        }

        /** @phpstan-var class-string<BundleInterface> $class */
        foreach ($contents as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                yield new $class();
            }
        }
    }

    public function getProjectDir(): string
    {
        return \dirname(__DIR__);
    }

    public function process(ContainerBuilder $container): void
    {
        $isJaasActive = $container->resolveEnvPlaceholders($container->getParameter('jaas_activated'),
            true
        );

        $tokenGeneratorClass = 'true' === $isJaasActive ? JaasTokenGenerator::class : SelfHostedTokenGenerator::class;

        $container->setAlias(TokenGeneratorInterface::class, $tokenGeneratorClass);
    }

    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $configDir = $this->getProjectDir() . '/config';

        $container->addResource(new FileResource($configDir . '/bundles.php'));

        $loader->load($configDir . '/services.yaml');
        $loader->load($configDir . '/{packages}/*.yaml', 'glob');
        $loader->load($configDir . '/{packages}/' . $this->getEnvironment() . '/**/*.yaml', 'glob');

        $isWorldCafeActive = $container->resolveEnvPlaceholders($container->getParameter('world_cafe'),
            true
        );

        if ('true' === $isWorldCafeActive) {
            $loader->load($this->getProjectDir() . '/packages/WorldCafe/config/packages/*.yaml', 'glob');
        }
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $configDir = $this->getProjectDir() . '/config';

        $routes->import($configDir . '/routes.yaml');
        $routes->import($configDir . '/{routes}/*.yaml');
        $routes->import($configDir . '/{routes}/' . $this->getEnvironment() . '/**/*.yaml');
    }
}

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

use App\TokenGenerator\JaasTokenGenerator;
use App\TokenGenerator\SelfHostedTokenGenerator;
use App\TokenGenerator\TokenGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\BundleInterface;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\RouteCollectionBuilder;

final class Kernel extends BaseKernel implements CompilerPassInterface
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $contents = require $this->getProjectDir() . '/config/bundles.php';

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

        $tokenGeneratorClass = 'true' === $isJaasActive
            ? JaasTokenGenerator::class
            : SelfHostedTokenGenerator::class;

        $container->setAlias(TokenGeneratorInterface::class, $tokenGeneratorClass);
    }

    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $configDir = $this->getProjectDir() . '/config';

        $container->addResource(new FileResource($configDir . '/bundles.php'));

        $loader->load($configDir . '/services.yaml');
        $loader->load($configDir . '/{packages}/*.yaml', 'glob');
        $loader->load($configDir . '/{packages}/' . $this->getEnvironment() . '/**/*.yaml', 'glob');
    }

    protected function configureRoutes(RouteCollectionBuilder $routes): void
    {
        $configDir = $this->getProjectDir() . '/config';

        $routes->import($configDir . '/routes.yaml', '/');
        $routes->import($configDir . '/{routes}/*.yaml', '/', 'glob');
        $routes->import($configDir . '/{routes}/' . $this->getEnvironment() . '/**/*.yaml', '/', 'glob');
    }
}

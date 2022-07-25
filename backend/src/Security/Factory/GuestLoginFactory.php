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

namespace App\Security\Factory;

use App\Security\GuestAuthenticator;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\AbstractFactory;
use Symfony\Component\DependencyInjection\ChildDefinition;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class GuestLoginFactory extends AbstractFactory
{
    public function getPriority(): int
    {
        return 0;
    }

    public function getKey(): string
    {
        return 'guest-login';
    }

    /**
     * @param array<array-key, mixed> $config
     */
    public function createAuthenticator(ContainerBuilder $container, string $firewallName, array $config, string $userProviderId): string|array
    {
        $authenticatorId = 'app.authenticator.guest_login.' . $firewallName;

        $options = array_intersect_key($config, $this->options);

        $container
            ->setDefinition($authenticatorId, new ChildDefinition(GuestAuthenticator::class))
            ->replaceArgument('$options', $options);

        return $authenticatorId;
    }
}

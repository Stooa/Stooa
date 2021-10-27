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

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\Security;
use Webmozart\Assert\Assert;

class UserResolver implements QueryItemResolverInterface
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /** @param User|null $item */
    public function __invoke($item, array $context): ?User
    {
        $user = $this->security->getUser();

        if (null !== $user) {
            Assert::isInstanceOf($user, User::class);

            return $user;
        }

        return null;
    }
}

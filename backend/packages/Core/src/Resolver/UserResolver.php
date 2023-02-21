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

namespace App\Core\Resolver;

use ApiPlatform\GraphQl\Resolver\QueryItemResolverInterface;
use App\Core\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class UserResolver implements QueryItemResolverInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    /**
     * @param mixed[] $context
     *
     * @return User
     *
     * @psalm-suppress ImplementedReturnTypeMismatch
     *
     * QueryItemResolverInterface forces you to not return null, but this is the only way
     * to tell ApiPlatform that this Resolver can't return a value with this $context
     */
    public function __invoke($item, array $context): object
    {
        $user = $this->security->getUser();

        if (null !== $user) {
            Assert::isInstanceOf($user, User::class);

            return $user;
        }

        return $item;
    }
}

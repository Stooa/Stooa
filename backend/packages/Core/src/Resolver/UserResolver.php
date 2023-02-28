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

use ApiPlatform\Exception\ItemNotFoundException;
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
     * @param User $item
     * @param mixed[] $context
     *
     * @return User
     */
    public function __invoke(?object $item, array $context): object
    {
        $user = $this->security->getUser();

        if (null !== $user) {
            Assert::isInstanceOf($user, User::class);

            return $user;
        }

        throw new ItemNotFoundException();
    }
}

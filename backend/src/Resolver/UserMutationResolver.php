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
use ApiPlatform\GraphQl\Resolver\MutationResolverInterface;
use Symfony\Component\Security\Core\Security;

class UserMutationResolver implements MutationResolverInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    /**
     * @param mixed[] $context
     *
     * @psalm-suppress ImplementedReturnTypeMismatch
     *
     * QueryItemResolverInterface forces you to not return null, but this is the only way
     * to tell ApiPlatform that this Resolver can't return a value with this $context
     */
    public function __invoke($item, array $context)
    {
        return $item;
    }
}

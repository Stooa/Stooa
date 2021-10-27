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
use App\Entity\Fishbowl;
use App\Repository\FishbowlRepository;

class FishbowlResolver implements QueryItemResolverInterface
{
    private FishbowlRepository $repository;

    public function __construct(FishbowlRepository $repository)
    {
        $this->repository = $repository;
    }

    /** @param Fishbowl|null $item */
    public function __invoke($item, array $context): ?Fishbowl
    {
        if (null === $item) {
            return $this->repository->findBySlug($context['args']['slug']);
        }

        return $item;
    }
}

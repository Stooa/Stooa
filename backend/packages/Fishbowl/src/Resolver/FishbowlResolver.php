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

namespace App\Fishbowl\Resolver;

use ApiPlatform\GraphQl\Resolver\QueryItemResolverInterface;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Service\PrivateFishbowlService;
use Webmozart\Assert\Assert;

class FishbowlResolver implements QueryItemResolverInterface
{
    public function __construct(
        private readonly FishbowlRepository $repository,
        private readonly PrivateFishbowlService $privateFishbowlService
    ) {
    }

    /**
     * @param mixed[] $context
     *
     * @return Fishbowl
     *
     * @psalm-suppress ImplementedReturnTypeMismatch
     *
     * QueryItemResolverInterface forces you to not return null, but this is the only way
     * to tell ApiPlatform that this Resolver can't return a value with this $context
     */
    public function __invoke($item, array $context): object
    {
        if (null === $item) {
            $fishbowl = $this->repository->findBySlug($context['args']['slug']);

            if (null !== $fishbowl) {
                return $this->privateFishbowlService->decryptPrivatePassword($fishbowl);
            }
        }

        Assert::isInstanceOf($item, Fishbowl::class);

        return $item;
    }
}

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
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class FishbowlCreatorResolver implements QueryItemResolverInterface
{
    public function __construct(
        private readonly FishbowlRepository $repository,
        private readonly Security $security,
        private readonly PrivateFishbowlService $privateFishbowlService
    ) {
    }

    /**
     * @param mixed[] $context
     *
     * @psalm-suppress ImplementedReturnTypeMismatch
     *
     * QueryItemResolverInterface forces you to not return null, but this is the only way
     * to tell ApiPlatform that this Resolver can't return a value with this $context
     */
    public function __invoke($item, array $context): ?Fishbowl
    {
        if (!isset($context['args']['slug'])) {
            return null;
        }

        $user = $this->security->getUser();

        if (null === $item) {
            $fishbowl = $this->repository->findBySlug($context['args']['slug']);

            if (null !== $fishbowl && $user === $fishbowl->getHost()) {
                return $this->privateFishbowlService->decryptPrivatePassword($fishbowl);
            }

            return null;
        }

        Assert::isInstanceOf($item, Fishbowl::class);

        return $item;
    }
}

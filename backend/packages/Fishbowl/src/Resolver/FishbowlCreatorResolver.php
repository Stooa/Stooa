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

use ApiPlatform\Exception\ItemNotFoundException;
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
     * @param Fishbowl $item
     * @param mixed[] $context
     *
     * @return Fishbowl
     */
    public function __invoke(?object $item, array $context): object
    {
        if (!isset($context['args']['slug'])) {
            throw new ItemNotFoundException();
        }

        $user = $this->security->getUser();

        if (null === $item) {
            $fishbowl = $this->repository->findBySlug($context['args']['slug']);

            if (null !== $fishbowl && $user === $fishbowl->getHost()) {
                return $this->privateFishbowlService->decryptPrivatePassword($fishbowl);
            }

            throw new ItemNotFoundException();
        }

        Assert::isInstanceOf($item, Fishbowl::class);

        return $item;
    }
}

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
use App\Core\Model\Event;
use App\Core\Model\EventRepositoryInterface;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Service\PrivateFishbowlService;
use Webmozart\Assert\Assert;

class EventResolver implements QueryItemResolverInterface
{
    public function __construct(
        private readonly EventRepositoryInterface $repository,
        private readonly PrivateFishbowlService $privateFishbowlService
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke(?object $item, array $context): object
    {
        if (null === $item) {
            $event = $this->repository->findBySlug($context['args']['slug']);

            if ($event instanceof Fishbowl) {
                return $this->privateFishbowlService->decryptPrivatePassword($event);
            }

            throw new ItemNotFoundException();
        }

        Assert::isInstanceOf($item, Event::class);

        return $item;
    }
}

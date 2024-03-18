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
use App\WorldCafe\Entity\WorldCafe;
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class EventCreatorResolver implements QueryItemResolverInterface
{
    public function __construct(
        private readonly EventRepositoryInterface $repository,
        private readonly Security $security,
        private readonly PrivateFishbowlService $privateFishbowlService
    ) {
    }

    /**
     * @param mixed[] $context
     *
     * @return Event
     */
    public function __invoke(?object $item, array $context): object
    {
        if (!isset($context['args']['slug'])) {
            throw new ItemNotFoundException();
        }

        $user = $this->security->getUser();

        if (null === $item) {
            $event = $this->repository->findBySlug($context['args']['slug']);

            if (null !== $event) {
                if ($event instanceof Fishbowl && $user === $event->getHost()) {
                    return $this->privateFishbowlService->decryptPrivatePassword($event);
                }

                if ($event instanceof WorldCafe && $user === $event->getHost()) {
                    return $event;
                }
            }

            throw new ItemNotFoundException();
        }

        Assert::isInstanceOf($item, Event::class);

        return $item;
    }
}

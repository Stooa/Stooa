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

namespace App\Core\EventSubscriber;

use App\Fishbowl\Entity\Fishbowl;
use App\WorldCafe\Entity\WorldCafe;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\GuardEvent;
use Webmozart\Assert\Assert;

class EventWorkflowSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function guardFishbowl(GuardEvent $event): void
    {
        $eventEntity = $event->getSubject();

        Assert::isInstanceOfAny($eventEntity, [WorldCafe::class, Fishbowl::class]);

        $user = $this->security->getUser();

        if (null !== $user && $eventEntity->getHost() !== $user) {
            $event->setBlocked(true);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.event.guard' => ['guardFishbowl'],
        ];
    }
}

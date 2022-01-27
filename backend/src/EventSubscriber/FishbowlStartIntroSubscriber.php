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

namespace App\EventSubscriber;

use App\Entity\Fishbowl;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\GuardEvent;

class FishbowlStartIntroSubscriber implements EventSubscriberInterface
{
    public function guardFishbowl(GuardEvent $event): void
    {
        /** @var Fishbowl $fishbowl */
        $fishbowl = $event->getSubject();

        if (!$fishbowl->getHasIntroduction()) {
            $event->setBlocked(true);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.fishbowl.guard.' . Fishbowl::TRANSITION_RUN => ['guardFishbowl'],
        ];
    }
}

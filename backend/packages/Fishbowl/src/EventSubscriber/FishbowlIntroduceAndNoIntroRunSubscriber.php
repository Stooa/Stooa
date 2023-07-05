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

namespace App\Fishbowl\EventSubscriber;

use App\Core\Model\Event;
use App\Fishbowl\Entity\Fishbowl;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\GuardEvent;

class FishbowlIntroduceAndNoIntroRunSubscriber implements EventSubscriberInterface
{
    public function guardFishbowl(GuardEvent $event): void
    {
        $eventEntity = $event->getSubject();

        if ($eventEntity instanceof Fishbowl) {
            $transition = $event->getTransition();

            if ((Event::TRANSITION_INTRODUCE === $transition->getName() && !$eventEntity->getHasIntroduction()) ||
                (Event::TRANSITION_NO_INTRO_RUN === $transition->getName() && $eventEntity->getHasIntroduction())
            ) {
                $event->setBlocked(true);
            }
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.event.guard.' . Event::TRANSITION_INTRODUCE => ['guardFishbowl'],
            'workflow.event.guard.' . Event::TRANSITION_NO_INTRO_RUN => ['guardFishbowl'],
        ];
    }
}

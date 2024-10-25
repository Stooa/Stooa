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

use App\Fishbowl\Entity\Fishbowl;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\GuardEvent;
use Webmozart\Assert\Assert;

class FishbowlIntroduceAndNoIntroRunSubscriber implements EventSubscriberInterface
{
    public function guardFishbowl(GuardEvent $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $transition = $event->getTransition();

        if ((Fishbowl::TRANSITION_INTRODUCE === $transition->getName() && !$fishbowl->getHasIntroduction())
            || (Fishbowl::TRANSITION_NO_INTRO_RUN === $transition->getName() && $fishbowl->getHasIntroduction())
        ) {
            $event->setBlocked(true);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.fishbowl.guard.' . Fishbowl::TRANSITION_INTRODUCE => ['guardFishbowl'],
            'workflow.fishbowl.guard.' . Fishbowl::TRANSITION_NO_INTRO_RUN => ['guardFishbowl'],
        ];
    }
}

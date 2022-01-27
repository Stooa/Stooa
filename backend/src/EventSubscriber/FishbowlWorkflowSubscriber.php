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
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Workflow\Event\GuardEvent;

class FishbowlWorkflowSubscriber implements EventSubscriberInterface
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function guardFishbowl(GuardEvent $event): void
    {
        /** @var Fishbowl $fishbowl */
        $fishbowl = $event->getSubject();

        /** @var User $user */
        $user = $this->security->getUser();

        if ($fishbowl->getHost() !== $user) {
            $event->setBlocked(true);
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            'workflow.fishbowl.guard' => ['guardFishbowl'],
        ];
    }
}

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
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\GuardEvent;
use Webmozart\Assert\Assert;

class FishbowlWorkflowSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function guardFishbowl(GuardEvent $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $user = $this->security->getUser();

        if (null !== $user && $fishbowl->getHost() !== $user) {
            $event->setBlocked(true);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.fishbowl.guard' => ['guardFishbowl'],
        ];
    }
}

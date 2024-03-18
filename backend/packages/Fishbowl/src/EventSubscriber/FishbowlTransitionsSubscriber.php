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
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\Event;
use Webmozart\Assert\Assert;

class FishbowlTransitionsSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly FishbowlRepository $repository)
    {
    }

    public function onIntroduction(Event $event): void
    {
        $fishbowl = $event->getSubject();

        if ($fishbowl instanceof Fishbowl) {
            $fishbowl->setIntroducedAt(new \DateTimeImmutable());

            $this->repository->persist($fishbowl);
        }
    }

    public function onNoIntroductionRun(Event $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $fishbowl->setRunnedAt(new \DateTimeImmutable());

        $this->repository->persist($fishbowl);
    }

    public function onRun(Event $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $fishbowl->setRunnedAt(new \DateTimeImmutable());

        $this->repository->persist($fishbowl);
    }

    public function onFinish(Event $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $fishbowl->setFinishedAt(new \DateTimeImmutable());

        $this->repository->persist($fishbowl);
    }

    public static function getSubscribedEvents(): iterable
    {
        return [
            'workflow.event.transition.' . Fishbowl::TRANSITION_INTRODUCE => 'onIntroduction',
            'workflow.event.transition.' . Fishbowl::TRANSITION_NO_INTRO_RUN => 'onNoIntroductionRun',
            'workflow.event.transition.' . Fishbowl::TRANSITION_RUN => 'onRun',
            'workflow.event.transition.' . Fishbowl::TRANSITION_FINISH => 'onFinish',
        ];
    }
}

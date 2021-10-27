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
use App\Repository\FishbowlRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Workflow\Event\Event;
use Webmozart\Assert\Assert;

class FishbowlTransitionsSubscriber implements EventSubscriberInterface
{
    private FishbowlRepository $repository;

    public function __construct(FishbowlRepository $repository)
    {
        $this->repository = $repository;
    }

    public function onIntroduction(Event $event): void
    {
        $fishbowl = $event->getSubject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $fishbowl->setIntroducedAt(new \DateTimeImmutable());

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
            'workflow.fishbowl.transition.introduce' => 'onIntroduction',
            'workflow.fishbowl.transition.run' => 'onRun',
            'workflow.fishbowl.transition.finish' => 'onFinish',
        ];
    }
}

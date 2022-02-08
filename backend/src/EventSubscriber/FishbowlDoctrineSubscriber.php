<?php

namespace App\EventSubscriber;


use App\Entity\Fishbowl;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Webmozart\Assert\Assert;

class FishbowlDoctrineSubscriber implements EventSubscriberInterface
{
    /** @return array<string, string> */
    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $fishbowl = $args->getObject();

        if (!$fishbowl instanceof Fishbowl) {
            return;
        }

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $fishbowl->calculateEstimatedDateToFinish();
    }
}

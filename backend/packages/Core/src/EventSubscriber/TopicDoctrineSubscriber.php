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

use App\Core\Entity\Topic;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class TopicDoctrineSubscriber implements EventSubscriberInterface
{
    /** @return array<int, string> */
    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $topic = $args->getObject();

        if (!$topic instanceof Topic) {
            return;
        }

        $topic->generateTranslationId();
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $topic = $args->getObject();

        if (!$topic instanceof Topic) {
            return;
        }

        $topic->generateTranslationId();
    }
}

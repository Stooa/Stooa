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
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::preUpdate, priority: 500, connection: 'default')]
#[AsDoctrineListener(event: Events::prePersist, priority: 500, connection: 'default')]
class FishbowlDoctrineSubscriber
{
    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $fishbowl = $args->getObject();

        if (!$fishbowl instanceof Fishbowl) {
            return;
        }

        $fishbowl->calculateFinishTime();
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $fishbowl = $args->getObject();

        if (!$fishbowl instanceof Fishbowl) {
            return;
        }

        $fishbowl->calculateFinishTime();
    }
}

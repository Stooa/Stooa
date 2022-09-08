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

use App\Encryption\HalitePasswordEncryption;
use App\Entity\Fishbowl;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class FishbowlPasswordDoctrineSubscriber implements EventSubscriberInterface
{
    private HalitePasswordEncryption $halitePasswordEncryption;

    public function __construct(HalitePasswordEncryption $halitePasswordEncryption)
    {
        $this->halitePasswordEncryption = $halitePasswordEncryption;
    }

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
        $fishbowl = $args->getObject();

        if (!$fishbowl instanceof Fishbowl) {
            return;
        }

        $this->encryptPassword($fishbowl);
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $fishbowl = $args->getObject();

        if (!$fishbowl instanceof Fishbowl) {
            return;
        }

        $this->encryptPassword($fishbowl);
    }

    private function encryptPassword(Fishbowl $fishbowl): void
    {
//        if ($fishbowl->getIsPrivate() && null !== $fishbowl->getPassword()) {
//            $fishbowl->setPassword($this->halitePasswordEncryption->encrypt($fishbowl->getPassword()));
//        }
    }
}

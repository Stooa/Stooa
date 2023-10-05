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

namespace App\Fishbowl\EventListener;

use App\Fishbowl\Entity\Attendee;
use App\Fishbowl\Service\AttendeeMailerService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Attendee::class)]
class AttendeeCreateListener
{
    public function __construct(
        private readonly AttendeeMailerService $attendeeMailerService
    ) {
    }

    public function postPersist(Attendee $attendee, PostPersistEventArgs $event): void
    {
        $this->attendeeMailerService->sendNewAttendeeNotification($attendee);
    }
}

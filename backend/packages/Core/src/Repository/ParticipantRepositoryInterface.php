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

namespace App\Core\Repository;

use App\Core\Entity\Guest;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\EventInterface;

interface ParticipantRepositoryInterface
{
    public function findUserInEvent(EventInterface $event, User $user): ?Participant;

    public function findGuestInEvent(EventInterface $event, Guest $guest): ?Participant;

    /** @return Participant[] */
    public function getParticipantsByEvent(EventInterface $event): array;

    public function persist(Participant $participant): void;
}

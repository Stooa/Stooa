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

namespace App\Core\Service;

use App\Core\Entity\Guest;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\Event;
use App\Core\Repository\ParticipantRepository;
use App\Fishbowl\Entity\Fishbowl;
use App\WorldCafe\Entity\WorldCafe;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @psalm-type RawParticipant = array{
 *     id: UuidInterface|null,
 *     lastPing: \DateTimeInterface|null,
 *     name: string|null,
 *     twitter: string|null,
 *     linkedin: string|null,
 *     isModerator: bool,
 *     isCurrentUser: bool,
 *     guestId: string|null,
 *     joined: bool,
 *     isMuted: bool
 * }
 */
class ParticipantService
{
    public function __construct(
        private readonly ParticipantRepository $participantRepository,
    ) {
    }

    public function createFishbowlParticipantFromUser(Fishbowl $fishbowl, User $user): Participant
    {
        $participant = $this->createParticipantFromFishbowl($fishbowl);
        $participant->setUser($user);

        return $participant;
    }

    public function createFishbowlParticipantFromGuest(Fishbowl $fishbowl, Guest $guest): Participant
    {
        $participant = $this->createParticipantFromFishbowl($fishbowl);
        $participant->setGuest($guest);

        return $participant;
    }

    public function createParticipantFromFishbowl(Fishbowl $fishbowl): Participant
    {
        $participant = new Participant();
        $participant->setFishbowl($fishbowl);

        $fishbowl->addParticipant($participant);

        return $participant;
    }

    public function findGuestInFishbowl(Fishbowl $fishbowl, Guest $guest): ?Participant
    {
        return $this->participantRepository->findGuestInFishbowl($fishbowl, $guest);
    }

    public function findUserInFishbowl(Fishbowl $fishbowl, User $user): ?Participant
    {
        return $this->participantRepository->findUserInFishbowl($fishbowl, $user);
    }

    public function persistParticipant(Participant $participant): void
    {
        $this->participantRepository->persist($participant);
    }

    /** @return RawParticipant[] */
    public function buildParticipantsByFishbowl(Fishbowl $fishbowl, ?UserInterface $currentUser): array
    {
        $participants = $this->participantRepository->getParticipantsByFishbowl($fishbowl);

        return $this->buildParticipants($participants, $fishbowl, $currentUser);
    }

    /** @return RawParticipant[] */
    public function buildParticipantsByWorldCafe(WorldCafe $worldCafe, ?UserInterface $currentUser): array
    {
        $participants = $this->participantRepository->getParticipantsByWorldCafe($worldCafe);

        return $this->buildParticipants($participants, $worldCafe, $currentUser);
    }

    /**
     * @param Participant[] $participants
     *
     * @return RawParticipant[]
     */
    private function buildParticipants(array $participants, Event $event, ?UserInterface $currentUser): array
    {
        return array_map(fn (Participant $participant) => [
            'id' => $participant->getId(),
            'lastPing' => $participant->getLastPing(),
            'name' => $participant->getUserName(),
            'twitter' => $participant->getPublicTwitterProfile(),
            'linkedin' => $participant->getPublicLinkedinAccount(),
            'isModerator' => $participant->isModerator($event),
            'isCurrentUser' => $participant->isCurrentUser($currentUser),
            'guestId' => $participant->getGuestId(),
            'joined' => false,
            'isMuted' => false,
        ], $participants);
    }
}

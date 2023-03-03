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

namespace App\Fishbowl\Service;

use App\Core\Entity\Guest;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Repository\GuestRepository;
use App\Core\Repository\ParticipantRepository;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Repository\FishbowlRepository;
use Hashids\Hashids;
use Psr\Log\LoggerInterface;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Webmozart\Assert\Assert;

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
class FishbowlService
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly FishbowlRepository $fishbowlRepository,
        private readonly RequestStack $requestStack,
        private readonly Security $security,
        private readonly GuestRepository $guestRepository,
        private readonly ParticipantRepository $participantRepository,
        private readonly TranslatorInterface $translator
    ) {
    }

    public function canFishbowlStart(string $slug, UserInterface $host): bool
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null !== $fishbowl && $fishbowl->getHost() === $host && !$fishbowl->isFinished()) {
            return true;
        }

        return false;
    }

    public function generateRandomSlug(Fishbowl $fishbowl): string
    {
        $hashids = new Hashids('', 10);

        return $hashids->encode(random_int(1, 1_000_000_000));
    }

    public function generateDefaultTitle(Fishbowl $fishbowl): Fishbowl
    {
        $fishbowlName = $fishbowl->getName();

        if (!empty($fishbowlName) && !ctype_space($fishbowlName)) {
            return $fishbowl;
        }

        return $fishbowl->setName(
            $this->translator->trans('fishbowl.default_title', ['%name%' => $fishbowl->getHostName()], null, $fishbowl->getLocale())
        );
    }

    public function getFishbowlStatus(string $slug): ?string
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        // Controls if an unfinished fishbowl is being access, if it should have end
        // (24 hours passed since closing date), we consider it finish, BUT we do not persist
        // this status, since we want to know how much Fishbowls are unfinished
        if (null !== $fishbowl && !$fishbowl->isFinished() && $fishbowl->shouldHaveEnd()) {
            $fishbowl->setCurrentStatus(Fishbowl::STATUS_FINISHED);
        }

        return (null !== $fishbowl) ? strtoupper($fishbowl->getCurrentStatus()) : null;
    }

    /** @return RawParticipant[] */
    public function getParticipants(string $slug): array
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);
        $currentUser = $this->security->getUser();

        if (null === $fishbowl) {
            return [];
        }

        return $this->buildParticipants(
            $this->participantRepository->getParticipants($fishbowl),
            $fishbowl,
            $currentUser
        );
    }

    public function ping(string $slug): ?Participant
    {
        $request = $this->requestStack->getCurrentRequest();

        if (null === $request) {
            $this->logger->error('[PING] Request is null');

            return null;
        }

        $guest = $this->getGuest($request);
        $user = $this->security->getUser();

        if (null === $user && null === $guest) {
            $this->logger->error('[PING] Guest and user are null');

            return null;
        }

        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null === $fishbowl) {
            $this->logger->error('[PING] fishbowl is null');

            return null;
        }

        $participant = null;
        $created = false;

        if (null !== $guest) {
            $participant = $this->participantRepository->findGuestInFishbowl($fishbowl, $guest);

            if (null === $participant) {
                $participant = $this->createParticipantFromGuest($fishbowl, $guest);
                $created = true;
            }
        } else {
            Assert::isInstanceOf($user, User::class);

            $participant = $this->participantRepository->findUserInFishbowl($fishbowl, $user);

            if (null === $participant) {
                $participant = $this->createParticipantFromUser($fishbowl, $user);
                $created = true;
            }
        }

        $participant->setLastPing(new \DateTimeImmutable());

        $this->participantRepository->persist($participant);

        if ($created) {
            $this->fishbowlRepository->persist($fishbowl);
        }

        return $participant;
    }

    private function createParticipantFromUser(Fishbowl $fishbowl, User $user): Participant
    {
        $participant = $this->createParticipant($fishbowl);
        $participant->setUser($user);

        return $participant;
    }

    private function createParticipantFromGuest(Fishbowl $fishbowl, Guest $guest): Participant
    {
        $participant = $this->createParticipant($fishbowl);
        $participant->setGuest($guest);

        return $participant;
    }

    private function getGuest(Request $request): ?Guest
    {
        try {
            $requestArray = $request->toArray();
        } catch (JsonException) {
            return null;
        }

        if (!empty($requestArray['guestId'])) {
            return $this->guestRepository->find($requestArray['guestId']);
        }

        return null;
    }

    private function createParticipant(Fishbowl $fishbowl): Participant
    {
        $participant = new Participant();
        $participant->setFishbowl($fishbowl);

        $fishbowl->addParticipant($participant);

        return $participant;
    }

    /**
     * @param Participant[] $participants
     *
     * @return RawParticipant[]
     */
    private function buildParticipants(array $participants, Fishbowl $fishbowl, ?UserInterface $currentUser): array
    {
        return array_map(fn (Participant $participant) => [
            'id' => $participant->getId(),
            'lastPing' => $participant->getLastPing(),
            'name' => $participant->getUserName(),
            'twitter' => $participant->getPublicTwitterProfile(),
            'linkedin' => $participant->getPublicLinkedinAccount(),
            'isModerator' => $participant->isModerator($fishbowl),
            'isCurrentUser' => $participant->isCurrentUser($currentUser),
            'guestId' => $participant->getGuestId(),
            'joined' => false,
            'isMuted' => false,
        ], $participants);
    }
}

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

use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\Event;
use App\Core\Service\GuestService;
use App\Core\Service\ParticipantService;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Repository\FishbowlRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Webmozart\Assert\Assert;

/**
 * @psalm-import-type RawParticipant from ParticipantService
 */
class FishbowlService
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly FishbowlRepository $fishbowlRepository,
        private readonly RequestStack $requestStack,
        private readonly Security $security,
        private readonly GuestService $guestService,
        private readonly ParticipantService $participantService,
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

    public function generateDefaultTitle(Fishbowl $fishbowl): Event
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

        return $this->participantService->buildParticipantsByFishbowl($fishbowl, $currentUser);
    }

    public function ping(string $slug): ?Participant
    {
        $request = $this->requestStack->getCurrentRequest();

        if (null === $request) {
            $this->logger->error('[PING] Request is null');

            return null;
        }

        $guest = $this->guestService->getGuest($request);
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
            $participant = $this->participantService->findGuestInEvent($fishbowl, $guest);

            if (null === $participant) {
                $participant = $this->participantService->createFishbowlParticipantFromGuest($fishbowl, $guest);
                $created = true;
            }
        } else {
            Assert::isInstanceOf($user, User::class);

            $participant = $this->participantService->findUserInEvent($fishbowl, $user);

            if (null === $participant) {
                $participant = $this->participantService->createFishbowlParticipantFromUser($fishbowl, $user);
                $created = true;
            }
        }

        $participant->setLastPing(new \DateTimeImmutable());

        $this->participantService->persistParticipant($participant);

        if ($created) {
            $this->fishbowlRepository->persist($fishbowl);
        }

        return $participant;
    }
}

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

namespace App\WorldCafe\Service;

use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\Event;
use App\Core\Service\GuestService;
use App\Core\Service\ParticipantService;
use App\WorldCafe\Entity\WorldCafe;
use App\WorldCafe\Repository\WorldCafeRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;
use Webmozart\Assert\Assert;

/**
 * @psalm-import-type RawParticipant from ParticipantService
 */
class WorldCafeService
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly WorldCafeRepository $worldCafeRepository,
        private readonly Security $security,
        private readonly ParticipantService $participantService,
        private readonly RequestStack $requestStack,
        private readonly LoggerInterface $logger,
        private readonly GuestService $guestService,
    ) {
    }

    public function generateDefaultTitle(WorldCafe $worldCafe): Event
    {
        $worldCafeName = $worldCafe->getName();

        if (!empty($worldCafeName) && !ctype_space($worldCafeName)) {
            return $worldCafe;
        }

        return $worldCafe->setName(
            $this->translator->trans('world_cafe.default_title', ['%name%' => $worldCafe->getHostName()], null, $worldCafe->getLocale())
        );
    }

    public function getWorldCafeStatus(string $slug): ?string
    {
        $worldCafe = $this->worldCafeRepository->findBySlug($slug);

        return (null !== $worldCafe) ? strtoupper($worldCafe->getCurrentStatus()) : null;
    }

    /** @return RawParticipant[] */
    public function getParticipants(string $slug): array
    {
        $worldCafe = $this->worldCafeRepository->findBySlug($slug);
        $currentUser = $this->security->getUser();

        if (null === $worldCafe) {
            return [];
        }

        return $this->participantService->buildParticipantsByWorldCafe($worldCafe, $currentUser);
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

        $worldCafe = $this->worldCafeRepository->findBySlug($slug);

        if (null === $worldCafe) {
            $this->logger->error('[PING] World Cafe is null');

            return null;
        }

        $participant = null;
        $created = false;

        if (null !== $guest) {
            $participant = $this->participantService->findGuestInWorldCafe($worldCafe, $guest);

            if (null === $participant) {
                $participant = $this->participantService->createWorldCafeParticipantFromGuest($worldCafe, $guest);
                $created = true;
            }
        } else {
            Assert::isInstanceOf($user, User::class);

            $participant = $this->participantService->findUserInWorldCafe($worldCafe, $user);

            if (null === $participant) {
                $participant = $this->participantService->createWorldCafeParticipantFromUser($worldCafe, $user);
                $created = true;
            }
        }

        $participant->setLastPing(new \DateTimeImmutable());

        $this->participantService->persistParticipant($participant);

        if ($created) {
            $this->worldCafeRepository->persist($worldCafe);
        }

        return $participant;
    }
}

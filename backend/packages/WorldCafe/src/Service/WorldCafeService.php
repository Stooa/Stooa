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

use App\Core\Model\Event;
use App\Core\Service\ParticipantService;
use App\WorldCafe\Entity\WorldCafe;
use App\WorldCafe\Repository\WorldCafeRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

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
}

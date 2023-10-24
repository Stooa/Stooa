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

namespace App\Core\Service\Hubspot;

use App\Core\Entity\Participant;
use App\Core\Repository\UserRepository;
use App\Fishbowl\Repository\FishbowlRepository;
use Ramsey\Uuid\UuidInterface;

class SyncFishbowlHubspotService
{
    public function __construct(
        protected readonly FishbowlRepository $fishbowlRepository,
        protected readonly UserRepository $userRepository,
        protected readonly CreateContactHubspotService $createContactHubspotService
    ) {
    }

    public function syncParticipants(UuidInterface $fishbowlId): void
    {
        $fishbowl = $this->fishbowlRepository->findById($fishbowlId->toString());

        if (null === $fishbowl) {
            return;
        }

        $host = $fishbowl->getHost();

        if (null === $host) {
            return;
        }

        /** @var Participant[] */
        $participants = $fishbowl->getParticipants();
        foreach ($participants as $participant) {
            $participant = $participant->getUser();

            if (null !== $participant && null !== $email = $participant->getEmail()) {
                $this->createContactHubspotService->create($host, $participant->getFullName(), $email);
            }
        }
    }
}

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

class SyncContactsHubspotService
{
    public function __construct(
        protected readonly FishbowlRepository $fishbowlRepository,
        protected readonly UserRepository $userRepository,
        protected readonly CreateContactHubspotService $createContactHubspotService
    ) {
    }

    public function syncContacts(UuidInterface $userId): void
    {
        $user = $this->userRepository->findUserById($userId->toString());

        if (null === $user) {
            return;
        }

        $fishbowls = $this->fishbowlRepository->findAllByUser($user);

        if (null === $fishbowls) {
            return;
        }

        foreach ($fishbowls as $fishbowl) {
            /** @var Participant[] */
            $participants = $fishbowl->getParticipants();
            foreach ($participants as $participant) {
                $user = $participant->getUser();

                if (null !== $user && null !== $email = $user->getEmail()) {
                    $this->createContactHubspotService->create($user, $user->getFullName(), $email);
                }
            }
        }
    }
}

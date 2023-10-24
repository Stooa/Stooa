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

use App\Core\Entity\User;
use App\Core\Message\SyncHubspotNotification;
use App\Core\Repository\UserRepository;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\Messenger\MessageBusInterface;

class SyncContactsService
{
    public function __construct(
        protected readonly MessageBusInterface $bus,
        protected readonly FishbowlRepository $fishbowlRepository,
        protected readonly UserRepository $userRepository
    ) {
    }

    public function syncContacts(User $user): void
    {
        $fishbowls = $this->fishbowlRepository->findAllByUser($user);

        if (null === $fishbowls) {
            return;
        }

        foreach ($fishbowls as $fishbowl) {
            if (null === $id = $fishbowl->getId()) {
                continue;
            }

            $this->bus->dispatch(new SyncHubspotNotification($id));
        }

        $user->setLastSyncDate(new \DateTimeImmutable());

        $this->userRepository->persist($user);
    }
}

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

    public function syncContacts(User $user): ?\DateTimeImmutable
    {
        $fishbowls = $this->fishbowlRepository->findAllByUser($user);

        if (null === $fishbowls) {
            return null;
        }

        foreach ($fishbowls as $fishbowl) {
            if (null === $id = $fishbowl->getId()) {
                continue;
            }

            $this->bus->dispatch(new SyncHubspotNotification($id));
        }

        $now = new \DateTimeImmutable();

        $user->setLastSyncDate($now);

        $this->userRepository->persist($user);

        return $now;
    }
}

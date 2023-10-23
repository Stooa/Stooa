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
use App\Fishbowl\Repository\FishbowlRepository;
use HubSpot\Factory;
use Symfony\Bundle\SecurityBundle\Security;

class SyncContactsHubspotService
{
    public function __construct(
        protected readonly TokenHubspotService $hubspotTokenService,
        protected readonly Security $security,
        protected readonly FishbowlRepository $fishbowlRepository
    ) {
    }

    public function syncContacts(): void
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return;
        }

        $fishbowls = $this->fishbowlRepository->findAllByUser($user);

        $accessToken = $this->hubspotTokenService->refreshToken();

        if (null === $accessToken) {
            return;
        }

        foreach ($fishbowls as $fishbowl) {
            $contacts = $fishbowl->getParticipants();
            foreach ($contacts as $contact) {
                $hubspot = Factory::createWithAccessToken($accessToken);
            }
        }
    }
}

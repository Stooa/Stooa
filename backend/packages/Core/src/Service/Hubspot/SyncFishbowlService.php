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
use App\Fishbowl\Repository\FishbowlRepository;
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\Cache\CacheInterface;

class SyncFishbowlService
{
    public function __construct(
        protected readonly FishbowlRepository $fishbowlRepository,
        protected readonly CreateContactService $createContactService,
        protected readonly CacheInterface $hubspotCache,
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

        $this->hubspotCache->delete('hubspot_access_token');

        /** @var Participant[] */
        $participants = $fishbowl->getParticipants();
        foreach ($participants as $participant) {
            $user = $participant->getUser();

            if (null !== $user && $user !== $host) {
                $this->createContactService->create($host, $user, $fishbowl);
            }
        }
    }
}

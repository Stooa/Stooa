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

namespace App\Core\MessageHandler;

use App\Core\Message\SyncHubspotNotification;
use App\Core\Service\Hubspot\SyncFishbowlService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class SyncHubspotHandler
{
    public function __construct(
        protected readonly SyncFishbowlService $syncFishbowlService
    ) {
    }

    public function __invoke(SyncHubspotNotification $message): void
    {
        $this->syncFishbowlService->syncParticipants($message->getFishbowlId());
    }
}

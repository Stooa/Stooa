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

namespace App\Fishbowl\MessageHandler;

use App\Fishbowl\Message\GetTranscriptionSummary;
use App\Fishbowl\Service\GetTranscriptionSummaryService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetTranscriptionSummaryHandler
{
    public function __construct(private readonly GetTranscriptionSummaryService $getTranscriptionSummaryService)
    {
    }

    public function __invoke(GetTranscriptionSummary $message): void
    {
        $this->getTranscriptionSummaryService->getSummary($message->runId(), $message->getThreadId(), $message->getSlug());
    }
}

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

use App\Fishbowl\Message\OpenAI\GetSummaryOpenAI;
use App\Fishbowl\Service\OpenAI\GetSummaryService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetSummaryOpenAIHandler
{
    public function __construct(private readonly GetSummaryService $getSummaryService)
    {
    }

    public function __invoke(GetSummaryOpenAI $message): void
    {
        $this->getSummaryService->getSummary($message->runId(), $message->getThreadId(), $message->getSlug());
    }
}

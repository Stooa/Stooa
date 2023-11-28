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

use App\Fishbowl\Message\GetSummaryAnswerOpenAI;
use App\Fishbowl\Service\OpenAI\GetSummaryAnswerService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetSummaryAnswerOpenAIHandler
{
    public function __construct(private readonly GetSummaryAnswerService $getSummaryAnswerService)
    {
    }

    public function __invoke(GetSummaryAnswerOpenAI $message): void
    {
        $this->getSummaryAnswerService->getSummary($message->runId(), $message->getThreadId(), $message->getSlug());
    }
}

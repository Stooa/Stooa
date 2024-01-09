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

use App\Fishbowl\Message\OpenAI\AskSummaryOpenAI;
use App\Fishbowl\Service\OpenAI\AskSummaryService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AskSummaryOpenAIHandler
{
    public function __construct(private readonly AskSummaryService $askSummaryService)
    {
    }

    public function __invoke(AskSummaryOpenAI $message): void
    {
        $this->askSummaryService->createThread($message->getFileId(), $message->getSlug());
    }
}

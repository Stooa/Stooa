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

use App\Fishbowl\Message\CreateTranscriptionThread;
use App\Fishbowl\Service\CreateTranscriptionThreadService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateTranscriptionThreadHandler
{
    public function __construct(private readonly CreateTranscriptionThreadService $createTranscriptionThreadService)
    {
    }

    public function __invoke(CreateTranscriptionThread $message): void
    {
        $this->createTranscriptionThreadService->createThread($message->getFileId(), $message->getSlug());
    }
}

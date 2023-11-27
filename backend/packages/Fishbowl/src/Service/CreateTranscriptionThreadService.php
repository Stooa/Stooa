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

namespace App\Fishbowl\Service;

use App\Fishbowl\Message\GetTranscriptionSummary;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;

final class CreateTranscriptionThreadService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $assistantId,
        private readonly MessageBusInterface $bus
    ) {
    }

    public function createThread(string $fileId, string $slug): void
    {
        $client = \OpenAI::client($this->apiKey);

        $file = $client->files()->retrieve($fileId);

        $thread = $client->threads()->createAndRun(
            [
                'assistant_id' => $this->assistantId,
                'thread' => [
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => 'Summarize the "content" of this JSON file\'s messages',
                            'file_ids' => [$file->id],
                        ],
                    ],
                ],
            ],
        );

        $this->bus->dispatch(new GetTranscriptionSummary($thread->id, $slug));
    }
}

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

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class SummarizeService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $assistantId
    ) {
    }

    public function create(): string
    {
        $client = \OpenAI::client($this->apiKey);

        $transcriptionFile = $this->getParameter('kernel.project_dir') . '/transcriptions/transcription2.json';

        $file = $client->files()->upload([
            'purpose' => 'assistants',
            'file' => fopen($transcriptionFile, 'r'),
        ]);

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

        return $thread->threadId;
    }
}

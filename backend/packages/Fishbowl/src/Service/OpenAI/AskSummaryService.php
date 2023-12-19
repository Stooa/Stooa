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

namespace App\Fishbowl\Service\OpenAI;

use App\Fishbowl\Message\OpenAI\GetSummaryOpenAI;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

final class AskSummaryService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $assistantId,
        private readonly MessageBusInterface $bus,
        private readonly FishbowlRepository $fishbowlRepository
    ) {
    }

    public function createThread(string $fileId, string $slug): void
    {
        $client = \OpenAI::client($this->apiKey);

        $file = $client->files()->retrieve($fileId);

        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null === $fishbowl) {
            return;
        }

        $thread = $client->threads()->createAndRun(
            [
                'assistant_id' => $this->assistantId,
                'thread' => [
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => 'Summarize this transcribed conversation in it’s spoken language.',
                            'file_ids' => [$file->id],
                        ],
                    ],
                ],
            ],
        );

        $this->bus->dispatch(new GetSummaryOpenAI($thread->id, $thread->threadId, $slug), [
            new DelayStamp(10000),
        ]);
    }
}

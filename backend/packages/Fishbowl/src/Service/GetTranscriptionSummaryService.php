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
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

final class GetTranscriptionSummaryService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly MessageBusInterface $bus,
        private readonly FishbowlRepository $fishbowlRepository
    ) {
    }

    public function getSummary(string $runId, string $threadId, string $slug): string
    {
        $client = \OpenAI::client($this->apiKey);

        $run = $client->threads()->runs()->retrieve(
            threadId: $threadId,
            runId: $runId,
        );

        if ('completed' !== $run->status) {
            return $this->retry($runId, $threadId, $slug);
        }

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 1,
        ]);

        foreach ($response->data as $messageResponse) {
            foreach ($messageResponse->content as $content) {
                if ('text' === $content->type) {
                    $this->saveSummary($content->text->value, $slug);
                }
            }
        }

        return $this->retry($runId, $threadId, $slug);
    }

    private function retry(string $runId, string $threadId, string $slug): string
    {
        $this->bus->dispatch(new GetTranscriptionSummary($runId, $threadId, $slug), [
            new DelayStamp(3000),
        ]);

        return 'The transcription is not ready yet';
    }

    private function saveSummary(string $summary, string $slug): void
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null !== $fishbowl) {
            $fishbowl->setSummary($summary);

            $this->fishbowlRepository->persist($fishbowl);
        }
    }
}

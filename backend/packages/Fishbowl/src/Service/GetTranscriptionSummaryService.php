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

final class GetTranscriptionSummaryService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly MessageBusInterface $bus
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
            return 'The transcription is not ready yet';
        }

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 1,
        ]);

        foreach ($response->data as $messageResponse) {
            foreach ($messageResponse->content as $content) {
                if ('text' === $content->type) {
                    return $content->text->value;
                }
            }
        }

        return 'The transcription is not ready yet';
        //
        //        $this->bus->dispatch(new GetTranscriptionSummary($threadId, $slug));
    }
}

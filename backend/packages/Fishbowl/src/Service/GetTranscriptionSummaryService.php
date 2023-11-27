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

    public function getSummary(string $threadId, string $slug): void
    {
        $client = \OpenAI::client($this->apiKey);

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 10,
        ]);

        foreach ($response->data as $result) {
            // check if the message is the one we want
        }
        $this->bus->dispatch(new GetTranscriptionSummary($threadId, $slug));
    }
}

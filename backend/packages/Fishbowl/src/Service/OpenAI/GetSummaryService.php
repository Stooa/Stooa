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

use OpenAI\Responses\Threads\Messages\ThreadMessageResponseContentTextObject;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\Exception\RecoverableMessageHandlingException;

final class GetSummaryService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly FishbowlSummaryService $fishbowlSummaryService
    ) {
    }

    public function getSummary(string $runId, string $threadId, string $slug): void
    {
        $client = \OpenAI::client($this->apiKey);

        $run = $client->threads()->runs()->retrieve(
            threadId: $threadId,
            runId: $runId,
        );

        if ('completed' !== $run->status) {
            throw new RecoverableMessageHandlingException('Run is not completed');
        }

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 1,
        ]);

        foreach ($response->data as $messageResponse) {
            foreach ($messageResponse->content as $content) {
                if ($content instanceof ThreadMessageResponseContentTextObject) {
                    $this->fishbowlSummaryService->saveSummary($content->text->value, $slug);
                }
            }
        }
    }
}

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

use App\Fishbowl\Message\GetSummaryOpenAI;
use App\Fishbowl\Repository\FishbowlRepository;
use OpenAI\Responses\Threads\Messages\ThreadMessageResponseContentTextObject;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

final class GetSummaryService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey,
        private readonly MessageBusInterface $bus,
        private readonly FishbowlRepository $fishbowlRepository
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
            $this->retry($runId, $threadId, $slug);
        }

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 1,
        ]);

        foreach ($response->data as $messageResponse) {
            foreach ($messageResponse->content as $content) {
                if ($content instanceof ThreadMessageResponseContentTextObject) {
                    $this->saveSummary($content->text->value, $slug);
                }
            }
        }
    }

    private function retry(string $runId, string $threadId, string $slug): void
    {
        $this->bus->dispatch(new GetSummaryOpenAI($runId, $threadId, $slug), [
            new DelayStamp(3000),
        ]);
    }

    private function saveSummary(string $summary, string $slug): void
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null !== $fishbowl) {
            $fishbowl->setSummary($summary);
            $fishbowl->setSummaryUpdatedAt(new \DateTimeImmutable());

            $this->fishbowlRepository->persist($fishbowl);
        }
    }
}

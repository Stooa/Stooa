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

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class UploadFileService extends AbstractController
{
    public function __construct(
        private readonly HttpClientInterface $client,
        private readonly CleanTranscriptionService $cleanTranscriptionService,
        private readonly FishbowlSummaryService $fishbowlSummaryService,
        private readonly string $apiKey
    ) {
    }

    public function upload(string $transcriptionUrl, string $slug): string
    {
        $response = $this->client->request('GET', $transcriptionUrl);
        $transcription = $response->getContent();

        $filesystem = new Filesystem();
        $file = $filesystem->tempnam('/tmp', 'transcription_', '.json');
        $filesystem->appendToFile($file, $this->cleanTranscriptionService->clean($transcription));

        if (filesize($file) < 1100) {
            $this->fishbowlSummaryService->saveSummary('Conversation not available to summarize', $slug);

            return '';
        }

        $client = \OpenAI::client($this->apiKey);

        $uploadedFile = $client->files()->upload([
            'purpose' => 'assistants',
            'file' => fopen($file, 'r'),
        ]);

        return $uploadedFile->id;
    }
}

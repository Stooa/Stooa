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
        private readonly string $apiKey
    ) {
    }

    public function upload(string $transcriptionUrl): string
    {
        $response = $this->client->request('GET', $transcriptionUrl);
        $transcription = $response->getContent();

        $filesystem = new Filesystem();
        $file = $filesystem->tempnam('/tmp', 'transcription_', '.json');
        $filesystem->appendToFile($file, $this->cleanTranscription($transcription));

        if (filesize($file) < 1200) {
            $file = $filesystem->tempnam('/tmp', 'transcription_', '.json');
            $filesystem->appendToFile($file, $transcription);
        }

        $client = \OpenAI::client($this->apiKey);

        $uploadedFile = $client->files()->upload([
            'purpose' => 'assistants',
            'file' => fopen($file, 'r'),
        ]);

        return $uploadedFile->id;
    }

    private function cleanTranscription(string $json): string
    {
        $jsonArray = json_decode($json, true);

        $removeKeys = ['roomAddress', 'meetingFqn', 'sessionId', 'timestamp', 'messageType'];

        foreach ($removeKeys as $key) {
            unset($jsonArray[$key]);
        }

        $removeKeys = ['jid', 'timestamp', 'avatarUrl', 'messageId'];

        foreach ($jsonArray['messages'] as $index => $message) {
            foreach ($removeKeys as $key) {
                unset($jsonArray['messages'][$index][$key]);
            }
        }

        return json_encode($jsonArray, \JSON_THROW_ON_ERROR);
    }
}

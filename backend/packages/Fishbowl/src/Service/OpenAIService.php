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

final class OpenAIService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function create(): string
    {
        $client = \OpenAI::client($this->apiKey);

        $transcriptionFile = $this->getParameter('kernel.project_dir') . '/transcriptions/transcription.json';

        $fileContent = file_get_contents($transcriptionFile);

        $response = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => 'Can you summarize the next json content:' . $fileContent . '?'],
            ],
        ]);

        return $response->choices[0]->message->content;
    }
}

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

use App\Fishbowl\Message\AskSummaryOpenAI;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;

final class UploadFileService extends AbstractController
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly string $apiKey
    ) {
    }

    public function upload(string $slug): void
    {
        $client = \OpenAI::client($this->apiKey);

        $fileName = $slug . '.json';

        $transcriptionFile = $this->getParameter('kernel.project_dir') . '/transcriptions/' . $fileName;

        $file = $client->files()->upload([
            'purpose' => 'assistants',
            'file' => fopen($transcriptionFile, 'r'),
        ]);

        $this->bus->dispatch(new AskSummaryOpenAI($file->id, $slug));
    }
}

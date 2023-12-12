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

use App\Fishbowl\Message\OpenAI\AskSummaryOpenAI;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

class TranscriptionFileService
{
    public function __construct(
        private readonly UploadFileService $uploadFileService,
        private readonly FishbowlRepository $fishbowlRepository,
        private readonly MessageBusInterface $bus,
    ) {
    }

    public function save(string $transcriptionUrl, string $slug): void
    {
        $fileId = $this->uploadFileService->upload($transcriptionUrl);

        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null !== $fishbowl && $fishbowl->isHasSummary()) {
            $this->bus->dispatch(new AskSummaryOpenAI($fileId, $slug), [
                new DelayStamp(5000),
            ]);
        }
    }
}

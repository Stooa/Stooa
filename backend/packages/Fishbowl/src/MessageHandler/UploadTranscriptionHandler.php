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

namespace App\Fishbowl\MessageHandler;

use App\Fishbowl\Message\UploadTranscription;
use App\Fishbowl\Service\UploadTranscriptionService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UploadTranscriptionHandler
{
    public function __construct(private readonly UploadTranscriptionService $uploadTranscriptionService)
    {
    }

    public function __invoke(UploadTranscription $message)
    {
        $this->uploadTranscriptionService->upload($message->getSlug());
    }
}

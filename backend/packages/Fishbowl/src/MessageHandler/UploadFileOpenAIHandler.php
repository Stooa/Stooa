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

use App\Fishbowl\Message\UploadFileOpenAI;
use App\Fishbowl\Service\OpenAI\UploadFileService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UploadFileOpenAIHandler
{
    public function __construct(private readonly UploadFileService $uploadFileService)
    {
    }

    public function __invoke(UploadFileOpenAI $message): void
    {
        $this->uploadFileService->upload($message->getSlug());
    }
}

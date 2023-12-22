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

namespace App\Fishbowl\Message\OpenAI;

class AskSummaryOpenAI
{
    public function __construct(
        private readonly string $fileId,
        private readonly string $slug,
    ) {
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getFileId(): string
    {
        return $this->fileId;
    }
}

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

class GetSummaryOpenAI
{
    public function __construct(
        private readonly string $runId,
        private readonly string $threadId,
        private readonly string $slug
    ) {
    }

    public function runId(): string
    {
        return $this->runId;
    }

    public function getThreadId(): string
    {
        return $this->threadId;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }
}

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

namespace App\Fishbowl\Message;

class ReadTranscriptionThread
{
    public function __construct(
        private readonly string $threadId,
    ) {
    }

    public function getThreadId(): string
    {
        return $this->threadId;
    }
}

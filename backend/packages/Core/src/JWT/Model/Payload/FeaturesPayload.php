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

namespace App\Core\JWT\Model\Payload;

final class FeaturesPayload implements PayloadInterface
{
    public function __construct(
        private readonly bool $recording,
        private readonly bool $livestreaming,
        private readonly bool $transcription,
        private readonly bool $outboundCall
    ) {
    }

    /** @return array<string, string> */
    public function toArray(): array
    {
        return [
            'recording' => $this->recording ? 'true' : 'false',
            'livestreaming' => $this->livestreaming ? 'true' : 'false',
            'transcription' => $this->transcription ? 'true' : 'false',
            'outbound-call' => $this->outboundCall ? 'true' : 'false',
        ];
    }
}

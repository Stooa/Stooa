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

final readonly class FeaturesPayload implements PayloadInterface
{
    public function __construct(
        private bool $recording,
        private bool $livestreaming,
        private bool $transcription,
        private bool $outboundCall,
        private bool $sipOutboundCall
    ) {
    }

    /** @return array<string, bool> */
    public function toArray(): array
    {
        return [
            'livestreaming' => $this->livestreaming,
            'outbound-call' => $this->outboundCall,
            'transcription' => $this->transcription,
            'sip-outbound-call' => $this->sipOutboundCall,
            'recording' => $this->recording,
        ];
    }
}

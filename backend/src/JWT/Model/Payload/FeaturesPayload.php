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

namespace App\JWT\Model\Payload;

final class FeaturesPayload implements PayloadInterface
{
    private bool $recording;
    private bool $livestreaming;
    private bool $transcription;
    private bool $outboundCall;
    private bool $sipOutboundCall;

    public function __construct(bool $recording, bool $livestreaming, bool $transcription, bool $outboundCall, bool $sipOutboundCall)
    {
        $this->recording = $recording;
        $this->livestreaming = $livestreaming;
        $this->transcription = $transcription;
        $this->outboundCall = $outboundCall;
        $this->sipOutboundCall = $sipOutboundCall;
    }

    /** @return array<string, bool|null> */
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

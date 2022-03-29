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

namespace App\Model\Payload;

final class FeaturesPayload implements PayloadInterface
{
    private bool $recording;
    private bool $livestreaming;
    private bool $transcription;
    private bool $outboundCall;
    private bool $moderator;

    public function __construct(bool $moderator)
    {
        $this->moderator = $moderator;
        $this->recording = false;
        $this->livestreaming = false;
        $this->transcription = false;
        $this->outboundCall = false;
    }

    public function isRecording(): bool
    {
        return $this->recording;
    }

    public function isLivestreaming(): bool
    {
        return $this->livestreaming;
    }

    public function isTranscription(): bool
    {
        return $this->transcription;
    }

    public function isOutboundCall(): bool
    {
        return $this->outboundCall;
    }

    public function isModerator(): bool
    {
        return $this->moderator;
    }

    /** @return array<string, bool|null> */
    public function toArray(): array
    {
        return [
            'recording' => $this->isRecording(),
            'livestreaming' => $this->isLivestreaming(),
            'transcription' => $this->isTranscription(),
            'outbound-call' => $this->isOutboundCall(),
        ];
    }
}

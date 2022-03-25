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
    private ?bool $recording;
    private ?bool $livestreaming;
    private ?bool $transcription;
    private ?bool $outboundCall;

    public function getRecording(): ?bool
    {
        return $this->recording;
    }

    public function setRecording(?bool $recording): void
    {
        $this->recording = $recording;
    }

    public function getLivestreaming(): ?bool
    {
        return $this->livestreaming;
    }

    public function setLivestreaming(?bool $livestreaming): void
    {
        $this->livestreaming = $livestreaming;
    }

    public function getTranscription(): ?bool
    {
        return $this->transcription;
    }

    public function setTranscription(?bool $transcription): void
    {
        $this->transcription = $transcription;
    }

    public function getOutboundCall(): ?bool
    {
        return $this->outboundCall;
    }

    public function setOutboundCall(?bool $outboundCall): void
    {
        $this->outboundCall = $outboundCall;
    }

    /** @return array<string, bool|null> */
    public function toArray(): array
    {
        return [
            'recording' => $this->getRecording(),
            'livestreaming' => $this->getLivestreaming(),
            'transcription' => $this->getTranscription(),
            'outbound-call' => $this->getOutboundCall(),
        ];
    }
}

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

final class JaasJWTPayload extends JWTPayload
{
    private ?FeaturesPayload $features;

    public function __construct(string $appId, ?UserPayload $userPayload, ?FeaturesPayload $featuresPayload, ?HeaderPayload $headerPayload)
    {
        $this->iss = 'chat';
        $this->aud = 'jitsi';
        $this->sub = $appId;
        $this->room = '*';
        $this->user = $userPayload;
        $this->features = $featuresPayload;
        $this->headerPayload = $headerPayload;
    }

    public function getFeatures(): ?FeaturesPayload
    {
        return $this->features;
    }

    /** @return array<string, array<string, string|array<string, mixed>>|string|null> */
    public function toArray(): array
    {
        return [
            'iss' => $this->getIss(),
            'aud' => $this->getAud(),
            'sub' => $this->getSub(),
            'room' => $this->getRoom(),
            'context' => [
                'features' => $this->getFeatures() ? $this->getFeatures()->toArray() : '',
                'user' => $this->getUser() ? $this->getUser()->toArray() : '',
            ],
        ];
    }
}

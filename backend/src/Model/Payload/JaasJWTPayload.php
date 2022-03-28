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

    public function __construct(string $appId, ?UserPayload $userPayload, ?FeaturesPayload $featuresPayload)
    {
        $this->iss = 'chat';
        $this->aud = 'jitsi';
        $this->sub = $appId;
        $this->room = '*';
        $this->user = $userPayload;
        $this->features = $featuresPayload;
    }

    public function getFeatures(): ?FeaturesPayload
    {
        return $this->features;
    }

    /** @return array<string, array<string, string|array<string, mixed>>|string|null> */
    public function toArray(): array
    {
        $array = [
            'context' => [
                'features' => $this->getFeatures() ? $this->getFeatures()->toArray() : '',
            ],
        ];

        return array_merge(parent::toArray(), $array);
    }
}

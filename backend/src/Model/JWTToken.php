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

namespace App\Model;

use App\Model\Payload\FeaturesPayload;
use App\Model\Payload\HeaderPayload;
use App\Model\Payload\UserPayload;
use Lcobucci\JWT\Token\RegisteredClaims;

final class JWTToken
{
    private ?string $iss;
    private ?string $aud;
    private ?string $sub;
    private ?string $room;
    private ?FeaturesPayload $features;
    private ?\DateTimeImmutable $nbf;
    private ?UserPayload $user;
    private ?HeaderPayload  $headerPayload;

    public function __construct(string $iss, string $aud, string $sub, string $room, UserPayload $user)
    {
        $this->iss = $iss;
        $this->aud = $aud;
        $this->sub = $sub;
        $this->room = $room;
        $this->user = $user;
        $this->features = null;
        $this->headerPayload = null;
        $this->nbf = null;
    }

    public function getIss(): ?string
    {
        return $this->iss;
    }

    public function getAud(): ?string
    {
        return $this->aud;
    }

    public function getSub(): ?string
    {
        return $this->sub;
    }

    public function getRoom(): ?string
    {
        return $this->room;
    }

    public function getUser(): ?UserPayload
    {
        return $this->user;
    }

    public function setHeaderPayload(?HeaderPayload $headerPayload): void
    {
        $this->headerPayload = $headerPayload;
    }

    public function getHeaderPayload(): ?HeaderPayload
    {
        return $this->headerPayload;
    }

    public function getFeatures(): ?FeaturesPayload
    {
        return $this->features;
    }

    public function setFeatures(?FeaturesPayload $features): void
    {
        $this->features = $features;
    }

    public function setNbf(?\DateTimeImmutable $nbf): void
    {
        $this->nbf = $nbf;
    }

    public function getNbf(): ?\DateTimeImmutable
    {
        return $this->nbf;
    }

    /** @return array<string, array<string, string|array<string, mixed>>|string|null> */
    public function toArray(): array
    {
        $arrayResponse = [
            RegisteredClaims::ISSUER => $this->getIss(),
            RegisteredClaims::AUDIENCE => $this->getAud(),
            RegisteredClaims::SUBJECT => $this->getSub(),
            'room' => $this->getRoom(),
            'context' => [
                'user' => $this->getUser() ? $this->getUser()->toArray() : '',
            ],
        ];

        if ($this->getNbf()) {
            $arrayResponse[RegisteredClaims::NOT_BEFORE] = $this->getNbf();
        }

        if ($this->getFeatures()) {
            $arrayResponse['context']['features'] = $this->getFeatures()->toArray();
        }

        return $arrayResponse;
    }
}

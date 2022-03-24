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

final class JWTPayload implements PayloadInterface
{
    private ?string $iss;
    private ?string $aud;
    private ?string $sub;
    private ?string $room;
    private UserPayload $user;

    public function getIss(): ?string
    {
        return $this->iss;
    }

    public function setIss(?string $iss): void
    {
        $this->iss = $iss;
    }

    public function getAud(): ?string
    {
        return $this->aud;
    }

    public function setAud(?string $aud): void
    {
        $this->aud = $aud;
    }

    public function getSub(): ?string
    {
        return $this->sub;
    }

    public function setSub(?string $sub): void
    {
        $this->sub = $sub;
    }

    public function getRoom(): ?string
    {
        return $this->room;
    }

    public function setRoom(?string $room): void
    {
        $this->room = $room;
    }

    public function getUser(): UserPayload
    {
        return $this->user;
    }

    public function setUser(UserPayload $user): void
    {
        $this->user = $user;
    }

    /** @return array<string, array<string, array<string, mixed>>|string|null> */
    public function toArray(): array
    {
        return [
            'iss' => $this->getIss(),
            'aud' => $this->getAud(),
            'sub' => $this->getSub(),
            'room' => $this->getRoom(),
            'context' => [
                'user' => $this->getUser()->toArray(),
            ],
        ];
    }
}

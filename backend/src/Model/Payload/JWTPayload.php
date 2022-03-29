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

class JWTPayload implements PayloadInterface
{
    protected ?string $iss;
    protected ?string $aud;
    protected ?string $sub;
    protected ?string $room;
    protected ?UserPayload $user;
    protected ?HeaderPayload  $headerPayload;

    public function __construct(?UserPayload $user, ?string $room)
    {
        $this->iss = 'api_client';
        $this->aud = 'api_client';
        $this->sub = 'meet.jitsi';
        $this->room = $room;
        $this->user = $user;
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

    public function getHeaderPayload(): ?HeaderPayload
    {
        return $this->headerPayload;
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
                'user' => $this->getUser() ? $this->getUser()->toArray() : '',
            ],
        ];
    }
}

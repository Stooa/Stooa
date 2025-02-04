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

namespace App\Core\JWT\Model;

use App\Core\JWT\Model\Payload\FeaturesPayload;
use App\Core\JWT\Model\Payload\HeaderPayload;
use App\Core\JWT\Model\Payload\UserPayload;
use Lcobucci\JWT\Token\RegisteredClaims;

class JWTToken
{
    public function __construct(
        private readonly string $iss,
        private readonly string $aud,
        private readonly string $sub,
        private readonly string $room,
        private readonly UserPayload $user,
        private readonly ?\DateTimeImmutable $nbf = null,
        private readonly ?HeaderPayload $headerPayload = null,
        private readonly ?FeaturesPayload $features = null,
    ) {
    }

    public function getHeaderPayload(): ?HeaderPayload
    {
        return $this->headerPayload;
    }

    public function getNbf(): ?\DateTimeImmutable
    {
        return $this->nbf;
    }

    /** @return array<string, (\DateTimeImmutable|string|array<string, (string|array<string, mixed>)>|null)> */
    public function toArray(): array
    {
        $arrayResponse = [
            RegisteredClaims::ISSUER => $this->iss,
            RegisteredClaims::AUDIENCE => $this->aud,
            RegisteredClaims::SUBJECT => $this->sub,
            'room' => $this->room,
            'context' => [
                'user' => $this->user->toArray(),
            ],
        ];

        if (null !== $this->nbf) {
            $arrayResponse[RegisteredClaims::NOT_BEFORE] = $this->nbf;
        }

        if (null !== $this->features) {
            $arrayResponse['context']['features'] = $this->features->toArray();
        }

        return $arrayResponse;
    }
}

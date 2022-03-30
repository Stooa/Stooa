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

final class HeaderPayload implements PayloadInterface
{
    private string $alg;
    private string $typ;
    private string $kid;

    public function __construct(string $apiKey, string $alg, string $typ)
    {
        $this->kid = $apiKey;
        $this->alg = $alg;
        $this->typ = $typ;
    }

    /** @return array<string, string|null> */
    public function toArray(): array
    {
        return [
            'alg' => $this->alg,
            'kid' => $this->kid,
            'typ' => $this->typ,
        ];
    }
}

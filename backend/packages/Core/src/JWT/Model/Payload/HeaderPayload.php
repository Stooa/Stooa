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

namespace App\Core\JWT\Model\Payload;

final readonly class HeaderPayload implements PayloadInterface
{
    public function __construct(
        private string $kid,
        private string $alg,
        private string $typ
    ) {
    }

    /** @return array<string, string> */
    public function toArray(): array
    {
        return [
            'alg' => $this->alg,
            'kid' => $this->kid,
            'typ' => $this->typ,
        ];
    }
}

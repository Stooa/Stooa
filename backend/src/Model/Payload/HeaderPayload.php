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
    private ?string $alg;
    private ?string $typ;
    private ?string $kid;

    public function getAlg(): ?string
    {
        return $this->alg;
    }

    public function setAlg(?string $alg): void
    {
        $this->alg = $alg;
    }

    public function getTyp(): ?string
    {
        return $this->typ;
    }

    public function setTyp(?string $typ): void
    {
        $this->typ = $typ;
    }

    public function getKid(): ?string
    {
        return $this->kid;
    }

    public function setKid(?string $kid): void
    {
        $this->kid = $kid;
    }

    /** @return array<string, string|null> */
    public function toArray(): array
    {
        return [
            'alg' => $this->getAlg(),
            'kid' => $this->getKid(),
            'typ' => $this->getTyp(),
        ];
    }
}

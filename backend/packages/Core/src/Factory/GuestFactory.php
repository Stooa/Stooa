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

namespace App\Core\Factory;

use App\Core\Entity\Guest;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<Guest> */
final class GuestFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->firstName(),
        ];
    }

    protected static function getClass(): string
    {
        return Guest::class;
    }
}

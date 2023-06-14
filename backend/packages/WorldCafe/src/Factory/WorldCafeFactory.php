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

namespace App\WorldCafe\Factory;

use App\Fishbowl\Entity\Fishbowl;
use App\WorldCafe\Entity\WorldCafe;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<WorldCafe> */
final class WorldCafeFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->words(3, true),
            'description' => self::faker()->sentence(),
            'startDateTime' => self::faker()->dateTime(),
            'timezone' => self::faker()->timezone(),
            'locale' => 'en',
            'currentStatus' => self::faker()->randomElement(Fishbowl::$statusChoices),
            'slug' => self::faker()->slug(),
            'hasExtraRoundTime' => true,
            'roundMinutes' => 15,
        ];
    }

    protected static function getClass(): string
    {
        return WorldCafe::class;
    }
}

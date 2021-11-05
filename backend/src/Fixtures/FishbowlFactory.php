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

namespace App\Fixtures;

use App\Entity\Fishbowl;
use Zenstruck\Foundry\ModelFactory;

final class FishbowlFactory extends ModelFactory
{
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->title(),
            'description' => self::faker()->sentence(),
            'startDateTime' => self::faker()->dateTime(),
            'timezone' => self::faker()->timezone(),
            'locale' => self::faker()->languageCode(),
            'duration' => self::faker()->dateTime(),
            'currentStatus' => self::faker()->randomElement(Fishbowl::$statusChoices),
            'slug' => self::faker()->slug(),
        ];
    }

    protected static function getClass(): string
    {
        return Fishbowl::class;
    }
}

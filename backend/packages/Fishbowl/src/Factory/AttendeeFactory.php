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

namespace App\Fishbowl\Factory;

use App\Fishbowl\Entity\Attendee;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<Attendee> */
final class AttendeeFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->name(),
            'email' => self::faker()->email(),
            'timezone' => self::faker()->timezone(),
        ];
    }

    protected static function getClass(): string
    {
        return Attendee::class;
    }
}

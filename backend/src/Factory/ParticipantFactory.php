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

namespace App\Factory;

use App\Entity\Participant;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<Participant> */
final class ParticipantFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'lastPing' => self::faker()->dateTime(),
        ];
    }

    protected static function getClass(): string
    {
        return Participant::class;
    }
}

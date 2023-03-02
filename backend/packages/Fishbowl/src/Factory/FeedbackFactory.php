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

use App\Fishbowl\Entity\Feedback;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<Feedback> */
final class FeedbackFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'satisfaction' => Feedback::SATISFACTION_NEUTRAL,
            'origin' => Feedback::ORIGIN_FISHBOWL,
            'createdDateTime' => self::faker()->dateTime(),
            'comment' => self::faker()->words(10, true),
            'timezone' => self::faker()->timezone(),
            'email' => self::faker()->email(),
        ];
    }

    protected static function getClass(): string
    {
        return Feedback::class;
    }
}

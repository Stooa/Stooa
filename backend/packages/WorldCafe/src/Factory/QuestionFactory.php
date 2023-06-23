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

use App\WorldCafe\Entity\Question;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<Question> */
final class QuestionFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'title' => self::faker()->words(3, true),
            'description' => self::faker()->sentence(),
            'position' => self::faker()->numberBetween(1, 10),
        ];
    }

    protected static function getClass(): string
    {
        return Question::class;
    }
}

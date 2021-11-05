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

use App\Entity\User;
use Zenstruck\Foundry\ModelFactory;

final class UserFactory extends ModelFactory
{
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->firstName(),
            'surnames' => self::faker()->lastName(),
            'email' => self::faker()->unique()->email(),
            'password' => self::faker()->password(),
            'plainPassword' => self::faker()->word(),
            'privacyPolicy' => self::faker()->boolean(),
            'allowShareData' => self::faker()->boolean(),
            'active' => self::faker()->boolean(),
            'linkedinProfile' => self::faker()->boolean(),
            'twitterProfile' => self::faker()->boolean(),
            'locale' => self::faker()->languageCode(),
            'createdAt' => self::faker()->dateTime(),
            'updatedAt' => self::faker()->dateTime(),
            'fishbowls' => [FishbowlFactory::new()],
        ];
    }

    protected static function getClass(): string
    {
        return User::class;
    }
}

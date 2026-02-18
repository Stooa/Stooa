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

use App\Core\Entity\User;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<User> */
final class UserFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->firstName(),
            'surnames' => self::faker()->lastName(),
            'email' => self::faker()->unique()->email(),
            'password' => self::faker()->password(),
            'plainPassword' => self::faker()->word(),
            'privacyPolicy' => self::faker()->boolean(),
            'allowShareData' => true,
            'active' => self::faker()->boolean(),
            'linkedinProfile' => 'https://www.linkedin.com/in/wearestooa',
            'twitterProfile' => 'https://x.com/wearestooa',
            'locale' => 'en',
            'createdAt' => self::faker()->dateTime(),
            'updatedAt' => self::faker()->dateTime(),
        ];
    }

    protected static function getClass(): string
    {
        return User::class;
    }
}

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

use App\Core\Entity\SonataUserUser;
use Zenstruck\Foundry\ModelFactory;

/** @extends ModelFactory<SonataUserUser> */
final class SonataUserUserFactory extends ModelFactory
{
    /** @return array<string, mixed> */
    protected function getDefaults(): array
    {
        return [
            'username' => self::faker()->unique()->userName(),
            'email' => self::faker()->unique()->email(),
            'password' => self::faker()->password(),
            'enabled' => self::faker()->boolean(),
        ];
    }

    protected static function getClass(): string
    {
        return SonataUserUser::class;
    }
}

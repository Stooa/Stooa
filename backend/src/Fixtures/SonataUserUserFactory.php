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

use App\Entity\SonataUserUser;
use Zenstruck\Foundry\ModelFactory;

final class SonataUserUserFactory extends ModelFactory
{
    protected function getDefaults(): array
    {
        return [
            'username' => self::faker()->unique()->userName(),
            'email' => self::faker()->unique()->email(),
            'password' => self::faker()->password(),
            'enabled' => self::faker()->boolean,
            'roles' => [],
        ];
    }

    protected static function getClass(): string
    {
        return SonataUserUser::class;
    }
}

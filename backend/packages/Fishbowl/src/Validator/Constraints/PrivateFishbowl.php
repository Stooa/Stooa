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

namespace App\Fishbowl\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class PrivateFishbowl extends Constraint
{
    public string $message = 'fishbowl.private.private';
    public string $publicMessage = 'fishbowl.private.public';

    public function getTargets(): array|string
    {
        return self::CLASS_CONSTRAINT;
    }
}

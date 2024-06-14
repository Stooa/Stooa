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

namespace App\Core\Service;

use Hashids\Hashids;

class SlugService
{
    public function generateRandomSlug(): string
    {
        $hashids = new Hashids('', 10);

        return $hashids->encode(random_int(1, 1_000_000_000));
    }
}

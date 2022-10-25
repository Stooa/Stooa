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

namespace App\Core\JWT\Model\Payload;

use Ramsey\Uuid\UuidInterface;

interface PayloadInterface
{
    /** @return array<string, bool|string|UuidInterface|array<string, mixed>|null> */
    public function toArray(): array;
}

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

namespace App\Core\Encryption;

interface PasswordEncryptionInterface
{
    public function encrypt(?string $password): ?string;

    public function decrypt(?string $cipherPassword): ?string;
}

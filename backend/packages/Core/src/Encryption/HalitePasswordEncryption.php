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

use ParagonIE\Halite\KeyFactory;
use ParagonIE\Halite\Symmetric\Crypto;
use ParagonIE\HiddenString\HiddenString;

class HalitePasswordEncryption implements PasswordEncryptionInterface
{
    public function __construct(
        private readonly string $key,
    ) {
    }

    public function encrypt(?string $password): ?string
    {
        if (null === $password) {
            return null;
        }

        return Crypto::encrypt(
            new HiddenString($password),
            KeyFactory::importEncryptionKey(new HiddenString($this->key))
        );
    }

    public function decrypt(?string $cipherPassword): ?string
    {
        if (null === $cipherPassword) {
            return null;
        }

        return Crypto::decrypt(
            $cipherPassword,
            KeyFactory::importEncryptionKey(new HiddenString($this->key))
        )->getString();
    }
}

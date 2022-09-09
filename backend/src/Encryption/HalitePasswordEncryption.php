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

namespace App\Encryption;

use ParagonIE\Halite\KeyFactory;
use ParagonIE\Halite\Symmetric\Crypto;
use ParagonIE\Halite\Symmetric\EncryptionKey;
use ParagonIE\HiddenString\HiddenString;

class HalitePasswordEncryption implements PasswordEncryptionInterface
{
    private EncryptionKey $encryptedKey;

    public function __construct(
        private readonly string $key

    ) {
        $this->encryptedKey = KeyFactory::importEncryptionKey(new HiddenString($this->key));
    }

    public function encrypt(string $password): string
    {
        return Crypto::encrypt(
            new HiddenString(
                $password
            ),
            $this->encryptedKey
        );
    }

    public function decrypt(string $cipherPassword): string
    {
        return Crypto::decrypt(
            $cipherPassword,
            $this->encryptedKey
        )->getString();
    }
}

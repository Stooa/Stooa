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

namespace App\Core\Security;

use App\Core\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderService
{
    public function __construct(private readonly UserPasswordHasherInterface $hasher)
    {
    }

    public function encodePassword(User $user): void
    {
        if (!$user->getPlainPassword()) {
            return;
        }

        $hashedPassword = $this->hasher->hashPassword($user, $user->getPlainPassword());

        $user->setPassword($hashedPassword);
        $user->eraseCredentials();
    }
}

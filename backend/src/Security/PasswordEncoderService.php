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

namespace App\Security;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;

class PasswordEncoderService
{
    public function __construct(private readonly PasswordHasherFactoryInterface $encoderFactory)
    {
    }

    public function encodePassword(User $user): void
    {
        if (!$user->getPlainPassword()) {
            return;
        }

        $encoder = $this->encoderFactory->getEncoder($user);
        $hashedPassword = $encoder->encodePassword($user->getPlainPassword(), $user->getSalt());

        $user->setPassword($hashedPassword);
        $user->eraseCredentials();
    }
}

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

namespace App\Core\Service\Hubspot;

use App\Core\Entity\User;
use App\Core\Repository\UserRepository;

class RemoveTokenService
{
    public function __construct(
        protected readonly UserRepository $userRepository,
    ) {
    }

    public function remove(User $user): void
    {
        $user->setHubspotRefreshToken('');

        $this->userRepository->persist($user);
    }
}

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

namespace App\TokenGenerator;

use App\Entity\User;
use App\Model\Payload\JWTPayload;
use App\Model\Payload\UserPayload;
use App\Service\UserService;

final class SelfHostedTokenGenerator implements TokenGeneratorInterface
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function generate(User $user): JWTPayload
    {
        $userPayload = new UserPayload(
            $user->getFullName(),
            $user->getEmail(),
            $user->getPublicTwitterProfile(),
            $user->getPublicLinkedinProfile(),
            false
        );

        return new JWTPayload($userPayload, $this->userService->buildRoomPermissionByUser($user));
    }
}

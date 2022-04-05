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

namespace App\JWT\TokenGenerator;

use App\Entity\User;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\UserPayload;
use App\JWT\UserRoomRequest;

final class SelfHostedTokenGenerator implements TokenGeneratorInterface
{
    private UserRoomRequest $buildRoomRequest;

    public function __construct(UserRoomRequest $buildRoomRequest)
    {
        $this->buildRoomRequest = $buildRoomRequest;
    }

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, false, null, null);

        return new JWTToken('api_client', 'api_client', 'meet.jitsi',
            $this->buildRoomRequest->buildRoomPermissionByUser($user),
            $userPayload
        );
    }
}

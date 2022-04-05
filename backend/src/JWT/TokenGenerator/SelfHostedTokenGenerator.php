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
use App\JWT\CurrentUserFishbowl;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\UserPayload;

final class SelfHostedTokenGenerator implements TokenGeneratorInterface
{
    private CurrentUserFishbowl $buildRoomRequest;

    public function __construct(CurrentUserFishbowl $buildRoomRequest)
    {
        $this->buildRoomRequest = $buildRoomRequest;
    }

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, false, null, null);

        return new JWTToken('api_client', 'api_client', 'meet.jitsi',
            $this->buildRoomRequest->currentSlug($user),
            $userPayload
        );
    }
}

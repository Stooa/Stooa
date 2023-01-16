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

namespace App\Core\JWT\TokenGenerator;

use App\Core\Entity\User;
use App\Core\JWT\CurrentUserFishbowl;
use App\Core\JWT\Model\JWTToken;
use App\Core\JWT\Model\Payload\UserPayload;

final readonly class SelfHostedTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(private CurrentUserFishbowl $currentUserFishbowl)
    {
    }

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, false);

        return new JWTToken('api_client', 'api_client', 'meet.jitsi',
            $this->currentUserFishbowl->currentSlug($user),
            $userPayload
        );
    }
}

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

use App\JWT\CurrentUserFishbowl;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\UserPayload;
use Symfony\Component\Security\Core\User\UserInterface;

final class SelfHostedTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(private readonly CurrentUserFishbowl $currentUserFishbowl)
    {
    }

    public function generate(UserInterface $user): JWTToken
    {
        $userPayload = new UserPayload($user, false);

        return new JWTToken('api_client', 'api_client', 'meet.jitsi',
            $this->currentUserFishbowl->currentSlug($user),
            $userPayload
        );
    }
}

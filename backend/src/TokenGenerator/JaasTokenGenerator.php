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
use App\Model\Payload\FeaturesPayload;
use App\Model\Payload\HeaderPayload;
use App\Model\Payload\JaasJWTPayload;
use App\Model\Payload\JWTPayload;
use App\Model\Payload\UserPayload;
use App\Service\UserService;

final class JaasTokenGenerator implements TokenGeneratorInterface
{
    private string $appId;
    private string $apiKey;
    private UserService $userService;

    public function __construct(string $appId, string $apiKey, UserService $userService)
    {
        $this->appId = $appId;
        $this->apiKey = $apiKey;
        $this->userService = $userService;
    }

    public function generate(User $user): JWTPayload
    {
        $isUserHost = $this->userService->isUserHost($user);

        $userPayload = new UserPayload(
            $user->getFullName(),
            $user->getEmail(),
            $user->getPublicTwitterProfile(),
            $user->getPublicLinkedinProfile(),
            $isUserHost
        );

        return new JaasJWTPayload(
            $this->appId, $userPayload,
            new FeaturesPayload($isUserHost),
            new HeaderPayload($this->apiKey)
        );
    }
}

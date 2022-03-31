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
use App\Model\JWTToken;
use App\Model\Payload\FeaturesPayload;
use App\Model\Payload\HeaderPayload;
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

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, $this->userService->isUserHost($user));
        $userPayload->setAvatar('');
        $userPayload->setId($user->getId());

        $jwtToken = new JWTToken('chat', 'jitsi', $this->appId, '*', $userPayload, );

        $date = new \DateTimeImmutable('-10 seconds');
        $jwtToken->setNbf($date->getTimestamp());
        $jwtToken->setFeatures(new FeaturesPayload(false, false, false, false, false));
        $jwtToken->setHeaderPayload(new HeaderPayload($this->apiKey, 'RS256', 'JWT'));

        return $jwtToken;
    }
}

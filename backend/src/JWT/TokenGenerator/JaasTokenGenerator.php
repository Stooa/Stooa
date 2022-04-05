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
use App\JWT\HostValidator;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\FeaturesPayload;
use App\JWT\Model\Payload\HeaderPayload;
use App\JWT\Model\Payload\UserPayload;

final class JaasTokenGenerator implements TokenGeneratorInterface
{
    private string $appId;
    private string $apiKey;
    private HostValidator $requestUserIsHost;

    public function __construct(string $appId, string $apiKey, HostValidator $requestUserIsHost)
    {
        $this->appId = $appId;
        $this->apiKey = $apiKey;
        $this->requestUserIsHost = $requestUserIsHost;
    }

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, $this->requestUserIsHost->validateFromRequest($user), $user->getId(), '');

        return new JWTToken('chat', 'jitsi', $this->appId, '*', $userPayload,
            new \DateTimeImmutable('-10 seconds'),
            new HeaderPayload($this->apiKey, 'RS256', 'JWT'),
            new FeaturesPayload(false, false, false, false, false)
        );
    }
}

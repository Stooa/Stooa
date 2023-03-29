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
use App\Core\JWT\HostValidator;
use App\Core\JWT\Model\JWTToken;
use App\Core\JWT\Model\Payload\FeaturesPayload;
use App\Core\JWT\Model\Payload\HeaderPayload;
use App\Core\JWT\Model\Payload\UserPayload;

final class JaasTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(
        private readonly string $appId,
        private readonly string $apiKey,
        private readonly bool $transcriptionEnabled,
        private readonly HostValidator $hostValidator
    ) {
    }

    public function generate(User $user): JWTToken
    {
        $userPayload = new UserPayload($user, $this->hostValidator->validateFromRequest($user), $user->getId(), '');

        return new JWTToken('chat', 'jitsi', $this->appId, '*', $userPayload,
            new \DateTimeImmutable('-10 seconds'),
            new HeaderPayload($this->apiKey, 'RS256', 'JWT'),
            new FeaturesPayload(false, false, $this->transcriptionEnabled, false, false)
        );
    }
}

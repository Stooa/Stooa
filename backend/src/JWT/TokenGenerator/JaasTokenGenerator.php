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

use App\Entity\Foo1Interface;
use App\JWT\HostValidator;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\FeaturesPayload;
use App\JWT\Model\Payload\HeaderPayload;
use App\JWT\Model\Payload\UserPayload;
use Symfony\Component\Security\Core\User\UserInterface;

final class JaasTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(
        private readonly string $appId,
        private readonly string $apiKey,
        private readonly HostValidator $hostValidator
    ) {
    }

    public function generate(UserInterface $user): JWTToken
    {
        \assert($user instanceof Foo1Interface);

        $userPayload = new UserPayload($user, $this->hostValidator->validateFromRequest($user), $user->getId(), '');

        return new JWTToken('chat', 'jitsi', $this->appId, '*', $userPayload,
            new \DateTimeImmutable('-10 seconds'),
            new HeaderPayload($this->apiKey, 'RS256', 'JWT'),
            new FeaturesPayload(false, false, false, false, false)
        );
    }
}

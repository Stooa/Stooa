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

namespace App\Core\Service\Hubspot;

use App\Core\Entity\User;
use App\Core\Repository\UserRepository;
use HubSpot\Client\Auth\OAuth\Model\TokenResponseIF;
use HubSpot\Factory;
use Symfony\Bundle\SecurityBundle\Security;

class TokenHubspotService
{
    public function __construct(
        protected readonly Security $security,
        protected readonly UserRepository $userRepository,
        protected readonly string $redirectUrl,
        protected readonly string $clientId,
        protected readonly string $clientSecret
    ) {
    }

    public function createToken(string $code): ?string
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return null;
        }

        $tokens = Factory::create()->auth()->oAuth()->tokensApi()->create(
            'authorization_code',
            $code,
            $this->redirectUrl,
            $this->clientId,
            $this->clientSecret
        );

        if (!$tokens instanceof TokenResponseIF) {
            return null;
        }

        $this->saveRefreshToken($user, $tokens->getRefreshToken());

        return $tokens->getAccessToken();
    }

    public function refreshToken(): ?string
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user || null === $user->getHubspotRefreshToken()) {
            return null;
        }

        $tokens = Factory::create()->auth()->oAuth()->tokensApi()->create(
            'refresh_token',
            null,
            $this->redirectUrl,
            $this->clientId,
            $this->clientSecret,
            $user->getHubspotRefreshToken()
        );

        if (!$tokens instanceof TokenResponseIF) {
            return null;
        }

        $this->saveRefreshToken($user, $tokens->getRefreshToken());

        return $tokens->getAccessToken();
    }

    private function saveRefreshToken(User $user, string $refreshToken): void
    {
        $user->setHubspotRefreshToken($refreshToken);

        $this->userRepository->persist($user);
    }
}

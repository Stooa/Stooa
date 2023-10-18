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
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class HubspotTokenService
{
    public function __construct(
        protected readonly HttpClientInterface $client,
        protected readonly Security $security,
        protected readonly UserRepository $userRepository,
        protected readonly string $url,
        protected readonly string $redirectUrl,
        protected readonly string $clientId,
        protected readonly string $clientSecret
    ) {
    }

    public function token(string $code): ?string
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return null;
        }

        $result = $this->client->request('POST', 'https://api.hubapi.com/oauth/v1/token', [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded;charset=utf-8',
            ],
            'body' => [
                'grant_type' => 'authorization_code',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri' => $this->redirectUrl,
                'code' => $code,
            ],
        ]);

        $responseArray = $result->toArray();

        if (null === isset($responseArray['refresh_token']) || null === isset($responseArray['access_token'])) {
            return null;
        }

        $this->saveRefreshToken($user, $responseArray['refresh_token']);

        return $responseArray['access_token'];
    }

    private function saveRefreshToken(User $user, string $refreshToken): void
    {
        $user->setHubspotRefreshToken($refreshToken);

        $this->userRepository->persist($user);
    }
}

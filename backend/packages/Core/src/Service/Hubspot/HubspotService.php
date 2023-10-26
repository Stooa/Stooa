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
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use HubSpot\Delay;
use HubSpot\Discovery\Discovery;
use HubSpot\Factory;
use HubSpot\RetryMiddlewareFactory;

class HubspotService
{
    public function __construct(
        protected readonly TokenHubspotService $tokenHubspotService
    ) {
    }

    public function createHubspot(User $user): ?Discovery
    {
        $accessToken = $this->tokenHubspotService->accessToken($user);

        if (null === $accessToken) {
            return null;
        }
        $handlerStack = HandlerStack::create();
        $handlerStack->push(
            RetryMiddlewareFactory::createRateLimitMiddleware(
                Delay::getConstantDelayFunction()
            )
        );

        $handlerStack->push(
            RetryMiddlewareFactory::createInternalErrorsMiddleware(
                Delay::getExponentialDelayFunction(2)
            )
        );

        $client = new Client(['handler' => $handlerStack]);

        return Factory::createWithAccessToken($accessToken, $client);
    }
}

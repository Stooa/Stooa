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

namespace App\Core\JWT;

use App\Fishbowl\Service\FishbowlService;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

class CurrentUserRoom
{
    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly FishbowlService $fishbowlService
    ) {
    }

    /**
     * When a host has multiple fishbowls created we want to specify the room name via endpoint everytime we want to
     * refresh the token.
     */
    public function getRoom(UserInterface $user): ?string
    {
        $currentRequest = $this->requestStack->getCurrentRequest();

        if (null !== $currentRequest) {
            try {
                $requestArray = $currentRequest->toArray();
            } catch (JsonException) {
                return null;
            }

            if (!empty($requestArray['room']) && \is_string($requestArray['room'])) {
                return $requestArray['room'];
            }
        }

        return null;
    }
}

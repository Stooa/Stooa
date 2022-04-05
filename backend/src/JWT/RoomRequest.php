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

namespace App\JWT;

use App\Service\FishbowlService;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

final class RoomRequest
{
    private RequestStack $requestStack;
    private FishbowlService $fishbowlService;

    public function __construct(RequestStack $requestStack, FishbowlService $fishbowlService)
    {
        $this->requestStack = $requestStack;
        $this->fishbowlService = $fishbowlService;
    }

    /**
     * When a host has multiple fishbowls created we want to specify the room name via endpoint everytime we want to
     * refresh the token.
     */
    public function getRoomFromRequest(UserInterface $user): ?string
    {
        $currentRequest = $this->requestStack->getCurrentRequest();

        if (null !== $currentRequest) {
            $slug = $currentRequest->request->get('room');

            if (null !== $slug && \is_string($slug) && $this->fishbowlService->canFishbowlStart($slug, $user)) {
                return $slug;
            }
        }

        return null;
    }
}

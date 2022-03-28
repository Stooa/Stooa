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

namespace App\Service;

use App\Entity\User;
use App\Repository\FishbowlRepository;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

class UserService
{
    private RequestStack $requestStack;
    private FishbowlService $fishbowlService;
    private FishbowlRepository $fishbowlRepository;

    public function __construct(RequestStack $requestStack, FishbowlService $fishbowlService, FishbowlRepository $fishbowlRepository)
    {
        $this->requestStack = $requestStack;
        $this->fishbowlService = $fishbowlService;
        $this->fishbowlRepository = $fishbowlRepository;
    }

    public function isUserHost(UserInterface $user): bool
    {
        $slug = $this->getRoomFromRequest($user);

        if (null === $slug) {
            return false;
        }

        Assert::isInstanceOf($user, User::class);

        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null === $fishbowl) {
            return false;
        }

        return $fishbowl->getHost() === $user;
    }

    public function buildRoomPermissionByUser(UserInterface $user): string
    {
        $slug = $this->getRoomFromRequest($user);

        if (null !== $slug) {
            return $slug;
        }

        Assert::isInstanceOf($user, User::class);

        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }

    /**
     * When a host has multiple fishbowls created we want to specify the room name via endpoint everytime we want to
     * refresh the token.
     */
    private function getRoomFromRequest(UserInterface $user): ?string
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

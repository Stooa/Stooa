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

use App\Entity\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

final class UserRoomRequest
{
    private RoomRequest $roomRequest;

    public function __construct(RoomRequest $roomRequest)
    {
        $this->roomRequest = $roomRequest;
    }

    public function buildRoomPermissionByUser(UserInterface $user): string
    {
        $slug = $this->roomRequest->getRoomFromRequest($user);

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
}

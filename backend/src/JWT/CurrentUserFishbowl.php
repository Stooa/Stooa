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

class CurrentUserFishbowl
{
    public function __construct(private readonly CurrentUserRoom $currentUserRoom)
    {
    }

    public function currentSlug(UserInterface $user): string
    {
        $slug = $this->currentUserRoom->getRoom($user);

        if (null !== $slug) {
            return $slug;
        }

        if (!$user instanceof User) {
            return '';
        }

        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }
}

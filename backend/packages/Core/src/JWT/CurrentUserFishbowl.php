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

use App\Core\Entity\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

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

        Assert::isInstanceOf($user, User::class);

        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }
}

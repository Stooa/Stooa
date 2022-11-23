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
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

class HostValidator
{
    public function __construct(
        private readonly FishbowlRepository $fishbowlRepository,
        private readonly CurrentUserRoom $currentUserRoom
    ) {
    }

    public function validateFromRequest(UserInterface $user): bool
    {
        $slug = $this->currentUserRoom->getRoom($user);

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
}

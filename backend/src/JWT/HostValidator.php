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
use App\Repository\FishbowlRepository;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

class HostValidator
{
    private FishbowlRepository $fishbowlRepository;
    private CurrentUserRoom $roomRequest;

    public function __construct(FishbowlRepository $fishbowlRepository, CurrentUserRoom $roomRequest)
    {
        $this->fishbowlRepository = $fishbowlRepository;
        $this->roomRequest = $roomRequest;
    }

    public function validateFromRequest(UserInterface $user): bool
    {
        $slug = $this->roomRequest->getRoom($user);

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

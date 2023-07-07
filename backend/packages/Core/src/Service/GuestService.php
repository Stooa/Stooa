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

namespace App\Core\Service;

use App\Core\Entity\Guest;
use App\Core\Repository\GuestRepository;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\Request;

class GuestService
{
    public function __construct(
        private readonly GuestRepository $guestRepository,
    ) {
    }

    public function getGuest(Request $request): ?Guest
    {
        try {
            $requestArray = $request->toArray();
        } catch (JsonException) {
            return null;
        }

        if (!empty($requestArray['guestId'])) {
            return $this->guestRepository->find($requestArray['guestId']);
        }

        return null;
    }
}

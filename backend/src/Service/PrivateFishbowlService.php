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

use App\Encryption\HalitePasswordEncryption;
use App\Entity\Fishbowl;
use App\Repository\FishbowlRepository;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;

class PrivateFishbowlService
{
    public function __construct(
        private readonly HalitePasswordEncryption $halitePasswordEncryption,
        private readonly Security $security,
        private readonly RequestStack $requestStack,
        private readonly FishbowlRepository $fishbowlRepository,
    ) {
    }

    public function isPasswordEqual(string $slug): bool
    {
        $request = $this->requestStack->getCurrentRequest();

        if (null === $request) {
            return false;
        }

        $password = $request->request->get('password');

        if (null === $password) {
            return false;
        }

        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null === $fishbowl) {
            return false;
        }

        return $fishbowl->getIsPrivate() && $password === $this->halitePasswordEncryption->decrypt($fishbowl->getPassword());
    }

    public function decryptPrivatePassword(Fishbowl $fishbowl): Fishbowl
    {
        if (false === $fishbowl->getIsPrivate()) {
            return $fishbowl;
        }

        if ($this->security->getUser() === $fishbowl->getHost()) {
            $fishbowl->setPlainPassword($this->halitePasswordEncryption->decrypt($fishbowl->getPassword()));
        }

        return $fishbowl;
    }
}

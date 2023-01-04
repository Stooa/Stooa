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

namespace App\Fishbowl\Service;

use App\Core\Encryption\HalitePasswordEncryption;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

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
        $currentRequest = $this->requestStack->getCurrentRequest();

        if (null === $currentRequest) {
            return false;
        }

        $password = $currentRequest->request->get('password');

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

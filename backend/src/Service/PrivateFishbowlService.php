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
use Symfony\Component\Security\Core\Security;

class PrivateFishbowlService
{
    public function __construct(
        private readonly HalitePasswordEncryption $halitePasswordEncryption,
        private readonly Security $security
    ) {
    }

    public function decryptPassword(Fishbowl $fishbowl): Fishbowl
    {
        if ($fishbowl->getIsPrivate() && $this->security->getUser() === $fishbowl->getHost()) {
            $fishbowl->setPassword($this->halitePasswordEncryption->decrypt($fishbowl->getPassword()));
        } else {
            $fishbowl->setPassword(null);
        }

        return $fishbowl;
    }
}

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

namespace App\DataFixtures;

use App\Entity\SonataUserUser;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class DefaultFixtures extends Fixture
{
    /**
     * This is the default admin password for the staging environment.
     * The password is "admin", and it is only for testing purposes.
     */
    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';

    public function load(ObjectManager $manager): void
    {
        $user = new SonataUserUser();
        $user->setUsername('admin');
        $user->setEmail('admin@localhost');
        $user->setPassword(static::ADMIN_PASSWORD);
        $user->setEnabled(true);
        $user->setSuperAdmin(true);

        $manager->persist($user);
        $manager->flush();
    }
}

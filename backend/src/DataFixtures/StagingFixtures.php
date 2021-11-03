<?php

namespace App\DataFixtures;

use App\Entity\SonataUserUser;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class StagingFixtures extends Fixture
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

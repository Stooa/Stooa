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

use App\Entity\Fishbowl;
use App\Fixtures\FishbowlFactory;
use App\Fixtures\SonataUserUserFactory;
use App\Fixtures\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use FOS\UserBundle\Model\User;

class DefaultFixtures extends Fixture
{
    /**
     * This is the default admin password for the staging environment.
     * The password is "admin", and it is only for testing purposes.
     */
    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';

    public function load(ObjectManager $manager): void
    {
        SonataUserUserFactory::createOne([
            'username' => 'admin',
            'email' => 'admin@localhost',
            'password' => self::ADMIN_PASSWORD,
            'enabled' => true,
            'roles' => [User::ROLE_SUPER_ADMIN],
        ]);

        UserFactory::createOne([
           'email' => 'user@stooa.com',
           'password' => self::ADMIN_PASSWORD,
            'locale' => 'es',
            'active' => true,
            'fishbowls' => [],
            'createdAt' => new \DateTime(),
        ]);

        $now = new \DateTime();
        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'locale' => 'es',
            'duration' => $now->add(new \DateInterval('PT1H')),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
        ])->object();

        UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'locale' => 'es',
            'active' => true,
            'fishbowls' => [$fishbowl],
            'createdAt' => new \DateTime(),
        ]);
    }
}

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

namespace App\Core\DataFixtures;

use App\Core\Factory\GuestFactory;
use App\Core\Factory\ParticipantFactory;
use App\Core\Factory\SonataUserUserFactory;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FeedbackFactory;
use App\Fishbowl\Factory\FishbowlFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Sonata\UserBundle\Model\UserInterface;

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
            'roles' => [UserInterface::ROLE_SUPER_ADMIN],
        ]);

        $host = UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
            'createdAt' => new \DateTime(),
            'privacyPolicy' => true,
        ])->object();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'test-me-fishbowl',
            'host' => $host,
        ])->object();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime('+ 1 hour'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $host,
        ])->object();

        $user = UserFactory::createOne([
            'email' => 'user@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
            'privacyPolicy' => true,
        ])->object();

        $fishbowl = FishbowlFactory::createOne([
            'name' => 'Fishbowl with feedbacks',
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_FINISHED,
            'slug' => 'fishbowl-with-feedbacks',
            'host' => $host,
        ])->object();

        FeedbackFactory::createOne([
            'fishbowl' => $fishbowl,
            'participant' => ParticipantFactory::createOne([
                'user' => $user,
            ]),
        ]);

        FeedbackFactory::createMany(10, [
            'fishbowl' => $fishbowl,
            'participant' => ParticipantFactory::createOne([
                'guest' => GuestFactory::createOne(),
            ]),
        ]);

        FishbowlFactory::createMany(4, [
            'startDateTime' => new \DateTime('yesterday'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $host,
        ]);

        FishbowlFactory::createMany(5, [
            'startDateTime' => new \DateTime('yesterday'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_FINISHED,
            'host' => $host,
        ]);
    }
}

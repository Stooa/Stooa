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

namespace App\Integration;

use App\Entity\Fishbowl;
use App\Entity\Guest;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\ParticipantRepository;
use Runroom\Testing\TestCase\DoctrineTestCase;

class ParticipantRepositoryTest extends DoctrineTestCase
{
    private ParticipantRepository $participantRepository;

    /**
     * @psalm-suppress InternalMethod
     * @psalm-suppress PropertyTypeCoercion
     *
     * $container->get() is considered internal and is not well detected by Psalm,
     * this will change once we migrate to Foundry and remove our DoctrineTestCase
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->participantRepository = self::$container->get(ParticipantRepository::class);
    }

    /** @test */
    public function itFindsParticipantInFishbowlByUser(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setId('e5bebe22-4d79-498e-88eb-0bc84f71ae45');

        $user = new User();
        $user->setId('cb81a530-5b01-4832-b5c4-01984431fac2');

        $participant = $this->participantRepository->findUserInFishbowl($fishbowl, $user);
        $this->assertInstanceOf(Participant::class, $participant);
    }

    /** @test */
    public function itFindsParticipantInFishbowlByGuest(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setId('e5bebe22-4d79-498e-88eb-0bc84f71ae45');

        $guest = new Guest();
        $guest->setId('98d901d7-44b2-4b03-9c86-9005ce95ee29');

        $participant = $this->participantRepository->findGuestInFishbowl($fishbowl, $guest);
        $this->assertInstanceOf(Participant::class, $participant);
    }

    protected function getDataFixtures(): array
    {
        return ['participant.yaml'];
    }
}

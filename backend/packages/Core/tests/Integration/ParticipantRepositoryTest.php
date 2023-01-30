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

namespace App\Core\Tests\Integration;

use App\Core\Entity\Participant;
use App\Core\Factory\GuestFactory;
use App\Core\Factory\ParticipantFactory;
use App\Core\Factory\UserFactory;
use App\Core\Repository\ParticipantRepository;
use App\Fishbowl\Factory\FishbowlFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ParticipantRepositoryTest extends KernelTestCase
{
    use Factories;
    use ResetDatabase;

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
        parent::bootKernel();

        $this->participantRepository = static::getContainer()->get(ParticipantRepository::class);
    }

    /** @test */
    public function itFindsParticipantInFishbowlByUser(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $user = UserFactory::createOne()->object();

        ParticipantFactory::createOne([
           'fishbowl' => $fishbowl,
           'user' => $user,
        ]);

        $participant = $this->participantRepository->findUserInFishbowl($fishbowl, $user);
        $this->assertInstanceOf(Participant::class, $participant);
    }

    /** @test */
    public function itFindsParticipantInFishbowlByGuest(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $guest = GuestFactory::createOne()->object();

        ParticipantFactory::createOne([
            'fishbowl' => $fishbowl,
            'guest' => $guest,
        ]);

        $participant = $this->participantRepository->findGuestInFishbowl($fishbowl, $guest);
        $this->assertInstanceOf(Participant::class, $participant);
    }
}

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

namespace App\Fishbowl\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;

use function Zenstruck\Foundry\faker;

use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FishbowlDashboardListFunctionalTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';
    private User $host;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();
    }

    /** @test */
    public function itGetsFishbowlsWithFeedbacks(): void
    {
        $hostToken = $this->logIn($this->host);

        $this->create50PastFishbowls();

        $this->create50FinishedFishbowls();

        $now = new \DateTime();

        $oneHourAgo = (new \DateTimeImmutable())->modify('-1 hour');

        $response = static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'or[startDateTime][after]' => $oneHourAgo->format('Y-m-d H:i:s'),
                'or[currentStatus]' => Fishbowl::STATUS_FINISHED,
            ],
            'auth_bearer' => $hostToken,
        ]);

        $responseArray = $response->toArray();

        $this->assertResponseIsSuccessful();

        $this->assertJsonContains([
            '@context' => '/contexts/Fishbowl',
            '@id' => '/fishbowls',
            'hydra:totalItems' => 100,
        ]);

//        $this->assertSame('fishbowl name', $responseArray['hydra:member'][0]['name']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['@id']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['@type']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['satisfaction']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['comment']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['email']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['origin']);
//        $this->assertNotEmpty($responseArray['hydra:member'][0]['feedbacks'][0]['participant']);

        $this->assertMatchesResourceCollectionJsonSchema(Fishbowl::class);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }

//    private function createFishbowlWithFeedbacks(): void
//    {
//        $user = UserFactory::createOne([
//            'email' => 'user@stooa.com',
//        ]);
//
//        $fishbowl = FishbowlFactory::createOne([
//            'name' => 'fishbowl name',
//            'startDateTime' => new \DateTime('+ 30 minutes'),
//            'timezone' => 'Europe/Madrid',
//            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
//            'currentStatus' => Fishbowl::STATUS_FINISHED,
//            'host' => $this->host,
//        ])->object();
//
//        FeedbackFactory::createMany(2, [
//            'fishbowl' => $fishbowl,
//            'participant' => ParticipantFactory::createOne([
//                'user' => $user,
//            ]),
//        ]);
//    }

    private function create50PastFishbowls(): void
    {
        FishbowlFactory::createMany(50, [
            'name' => faker()->words(3, true),
            'description' => faker()->sentence(),
            'startDateTime' => new \DateTime('- 2 day'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_RUNNING,
            'host' => $this->host,
        ]);
    }

    private function create50FinishedFishbowls(): void
    {
        FishbowlFactory::createMany(50, [
            'name' => faker()->words(3, true),
            'description' => faker()->sentence(),
            'startDateTime' => new \DateTime('+ 30 minutes'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_FINISHED,
            'host' => $this->host,
        ]);
    }
}

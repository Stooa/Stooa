<?php

namespace App\Tests\Functional;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Fishbowl;
use App\Entity\User;
use App\Factory\FishbowlFactory;
use App\Factory\UserFactory;
use Faker\Provider\DateTime;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FishbowlListFunctionalTest extends ApiTestCase
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
    public function itGetsHostsOnlyCreatedFishbowlsCorrectly(): void
    {
        FishbowlFactory::createOne([
            'host' => $this->host
        ]);

        FishbowlFactory::createOne([
            'currentStatus' => Fishbowl::STATUS_FINISHED
        ]);

        FishbowlFactory::createOne();

        $hostToken = $this->logIn($this->host);

        static::createClient()->request('GET', '/fishbowls', [
            'auth_bearer' => $hostToken,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Fishbowl',
            '@id' => '/fishbowls',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 1,
        ]);

        $this->assertMatchesResourceCollectionJsonSchema(Fishbowl::class);
    }

    /** @test */
    public function itGetsFishbowlsFilteredByDate(): void
    {
        $timeZone = 'Europe/Madrid';

        $now = new \DateTime();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime('+ 30 minutes', new \DateTimeZone($timeZone)),
            'timezone' => $timeZone,
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host
        ])->object();

        $hostToken = $this->logIn($this->host);

        static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'estimatedDateToFinish[before]' => $now->format(\DateTimeInterface::ISO8601)
            ],
            'auth_bearer' => $hostToken,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Fishbowl',
            '@id' => '/fishbowls',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 0,
        ]);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

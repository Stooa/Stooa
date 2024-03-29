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
        self::bootKernel();

        $this->host = UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();
    }

    /** @test */
    public function itDoesntGetAnyFishbowlWhenUserDoesntCreateAny(): void
    {
        FishbowlFactory::createOne([
            'currentStatus' => Fishbowl::STATUS_FINISHED,
        ]);

        FishbowlFactory::createOne();

        $hostToken = $this->logIn($this->host);

        $fiveHoursAgo = (new \DateTimeImmutable())->modify('-5 hour');

        $response = static::createClient()->request('GET', '/fishbowls', [
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

        $this->assertMatchesResourceCollectionJsonSchema(Fishbowl::class);
    }

    /** @test */
    public function itGetsFishbowlsFilteredByAfterDate(): void
    {
        $now = new \DateTime();

        $fishbowl = FishbowlFactory::createOne([
            'name' => 'fishbowl name',
            'startDateTime' => new \DateTime('+ 30 minutes'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $hostToken = $this->logIn($this->host);

        $fiveHoursAgo = (new \DateTimeImmutable())->modify('-5 hour');

        $response = static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'currentStatus[0]' => Fishbowl::STATUS_INTRODUCTION,
                'currentStatus[1]' => Fishbowl::STATUS_RUNNING,
                'currentStatus[2]' => Fishbowl::STATUS_NOT_STARTED,
                'startDateTime[after]' => $fiveHoursAgo->format('Y-m-d H:i:s'),
                'finishDateTime[after]' => $now->format('Y-m-d H:i:s'),
            ],
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

        $this->assertSame($fishbowl->getName(), $response->toArray()['hydra:member'][0]['name']);
    }

    /** @test */
    public function itGetsPasswordInPrivateFishbowls(): void
    {
        $now = new \DateTime();

        $fishbowl = FishbowlFactory::createOne([
            'name' => 'fishbowl name',
            'startDateTime' => new \DateTime('+ 30 minutes'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
            'isPrivate' => true,
            'plainPassword' => 'password',
        ])->object();

        $hostToken = $this->logIn($this->host);

        $fiveHoursAgo = (new \DateTimeImmutable())->modify('-5 hour');

        $response = static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'currentStatus[0]' => Fishbowl::STATUS_INTRODUCTION,
                'currentStatus[1]' => Fishbowl::STATUS_RUNNING,
                'currentStatus[2]' => Fishbowl::STATUS_NOT_STARTED,
                'startDateTime[after]' => $fiveHoursAgo->format('Y-m-d H:i:s'),
                'finishDateTime[after]' => $now->format('Y-m-d H:i:s'),
            ],
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

        $this->assertSame($fishbowl->getName(), $response->toArray()['hydra:member'][0]['name']);
        $this->assertSame($fishbowl->getPlainPassword(), $response->toArray()['hydra:member'][0]['plainPassword']);
    }

    /** @test */
    public function itGetsFishbowlsFilteredByBeforeDate(): void
    {
        $now = new \DateTime();

        FishbowlFactory::createOne([
            'name' => 'fishbowl name',
            'startDateTime' => new \DateTime('yesterday'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $hostToken = $this->logIn($this->host);

        $fiveHoursAgo = (new \DateTimeImmutable())->modify('-5 hour');

        static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'currentStatus[0]' => Fishbowl::STATUS_INTRODUCTION,
                'currentStatus[1]' => Fishbowl::STATUS_RUNNING,
                'currentStatus[2]' => Fishbowl::STATUS_NOT_STARTED,
                'startDateTime[after]' => $fiveHoursAgo->format('Y-m-d H:i:s'),
                'finishDateTime[before]' => $now->format('Y-m-d H:i:s'),
                'order[startDateTime]' => 'asc',
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

    /** @test */
    public function itGetsFishbowlsOrderedCorrectly(): void
    {
        $third = FishbowlFactory::createOne([
            'name' => 'first',
            'startDateTime' => new \DateTime('tomorrow'),
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $second = FishbowlFactory::createOne([
            'name' => 'second',
            'startDateTime' => new \DateTime('now'),
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        FishbowlFactory::createOne([
            'name' => 'second',
            'startDateTime' => new \DateTime('now'),
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_FINISHED,
            'host' => $this->host,
        ])->object();

        FishbowlFactory::createOne([
            'name' => 'third',
            'startDateTime' => new \DateTime('yesterday'),
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $hostToken = $this->logIn($this->host);

        $fiveHoursAgo = (new \DateTimeImmutable())->modify('-5 hour');

        $response = static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'currentStatus[0]' => Fishbowl::STATUS_INTRODUCTION,
                'currentStatus[1]' => Fishbowl::STATUS_RUNNING,
                'currentStatus[2]' => Fishbowl::STATUS_NOT_STARTED,
                'startDateTime[after]' => $fiveHoursAgo->format('Y-m-d H:i:s'),
                'order[startDateTime]' => 'asc',
            ],
            'auth_bearer' => $hostToken,
        ]);

        $this->assertJsonContains([
            '@context' => '/contexts/Fishbowl',
            '@id' => '/fishbowls',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);

        $this->assertSame($second->getName(), $response->toArray()['hydra:member'][0]['name']);
        $this->assertSame($third->getName(), $response->toArray()['hydra:member'][1]['name']);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

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

namespace App\Tests\Functional;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Fishbowl;
use App\Entity\User;
use App\Factory\FishbowlFactory;
use App\Factory\UserFactory;
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
            'host' => $this->host,
        ]);

        FishbowlFactory::createOne([
            'currentStatus' => Fishbowl::STATUS_FINISHED,
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
    public function itGetsFishbowlsFilteredByAfterDate(): void
    {
        $now = new \DateTime();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime('+ 30 minutes'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $hostToken = $this->logIn($this->host);

        static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'estimatedDateToFinish[after]' => $now->format(\DateTimeInterface::ISO8601),
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
    }

    /** @test */
    public function itGetsFishbowlsFilteredByBeforeDate(): void
    {
        $now = new \DateTime();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime('+ 30 minutes'),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '30:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'host' => $this->host,
        ])->object();

        $hostToken = $this->logIn($this->host);

        static::createClient()->request('GET', '/fishbowls', [
            'query' => [
                'estimatedDateToFinish[before]' => $now->format(\DateTimeInterface::ISO8601),
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

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

namespace Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;

use App\Core\Model\Event;
use App\WorldCafe\Factory\WorldCafeFactory;

use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class StatusWorldCafeFunctionalTest extends ApiTestCase
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
    public function itGetsWorldCafeStatus(): void
    {
        $hostToken = $this->logIn($this->host);

        $worldCafe = WorldCafeFactory::createOne([
            'locale' => 'es',
            'slug' => 'world-cafe-slug',
            'currentStatus' => Event::STATUS_INTRODUCTION,
        ])->object();

        $response = static::createClient()->request('GET', '/es/world-cafe-status/' . $worldCafe->getSlug(), [
            'auth_bearer' => $hostToken,
        ]);

        $responseArray = $response->toArray();

        $this->assertSame(strtoupper($worldCafe->getCurrentStatus()), $responseArray['status']);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}
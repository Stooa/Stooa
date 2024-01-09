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

namespace App\Fishbowl\Tests\Functional\Attendee;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Factory\AttendeeFactory;
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class GetAttendeeFunctionalTest extends ApiTestCase
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
    public function itGetsAttendee(): void
    {
        $hostToken = $this->logIn($this->host);

        $feedback = AttendeeFactory::createOne()->object();

        $response = $this->getFeedback($feedback->getId(), $hostToken);

        $responseArray = $response->toArray();

        $this->assertSame('/attendees/' . $feedback->getId(), $responseArray['@id']);
        $this->assertSame('Attendee', $responseArray['@type']);
    }

    private function getFeedback(?UuidInterface $attendeeId, string $token): ResponseInterface
    {
        return static::createClient()->request('GET', '/attendees/' . $attendeeId, [
            'auth_bearer' => $token,
        ]);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

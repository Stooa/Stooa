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
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CreateAttendeeFunctionalTest extends ApiTestCase
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
    public function itCreatesAttendee(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $token = $this->logIn($this->host);

        $response = $this->callGQLWithToken(
            $token,
            $fishbowl,
        );

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']['createAttendee']['attendee']['id']);
        $this->assertSame('Name Test', $graphqlResponse['data']['createAttendee']['attendee']['name']);

    }

    private function callGQLWithToken(string $token, Fishbowl $fishbowl): ResponseInterface
    {
        $createMutation = <<<GQL
            mutation CreateAttendee(\$input: createAttendeeInput!) {
                createAttendee(input: \$input) {
                    attendee {
                        id
                        name
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $createMutation,
                'variables' => [
                    'input' => [
                        'fishbowl' => '/fishbowls/' . $fishbowl->getId(),
                        'name' => 'Name Test',
                        'email' => 'email@test.com',
                        'timezone' => 'Europe/Madrid',
                    ],
                ],
            ],
            'auth_bearer' => $token,
        ]);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

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

namespace App\WorldCafe\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\WorldCafe\Entity\WorldCafe;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CreateWorldCafeFunctionalTest extends ApiTestCase
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
    public function itCreatesWorldCafe(): void
    {
        $token = $this->logIn($this->host);

        $newWorldCafe = new WorldCafe();
        $newWorldCafe->setName('New World Café name');

        $response = $this->callCreateMutation($token, $newWorldCafe);

        $graphqlResponse = $response->toArray();
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($newWorldCafe->getName(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['name']);
    }

    private function callCreateMutation(?string $token, WorldCafe $worldCafe): ResponseInterface
    {
        $createMutation = <<<GQL
            mutation CreateWorldCafe(\$input: createWorldCafeInput!) {
                createWorldCafe(input: \$input) {
                     worldCafe {
                        id
                        name
                        slug
                        description
                        locale
                        startDateTimeTz
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $createMutation,
                'variables' => [
                    'input' => [
                        'name' => $worldCafe->getName(),
                        'description' => 'description',
                        'locale' => 'en',
                        'startDateTime' => '2023-12-25T18:48:58.091Z',
                        'timezone' => 'Europe/Madrid',
                        'hasExtraRoundTime' => true,
                        'questions' => [
                            [
                                'name' => 'Question name',
                                'description' => 'Question description',
                            ],
                        ],
//                        'questions'  => [
//                            ['id' => '/questions/93530986-bd80-4d99-82d9-11df9bc64daa']
//                        ]
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

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
        $newWorldCafe->setDescription('Description');
        $newWorldCafe->setLocale('en');
        $newWorldCafe->setHasExtraRoundTime(true);
        $newWorldCafe->setRoundMinutes(15);

        $response = $this->callCreateMutation($token, $newWorldCafe);

        $graphqlResponse = $response->toArray();

        $this->assertNotEmpty($graphqlResponse['data']);
        $this->assertSame($newWorldCafe->getName(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['name']);
        $this->assertSame($newWorldCafe->getDescription(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['description']);
        $this->assertSame($newWorldCafe->getLocale(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['locale']);
        $this->assertSame($newWorldCafe->getHasExtraRoundTime(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['hasExtraRoundTime']);
        $this->assertSame($newWorldCafe->getRoundMinutes(), $graphqlResponse['data']['createWorldCafe']['worldCafe']['roundMinutes']);
        $this->assertNotEmpty($graphqlResponse['data']['createWorldCafe']['worldCafe']['slug']);
        $this->assertNotEmpty($graphqlResponse['data']['createWorldCafe']['worldCafe']['id']);
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
                        hasExtraRoundTime
                        roundMinutes
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
                        'description' => $worldCafe->getDescription(),
                        'locale' => $worldCafe->getLocale(),
                        'startDateTime' => '2023-12-25T18:48:58.091Z',
                        'timezone' => 'Europe/Madrid',
                        'hasExtraRoundTime' => $worldCafe->getHasExtraRoundTime(),
                        'roundMinutes' => $worldCafe->getRoundMinutes(),
                        'questions' => [
                            [
                                'name' => 'Question name',
                                'description' => 'Question description',
                            ],
                        ],
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

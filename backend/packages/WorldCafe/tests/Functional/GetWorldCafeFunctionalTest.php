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
use App\WorldCafe\Factory\WorldCafeFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class GetWorldCafeFunctionalTest extends ApiTestCase
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
    public function itGetsWorldCafeBySlug(): void
    {
        $hostToken = $this->logIn($this->host);

        $newWorldCafe = WorldCafeFactory::createOne([
            'slug' => 'world-cafe-slug',
        ])->object();

        $response = $this->callGQLWithToken('world-cafe-slug', $hostToken);

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($newWorldCafe->getName(), $graphqlResponse['data']['bySlugQueryWorldCafe']['name']);
        $this->assertSame($newWorldCafe->getDescription(), $graphqlResponse['data']['bySlugQueryWorldCafe']['description']);
        $this->assertSame($newWorldCafe->getLocale(), $graphqlResponse['data']['bySlugQueryWorldCafe']['locale']);
        $this->assertSame($newWorldCafe->getHasExtraRoundTime(), $graphqlResponse['data']['bySlugQueryWorldCafe']['hasExtraRoundTime']);
        $this->assertSame($newWorldCafe->getRoundMinutes(), $graphqlResponse['data']['bySlugQueryWorldCafe']['roundMinutes']);
        $fistQuestion = $newWorldCafe->getQuestions()->first();
        if (false !== $fistQuestion) {
            $this->assertSame($fistQuestion->getTitle(), $graphqlResponse['data']['bySlugQueryWorldCafe']['questions'][0]['title']);
            $this->assertSame($fistQuestion->getDescription(), $graphqlResponse['data']['bySlugQueryWorldCafe']['questions'][0]['description']);
            $this->assertSame($fistQuestion->getPosition(), $graphqlResponse['data']['bySlugQueryWorldCafe']['questions'][0]['position']);
        }
    }

    private function callGQLWithToken(?string $slug, string $token): ResponseInterface
    {
        $bySlugQuery = <<<GQL
            query BySlugQueryWorldCafe(\$slug: String!) {
                bySlugQueryWorldCafe(slug: \$slug) {
                        id
                        name
                        slug
                        description
                        locale
                        startDateTimeTz
                        hasExtraRoundTime
                        roundMinutes
                        questions {
                            id
                            title
                            description
                            position
                        }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $bySlugQuery,
                'variables' => [
                    'slug' => $slug,
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

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

        WorldCafeFactory::createOne([
            'name' => 'World Cafe name',
            'description' => 'World Cafe description',
            'locale' => 'en',
            'slug' => 'world-cafe-slug',
        ]);
    }

    /** @test */
    public function itGetsWorldCafeBySlug(): void
    {
        $hostToken = $this->logIn($this->host);

        $response = $this->callGQLWithToken('world-cafe-slug', $hostToken);

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($graphqlResponse['data']['bySlugQueryWorldCafe']['name'], 'World Cafe name');
        $this->assertSame($graphqlResponse['data']['bySlugQueryWorldCafe']['slug'], 'world-cafe-slug');
        $this->assertSame($graphqlResponse['data']['bySlugQueryWorldCafe']['locale'], 'en');
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

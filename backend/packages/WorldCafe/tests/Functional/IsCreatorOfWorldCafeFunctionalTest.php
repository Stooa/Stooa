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
use App\WorldCafe\Factory\WorldCafeFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class IsCreatorOfWorldCafeFunctionalTest extends ApiTestCase
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
    public function itGetsIsCreatorOfWorldCafeBySlug(): void
    {
        $hostToken = $this->logIn($this->host);

        $newWorldCafe = WorldCafeFactory::createOne([
            'slug' => 'world-cafe-slug',
            'host' => $this->host,
        ])->object();

        $response = $this->callGQLWithToken('world-cafe-slug', $hostToken);

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($newWorldCafe->getCurrentStatus(), $graphqlResponse['data']['isCreatorOfWorldCafe']['currentStatus']);
    }

    private function callGQLWithToken(?string $slug, string $token): ResponseInterface
    {

        $bySlugQuery = <<<GQL
            query IsCreatorOfWorldCafe(\$slug: String!) {
                isCreatorOfWorldCafe(slug: \$slug) {
                    currentStatus
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

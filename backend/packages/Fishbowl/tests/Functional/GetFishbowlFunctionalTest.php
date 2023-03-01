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
use App\Fishbowl\Factory\FishbowlFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class GetFishbowlFunctionalTest extends ApiTestCase
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

        FishbowlFactory::createOne([
            'name' => 'fishbowl name',
            'description' => 'fishbowl description',
            'locale' => 'en',
            'slug' => 'fishbowl-slug',
        ]);
    }

    /** @test */
    public function itGetsErrorWhenCallingWithNullValue(): void
    {
        $hostToken = $this->logIn($this->host);

        $response = $this->callGQLWithToken(null, $hostToken);

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('errors', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['errors']);
        $this->assertSame($graphqlResponse['errors'][0]['message'],
            'Variable "$slug" of non-null type "String!" must not be null.'
        );
    }

    /** @test */
    public function itGetsNullWhenCallingWithWrongSlug(): void
    {
        $hostToken = $this->logIn($this->host);

        $response = $this->callGQLWithToken('wrongSlug', $hostToken);

        $graphqlResponse = $response->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);
        $this->assertSame($graphqlResponse['data']['bySlugQueryFishbowl'], null);
    }

    /** @test */
    public function itGetsFishbowlBySlug(): void
    {
        $hostToken = $this->logIn($this->host);

        $response = $this->callGQLWithToken('fishbowl-slug', $hostToken);

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($graphqlResponse['data']['bySlugQueryFishbowl']['name'], 'fishbowl name');
        $this->assertSame($graphqlResponse['data']['bySlugQueryFishbowl']['description'], 'fishbowl description');
        $this->assertSame($graphqlResponse['data']['bySlugQueryFishbowl']['slug'], 'fishbowl-slug');
        $this->assertSame($graphqlResponse['data']['bySlugQueryFishbowl']['locale'], 'en');
    }

    private function callGQLWithToken(?string $slug, string $token): ResponseInterface
    {
        $bySlugQuery = <<<GQL
            query BySlugQueryFishbowl(\$slug: String!) {
                bySlugQueryFishbowl(slug: \$slug) {
                    id
                    name
                    slug
                    description
                    locale
                    startDateTimeTz
                    endDateTimeTz
                    durationFormatted
                    slug
                    isFishbowlNow
                    hasIntroduction
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

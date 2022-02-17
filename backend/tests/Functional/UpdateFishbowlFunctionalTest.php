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
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UpdateFishbowlFunctionalTest extends ApiTestCase
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
    public function itGetsAccessDeniedWhenUpdatingNotHostingFishbowl(): void
    {
        $fishbowlWithoutHost = FishbowlFactory::createOne()->object();
        $hostToken = $this->logIn($this->host);

        $newFishbowl = FishbowlFactory::createOne([
           'name' => 'New fishbowl name',
        ])->object();

        $response = $this->callGQLWithToken($fishbowlWithoutHost->getId(), $hostToken, $newFishbowl);
        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('errors', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['errors']);
        $this->assertSame($graphqlResponse['errors'][0]['debugMessage'], 'Access Denied.');
    }

    private function callGQLWithToken(?UuidInterface $id, string $token, Fishbowl $newFishbowl): ResponseInterface
    {
        $updateMutation = <<<GQL
            mutation UpdateFishbowl(\$input: updateFishbowlInput!) {
                updateFishbowl(input: \$input) {
                    fishbowl {
                        name
                        description
                        locale
                        startDateTimeTz
                        timezone
                        hasIntroduction
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $updateMutation,
                'variables' => [
                    'input' => [
                        'id' => '/fishbowls/' . $id,
                        'name' => $newFishbowl->getName(),
                        'description' => $newFishbowl->getDescription(),
                        'locale' => $newFishbowl->getLocale(),
                        'startDateTime' => $newFishbowl->getStartDateTime()
                            ? $newFishbowl->getStartDateTime()->format('Y-m-d H:i:s')
                            : null,
                        'timezone' => $newFishbowl->getTimezone(),
                        'hasIntroduction' => $newFishbowl->getHasIntroduction(),
                    ],
                ],
            ],
            'auth_bearer' => $token,
        ]);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

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
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FishbowlWorkflowFunctionalTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';
    private User $adminUser;
    private string $adminToken;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = UserFactory::createOne([
            'email' => 'admin@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();

        $this->adminToken = $this->logIn($this->adminUser);

        $user = UserFactory::createOne([
            'email' => 'user@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();

        $this->token = $this->logIn($user);
    }

    /** @test */
    public function itIntroducesFishbowlWithWrongUser(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_NOT_STARTED, $this->adminUser);

        $gql = <<<GQL
          mutation IntroduceFishbowl(\$slug: String!) {
            introduceFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->token);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data']['introduceFishbowl']['fishbowl']);
    }

    /** @test */
    public function itIntroducesFishbowl(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_NOT_STARTED, $this->adminUser);

        $gql = <<<GQL
          mutation IntroduceFishbowl(\$slug: String!) {
            introduceFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->adminToken);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame(Fishbowl::STATUS_INTRODUCTION, $graphqlResponse['data']['introduceFishbowl']['fishbowl']['currentStatus']);
    }

    /** @test */
    public function itRunsFishbowlWithWrongUser(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_INTRODUCTION, $this->adminUser);

        $gql = <<<GQL
          mutation RunFishbowl(\$slug: String!) {
            runFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->token);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data']['runFishbowl']['fishbowl']);
    }

    /** @test */
    public function itRunsFishbowl(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_INTRODUCTION, $this->adminUser);

        $gql = <<<GQL
          mutation RunFishbowl(\$slug: String!) {
            runFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->adminToken);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame(Fishbowl::STATUS_RUNNING, $graphqlResponse['data']['runFishbowl']['fishbowl']['currentStatus']);
    }

    /** @test */
    public function itFinishesFishbowlWithWrongUser(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_RUNNING, $this->adminUser);

        $gql = <<<GQL
          mutation FinishFishbowl(\$slug: String!) {
            finishFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->token);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data']['finishFishbowl']['fishbowl']);
    }

    /** @test */
    public function itFinishesFishbowl(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_RUNNING, $this->adminUser);

        $gql = <<<GQL
          mutation FinishFishbowl(\$slug: String!) {
            finishFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->adminToken);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame(Fishbowl::STATUS_FINISHED, $graphqlResponse['data']['finishFishbowl']['fishbowl']['currentStatus']);
    }

    /** @test */
    public function itCantRunFishbowlWithoutIntroduction(): void
    {
        self::bootKernel();

        parent::setUp();

        $this->createFishbowlWithStatus(Fishbowl::STATUS_NOT_STARTED, $this->adminUser);

        $gql = <<<GQL
          mutation RunFishbowl(\$slug: String!) {
            runFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $graphqlResponse = $this->callGraphqlWithToken($gql, $this->adminToken);

        $graphqlResponse =  $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data']['runFishbowl']['fishbowl']);
    }

    private function logIn(User $user): string
    {
        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => $user->getEmail(),
            'password' => 'admin',
        ]]);

        $this->assertResponseIsSuccessful();

        $logInResponse = $response->toArray();

        $this->assertArrayHasKey('token', $logInResponse);
        $this->assertNotEmpty($logInResponse['token']);

        return $logInResponse['token'];
    }

    private function callGraphqlWithToken(string $gql, string $token): ResponseInterface
    {
        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $gql,
                'variables' => [
                    'slug' => 'fishbowl-slug',
                ],
            ],
            'auth_bearer' => $token,
        ]);
    }

    private function createFishbowlWithStatus(string $status, User $user): void
    {
        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
            'currentStatus' => $status,
            'slug' => 'fishbowl-slug',
            'host' => $user,
        ]);
    }
}

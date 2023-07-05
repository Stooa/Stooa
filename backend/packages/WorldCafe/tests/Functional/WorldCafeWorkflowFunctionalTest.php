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
use App\Core\Model\Event;
use App\WorldCafe\Factory\WorldCafeFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class WorldCafeWorkflowFunctionalTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';
    private User $host;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();

        $this->user = UserFactory::createOne([
            'email' => 'user@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();
    }

    /**
     * @test
     *
     * @dataProvider mutationProvider
     */
    public function itCantRunWorkflowMutationWithWrongUser(
        string $mutationName,
        string $functionName,
        string $initialStatus,
        bool $hasIntroduction
    ): void {
        self::bootKernel();

        $this->hostCreatesWorldCafeWithStatus($initialStatus);

        $userToken = $this->logIn($this->user);

        $gql = $this->createGQLWorkflowMutation($mutationName, $functionName);

        $graphqlResponse = $this->callGQLWithToken($gql, $userToken);

        $graphqlResponse = $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data'][$functionName]['worldCafe']);
    }

    /** @return iterable<array{string, string, string, bool}> */
    public static function mutationProvider(): iterable
    {
        yield ['IntroduceWorldCafe', 'introduceWorldCafe', Event::STATUS_NOT_STARTED, true];
    }

    /**
     * @test
     *
     * @dataProvider mutationProviderWithFinalStatus
     */
    public function itRunsWorkflowMutationWhenWorldCafeHostsExecutesThem(
        string $mutationName,
        string $functionName,
        string $initialStatus,
        string $finalStatus,
        bool $hasIntroduction
    ): void {
        self::bootKernel();

        $this->hostCreatesWorldCafeWithStatus($initialStatus);

        $hostToken = $this->logIn($this->host);

        $gql = $this->createGQLWorkflowMutation($mutationName, $functionName);

        $graphqlResponse = $this->callGQLWithToken($gql, $hostToken);

        $graphqlResponse = $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($finalStatus, $graphqlResponse['data'][$functionName]['worldCafe']['currentStatus']);
    }

    /** @return iterable<array{string, string, string, string, bool}> */
    public static function mutationProviderWithFinalStatus(): iterable
    {
        yield ['IntroduceWorldCafe', 'introduceWorldCafe', Event::STATUS_NOT_STARTED, Event::STATUS_INTRODUCTION, true];
    }

    private function createGQLWorkflowMutation(string $mutationName, string $functionName): string
    {
        return <<<GQL
          mutation {$mutationName}(\$slug: String!) {
            {$functionName}(input: {slug: \$slug}) {
              worldCafe {
                currentStatus
              }
            }
          }
        GQL;
    }

    private function callGQLWithToken(string $gql, string $token): ResponseInterface
    {
        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $gql,
                'variables' => [
                    'slug' => 'world-cafe-slug',
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

    private function hostCreatesWorldCafeWithStatus(string $status): void
    {
        WorldCafeFactory::createOne([
            'currentStatus' => $status,
            'slug' => 'world-cafe-slug',
            'host' => $this->host,
        ]);
    }
}

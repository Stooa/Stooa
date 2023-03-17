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
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FishbowlWorkflowFunctionalTest extends ApiTestCase
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

        $this->hostCreatesFishbowlWithStatus($initialStatus, $hasIntroduction);

        $userToken = $this->logIn($this->user);

        $gql = $this->createGQLWorkflowMutation($mutationName, $functionName);

        $graphqlResponse = $this->callGQLWithToken($gql, $userToken);

        $graphqlResponse = $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data'][$functionName]['fishbowl']);
    }

    /** @return iterable<array{string, string, string, bool}> */
    public static function mutationProvider(): iterable
    {
        yield ['IntroduceFishbowl', 'introduceFishbowl', Fishbowl::STATUS_NOT_STARTED, true];
        yield ['RunFishbowl', 'runFishbowl', Fishbowl::STATUS_INTRODUCTION, true];
        yield ['FinishFishbowl', 'finishFishbowl', Fishbowl::STATUS_RUNNING, true];
        yield ['NoIntroRunFishbowl', 'noIntroRunFishbowl', Fishbowl::STATUS_NOT_STARTED, false];
    }

    /**
     * @test
     *
     * @dataProvider mutationProviderWithFinalStatus
     */
    public function itRunsWorkflowMutationWhenFishbowlHostsExecutesThem(
        string $mutationName,
        string $functionName,
        string $initialStatus,
        string $finalStatus,
        bool $hasIntroduction
    ): void {
        self::bootKernel();

        $this->hostCreatesFishbowlWithStatus($initialStatus, $hasIntroduction);

        $hostToken = $this->logIn($this->host);

        $gql = $this->createGQLWorkflowMutation($mutationName, $functionName);

        $graphqlResponse = $this->callGQLWithToken($gql, $hostToken);

        $graphqlResponse = $graphqlResponse->toArray();
        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame($finalStatus, $graphqlResponse['data'][$functionName]['fishbowl']['currentStatus']);
    }

    /** @return iterable<array{string, string, string, string, bool}> */
    public static function mutationProviderWithFinalStatus(): iterable
    {
        yield ['IntroduceFishbowl', 'introduceFishbowl', Fishbowl::STATUS_NOT_STARTED, Fishbowl::STATUS_INTRODUCTION, true];
        yield ['RunFishbowl', 'runFishbowl', Fishbowl::STATUS_INTRODUCTION, Fishbowl::STATUS_RUNNING, true];
        yield ['FinishFishbowl', 'finishFishbowl', Fishbowl::STATUS_RUNNING, Fishbowl::STATUS_FINISHED, true];
        yield ['NoIntroRunFishbowl', 'noIntroRunFishbowl', Fishbowl::STATUS_NOT_STARTED, Fishbowl::STATUS_RUNNING, false];
    }

    /**
     * @test
     *
     * @dataProvider mutationHasIntroduceProvider
     */
    public function itBlocksWorkflowDependingHasIntroductionValue(
        string $mutationName,
        string $functionName,
        string $initialStatus,
        bool $hasIntroduction
    ): void {
        self::bootKernel();

        $this->hostCreatesFishbowlWithStatus($initialStatus, $hasIntroduction);

        $hostToken = $this->logIn($this->host);

        $gql = $this->createGQLWorkflowMutation($mutationName, $functionName);

        $graphqlResponse = $this->callGQLWithToken($gql, $hostToken);

        $graphqlResponse = $graphqlResponse->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertNull($graphqlResponse['data'][$functionName]['fishbowl']);
    }

    /** @return iterable<array{string, string, string, bool}> */
    public static function mutationHasIntroduceProvider(): iterable
    {
        yield ['IntroduceFishbowl', 'introduceFishbowl', Fishbowl::STATUS_NOT_STARTED, false];
        yield ['NoIntroRunFishbowl', 'noIntroRunFishbowl', Fishbowl::STATUS_NOT_STARTED, true];
    }

    private function createGQLWorkflowMutation(string $mutationName, string $functionName): string
    {
        return <<<GQL
          mutation {$mutationName}(\$slug: String!) {
            {$functionName}(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }

    private function callGQLWithToken(string $gql, string $token): ResponseInterface
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

    private function hostCreatesFishbowlWithStatus(string $status, bool $hasIntroduction): void
    {
        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
            'currentStatus' => $status,
            'slug' => 'fishbowl-slug',
            'host' => $this->host,
            'hasIntroduction' => $hasIntroduction,
        ]);
    }
}

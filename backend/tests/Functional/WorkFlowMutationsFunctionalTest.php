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
use App\Factory\FishbowlFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class WorkFlowMutationsFunctionalTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';

    protected function setUp(): void
    {
        parent::setUp();
    }

    /** @test */
    public function itIntroducesFishbowl(): void
    {
        self::bootKernel();

        parent::setUp();

        $user = UserFactory::createOne([
            'name' => 'Name',
            'surnames' => 'Surnames',
            'email' => 'user@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ])->object();

        FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'fishbowl-slug',
            'host' => $user,
        ]);

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'user@stooa.com',
            'password' => 'admin',
        ]]);

        $this->assertResponseIsSuccessful();

        $logInResponse = $response->toArray();

        $this->assertArrayHasKey('token', $logInResponse);
        $this->assertNotEmpty($logInResponse['token']);

        $gql = <<<GQL
          mutation IntroduceFishbowl(\$slug: String!) {
            introduceFishbowl(input: {slug: \$slug}) {
              fishbowl {
                currentStatus
              }
            }
          }
        GQL;

        $response = static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $gql,
                'variables' => [
                    'slug' => 'fishbowl-slug',
                ],
            ],
            'auth_bearer' => $logInResponse['token'],
        ]);
        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);

        $this->assertSame(Fishbowl::STATUS_INTRODUCTION, $graphqlResponse['data']['introduceFishbowl']['fishbowl']['currentStatus']);
    }
}

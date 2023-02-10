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

namespace App\Core\Tests\Functional;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ChangePasswordLoggedFunctionalTest extends ApiTestCase
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
    public function itChangesPassword(): void
    {
        $token = $this->logIn($this->host);

        $response = $this->callGQLWithToken($token);

        $graphqlResponse = $response->toArray();

        $this->assertSame('newPassword', $graphqlResponse['data']['changePasswordLoggedUser']['user']['plainPassword']);
    }

    private function callGQLWithToken(string $token): ResponseInterface
    {
        $mutation = <<<GQL
            mutation ChangePasswordLogged(\$input: changePasswordLoggedUserInput!) {
                changePasswordLoggedUser(input: \$input) {
                    user {
                        plainPassword
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $mutation,
                'variables' => [
                    'input' => [
                        'password' => 'admin',
                        'newPassword' => 'newPassword',
                        'newPasswordConfirmation' => 'newPassword',
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

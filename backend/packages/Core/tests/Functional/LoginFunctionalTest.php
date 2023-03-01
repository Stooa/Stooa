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

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class LoginFunctionalTest extends ApiTestCase
{
    use Factories;
    use ResetDatabase;

    private const ADMIN_PASSWORD = '$argon2id$v=19$m=65536,t=4,p=1$37ytdOiVjLdUPFfPRDALmA$xZsJ/uHJ1nTklxYMq1WrjhEPPN2E1HOtVXAyf4rTTV0';

    protected function setUp(): void
    {
        parent::setUp();

        UserFactory::createOne([
            'name' => 'Name',
            'surnames' => 'Surnames',
            'email' => 'user@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
        ]);
    }

    /** @test */
    public function itLogsInCorrectly(): void
    {
        self::bootKernel();

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'user@stooa.com',
            'password' => 'admin',
        ]]);

        $logInResponse = $response->toArray();

        $this->assertArrayHasKey('token', $logInResponse);
        $this->assertArrayHasKey('refresh_token', $logInResponse);
        $this->assertNotEmpty($logInResponse['token']);
        $this->assertNotEmpty($logInResponse['refresh_token']);
        $this->assertResponseIsSuccessful();
    }

    /** @test */
    public function itReturns401WithWrongPasswordLogin(): void
    {
        self::bootKernel();

        static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'user@stooa.com',
            'password' => 'wrongPassword',
        ]]);

        $this->assertResponseStatusCodeSame(401);
    }

    /**
     * @test
     *
     * @dataProvider errorMessageProvider
     */
    public function itTranslatesCorrectlyLoginErrorMessage(string $langCode, string $message): void
    {
        self::bootKernel();

        $response = static::createClient()->request('POST', '/login', [
            'json' => [
                'email' => 'user@stooa.com',
                'password' => 'wrongPassword',
            ],
            'headers' => [
                'Accept-Language' => $langCode,
            ],
        ]);
        $this->assertResponseStatusCodeSame(401);

        $loginResponse = $response->getContent(false);
        $responseArray = json_decode($loginResponse, true, 512, \JSON_THROW_ON_ERROR);
        $this->assertIsArray($responseArray);
        $this->assertArrayHasKey('message', $responseArray);
        $this->assertSame($message, $responseArray['message']);
    }

    /** @return iterable<array{0: string, 1: string}> */
    public function errorMessageProvider(): iterable
    {
        yield ['es', 'Credenciales no válidas'];
        yield ['en', 'Invalid credentials'];
        yield ['ca', 'Credencials no vàlides'];
        yield ['fr', 'Informations d\'identification invalides.'];
    }
}

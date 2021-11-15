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
use FOS\UserBundle\Model\FosUserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Sonata\UserBundle\Model\UserInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class RefreshTokenTest extends ApiTestCase
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
            'linkedinProfile' => 'https://www.linkedin.com/test',
            'twitterProfile' => 'https//www.twitter.com/test',
            'allowShareData' => true,
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

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'user@stooa.com',
            'password' => '',
        ]]);

        $this->assertResponseStatusCodeSame(401);
    }

    /** @test */
    public function itReturns401WithWrongRefreshToken(): void
    {
        self::bootKernel();

        $response = static::createClient()->request('POST', '/refresh-token', ['json' => [
            'email' => 'user@stooa.com',
            'refresh_token' => 'refresh_token',
        ]]);

        $this->assertResponseStatusCodeSame(401);
    }

    /** @test */
    public function itRefreshUserToken(): void
    {
        self::bootKernel();

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'user@stooa.com',
            'password' => 'admin',
        ]]);

        $this->assertResponseIsSuccessful();

        $logInResponse = $response->toArray();

        $response = static::createClient()->request('POST', '/refresh-token', ['json' => [
            'email' => 'user@stooa.com',
            'refresh_token' => $logInResponse['refresh_token'],
        ]]);

        $this->assertResponseIsSuccessful();

        $refreshTokenResponse = $response->toArray();

        $this->assertArrayHasKey('token', $refreshTokenResponse);
        $this->assertArrayHasKey('refresh_token', $refreshTokenResponse);
        $this->assertNotEmpty($refreshTokenResponse['token']);
        $this->assertNotEmpty($refreshTokenResponse['refresh_token']);

        $token = new JWTUserToken();
        $token->setRawToken($refreshTokenResponse['token']);

        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');
        $decodedToken = $jwtManager->decode($token);

        $this->assertIsArray($decodedToken);

        $this->assertArrayHasKey('room', $decodedToken);
        $this->assertArrayHasKey('username', $decodedToken);
        $this->assertArrayHasKey('roles', $decodedToken);
        $this->assertArrayHasKey('context', $decodedToken);
        $this->assertSame($decodedToken['room'], '');
        $this->assertSame($decodedToken['username'], 'user@stooa.com');
        $this->assertSame($decodedToken['roles'], [FosUserInterface::ROLE_DEFAULT]);
        $this->assertSame($decodedToken['context'], [
            'user' => [
                'name' => 'Name Surnames',
                'email' => 'user@stooa.com',
                'twitter' => 'https//www.twitter.com/test',
                'linkedin' => 'https://www.linkedin.com/test',
            ]
        ]);
    }

    /** @test */
    public function itRefreshUserTokenWithOneFishbowl(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '02:00'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'fishbowl-slug',
        ])->object();

        UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
            'fishbowls' => [$fishbowl],
            'createdAt' => new \DateTime(),
        ]);

        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'host@stooa.com',
            'password' => 'admin',
        ]]);

        $logInResponse = $response->toArray();

        $response = static::createClient()->request('POST', '/refresh-token', ['json' => [
            'email' => 'host@stooa.com',
            'refresh_token' => $logInResponse['refresh_token'],
        ]]);

        $this->assertResponseIsSuccessful();

        $refreshTokenResponse = $response->toArray();

        $token = new JWTUserToken();
        $token->setRawToken($refreshTokenResponse['token']);
        $decodedToken = $jwtManager->decode($token);

        $this->assertIsArray($decodedToken);
        $this->assertArrayHasKey('room', $decodedToken);
        $this->assertSame($decodedToken['room'], 'fishbowl-slug');
    }

//    /** @test */
//    public function itGetsFirstFishbowlSlugWhenRefreshingTokenUserWithTwoCloseFishbowl(): void
//    {
//        $this->createHostWithTwoCloseFishbowls();
//
//        $response = static::createClient()->request('POST', '/login', ['json' => [
//            'email' => 'host@stooa.com',
//            'password' => 'admin',
//        ]]);
//
//        $logInResponse = $response->toArray();
//
//        $response = static::createClient()->request('POST', '/refresh-token', ['query' => [
//            'email' => 'host@stooa.com',
//            'refresh_token' => $logInResponse['refresh_token'],
//        ]]);
//
//        $refreshTokenResponse = $response->toArray();
//
//        $token = new JWTUserToken();
//        $token->setRawToken($refreshTokenResponse['token']);
//
//        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');
//        $decodedToken = $jwtManager->decode($token);
//
//        $this->assertIsArray($decodedToken);
//        $this->assertArrayHasKey('room', $decodedToken);
//        $this->assertSame($decodedToken['room'], 'first');
//    }

    /**
     * @test
     * @dataProvider roomProvider
     */
    public function itGetsCorrectRoomsByParameter(string $room): void
    {
        $this->createHostWithTwoCloseFishbowls();

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'host@stooa.com',
            'password' => 'admin',
        ]]);

        $this->assertResponseIsSuccessful();

        $logInResponse = $response->toArray();

        $response = static::createClient()->request('POST', '/refresh-token', ['query' => [
            'email' => 'host@stooa.com',
            'refresh_token' => $logInResponse['refresh_token'],
            'room' => $room,
        ]]);

        $this->assertResponseIsSuccessful();

        $refreshTokenResponse = $response->toArray();

        $token = new JWTUserToken();
        $token->setRawToken($refreshTokenResponse['token']);

        $jwtManager = static::$container->get('lexik_jwt_authentication.jwt_manager');
        $decodedToken = $jwtManager->decode($token);

        $this->assertIsArray($decodedToken);
        $this->assertArrayHasKey('room', $decodedToken);
        $this->assertSame($decodedToken['room'], $room);
    }

    /** @return iterable<array{string}> */
    public function roomProvider(): iterable
    {
        yield ['first'];
        yield ['second'];
    }

    private function createHostWithTwoCloseFishbowls(): void
    {
        $firstDate = new \DateTime();
        $firstFishbowl = FishbowlFactory::createOne([
            'startDateTime' => $firstDate,
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '00:02'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'first',
        ])->object();

        $secondDate = new \DateTime('+ 2 minutes');
        $secondFishbowl = FishbowlFactory::createOne([
            'startDateTime' => $secondDate,
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '00:30'),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'second',
        ])->object();

        UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
            'fishbowls' => [$firstFishbowl, $secondFishbowl],
            'createdAt' => new \DateTime(),
        ]);
    }
}

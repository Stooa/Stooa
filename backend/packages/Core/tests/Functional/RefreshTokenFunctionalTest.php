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
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Sonata\UserBundle\Model\UserInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class RefreshTokenFunctionalTest extends ApiTestCase
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
    public function itReturns401WithWrongRefreshToken(): void
    {
        self::bootKernel();

        static::createClient()->request('POST', '/refresh-token', ['json' => [
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

        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');
        $decodedToken = $jwtManager->decode($token);

        $this->assertIsArray($decodedToken);

        $this->assertArrayHasKey('room', $decodedToken);
        $this->assertArrayHasKey('username', $decodedToken);
        $this->assertArrayHasKey('roles', $decodedToken);
        $this->assertArrayHasKey('context', $decodedToken);
        $this->assertSame($decodedToken['room'], '');
        $this->assertSame($decodedToken['username'], 'user@stooa.com');
        $this->assertSame($decodedToken['roles'], [UserInterface::ROLE_DEFAULT]);
        $this->assertSame($decodedToken['context'], [
            'user' => [
                'name' => 'Name Surnames',
                'email' => 'user@stooa.com',
                'twitter' => 'https//www.twitter.com/test',
                'linkedin' => 'https://www.linkedin.com/test',
                'moderator' => false,
                'id' => null,
                'avatar' => null,
            ],
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

        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

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

    /** @test */
    public function itGetsFirstFishbowlSlugWhenRefreshingTokenUserWithTwoCloseFishbowl(): void
    {
        $this->createHostWithTwoCloseFishbowls();

        $response = static::createClient()->request('POST', '/login', ['json' => [
            'email' => 'host@stooa.com',
            'password' => 'admin',
        ]]);

        $logInResponse = $response->toArray();

        $response = static::createClient()->request('POST', '/refresh-token', ['query' => [
            'email' => 'host@stooa.com',
            'refresh_token' => $logInResponse['refresh_token'],
        ]]);

        $refreshTokenResponse = $response->toArray();

        $token = new JWTUserToken();
        $token->setRawToken($refreshTokenResponse['token']);

        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');
        $decodedToken = $jwtManager->decode($token);

        $this->assertIsArray($decodedToken);
        $this->assertArrayHasKey('room', $decodedToken);
        $this->assertSame($decodedToken['room'], 'first');
    }

    /**
     * @test
     *
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

        $response = static::createClient()->request('POST', '/refresh-token', [
            'query' => [
                'email' => 'host@stooa.com',
                'refresh_token' => $logInResponse['refresh_token'],
            ],
            'body' => $this->createRoomContent($room),
        ]);

        $this->assertResponseIsSuccessful();

        $refreshTokenResponse = $response->toArray();

        $token = new JWTUserToken();
        $token->setRawToken($refreshTokenResponse['token']);

        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');
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
        $timeZone = new \DateTimeZone('Europe/Madrid');

        $firstDate = new \DateTime('now', $timeZone);

        $firstFishbowl = FishbowlFactory::createOne([
            'startDateTime' => $firstDate,
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '00:02', $timeZone),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'first',
        ])->object();

        $secondDate = new \DateTime('+ 2 minutes', $timeZone);
        $secondFishbowl = FishbowlFactory::createOne([
            'startDateTime' => $secondDate,
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '00:30', $timeZone),
            'currentStatus' => Fishbowl::STATUS_NOT_STARTED,
            'slug' => 'second',
        ])->object();

        UserFactory::createOne([
            'email' => 'host@stooa.com',
            'password' => self::ADMIN_PASSWORD,
            'active' => true,
            'fishbowls' => [$firstFishbowl, $secondFishbowl],
            'createdAt' => new \DateTime('now', $timeZone),
        ]);
    }

    private function createRoomContent(string $room): string
    {
        return json_encode(['room' => $room], \JSON_THROW_ON_ERROR);
    }
}

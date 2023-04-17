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

namespace App\Fishbowl\Tests\Functional\Feedback;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Factory\FeedbackFactory;
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class GetFeedbackFunctionalTest extends ApiTestCase
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
    public function itGetsFeedback(): void
    {
        $hostToken = $this->logIn($this->host);

        $feedback = FeedbackFactory::createOne()->object();

        $response = $this->getFeedback($feedback->getId(), $hostToken);

        $responseArray = $response->toArray();

        $this->assertSame('/feedback/' . $feedback->getId(), $responseArray['@id']);
        $this->assertSame('Feedback', $responseArray['@type']);
        $this->assertSame($feedback->getSatisfaction(), $responseArray['satisfaction']);
        $this->assertSame($feedback->getOrigin(), $responseArray['origin']);
        $this->assertSame($feedback->getCreatedDateTime()?->format(\DateTime::ATOM), $responseArray['createdDateTime']);
        $this->assertSame($feedback->getTimezone(), $responseArray['timezone']);
    }

    private function getFeedback(?UuidInterface $feedbackId, string $token): ResponseInterface
    {
        return static::createClient()->request('GET', '/feedback/' . $feedbackId, [
            'auth_bearer' => $token,
        ]);
    }

    private function logIn(User $user): string
    {
        $jwtManager = static::getContainer()->get('lexik_jwt_authentication.jwt_manager');

        return $jwtManager->create($user);
    }
}

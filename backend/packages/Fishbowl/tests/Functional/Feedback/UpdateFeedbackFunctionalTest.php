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
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Factory\ParticipantFactory;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Entity\Feedback;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FeedbackFactory;
use App\Fishbowl\Factory\FishbowlFactory;
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UpdateFeedbackFunctionalTest extends ApiTestCase
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

        FishbowlFactory::createOne([
            'name' => 'fishbowl name',
            'description' => 'fishbowl description',
            'locale' => 'en',
            'slug' => 'fishbowl-slug',
        ]);
    }

    /** @test */
    public function itCreatesFeedback(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $participant = ParticipantFactory::createOne([
            'user' => $this->host,
            'fishbowl' => $fishbowl,
        ])->object();

        $token = $this->logIn($this->host);

        $feedback = FeedbackFactory::createOne()->object();

        $response = $this->callGQLWithToken(
            $token,
            $feedback->getId(),
            $participant,
            $fishbowl,
            Feedback::SATISFACTION_NEUTRAL,
            Feedback::ORIGIN_FISHBOWL,
        );

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);
        $this->assertSame('new@email.com', $graphqlResponse['data']['updateFeedback']['feedback']['email']);
        $this->assertSame(Feedback::ORIGIN_FISHBOWL, $graphqlResponse['data']['updateFeedback']['feedback']['origin']);
        $this->assertSame(Feedback::SATISFACTION_NEUTRAL, $graphqlResponse['data']['updateFeedback']['feedback']['satisfaction']);
        $this->assertSame('This is a comment', $graphqlResponse['data']['updateFeedback']['feedback']['comment']);
        $this->assertSame('/fishbowls/' . $fishbowl->getId(), $graphqlResponse['data']['updateFeedback']['feedback']['fishbowl']['id']);
        $this->assertSame('/participants/' . $participant->getId(), $graphqlResponse['data']['updateFeedback']['feedback']['participant']['id']);
    }

    private function callGQLWithToken(string $token, ?UuidInterface $id, Participant $participant, Fishbowl $fishbowl, string $satisfaction, string $origin): ResponseInterface
    {
        $createMutation = <<<GQL
            mutation UpdateFeedback(\$input: updateFeedbackInput!) {
                updateFeedback(input: \$input) {
                    feedback {
                        id
                        satisfaction
                        origin
                        email
                        comment
                        fishbowl {
                            id
                        }
                        participant {
                            id
                        }
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $createMutation,
                'variables' => [
                    'input' => [
                        'id' => '/feedback/' . $id,
                        'fishbowl' => '/fishbowls/' . $fishbowl->getId(),
                        'participant' => '/participants/' . $participant->getId(),
                        'email' => 'new@email.com',
                        'comment' => 'This is a comment',
                        'satisfaction' => $satisfaction,
                        'origin' => $origin,
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

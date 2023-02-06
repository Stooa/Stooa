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

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Factory\ParticipantFactory;
use App\Core\Factory\UserFactory;
use App\Fishbowl\Entity\Feedback;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CreateFeedbackFunctionalTest extends ApiTestCase
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
    public function itCreatesFeedback(): void
    {
        $participant = ParticipantFactory::createOne()->object();
        $fishbowl = FishbowlFactory::createOne()->object();
//        $fishbowl->addParticipant($participant);

        $token = $this->logIn($this->host);
        $response = $this->callGQLWithToken(
            $token,
            $participant,
            $fishbowl,
            Feedback::SATISFACTION_HAPPY,
            Feedback::ORIGIN_FISHBOWL
        );

        $graphqlResponse = $response->toArray();

        $this->assertArrayHasKey('data', $graphqlResponse);
        $this->assertNotEmpty($graphqlResponse['data']);
        $this->assertNotEmpty($graphqlResponse['data']['createFeedback']['feedback']['id']);
        $this->assertSame(Feedback::SATISFACTION_HAPPY, $graphqlResponse['data']['createFeedback']['feedback']['satisfaction']);
        $this->assertSame(Feedback::ORIGIN_FISHBOWL, $graphqlResponse['data']['createFeedback']['feedback']['origin']);
        $this->assertSame('This is a comment', $graphqlResponse['data']['createFeedback']['feedback']['comment']);
        $this->assertSame('email@test.com', $graphqlResponse['data']['createFeedback']['feedback']['email']);
        $this->assertSame('Europe/Madrid', $graphqlResponse['data']['createFeedback']['feedback']['timezone']);
    }

    private function callGQLWithToken(string $token, Participant $participant, Fishbowl $fishbowl, string $satisfaction, string $origin): ResponseInterface
    {
        $createMutation = <<<GQL
            mutation CreateFeedback(\$input: createFeedbackInput!) {
                createFeedback(input: \$input) {
                    feedback {
                        id
                        origin
                        satisfaction
                        comment
                        email
                        timezone
                    }
                }
            }
        GQL;

        return static::createClient()->request('POST', '/graphql', [
            'json' => [
                'query' => $createMutation,
                'variables' => [
                    'input' => [
                        'participant' => '/participants/' . $participant->getId(),
                        'fishbowl' => '/fishbowls/' . $fishbowl->getId(),
                        'satisfaction' => $satisfaction,
                        'comment' => 'This is a comment',
                        'email' => 'email@test.com',
                        'origin' => $origin,
                        'timezone' => 'Europe/Madrid',
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

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

namespace App\Core\Tests\Unit\JWT;

use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\Core\JWT\HostValidator;
use App\Core\JWT\Model\JWTToken;
use App\Core\JWT\Model\Payload\FeaturesPayload;
use App\Core\JWT\Model\Payload\HeaderPayload;
use App\Core\JWT\Model\Payload\UserPayload;
use App\Core\JWT\TokenGenerator\JaasTokenGenerator;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class JaasTokenGeneratorTest extends TestCase
{
    use Factories;

    private JaasTokenGenerator $jaasTokenGenerator;
    /** @var Stub&HostValidator */
    private Stub $hostValidator;
    private User $user;
    private string $appId;
    private string $apiKey;
    private bool $transcriptionEnabled;

    protected function setUp(): void
    {
        parent::setUp();

        $this->appId = 'appId';
        $this->apiKey = 'apiKey';
        $this->transcriptionEnabled = false;

        $this->user = UserFactory::createOne()->object();

        $this->hostValidator = $this->createStub(HostValidator::class);

        $this->jaasTokenGenerator = new JaasTokenGenerator(
            $this->appId,
            $this->apiKey,
            $this->transcriptionEnabled,
            $this->hostValidator
        );
    }

    /** @test */
    public function itGeneratesTokenCorrectly(): void
    {
        $isModerator = true;
        $this->hostValidator->method('validateFromRequest')->willReturn($isModerator);

        $token = $this->jaasTokenGenerator->generate($this->user);

        $userPayload = new UserPayload($this->user, $isModerator, $this->user->getId(), '');

        $expectedToken = new JWTToken('chat', 'jitsi', $this->appId, '*', $userPayload,
            new \DateTimeImmutable('-10 seconds'),
            new HeaderPayload($this->apiKey, 'RS256', 'JWT'),
            new FeaturesPayload(false, false, false, false)
        );

        $expectedNbf = $expectedToken->getNbf();
        $nbf = $token->getNbf();

        $this->assertNotNull($expectedNbf);
        $this->assertNotNull($nbf);

        $this->assertSame($nbf->getTimestamp(), $expectedNbf->getTimestamp());

        $tokenArray = $token->toArray();
        $expectedTokenArray = $expectedToken->toArray();

        unset($tokenArray['nbf'], $expectedTokenArray['nbf']);

        $this->assertSame($tokenArray, $expectedTokenArray);
    }
}

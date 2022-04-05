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

namespace App\Tests\Unit;

use App\Entity\User;
use App\Factory\UserFactory;
use App\JWT\CurrentUserFishbowl;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\UserPayload;
use App\JWT\TokenGenerator\SelfHostedTokenGenerator;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class SelfHostedTokenGeneratorTest extends TestCase
{
    use Factories;

    private SelfHostedTokenGenerator $selfHostedTokenGenerator;
    /** @var Stub&CurrentUserFishbowl */
    private Stub $currentUserFishbowl;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = UserFactory::createOne()->object();

        $this->currentUserFishbowl = $this->createStub(CurrentUserFishbowl::class);

        $this->selfHostedTokenGenerator = new SelfHostedTokenGenerator($this->currentUserFishbowl);
    }

    /** @test */
    public function itGeneratesTokenCorrectly(): void
    {
        $room = 'room-name';
        $this->currentUserFishbowl->method('currentSlug')->willReturn($room);

        $responseToken = $this->selfHostedTokenGenerator->generate($this->user);

        $userPayload = new UserPayload($this->user, false);
        $token = new JWTToken('api_client', 'api_client', 'meet.jitsi', $room, $userPayload);

        $this->assertSame($responseToken->toArray(), $token->toArray());
    }
}

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

namespace App\Tests\Unit\JWT;

use App\Entity\User;
use App\EventSubscriber\JWTCreatedSubscriber;
use App\Factory\UserFactory;
use App\JWT\Model\JWTToken;
use App\JWT\Model\Payload\HeaderPayload;
use App\JWT\Model\Payload\UserPayload;
use App\JWT\TokenGenerator\TokenGeneratorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

use Zenstruck\Foundry\Test\Factories;

class JWTCreatedSubscriberTest extends TestCase
{
    use Factories;

    private JWTCreatedSubscriber $subscriber;
    /** @var MockObject&TokenGeneratorInterface */
    private MockObject $tokenGenerator;
    private User $user;

    protected function setUp(): void
    {
        $this->user = UserFactory::createOne()->object();

        $this->tokenGenerator = $this->createMock(TokenGeneratorInterface::class);
        $this->subscriber = new JWTCreatedSubscriber($this->tokenGenerator);
    }

    /** @test */
    public function itCreatesPayloadCorrectly(): void
    {
        $event = new JWTCreatedEvent([], $this->user, []);

        $userPayload = new UserPayload($this->user, false);
        $token = new JWTToken('iss', 'aud', 'sub', 'room', $userPayload);

        $this->tokenGenerator->method('generate')->willReturn($token);

        $this->subscriber->onJWTCreated($event);
        $this->assertSame($token->toArray(), $event->getData());

        $this->assertSame([], $event->getHeader());
    }

    /** @test */
    public function itCreatesPayloadCorrectlyWithHeader(): void
    {
        $event = new JWTCreatedEvent([], $this->user, []);

        $userPayload = new UserPayload($this->user, false);
        $headerPayload = new HeaderPayload('apiKey', 'alg', 'typ');
        $token = new JWTToken('iss', 'aud', 'sub', 'room', $userPayload, new \DateTimeImmutable(), $headerPayload);

        $this->tokenGenerator->method('generate')->willReturn($token);

        $this->subscriber->onJWTCreated($event);
        $this->assertSame($token->toArray(), $event->getData());

        $this->assertSame($headerPayload->toArray(), $event->getHeader());
    }
}

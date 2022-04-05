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


use App\EventSubscriber\JWTCreatedSubscriber;
use App\JWT\TokenGenerator\SelfHostedTokenGenerator;
use App\JWT\TokenGenerator\TokenGeneratorInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedSubscriberTest extends TestCase
{
    private JWTCreatedSubscriber $subscriber;
    private RequestStack $requestStack;
    /** @var MockObject&SelfHostedTokenGenerator */
    private MockObject $selfHostedTokenGenerator;

    protected function setUp(): void
    {
        $request = new Request();
        $this->requestStack = new RequestStack();
        $this->requestStack->push($request);

        $this->selfHostedTokenGenerator = $this->createMock(TokenGeneratorInterface::class);
        $this->subscriber = new JWTCreatedSubscriber($this->requestStack, $this->fishbowlService);
    }   

    /** @test */
    public function foo()
    {

    }
}

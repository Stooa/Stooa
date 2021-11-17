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

use App\Entity\Fishbowl;
use App\Entity\User;
use App\EventSubscriber\JWTCreatedSubscriber;
use App\Service\FishbowlService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedSubscriberTest extends TestCase
{
    private JWTCreatedSubscriber $subscriber;
    private RequestStack $requestStack;
    /** @var MockObject&FishbowlService */
    private MockObject $fishbowlService;
    private User $user;
    /** @var array<string, mixed> */
    private array $data;
    private Fishbowl $fishbowl;

    protected function setUp(): void
    {
        $request = new Request();
        $this->requestStack = new RequestStack();
        $this->requestStack->push($request);
        $this->fishbowlService = $this->createMock(FishbowlService::class);
        $this->subscriber = new JWTCreatedSubscriber($this->requestStack, $this->fishbowlService);

        $this->user = new User();
        $this->user->setName('name');
        $this->user->setSurnames('surnames');
        $this->user->setEmail('email');
        $this->user->setTwitterProfile('twitter');
        $this->user->setLinkedinProfile('linkedin');

        $this->fishbowl = new Fishbowl();
        $this->fishbowl->setStartDateTime(new \DateTime());
        $this->fishbowl->setTimezone('Europe/madrid');
        $this->fishbowl->setDuration(new \DateTime('+ 30 minutes'));
        $this->fishbowl->setCurrentStatus(Fishbowl::STATUS_RUNNING);
        $this->fishbowl->setSlug('fishbowl-slug');

        $this->data = [
            'iss' => 'api_client',
            'aud' => 'api_client',
            'sub' => 'meet.jitsi',
            'room' => '',
            'context' => [
                'user' => [
                    'name' => $this->user->getFullName(),
                    'email' => $this->user->getEmail(),
                    'twitter' => $this->user->getPublicLinkedinProfile(),
                    'linkedin' => $this->user->getPublicLinkedinProfile(),
                ],
            ],
        ];
    }

    /** @test */
    public function itCreatesPayloadDataWithEmptyRoom(): void
    {
        $event = new JWTCreatedEvent([], $this->user, []);

        $this->subscriber->onJWTCreated($event);
        $this->assertSame($this->data, $event->getData());
    }

    /** @test */
    public function itCreatesPayloadDataWithUserFishbowlSlug(): void
    {
        $this->user->addFishbowl($this->fishbowl);

        $event = new JWTCreatedEvent([], $this->user, []);

        $this->subscriber->onJWTCreated($event);

        $this->data['room'] = 'fishbowl-slug';
        $this->assertSame($this->data, $event->getData());
    }

    /** @test */
    public function itCreatesPayloadDataWithUserFishbowlSlugFromRequest(): void
    {
        $request = new Request([], ['room' => 'fishbowl-slug']);
        $this->requestStack->push($request);
        $this->subscriber = new JWTCreatedSubscriber($this->requestStack, $this->fishbowlService);

        $event = new JWTCreatedEvent([], $this->user, []);

        $this->fishbowlService->method('canFishbowlStart')->willReturn(true);

        $this->subscriber->onJWTCreated($event);

        $this->data['room'] = 'fishbowl-slug';
        $this->assertSame($this->data, $event->getData());
    }
}

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

namespace App\Fishbowl\Tests\Unit;

use App\Core\Factory\UserFactory;
use App\Fishbowl\EventSubscriber\FishbowlWorkflowSubscriber;
use App\Fishbowl\Factory\FishbowlFactory;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Workflow\Event\GuardEvent;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlWorkflowSubscriberTest extends TestCase
{
    use Factories;

    /** @var MockObject&Security */
    private MockObject $security;
    private FishbowlWorkflowSubscriber $subscriber;

    protected function setUp(): void
    {
        $this->security = $this->createMock(Security::class);
        $this->subscriber = new FishbowlWorkflowSubscriber($this->security);
    }

    /** @test */
    public function itDoesntBlockWorkflowWhenUserIsTheHost(): void
    {
        $user = UserFactory::createOne()->object();
        $fishbowl = FishbowlFactory::createOne([
            'host' => $user,
        ])->object();

        $this->security->method('getUser')->willReturn($user);
        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition('fishbowl', '', ''));

        $this->subscriber->guardFishbowl($guardEvent);
        $this->assertFalse($guardEvent->isBlocked());
    }

    /** @test */
    public function itBlocksWorkflowWhenUserAreNotTheSame(): void
    {
        $user = UserFactory::createOne()->object();
        $fishbowl = FishbowlFactory::createOne()->object();

        $this->security->method('getUser')->willReturn($user);
        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition('fishbowl', '', ''));

        $this->subscriber->guardFishbowl($guardEvent);
        $this->assertTrue($guardEvent->isBlocked());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame(['workflow.fishbowl.guard' => ['guardFishbowl']], $this->subscriber::getSubscribedEvents());
    }
}

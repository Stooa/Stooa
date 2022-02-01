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
use App\EventSubscriber\FishbowlWorkflowGuardSubscriber;
use App\Factory\FishbowlFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\Event\GuardEvent;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlWorkflowGuardSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlWorkflowGuardSubscriber $subscriber;

    protected function setUp(): void
    {
        $this->subscriber = new FishbowlWorkflowGuardSubscriber();
    }

    /** @test */
    public function itBlockWhenIntroduceTransitionDoesntHaveIntroduction(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'hasIntroduction' => false,
        ])->object();

        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition(Fishbowl::TRANSITION_INTRODUCE, '', ''));

        $this->subscriber->guardFishbowl($guardEvent);

        $this->assertTrue($guardEvent->isBlocked());
    }

    /** @test */
    public function itBlockWhenNoIntroTransitionDoesHaveIntroduction(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'hasIntroduction' => true,
        ])->object();

        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition(Fishbowl::TRANSITION_NO_INTRO_RUN, '', ''));

        $this->subscriber->guardFishbowl($guardEvent);

        $this->assertTrue($guardEvent->isBlocked());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([
                'workflow.fishbowl.guard' => ['guardFishbowl'],
            ],
            $this->subscriber::getSubscribedEvents()
        );
    }
}

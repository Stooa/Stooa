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

use App\Core\Model\Event;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\EventSubscriber\FishbowlIntroduceAndNoIntroRunSubscriber;
use App\Fishbowl\Factory\FishbowlFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\Event\GuardEvent;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlIntroduceAndNoIntroRunSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlIntroduceAndNoIntroRunSubscriber $subscriber;

    protected function setUp(): void
    {
        $this->subscriber = new FishbowlIntroduceAndNoIntroRunSubscriber();
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
                'workflow.event.guard.' . Event::TRANSITION_INTRODUCE => ['guardFishbowl'],
                'workflow.event.guard.' . Event::TRANSITION_NO_INTRO_RUN => ['guardFishbowl'],
            ],
            $this->subscriber::getSubscribedEvents()
        );
    }
}

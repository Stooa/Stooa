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

use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\EventSubscriber\FishbowlTransitionsSubscriber;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Repository\FishbowlRepository;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\Event\Event;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlTransitionsSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlTransitionsSubscriber $subscriber;
    private Fishbowl $fishbowl;
    /** @var Stub&FishbowlRepository */
    private Stub $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fishbowl = FishbowlFactory::createOne()->object();
        $this->repository = $this->createStub(FishbowlRepository::class);

        $this->subscriber = new FishbowlTransitionsSubscriber($this->repository);
    }

    /** @test */
    public function itSetsIntroducedAtDateWhenIntroduceTransitionIsExecuted(): void
    {
        $transition = new Transition(Fishbowl::TRANSITION_INTRODUCE,
            Fishbowl::STATUS_NOT_STARTED,
            Fishbowl::STATUS_INTRODUCTION
        );
        $event = new Event($this->fishbowl, new Marking(), $transition);

        $this->subscriber->onIntroduction($event);

        $this->assertNotNull($this->fishbowl->getIntroducedAt());
    }

    /** @test */
    public function itSetsRunAtDateWhenNoIntroductionRunTransitionIsExecuted(): void
    {
        $transition = new Transition(Fishbowl::TRANSITION_NO_INTRO_RUN,
            Fishbowl::STATUS_NOT_STARTED,
            Fishbowl::STATUS_RUNNING
        );
        $event = new Event($this->fishbowl, new Marking(), $transition);

        $this->subscriber->onNoIntroductionRun($event);

        $this->assertNotNull($this->fishbowl->getRunnedAt());
    }

    /** @test */
    public function itSetsRunAtDateWhenRunTransitionIsExecuted(): void
    {
        $transition = new Transition(Fishbowl::TRANSITION_RUN,
            Fishbowl::STATUS_INTRODUCTION,
            Fishbowl::STATUS_RUNNING
        );
        $event = new Event($this->fishbowl, new Marking(), $transition);

        $this->subscriber->onRun($event);

        $this->assertNotNull($this->fishbowl->getRunnedAt());
    }

    /** @test */
    public function itSetsFinishedAtDateWhenFinishTransitionIsExecuted(): void
    {
        $transition = new Transition(Fishbowl::TRANSITION_FINISH,
            Fishbowl::STATUS_RUNNING,
            Fishbowl::STATUS_FINISHED
        );
        $event = new Event($this->fishbowl, new Marking(), $transition);

        $this->subscriber->onFinish($event);

        $this->assertNotNull($this->fishbowl->getFinishedAt());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([
            'workflow.fishbowl.transition.' . Fishbowl::TRANSITION_INTRODUCE => 'onIntroduction',
            'workflow.fishbowl.transition.' . Fishbowl::TRANSITION_NO_INTRO_RUN => 'onNoIntroductionRun',
            'workflow.fishbowl.transition.' . Fishbowl::TRANSITION_RUN => 'onRun',
            'workflow.fishbowl.transition.' . Fishbowl::TRANSITION_FINISH => 'onFinish',
        ],
            $this->subscriber::getSubscribedEvents()
        );
    }
}

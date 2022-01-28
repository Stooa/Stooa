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
use App\EventSubscriber\FishbowlStartWithoutIntroSubscriber;
use App\Factory\FishbowlFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\Event\GuardEvent;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlStartWithoutIntroSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlStartWithoutIntroSubscriber $subscriber;

    protected function setUp(): void
    {
        $this->subscriber = new FishbowlStartWithoutIntroSubscriber();
    }

    /** @test */
    public function itBlockWhenHasIntroduction(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition('fishbowl', '', ''));

        $this->subscriber->guardFishbowl($guardEvent);
        $this->assertFalse($guardEvent->isBlocked());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([
                'workflow.fishbowl.guard.' . Fishbowl::TRANSITION_NO_INTRO_RUN => ['guardFishbowl'],
            ],
            $this->subscriber::getSubscribedEvents()
        );
    }
}

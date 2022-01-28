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
use App\EventSubscriber\FishbowlStartIntroSubscriber;
use App\Factory\FishbowlFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\Event\GuardEvent;
use Symfony\Component\Workflow\Marking;
use Symfony\Component\Workflow\Transition;
use Zenstruck\Foundry\Test\Factories;

class FishbowlStartIntroSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlStartIntroSubscriber $subscriber;

    protected function setUp(): void
    {
        $this->subscriber = new FishbowlStartIntroSubscriber();
    }

    /** @test */
    public function itBlockWhenHasIntroduction(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'hasIntroduction' => true,
        ])->object();

        $guardEvent = new GuardEvent($fishbowl, new Marking(), new Transition('fishbowl', '', ''));

        $this->subscriber->guardFishbowl($guardEvent);
        $this->assertFalse($guardEvent->isBlocked());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([
                'workflow.fishbowl.guard.' . Fishbowl::TRANSITION_INTRODUCE => ['guardFishbowl'],
            ],
            $this->subscriber::getSubscribedEvents()
        );
    }
}

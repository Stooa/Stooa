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
use App\EventSubscriber\FishbowlDoctrineSubscriber;
use App\Factory\FishbowlFactory;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Persistence\ObjectManager;
use PHPUnit\Framework\TestCase;
use Webmozart\Assert\Assert;
use Zenstruck\Foundry\Test\Factories;

class FishbowlDoctrineSubscriberTest extends TestCase
{
    use Factories;

    private FishbowlDoctrineSubscriber $subscriber;

    protected function setUp(): void
    {
        parent::setUp();

        $this->subscriber = new FishbowlDoctrineSubscriber();
    }

    /** @test */
    public function itCalculatesFinishDateTime(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
        ])->object();

        $objectManager = $this->createStub(ObjectManager::class);
        $eventArgs = new LifecycleEventArgs($fishbowl, $objectManager);

        $this->subscriber->prePersist($eventArgs);

        $fishbowl = $eventArgs->getObject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $this->assertNotNull($fishbowl->getFinishDateTime());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([Events::prePersist, Events::preUpdate], $this->subscriber->getSubscribedEvents());
    }
}

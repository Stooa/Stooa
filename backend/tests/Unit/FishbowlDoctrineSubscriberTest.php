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
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
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
    public function itCalculatesFinishDateTimeWhenPersisting(): void
    {
        $currentTime = new \DateTime();

        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => $currentTime,
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
        ])->object();

        $objectManager = $this->createStub(EntityManagerInterface::class);
        $eventArgs = new LifecycleEventArgs($fishbowl, $objectManager);

        $this->subscriber->prePersist($eventArgs);

        $fishbowl = $eventArgs->getObject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $this->assertNotNull($fishbowl->getFinishDateTime());

        $this->assertEquals($fishbowl->getFinishDateTime()->getTimestamp(), $currentTime->add(new \DateInterval('PT1H'))->getTimestamp());
    }

    /** @test */
    public function itCalculatesFinishDateTimeWhenUpdating(): void
    {
        $currentTime = new \DateTime();
        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => $currentTime,
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
        ])->object();

        $objectManager = $this->createStub(EntityManagerInterface::class);
        $eventArgs = new LifecycleEventArgs($fishbowl, $objectManager);

        $this->subscriber->preUpdate($eventArgs);

        $fishbowl = $eventArgs->getObject();

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        $this->assertNotNull($fishbowl->getFinishDateTime());
        $this->assertEquals($fishbowl->getFinishDateTime()->getTimestamp(), $currentTime->add(new \DateInterval('PT1H'))->getTimestamp());
    }

    /** @test */
    public function itGetSubscribedEvents(): void
    {
        $this->assertSame([Events::prePersist, Events::preUpdate], $this->subscriber->getSubscribedEvents());
    }
}

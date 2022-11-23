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

namespace App\Core\Tests\Unit\JWT;

use App\Core\Entity\User;
use App\Core\Factory\UserFactory;
use App\Core\JWT\CurrentUserFishbowl;
use App\Core\JWT\CurrentUserRoom;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class CurrentUserFishbowlTest extends TestCase
{
    use Factories;

    /** @var Stub&CurrentUserRoom */
    protected Stub $currentUserRoom;
    protected CurrentUserFishbowl $currentUserFishbowl;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = UserFactory::createOne()->object();

        $this->currentUserRoom = $this->createStub(CurrentUserRoom::class);
        $this->currentUserFishbowl = new CurrentUserFishbowl($this->currentUserRoom);
    }

    /** @test */
    public function itGetsEmptySlug(): void
    {
        $this->currentUserRoom->method('getRoom')->willReturn(null);

        $slug = $this->currentUserFishbowl->currentSlug($this->user);

        $this->assertSame($slug, '');
    }

    /** @test */
    public function itGetsSlugCorrectly(): void
    {
        $this->currentUserRoom->method('getRoom')->willReturn('room-name');

        $slug = $this->currentUserFishbowl->currentSlug($this->user);

        $this->assertSame('room-name', $slug);
    }

    /** @test */
    public function itGetsRunningFishbowlWhenRequestRoomIsEmpty(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'startDateTime' => new \DateTime(),
            'timezone' => 'Europe/Madrid',
            'duration' => \DateTime::createFromFormat('!H:i', '01:00'),
            'host' => $this->user,
            'slug' => 'fishbowl-slug',
            'currentStatus' => Fishbowl::STATUS_RUNNING,
        ])->object();

        $this->user->addFishbowl($fishbowl);

        $this->currentUserRoom->method('getRoom')->willReturn(null);

        $slug = $this->currentUserFishbowl->currentSlug($this->user);

        $this->assertSame($slug, 'fishbowl-slug');
    }
}

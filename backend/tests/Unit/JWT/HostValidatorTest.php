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

namespace App\Tests\JWT;

use App\Entity\User;
use App\Factory\FishbowlFactory;
use App\Factory\UserFactory;
use App\JWT\CurrentUserRoom;
use App\JWT\HostValidator;
use App\Repository\FishbowlRepository;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class HostValidatorTest extends TestCase
{
    use Factories;

    protected HostValidator $hostValidator;
    /** @var Stub&FishbowlRepository */
    protected Stub $fishbowlRepository;
    /** @var Stub&CurrentUserRoom */
    protected Stub $currentUserRoom;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = UserFactory::createOne()->object();

        $this->fishbowlRepository = $this->createStub(FishbowlRepository::class);

        $this->currentUserRoom = $this->createStub(CurrentUserRoom::class);

        $this->hostValidator = new HostValidator($this->fishbowlRepository, $this->currentUserRoom);
    }

    /** @test */
    public function itGetsFalseWhenRoomIsNullInRequest(): void
    {
        $this->currentUserRoom->method('getRoom')->willReturn(null);

        $isHost = $this->hostValidator->validateFromRequest($this->user);

        $this->assertFalse($isHost);
    }

    /** @test */
    public function itGetsFalseWhenRepositoryReturnsNoFishbowl(): void
    {
        $this->currentUserRoom->method('getRoom')->willReturn('room-name');

        $this->fishbowlRepository->method('findBySlug')->willReturn(null);

        $isHost = $this->hostValidator->validateFromRequest($this->user);

        $this->assertFalse($isHost);
    }

    /** @test */
    public function itGetsFalseWhenFishbowlHostIsNotUser(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $this->currentUserRoom->method('getRoom')->willReturn('room-name');

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);

        $isHost = $this->hostValidator->validateFromRequest($this->user);

        $this->assertFalse($isHost);
    }

    /** @test */
    public function itGetsTrueWhenUserIsHostOfTheFishbowl(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'host' => $this->user,
        ])->object();

        $this->currentUserRoom->method('getRoom')->willReturn('room-name');

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);

        $isHost = $this->hostValidator->validateFromRequest($this->user);

        $this->assertTrue($isHost);
    }
}

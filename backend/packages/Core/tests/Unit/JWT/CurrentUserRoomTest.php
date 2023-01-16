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
use App\Core\JWT\CurrentUserRoom;
use App\Fishbowl\Service\FishbowlService;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Zenstruck\Foundry\Test\Factories;

class CurrentUserRoomTest extends TestCase
{
    use Factories;

    private CurrentUserRoom $currentUserRoom;
    /** @var Stub&FishbowlService */
    private Stub $fishbowlService;
    private RequestStack $requestStack;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $request = new Request();
        $this->requestStack = new RequestStack();
        $this->requestStack->push($request);

        $this->user = UserFactory::createOne()->object();

        $this->fishbowlService = $this->createStub(FishbowlService::class);

        $this->currentUserRoom = new CurrentUserRoom($this->requestStack, $this->fishbowlService);
    }

    /** @test */
    public function itGetsNullWhenRequestDontHaveRoomValue(): void
    {
        $room = $this->currentUserRoom->getRoom($this->user);

        $this->assertNull($room);
    }

    /** @test */
    public function itGetsNullWhenFishbowlIsNotReadyToStart(): void
    {
        $request = new Request([], [], [], [], [], [], $this->createRoomContent('room-name'));
        $this->requestStack->push($request);

        $this->fishbowlService->method('canFishbowlStart')->willReturn(false);

        $room = $this->currentUserRoom->getRoom($this->user);

        $this->assertNull($room);
    }

    /** @test */
    public function itGetsRoomNameCorrectly(): void
    {
        $request = new Request([], [], [], [], [], [], $this->createRoomContent('room-name'));
        $this->requestStack->push($request);

        $this->fishbowlService->method('canFishbowlStart')->willReturn(true);

        $room = $this->currentUserRoom->getRoom($this->user);

        $this->assertSame('room-name', $room);
    }

    private function createRoomContent(string $room): string
    {
        return json_encode(['room' => $room], \JSON_THROW_ON_ERROR);
    }
}

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

namespace App\Fishbowl\Tests\Unit\Controller;

use App\Core\Entity\Participant;
use App\Fishbowl\Controller\FishbowlController;
use App\Fishbowl\Service\FishbowlService;
use App\Fishbowl\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Zenstruck\Foundry\Test\Factories;

class FishbowlControllerTest extends TestCase
{
    use Factories;

    private FishbowlController $controller;

    /** @var FishbowlService&MockObject */
    private MockObject $fishbowlService;
    /** @var MockObject&PrivateFishbowlService */
    private MockObject $privateFishbowlService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->privateFishbowlService = $this->createMock(PrivateFishbowlService::class);
        $this->fishbowlService = $this->createMock(FishbowlService::class);

        $this->controller = new FishbowlController(
            $this->fishbowlService,
            $this->privateFishbowlService
        );
    }

    /** @test */
    public function itCallsPrivateFishbowl(): void
    {
        $jsonResponse = new JsonResponse(['response' => true]);

        $this->privateFishbowlService->method('isPasswordEqual')->willReturn(true);

        $response = $this->controller->private('fishbowl-slug');

        $this->assertSame($jsonResponse->getContent(), $response->getContent());
    }

    /** @test */
    public function itCallsParticipants(): void
    {
        $jsonResponse = new JsonResponse(['response' => []]);

        $this->fishbowlService->method('getParticipants')->willReturn([]);

        $response = $this->controller->participants('fishbowl-slug');

        $this->assertSame($jsonResponse->getContent(), $response->getContent());
    }

    /** @test */
    public function itCallsStatus(): void
    {
        $jsonResponse = new JsonResponse(['status' => 'running']);

        $this->fishbowlService->method('getFishbowlStatus')->willReturn('running');

        $response = $this->controller->status('fishbowl-slug');

        $this->assertSame($jsonResponse->getContent(), $response->getContent());
    }

    /** @test */
    public function itCallsPing(): void
    {
        $participant = new Participant();

        $jsonResponse = new JsonResponse(['response' => [
            'participantId' => $participant->getId(),
            'slug' => null,
        ]]);

        $this->fishbowlService->method('ping')->willReturn($participant);

        $response = $this->controller->ping('fishbowl-slug');

        $this->assertSame($jsonResponse->getContent(), $response->getContent());
    }
}

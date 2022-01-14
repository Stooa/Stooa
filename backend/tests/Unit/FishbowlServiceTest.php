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
use App\Entity\Guest;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\FishbowlRepository;
use App\Repository\GuestRepository;
use App\Repository\ParticipantRepository;
use App\Service\FishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Translation\Translator;

class FishbowlServiceTest extends TestCase
{
    private RequestStack $requestStack;
    private FishbowlService $service;
    private MockObject $fishbowlRepository;
    private MockObject $guestRepository;
    private MockObject $participantRepository;
    private MockObject $security;
    private MockObject $translator;

    protected function setUp(): void
    {
        $this->fishbowlRepository = $this->createMock(FishbowlRepository::class);
        $this->guestRepository = $this->createMock(GuestRepository::class);
        $this->participantRepository = $this->createMock(ParticipantRepository::class);
        $this->requestStack = new RequestStack();
        $this->security = $this->createMock(Security::class);
        $this->translator = $this->createMock(Translator::class);

        $this->service = new FishbowlService(
            $this->fishbowlRepository,
            $this->requestStack,
            $this->security,
            $this->guestRepository,
            $this->participantRepository,
            $this->translator
        );
    }

    /** @test */
    public function itGeneratesRandomSlug(): void
    {
        $fishbowl = new Fishbowl();
        $slug = $this->service->generateRandomSlug($fishbowl);

        $this->assertSame(10, \strlen($slug));
    }

    /** @test */
    public function itGetsFishbowlStatus(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setName('fishbowl name');
        $fishbowl->setTimezone('Europe/Madrid');
        $fishbowl->setDuration((new \DateTimeImmutable())->setTime(1, 0));
        $fishbowl->setStartDateTime(new \DateTimeImmutable());
        $fishbowl->setCurrentStatus(Fishbowl::STATUS_RUNNING);

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);

        $responseStatus = $this->service->getFishbowlStatus('fishbowl-slug');

        $this->assertSame(strtoupper(Fishbowl::STATUS_RUNNING), $responseStatus);
    }

    /** @test */
    public function itGetsFishbowlStatusFinishedWithoutBeingFinish(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setName('fishbowl name');
        $fishbowl->setTimezone('Europe/Madrid');
        $fishbowl->setDuration((new \DateTimeImmutable())->setTime(1, 0));
        $fishbowl->setStartDateTime((new \DateTimeImmutable())->sub(new \DateInterval('PT48H')));
        $fishbowl->setCurrentStatus(Fishbowl::STATUS_RUNNING);

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);

        $responseStatus = $this->service->getFishbowlStatus('fishbowl-slug');

        $this->assertSame(strtoupper(Fishbowl::STATUS_FINISHED), $responseStatus);
    }

    /** @test */
    public function itGetsEmptyParticipantsWithExistingFishbowl(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setName('fishbowl name');

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->security->method('getUser')->willReturn(null);

        $responseParticipants = $this->service->getParticipants('fishbowl-slug');

        $this->assertSame([], $responseParticipants);
    }

    /** @test */
    public function itGetsEmptyParticipantsWithoutFishbowl(): void
    {
        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn(null);
        $this->security->method('getUser')->willReturn(null);

        $responseParticipants = $this->service->getParticipants('fishbowl-slug');

        $this->assertSame([], $responseParticipants);
    }

    /** @test */
    public function itGetsModeratorParticipant(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setName('fishbowl name');

        $user = new User();
        $user->setName('Name');
        $user->setSurnames('Surname');

        $participant = new Participant();
        $participant->setFishbowl($fishbowl);
        $participant->setUser($user);
        $participant->setGuest(null);

        $expectedParticipantArray = [
            'id' => $participant->getId(),
            'lastPing' => $participant->getLastPing(),
            'name' => $participant->getUserName(),
            'twitter' => $participant->getPublicTwitterProfile(),
            'linkedin' => $participant->getPublicLinkedinAccount(),
            'isModerator' => $participant->isModerator($fishbowl),
            'isCurrentUser' => true,
            'guestId' => null,
            'joined' => false,
            'isMuted' => false,
        ];

        $expectedResult = [$expectedParticipantArray];

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->security->method('getUser')->willReturn($user);

        $this->participantRepository->method('getParticipants')->with($fishbowl)->willReturn([$participant]);

        $responseParticipants = $this->service->getParticipants('fishbowl-slug');

        $this->assertSame($expectedResult, $responseParticipants);
    }

    /** @test */
    public function itGetsFalseWhenThereIsNoRequest(): void
    {
        $response = $this->service->ping('fishbowl-slug');
        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseFishbowlSlugDoesntExist(): void
    {
        $request = new Request();
        $request->request->set('guestId', '1');
        $this->requestStack->push($request);

        $response = $this->service->ping('fishbowl-slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenFishbowlExistsButThereIsNoParticipantOrGuest(): void
    {
        $request = new Request();
        $request->request->set('guestId', '1');
        $this->requestStack->push($request);

        $fishbowl = new Fishbowl();
        $fishbowl->setSlug('fishbowl-slug');

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $response = $this->service->ping('fishbowl-slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsTrueWhenParticipantExistsInRepository(): void
    {
        $request = new Request();
        $request->request->set('guestId', '1');
        $this->requestStack->push($request);

        $fishbowl = new Fishbowl();
        $fishbowl->setSlug('fishbowl-slug');

        $guest = new Guest();
        $participant = new Participant();

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->guestRepository->method('find')->with('1')->willReturn($guest);

        $this->participantRepository->method('findGuestInFishbowl')->with($fishbowl, $guest)->willReturn($participant);

        $this->participantRepository->expects($this->once())->method('persist')->with($participant);

        $response = $this->service->ping('fishbowl-slug');

        $this->assertTrue($response);
    }

    /** @test */
    public function itGetsTrueWhenUserExistsInFishbowl(): void
    {
        $request = new Request();
        $this->requestStack->push($request);

        $fishbowl = new Fishbowl();
        $fishbowl->setSlug('fishbowl-slug');

        $user = new User();

        $participant = new Participant();

        $this->security->method('getUser')->willReturn($user);
        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->participantRepository->method('findUserInFishbowl')->with($fishbowl, $user)->willReturn($participant);

        $this->participantRepository->expects($this->once())->method('persist')->with($participant);

        $response = $this->service->ping('fishbowl-slug');

        $this->assertTrue($response);
    }

    /** @test */
    public function createsNewParticipantAndFishbowlWhenItDoesntExists(): void
    {
        $request = new Request();
        $this->requestStack->push($request);

        $fishbowl = new Fishbowl();
        $fishbowl->setSlug('fishbowl-slug');

        $user = new User();

        $this->security->method('getUser')->willReturn($user);
        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->participantRepository->method('findUserInFishbowl')->with($fishbowl, $user)->willReturn(null);

        $this->participantRepository->expects($this->once())->method('persist');
        $this->fishbowlRepository->expects($this->once())->method('persist')->with($fishbowl);

        $response = $this->service->ping('fishbowl-slug');

        $this->assertTrue($response);
    }

    /** @test */
    public function createsNewGuestParticipantAndFishbowlWhenItDoesntExists(): void
    {
        $request = new Request();
        $request->request->set('guestId', '1');
        $this->requestStack->push($request);

        $fishbowl = new Fishbowl();
        $fishbowl->setSlug('fishbowl-slug');

        $guest = new Guest();
        $guest->setName('test');

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);
        $this->guestRepository->method('find')->with('1')->willReturn($guest);

        $this->participantRepository->method('findGuestInFishbowl')->with($fishbowl, $guest)->willReturn(null);

        $this->participantRepository->expects($this->once())->method('persist');
        $this->fishbowlRepository->expects($this->once())->method('persist')->with($fishbowl);

        $response = $this->service->ping('fishbowl-slug');

        $this->assertTrue($response);
    }

    /** @test */
    public function itCantStartFishbowlWhenFishbowlDoesntExists(): void
    {
        $user = new User();

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn(null);

        $response = $this->service->canFishbowlStart('fishbowl-slug', $user);

        $this->assertFalse($response);
    }

    /** @test */
    public function itCantStartFishbowlWhenFishbowlHostIsNotTheSame(): void
    {
        $user = new User();
        $host = new User();

        $fishbowl = new Fishbowl();
        $fishbowl->setHost($host);

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);

        $response = $this->service->canFishbowlStart('fishbowl-slug', $user);

        $this->assertFalse($response);
    }

    /** @test */
    public function itCanStartFishbowl(): void
    {
        $host = new User();

        $fishbowl = new Fishbowl();
        $fishbowl->setHost($host);

        $this->fishbowlRepository->method('findBySlug')->with('fishbowl-slug')->willReturn($fishbowl);

        $response = $this->service->canFishbowlStart('fishbowl-slug', $host);

        $this->assertTrue($response);
    }

    /**
     * @test
     * @dataProvider fishbowlTitleProvider
     */
    public function itGeneratesDefaultTitle(string $fishbowlTitle): void
    {
        $user = new User();
        $user->setName('Name');

        $fishbowl = new Fishbowl();
        $fishbowl->setName($fishbowlTitle);
        $fishbowl->setLocale('en');
        $fishbowl->setHost($user);
        $expectedName = 'Fishbowl Meeting - Name';

        $this->translator->method('trans')->willReturn($expectedName);
        $fishbowlResponse = $this->service->generateDefaultTitle($fishbowl);

        $this->assertSame($expectedName, $fishbowlResponse->getName());
    }

    /** @return iterable<array{string}> */
    public function fishbowlTitleProvider(): iterable
    {
        yield [''];
        yield ['   '];
    }

    /** @test */
    public function itReturnsSameTitleWhenGeneratingDefaultTitle(): void
    {
        $fishbowl = new Fishbowl();
        $fishbowl->setName('Fishbowl test name');

        $response = $this->service->generateDefaultTitle($fishbowl);

        $this->assertSame($fishbowl->getName(), $response->getName());
    }
}

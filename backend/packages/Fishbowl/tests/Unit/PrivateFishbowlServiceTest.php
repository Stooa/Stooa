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

use App\Core\Encryption\HalitePasswordEncryption;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Zenstruck\Foundry\Test\Factories;

class PrivateFishbowlServiceTest extends TestCase
{
    use Factories;

    /** @var MockObject&HalitePasswordEncryption */
    private MockObject $halitePasswordEncryption;
    /** @var MockObject&Security */
    private MockObject $security;
    /** @var MockObject&FishbowlRepository */
    private MockObject $fishbowlRepository;
    private RequestStack $requestStack;
    private PrivateFishbowlService $privateFishbowlService;

    protected function setUp(): void
    {
        $this->halitePasswordEncryption = $this->createMock(HalitePasswordEncryption::class);
        $this->security = $this->createMock(Security::class);
        $this->requestStack = new RequestStack();
        $this->fishbowlRepository = $this->createMock(FishbowlRepository::class);

        $this->privateFishbowlService = new PrivateFishbowlService(
            $this->halitePasswordEncryption,
            $this->security,
            $this->requestStack,
            $this->fishbowlRepository
        );
    }

    /** @test */
    public function itDoesntDecryptPasswordWhenFishbowlIsNotPrivate(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $decryptedFishbowl = $this->privateFishbowlService->decryptPrivatePassword($fishbowl);

        $this->assertNull($decryptedFishbowl->getPlainPassword());
    }

    /** @test */
    public function itDecryptPassword(): void
    {
        $fishbowl = FishbowlFactory::createOne([
            'isPrivate' => true,
            'password' => 'password',
        ])->object();

        $this->halitePasswordEncryption->method('decrypt')->willReturn('decryptedPassword');
        $decryptedFishbowl = $this->privateFishbowlService->decryptPrivatePassword($fishbowl);

        $this->assertSame('decryptedPassword', $decryptedFishbowl->getPlainPassword());
    }

    /** @test */
    public function itGetsFalseWhenRequestIsFalse(): void
    {
        $response = $this->privateFishbowlService->isPasswordEqual('slug');
        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenPasswordIsNull(): void
    {
        $request = new Request();

        $request->request->set('password', null);

        $this->requestStack->push($request);

        $response = $this->privateFishbowlService->isPasswordEqual('slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenFishbowlIsNull(): void
    {
        $request = new Request();

        $request->request->set('password', 'password');

        $this->requestStack->push($request);

        $this->fishbowlRepository->method('findBySlug')->willReturn(null);

        $response = $this->privateFishbowlService->isPasswordEqual('slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenFishbowlIsNotPrivate(): void
    {
        $request = new Request();

        $request->request->set('password', 'password');

        $this->requestStack->push($request);

        $fishbowl = FishbowlFactory::createOne()->object();

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);

        $response = $this->privateFishbowlService->isPasswordEqual('slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenIsPrivateButPasswordAreNotTheSame(): void
    {
        $request = new Request();

        $request->request->set('password', 'password');

        $this->requestStack->push($request);

        $fishbowl = FishbowlFactory::createOne([
            'isPrivate' => true,
        ])->object();

        $this->halitePasswordEncryption->method('decrypt')->willReturn('anotherPassword');

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);

        $response = $this->privateFishbowlService->isPasswordEqual('slug');

        $this->assertFalse($response);
    }

    /** @test */
    public function itGetsFalseWhenIsPrivateButPasswordAreTheSame(): void
    {
        $request = new Request([], [], [], [], [], [], json_encode(['password' => 'password'], \JSON_THROW_ON_ERROR));

        $this->requestStack->push($request);

        $fishbowl = FishbowlFactory::createOne([
            'isPrivate' => true,
        ])->object();

        $this->halitePasswordEncryption->method('decrypt')->willReturn('password');

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);

        $response = $this->privateFishbowlService->isPasswordEqual('slug');

        $this->assertTrue($response);
    }
}

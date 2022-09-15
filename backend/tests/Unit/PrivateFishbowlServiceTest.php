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

use App\Encryption\HalitePasswordEncryption;
use App\Factory\FishbowlFactory;
use App\Repository\FishbowlRepository;
use App\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Zenstruck\Foundry\Test\Factories;

class PrivateFishbowlServiceTest extends TestCase
{
    use Factories;

    /** @var MockObject&HalitePasswordEncryption */
    private MockObject $halitePasswordEncryption;
    /** @var MockObject&Security */
    private MockObject $security;
    /** @var MockObject&RequestStack */
    private MockObject $requestStack;
    /** @var MockObject&FishbowlRepository */
    private MockObject $fishbowlRepository;
    private PrivateFishbowlService $privateFishbowlService;

    protected function setUp(): void
    {
        $this->halitePasswordEncryption = $this->createMock(HalitePasswordEncryption::class);
        $this->security = $this->createMock(Security::class);
        $this->requestStack = $this->createMock(RequestStack::class);
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
}

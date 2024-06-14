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

namespace App\Fishbowl\Tests\Unit\Resolver;

use ApiPlatform\Exception\ItemNotFoundException;
use App\Core\Factory\UserFactory;
use App\Core\Resolver\EventCreatorResolver;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Zenstruck\Foundry\Test\Factories;

class FishbowlCreatorResolverTest extends TestCase
{
    use Factories;

    private EventCreatorResolver $resolver;
    /** @var MockObject&FishbowlRepository */
    private MockObject $fishbowlRepository;
    /** @var MockObject&PrivateFishbowlService */
    private MockObject $privateFishbowlService;
    /** @var MockObject&Security */
    private MockObject $security;

    protected function setUp(): void
    {
        parent::setUp();

        $this->privateFishbowlService = $this->createMock(PrivateFishbowlService::class);
        $this->fishbowlRepository = $this->createMock(FishbowlRepository::class);
        $this->security = $this->createMock(Security::class);

        $this->resolver = new EventCreatorResolver(
            $this->fishbowlRepository,
            $this->security,
            $this->privateFishbowlService
        );
    }

    /** @test */
    public function itThrowsExceptionWhenSlugIsNull(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $this->expectException(ItemNotFoundException::class);

        ($this->resolver)($fishbowl, []);
    }

    /** @test */
    public function itGetsTheSameFishbowl(): void
    {
        $context = ['args' => ['slug' => 'fishbowl-slug']];

        $fishbowl = FishbowlFactory::createOne()->object();

        $response = ($this->resolver)($fishbowl, $context);

        $this->assertSame($fishbowl, $response);
    }

    /** @test */
    public function itReturnsNullWhenFishbowlSlugDoesntExists(): void
    {
        $context = ['args' => ['slug' => 'fishbowl-slug']];

        $this->fishbowlRepository->method('findBySlug')->willReturn(null);

        $this->expectException(ItemNotFoundException::class);

        ($this->resolver)(null, $context);
    }

    /** @test */
    public function itDecryptsPasswordWhenFishbowlIsHost(): void
    {
        $user = UserFactory::createOne()->object();

        $fishbowl = FishbowlFactory::createOne([
            'host' => $user,
        ])->object();

        $decryptedFishbowl = FishbowlFactory::createOne([
            'plainPassword' => 'password',
        ])->object();

        $context = ['args' => ['slug' => 'fishbowl-slug']];

        $this->fishbowlRepository->method('findBySlug')->willReturn($fishbowl);
        $this->security->method('getUser')->willReturn($user);
        $this->privateFishbowlService->method('decryptPrivatePassword')->willReturn($decryptedFishbowl);

        $response = ($this->resolver)(null, $context);

        $this->assertSame($response, $decryptedFishbowl);
    }
}

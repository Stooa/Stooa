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

use App\Factory\FishbowlFactory;
use App\Repository\FishbowlRepository;
use App\Resolver\FishbowlResolver;
use App\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class FishbowlResolverTest extends TestCase
{
    use Factories;

    private FishbowlResolver $resolver;
    /** @var MockObject&FishbowlRepository */
    private MockObject $fishbowlRepository;
    /** @var MockObject&PrivateFishbowlService */
    private MockObject $privateFishbowlService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->privateFishbowlService = $this->createMock(PrivateFishbowlService::class);
        $this->fishbowlRepository = $this->createMock(FishbowlRepository::class);
        $this->resolver = new FishbowlResolver(
            $this->fishbowlRepository,
            $this->privateFishbowlService
        );
    }

    /** @test */
    public function itGetsSameFishbowlWhenItemIsNotNull(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $response = ($this->resolver)($fishbowl, []);

        $this->assertSame($fishbowl, $response);
    }

    /** @test */
    public function itGetsContextSlugWhenItemIsNull(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $context = ['args' => ['slug' => 'fishbowl-slug']];
        $this->fishbowlRepository->method('findBySlug')->willReturn(null);

        $response = ($this->resolver)($fishbowl, $context);
        $this->assertSame($fishbowl, $response);
    }
}

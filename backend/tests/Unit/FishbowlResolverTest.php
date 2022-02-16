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
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Zenstruck\Foundry\Test\Factories;

class FishbowlResolverTest extends TestCase
{
    use Factories;

    private FishbowlResolver $resolver;
    /** @var MockObject&FishbowlRepository */
    private MockObject $fishbowlRepository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fishbowlRepository = $this->createMock(FishbowlRepository::class);
        $this->resolver = new FishbowlResolver($this->fishbowlRepository);
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
        $context = ['args' => ['slug' => 'fishbowl-slug']];
        $this->fishbowlRepository->expects($this->once())->method('findBySlug')->with('fishbowl-slug');

        ($this->resolver)(null, $context);
    }
}

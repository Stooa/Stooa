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

namespace App\Tests\Unit\Resolver;

use App\Entity\Fishbowl;
use App\Factory\FishbowlFactory;
use App\Repository\FishbowlRepository;
use App\Resolver\FishbowlNoIntroRunMutationResolver;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\WorkflowInterface;
use Zenstruck\Foundry\Test\Factories;

class FishbowlNoIntroRunMutationResolverTest extends TestCase
{
    use Factories;

    /** @var Stub&FishbowlRepository */
    private Stub $repository;
    /** @var MockObject&WorkflowInterface */
    private MockObject $stateMachine;
    private FishbowlNoIntroRunMutationResolver $resolver;
    /** @var array<string, mixed> */
    private array $context;

    protected function setUp(): void
    {
        $this->repository = $this->createStub(FishbowlRepository::class);
        $this->stateMachine = $this->createMock(WorkflowInterface::class);
        $this->context = ['args' => ['input' => ['slug' => 'test']]];

        $this->resolver = new FishbowlNoIntroRunMutationResolver(
            $this->repository,
            $this->stateMachine
        );
    }

    /** @test */
    public function itGetsNullWhenContextIsEmpty(): void
    {
        $this->context = [];

        $returnedFishbowl = ($this->resolver)(null, $this->context);

        $this->assertNull($returnedFishbowl);
    }

    /** @test */
    public function itGetsNullFishbowlWhenFishbowlSlugDontExists(): void
    {
        $this->repository->method('findBySlug')->willReturn(null);

        $returnedFishbowl = ($this->resolver)(null, $this->context);

        $this->assertNull($returnedFishbowl);
    }

    /** @test */
    public function itGetsNullWhenFishbowlCantChangeWorkflowStatus(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $this->repository->method('findBySlug')->willReturn($fishbowl);
        $this->stateMachine->method('can')->willReturn(false)->with($fishbowl, Fishbowl::TRANSITION_NO_INTRO_RUN);

        $returnedFishbowl = ($this->resolver)(null, $this->context);

        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
        $this->assertNull($returnedFishbowl);
    }

    /** @test */
    public function itGetsCorrectFishbowl(): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $this->repository->method('findBySlug')->willReturn($fishbowl);
        $this->stateMachine->method('can')->willReturn(true)->with($fishbowl, Fishbowl::TRANSITION_NO_INTRO_RUN);
        $this->stateMachine->expects($this->once())->method('apply')->with($fishbowl, Fishbowl::TRANSITION_NO_INTRO_RUN);

        $returnedFishbowl = ($this->resolver)(null, $this->context);

        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
        $this->assertSame($fishbowl, $returnedFishbowl);
    }
}

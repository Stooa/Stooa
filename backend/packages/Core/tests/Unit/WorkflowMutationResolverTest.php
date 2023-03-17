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

namespace App\Core\Tests\Unit;

use ApiPlatform\GraphQl\Resolver\MutationResolverInterface;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Resolver\FishbowlFinishMutationResolver;
use App\Fishbowl\Resolver\FishbowlIntroduceMutationResolver;
use App\Fishbowl\Resolver\FishbowlNoIntroRunMutationResolver;
use App\Fishbowl\Resolver\FishbowlRunMutationResolver;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Workflow\WorkflowInterface;
use Webmozart\Assert\Assert;
use Zenstruck\Foundry\Test\Factories;

class WorkflowMutationResolverTest extends TestCase
{
    use Factories;

    /** @var Stub&FishbowlRepository */
    private Stub $repository;
    /** @var MockObject&WorkflowInterface */
    private MockObject $stateMachine;
    /** @var array<string, mixed> */
    private array $context;

    protected function setUp(): void
    {
        $this->repository = $this->createStub(FishbowlRepository::class);
        $this->stateMachine = $this->createMock(WorkflowInterface::class);
        $this->context = ['args' => ['input' => ['slug' => 'test']]];
    }

    /**
     * @test
     *
     * @dataProvider mutationResolverProvider
     */
    public function itGetsNullWhenContextIsEmpty(string $className): void
    {
        $this->context = [];

        $resolver = new $className(
            $this->repository,
            $this->stateMachine
        );

        Assert::isInstanceOf($resolver, MutationResolverInterface::class);

        $returnedFishbowl = $resolver(null, $this->context);

        $this->assertNull($returnedFishbowl);
    }

    /**
     * @test
     *
     * @dataProvider mutationResolverProvider
     */
    public function itGetsNullFishbowlWhenFishbowlSlugDontExists(string $className): void
    {
        $resolver = new $className(
            $this->repository,
            $this->stateMachine
        );

        Assert::isInstanceOf($resolver, MutationResolverInterface::class);

        $this->repository->method('findBySlug')->willReturn(null);

        $returnedFishbowl = $resolver(null, $this->context);

        $this->assertNull($returnedFishbowl);
    }

    /**
     * @test
     *
     * @dataProvider mutationResolverProviderWithTransition
     */
    public function itGetsNullWhenFishbowlCantChangeWorkflowStatus(string $className, string $transition): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();
        $this->repository->method('findBySlug')->willReturn($fishbowl);
        $this->stateMachine->method('can')->willReturn(false)->with($fishbowl, $transition);

        $resolver = new $className(
            $this->repository,
            $this->stateMachine
        );

        Assert::isInstanceOf($resolver, MutationResolverInterface::class);

        $returnedFishbowl = $resolver(null, $this->context);

        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
        $this->assertNull($returnedFishbowl);
    }

    /**
     * @test
     *
     * @dataProvider mutationResolverProviderWithTransition
     */
    public function itGetsCorrectFishbowl(string $className, string $transition): void
    {
        $fishbowl = FishbowlFactory::createOne()->object();

        $this->repository->method('findBySlug')->willReturn($fishbowl);
        $this->stateMachine->method('can')->willReturn(true)->with($fishbowl, $transition);
        $this->stateMachine->expects($this->once())->method('apply')->with($fishbowl, $transition);

        $resolver = new $className(
            $this->repository,
            $this->stateMachine
        );

        Assert::isInstanceOf($resolver, MutationResolverInterface::class);

        $returnedFishbowl = $resolver(null, $this->context);

        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
        $this->assertSame($fishbowl, $returnedFishbowl);
    }

    /** @return iterable<array{0: class-string}> */
    public static function mutationResolverProvider(): iterable
    {
        yield [FishbowlRunMutationResolver::class];
        yield [FishbowlNoIntroRunMutationResolver::class];
        yield [FishbowlIntroduceMutationResolver::class];
        yield [FishbowlFinishMutationResolver::class];
    }

    /** @return iterable<array{0: class-string, 1: Fishbowl::TRANSITION_*}> */
    public static function mutationResolverProviderWithTransition(): iterable
    {
        yield [FishbowlRunMutationResolver::class, Fishbowl::TRANSITION_RUN];
        yield [FishbowlNoIntroRunMutationResolver::class, Fishbowl::TRANSITION_NO_INTRO_RUN];
        yield [FishbowlIntroduceMutationResolver::class, Fishbowl::TRANSITION_INTRODUCE];
        yield [FishbowlFinishMutationResolver::class, Fishbowl::TRANSITION_FINISH];
    }
}

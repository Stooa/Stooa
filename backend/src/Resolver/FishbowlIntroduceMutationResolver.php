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

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Fishbowl;
use App\Repository\FishbowlRepository;
use Symfony\Component\Workflow\WorkflowInterface;
use Webmozart\Assert\Assert;

class FishbowlIntroduceMutationResolver implements MutationResolverInterface
{
    private FishbowlRepository $repository;
    private WorkflowInterface $fishbowlStateMachine;

    public function __construct(FishbowlRepository $repository, WorkflowInterface $fishbowlStateMachine)
    {
        $this->repository = $repository;
        $this->fishbowlStateMachine = $fishbowlStateMachine;
    }

    /** @param Fishbowl|null $item */
    public function __invoke($item, array $context): ?Fishbowl
    {
        $fishbowl = $this->repository->findBySlug($context['args']['input']['slug']);

        if (null === $fishbowl) {
            return null;
        }

        Assert::isInstanceOf($fishbowl, Fishbowl::class);

        if (!$this->fishbowlStateMachine->can($fishbowl, FISHBOWL::TRANSITION_INTRODUCE)) {
            return null;
        }

        $this->fishbowlStateMachine->apply($fishbowl, FISHBOWL::TRANSITION_INTRODUCE);

        return $fishbowl;
    }
}

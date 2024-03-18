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

namespace App\WorldCafe\Resolver;

use ApiPlatform\GraphQl\Resolver\MutationResolverInterface;
use App\Core\Model\Event;
use App\WorldCafe\Repository\WorldCafeRepository;
use Symfony\Component\Workflow\WorkflowInterface;

class WorldCafeIntroduceMutationResolver implements MutationResolverInterface
{
    public function __construct(
        private readonly WorldCafeRepository $repository,
        private readonly WorkflowInterface $eventStateMachine
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke(?object $item, array $context): ?object
    {
        if (!isset($context['args']['input']['slug'])) {
            return null;
        }

        $worldCafe = $this->repository->findBySlug($context['args']['input']['slug']);

        if (null === $worldCafe) {
            return null;
        }

        if (!$this->eventStateMachine->can($worldCafe, Event::TRANSITION_INTRODUCE)) {
            return null;
        }

        $this->eventStateMachine->apply($worldCafe, Event::TRANSITION_INTRODUCE);

        return $worldCafe;
    }
}

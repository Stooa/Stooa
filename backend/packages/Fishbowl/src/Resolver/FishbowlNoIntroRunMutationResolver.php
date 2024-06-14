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

namespace App\Fishbowl\Resolver;

use ApiPlatform\GraphQl\Resolver\MutationResolverInterface;
use App\Core\Model\Event;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\Workflow\WorkflowInterface;

class FishbowlNoIntroRunMutationResolver implements MutationResolverInterface
{
    public function __construct(
        private readonly FishbowlRepository $repository,
        private readonly WorkflowInterface $eventStateMachine
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke(?object $item, array $context): ?object
    {
        if (!isset($context['args']['input']['slug'])) {
            return null;
        }

        $fishbowl = $this->repository->findBySlug($context['args']['input']['slug']);

        if (null === $fishbowl) {
            return null;
        }

        if (!$this->eventStateMachine->can($fishbowl, Event::TRANSITION_NO_INTRO_RUN)) {
            return null;
        }

        $this->eventStateMachine->apply($fishbowl, Event::TRANSITION_NO_INTRO_RUN);

        return $fishbowl;
    }
}

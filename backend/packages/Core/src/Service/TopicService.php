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

namespace App\Core\Service;

use App\Core\Entity\Topic;
use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class TopicService
{
    /** @var NestedTreeRepository<Topic> */
    protected NestedTreeRepository $repository;

    public function __construct(
        protected readonly EntityManagerInterface $entityManager,
    ) {
        /** @psalm-suppress PropertyTypeCoercion */
        $this->repository = $entityManager->getRepository(Topic::class);
    }

    /** @param array<mixed, mixed> $id */
    public function removeTopics(array $id): void
    {
        $topics = $this->repository->findBy(['id' => $id]);

        foreach ($topics as $topic) {
            $this->repository->removeFromTree($topic);
        }
    }

    public function removeFromTree(Topic $topic): void
    {
        $this->repository->removeFromTree($topic);
    }
}

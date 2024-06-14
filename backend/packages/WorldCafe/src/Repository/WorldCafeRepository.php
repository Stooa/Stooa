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

namespace App\WorldCafe\Repository;

use App\Core\Model\EventRepositoryInterface;
use App\WorldCafe\Entity\WorldCafe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<WorldCafe> */
class WorldCafeRepository extends ServiceEntityRepository implements EventRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WorldCafe::class);
    }

    public function findBySlug(string $slug): ?WorldCafe
    {
        $query = $this->createQueryBuilder('worldcafe')
            ->where('worldcafe.slug = :slug')
            ->setParameter('slug', $slug, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function persist(WorldCafe $worldCafe): void
    {
        $this->_em->persist($worldCafe);
        $this->_em->flush();
    }
}

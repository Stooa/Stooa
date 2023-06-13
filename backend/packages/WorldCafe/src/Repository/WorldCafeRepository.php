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

use App\WorldCafe\Entity\WorldCoffe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<WorldCoffe> */
class WorldCafeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WorldCoffe::class);
    }

    public function findBySlug(string $slug): ?WorldCoffe
    {
        $query = $this->createQueryBuilder('worldcafe')
            ->where('worldcafe.slug = :slug')
            ->setParameter('slug', $slug, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function persist(WorldCoffe $worldCafe): void
    {
        $this->_em->persist($worldCafe);
        $this->_em->flush();
    }
}

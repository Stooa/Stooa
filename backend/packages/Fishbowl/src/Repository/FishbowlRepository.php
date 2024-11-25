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

namespace App\Fishbowl\Repository;

use App\Core\Entity\User;
use App\Fishbowl\Entity\Fishbowl;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Fishbowl> */
class FishbowlRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Fishbowl::class);
    }

    public function findBySlug(string $slug): ?Fishbowl
    {
        $query = $this->createQueryBuilder('fishbowl')
            ->where('fishbowl.slug = :slug')
            ->setParameter('slug', $slug, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findById(string $id): ?Fishbowl
    {
        $query = $this->createQueryBuilder('fishbowl')
            ->where('fishbowl.id = :id')
            ->setParameter('id', $id, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    /** @return Fishbowl[] */
    public function findAllByUser(User $user): ?array
    {
        $query = $this->createQueryBuilder('fishbowl')
            ->where('fishbowl.host = :host')
            ->setParameter('host', $user->getId(), 'uuid')
            ->getQuery();

        return $query->getResult();
    }

    public function persist(Fishbowl $fishbowl): void
    {
        $this->_em->persist($fishbowl);
        $this->_em->flush();
    }
}

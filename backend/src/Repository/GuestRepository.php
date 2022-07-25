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

namespace App\Repository;

use App\Entity\Guest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/** @extends ServiceEntityRepository<Guest> */
class GuestRepository extends ServiceEntityRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Guest::class);
    }

    public function loadUserByIdentifier(string $identifier): ?UserInterface
    {
        $query = $this->createQueryBuilder('guest')
            ->where('guest.id = :id')
            ->setParameter('id', $identifier)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function persist(Guest $guest): void
    {
        $this->_em->persist($guest);
        $this->_em->flush();
    }
}

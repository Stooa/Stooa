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

namespace App\Core\Repository;

use App\Core\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/** @extends ServiceEntityRepository<User> */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface, UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(\sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }

    public function loadUserByIdentifier(string $identifier): ?User
    {
        $query = $this->createQueryBuilder('user')
            ->where('user.email = :email')
            ->andWhere('user.active = true')
            ->setParameter('email', $identifier, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findUserById(?string $id): ?User
    {
        $query = $this->createQueryBuilder('user')
            ->where('user.id = :id')
            ->andWhere('user.active = true')
            ->setParameter('id', $id, Types::STRING)
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function persist(User $user): void
    {
        $this->_em->persist($user);
        $this->_em->flush();
    }
}

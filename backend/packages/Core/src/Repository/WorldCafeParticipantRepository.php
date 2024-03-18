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

use App\Core\Entity\Guest;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\EventInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Participant> */
class WorldCafeParticipantRepository extends ServiceEntityRepository implements ParticipantRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Participant::class);
    }

    public function findUserInEvent(EventInterface $event, User $user): ?Participant
    {
        $query = $this->createQueryBuilder('participant')
            ->where('participant.worldCafe = :worldCafe')
            ->andWhere('participant.user = :user')
            ->setParameter('worldCafe', $event->getId(), 'uuid')
            ->setParameter('user', $user->getId(), 'uuid')
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findGuestInEvent(EventInterface $event, Guest $guest): ?Participant
    {
        $query = $this->createQueryBuilder('participant')
            ->where('participant.worldCafe = :worldCafe')
            ->andWhere('participant.guest = :guest')
            ->setParameter('worldCafe', $event->getId(), 'uuid')
            ->setParameter('guest', $guest->getId(), 'uuid')
            ->getQuery();

        return $query->getOneOrNullResult();
    }

    /** @return Participant[] */
    public function getParticipantsByEvent(EventInterface $event): array
    {
        $now = new \DateTimeImmutable();
        $twentySeconds = new \DateInterval('PT20S');

        $query = $this->createQueryBuilder('participant')
            ->where('participant.worldCafe = :worldCafe')
            ->andWhere('participant.lastPing >= :twentySeconds')
            ->setParameter('worldCafe', $event->getId(), 'uuid')
            ->setParameter('twentySeconds', $now->sub($twentySeconds), Types::DATETIME_IMMUTABLE)
            ->orderBy('participant.id', 'ASC')
            ->getQuery();

        return $query->getResult();
    }

    public function persist(Participant $participant): void
    {
        $this->_em->persist($participant);
        $this->_em->flush();
    }
}

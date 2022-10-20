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

namespace App\Core\Extension;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Core\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Fishbowl;
use Symfony\Component\Security\Core\Security;
use Webmozart\Assert\Assert;

class FishbowlListExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ): void {
        if (Fishbowl::class !== $resourceClass || null === $user = $this->security->getUser()) {
            return;
        }

        Assert::isInstanceOf($user, User::class);

        $rootAlias = $queryBuilder->getRootAliases()[0];

        $queryBuilder->andWhere(sprintf('%s.host = :host', $rootAlias));
        $queryBuilder->setParameter('host', $user->getId(), 'uuid');

        $queryBuilder->andWhere(sprintf('%s.currentStatus != :finished', $rootAlias));
        $queryBuilder->setParameter('finished', Fishbowl::STATUS_FINISHED);

        $queryBuilder->addOrderBy(sprintf('%s.startDateTime', $rootAlias), 'ASC');
    }
}

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

namespace App\Fishbowl\Tests\Unit;

use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use App\Core\Entity\User;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Extension\FishbowlListExtension;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\QueryBuilder;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;

class FishbowlListExtensionTest extends TestCase
{
    private FishbowlListExtension $extension;
    /** @var Stub&Security */
    private Stub $security;
    /** @var Stub&EntityManager */
    private Stub $entityManager;

    protected function setUp(): void
    {
        parent::setUp();

        $this->entityManager = $this->createStub(EntityManager::class);
        $this->security = $this->createStub(Security::class);
        $this->extension = new FishbowlListExtension($this->security);
    }

    /** @test */
    public function itReturnsWhenIsNotFishbowlClass(): void
    {
        $queryBuilder = new QueryBuilder($this->entityManager);

        $queryNameGenerator = new QueryNameGenerator();

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, User::class);

        $this->assertSame($queryBuilder->getRootAliases(), []);
    }

    /** @test */
    public function itReturnsWhenThereIsNoUser(): void
    {
        $queryBuilder = new QueryBuilder($this->entityManager);

        $queryNameGenerator = new QueryNameGenerator();

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, Fishbowl::class);

        $this->assertSame($queryBuilder->getRootAliases(), []);
    }

    /** @test */
    public function itReturnsFishbowlQuery(): void
    {
        $queryBuilder = new QueryBuilder($this->entityManager);
        $queryBuilder
            ->select('id')
            ->from('fishbowl', 'fishbowl');
        $queryNameGenerator = new QueryNameGenerator();

        $this->security->method('getUser')->willReturn(new User());

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, Fishbowl::class);

        $this->assertSame($queryBuilder->getRootAliases(), ['fishbowl']);

        $responseQuery = 'SELECT id FROM fishbowl fishbowl WHERE fishbowl.host = :host AND fishbowl.currentStatus != :finished AND fishbowl.startDateTime > :fiveHoursAgo ORDER BY fishbowl.startDateTime ASC';

        $this->assertSame($queryBuilder->getDQL(), $responseQuery);
    }
}

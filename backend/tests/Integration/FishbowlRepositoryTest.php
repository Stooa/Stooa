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

namespace Tests\Integration;

use App\Entity\Fishbowl;
use App\Repository\FishbowlRepository;
use Runroom\Testing\TestCase\DoctrineTestCase;

class FishbowlRepositoryTest extends DoctrineTestCase
{
    private FishbowlRepository $fishbowlRepository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fishbowlRepository = self::$container->get(FishbowlRepository::class);
    }

    /** @test */
    public function itDoesntFindBySlug(): void
    {
        $fishbowl = $this->fishbowlRepository->findBySlug('fishbowl-doesnt-exists');
        $this->assertNull($fishbowl);
    }

    /** @test */
    public function itFindBySlug(): void
    {
        $fishbowl = $this->fishbowlRepository->findBySlug('fishbowl-name');
        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
    }

    protected function getDataFixtures(): array
    {
        return ['fishbowl.yaml'];
    }
}

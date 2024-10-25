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

namespace App\Fishbowl\Tests\Integration;

use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class FishbowlRepositoryTest extends KernelTestCase
{
    use Factories;
    use ResetDatabase;

    private FishbowlRepository $fishbowlRepository;

    /**
     * @psalm-suppress InternalMethod
     * @psalm-suppress PropertyTypeCoercion
     *
     * $container->get() is considered internal and is not well detected by Psalm,
     * this will change once we migrate to Foundry and remove our DoctrineTestCase
     */
    protected function setUp(): void
    {
        parent::bootKernel();

        $this->fishbowlRepository = static::getContainer()->get(FishbowlRepository::class);
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
        FishbowlFactory::createOne([
            'slug' => 'fishbowl-name',
        ]);

        $fishbowl = $this->fishbowlRepository->findBySlug('fishbowl-name');
        $this->assertInstanceOf(Fishbowl::class, $fishbowl);
    }
}

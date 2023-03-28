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

namespace App\Core\Tests\Integration;

use App\Core\Entity\Topic;
use App\Fishbowl\Factory\TopicFactory;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class TopicRepositoryTest extends KernelTestCase
{
    use Factories;
    use ResetDatabase;

    private ObjectManager $entityManager;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    /** @test */
    public function itGetsTopic(): void
    {
        $topic = TopicFactory::createOne()->object();

        $response = $this->entityManager->getRepository(Topic::class)->find($topic->getId());

        $this->assertInstanceOf(Topic::class, $response);
    }
}

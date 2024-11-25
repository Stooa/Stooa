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

namespace App\Fishbowl\Service\OpenAI;

use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class FishbowlSummaryService extends AbstractController
{
    public function __construct(
        private readonly FishbowlRepository $fishbowlRepository
    ) {
    }

    public function saveSummary(string $summary, string $slug): void
    {
        $fishbowl = $this->fishbowlRepository->findBySlug($slug);

        if (null !== $fishbowl) {
            $fishbowl->setSummary($summary);
            $fishbowl->setSummaryUpdatedAt(new \DateTimeImmutable());

            $this->fishbowlRepository->persist($fishbowl);
        }
    }
}

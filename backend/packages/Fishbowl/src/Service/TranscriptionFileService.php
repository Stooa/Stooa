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

namespace App\Fishbowl\Service;

use App\Fishbowl\Repository\FishbowlRepository;

class TranscriptionFileService
{
    public function __construct(private readonly FishbowlRepository $fishbowlRepository)
    {
    }

    /** @param array<mixed, mixed> $requestArray */
    public function save(array $requestArray, string $path): void
    {
        if (isset($requestArray['data']['preAuthenticatedLink'], $requestArray['fqn'])) {
            $slug = $this->getSlugFromFqn($requestArray['fqn']);

            $fileContent = file_get_contents($requestArray['data']['preAuthenticatedLink']);

            $fileName = $slug . '.json';

            file_put_contents($path . '/' . $fileName, $fileContent);

            $fishbowl = $this->fishbowlRepository->findBySlug($slug);

            if ($fishbowl->isHasSummary()) {
                // todo create new message
            }
        }
    }

    private function getSlugFromFqn(string $fqn): string
    {
        $urlParts = explode('/', $fqn);

        return end($urlParts);
    }
}

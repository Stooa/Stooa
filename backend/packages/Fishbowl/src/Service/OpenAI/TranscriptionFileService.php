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

use App\Fishbowl\Message\UploadFileOpenAI;
use App\Fishbowl\Repository\FishbowlRepository;
use Symfony\Component\Messenger\MessageBusInterface;

class TranscriptionFileService
{
    public function __construct(
        private readonly FishbowlRepository $fishbowlRepository,
        private readonly MessageBusInterface $bus,
    ) {
    }

    /** @param array<mixed, mixed> $requestArray */
    public function save(array $requestArray, string $path): void
    {
        if (isset($requestArray['data']['preAuthenticatedLink'], $requestArray['fqn'])) {
            $slug = $this->getSlugFromFqn($requestArray['fqn']);

            $fileName = $path . '/' . $slug . '.json';

            file_put_contents($fileName, file_get_contents($requestArray['data']['preAuthenticatedLink']));

            $fishbowl = $this->fishbowlRepository->findBySlug($slug);

            if (null !== $fishbowl && $fishbowl->isHasSummary()) {
                $this->bus->dispatch(new UploadFileOpenAI($slug));
            }
        }
    }

    private function getSlugFromFqn(string $fqn): string
    {
        $urlParts = explode('/', $fqn);

        return end($urlParts);
    }
}

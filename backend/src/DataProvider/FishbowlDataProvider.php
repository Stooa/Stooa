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

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\CollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Fishbowl;
use App\Service\PrivateFishbowlService;

final class FishbowlDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(private readonly PrivateFishbowlService $privateFishbowlService, private readonly CollectionDataProviderInterface $collectionDataProvider)
    {
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Fishbowl::class === $resourceClass;
    }

    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        /** @var Fishbowl[] $fishbowls */
        $fishbowls = $this->collectionDataProvider->getCollection($resourceClass, $operationName, $context);

        foreach ($fishbowls as $fishbowl) {
            $this->privateFishbowlService->decryptPrivatePassword($fishbowl);
        }

        return $fishbowls;
    }
}

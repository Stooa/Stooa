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

namespace App\Fishbowl\State;

use ApiPlatform\Doctrine\Orm\State\CollectionProvider;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Service\PrivateFishbowlService;

class FishbowlStateProvider implements ProviderInterface
{
    public function __construct(private readonly PrivateFishbowlService $privateFishbowlService, private readonly CollectionProvider $collectionProvider)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): iterable
    {
        $fishbowls = $this->collectionProvider->provide($operation, $uriVariables, $context);

        foreach ($fishbowls as $fishbowl) {
            $this->privateFishbowlService->decryptPrivatePassword($fishbowl);
        }

        return $fishbowls;
    }
}

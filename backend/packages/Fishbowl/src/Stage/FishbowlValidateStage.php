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

namespace App\Fishbowl\Stage;

use ApiPlatform\GraphQl\Resolver\Stage\ValidateStageInterface;
use ApiPlatform\Metadata\GraphQl\Operation;
use App\Core\Entity\User;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Service\FishbowlService;
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class FishbowlValidateStage implements ValidateStageInterface
{
    public function __construct(
        private readonly ValidateStageInterface $decorated,
        private readonly Security $security,
        private readonly FishbowlService $service
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke(object $object, string $resourceClass, Operation $operation, array $context): void
    {
        if ($object instanceof Fishbowl && null === $object->getId()) {
            $user = $this->security->getUser();

            if (null !== $user) {
                Assert::isInstanceOf($user, User::class);

                $object->setHost($user);
            }

            $object->setSlug($this->service->generateRandomSlug($object));

            $object = $this->service->generateDefaultTitle($object);
        }

        ($this->decorated)($object, $resourceClass, $operation, $context);
    }
}

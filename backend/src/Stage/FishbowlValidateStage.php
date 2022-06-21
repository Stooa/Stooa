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

namespace App\Stage;

use ApiPlatform\Core\GraphQl\Resolver\Stage\ValidateStageInterface;
use App\Entity\Fishbowl;
use App\Entity\User;
use App\Service\FishbowlService;
use Symfony\Component\Security\Core\Security;
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
    public function __invoke($object, string $resourceClass, string $operationName, array $context): void
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

        ($this->decorated)($object, $resourceClass, $operationName, $context);
    }
}

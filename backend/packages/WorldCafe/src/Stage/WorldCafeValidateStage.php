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

namespace App\WorldCafe\Stage;

use ApiPlatform\GraphQl\Resolver\Stage\ValidateStageInterface;
use ApiPlatform\Metadata\GraphQl\Operation;
use App\Core\Entity\User;
use App\Core\Service\SlugService;
use App\WorldCafe\Entity\WorldCoffe;
use App\WorldCafe\Service\WorldCafeService;
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class WorldCafeValidateStage implements ValidateStageInterface
{
    public function __construct(
        private readonly ValidateStageInterface $decorated,
        private readonly Security $security,
        private readonly WorldCafeService $service,
        private readonly SlugService $slugService
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke(object $object, string $resourceClass, Operation $operation, array $context): void
    {
        if ($object instanceof WorldCoffe && null === $object->getId()) {
            $user = $this->security->getUser();

            if (null !== $user) {
                Assert::isInstanceOf($user, User::class);

                $object->setHost($user);
            }

            $object->setSlug($this->slugService->generateRandomSlug());

            $object = $this->service->generateDefaultTitle($object);
        }

        ($this->decorated)($object, $resourceClass, $operation, $context);
    }
}

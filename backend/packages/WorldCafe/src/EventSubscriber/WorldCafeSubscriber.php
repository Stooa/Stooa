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

namespace App\WorldCafe\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Core\Service\SlugService;
use App\WorldCafe\Entity\WorldCafe;
use App\WorldCafe\Service\WorldCafeService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class WorldCafeSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly WorldCafeService $service,
        private readonly Security $security,
        private readonly SlugService $slugService
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [['setCurrentUser', EventPriorities::PRE_VALIDATE]],
        ];
    }

    public function setCurrentUser(ViewEvent $event): void
    {
        $object = $event->getControllerResult();

        if ($object instanceof WorldCafe && null === $object->getId()) {
            $user = $this->security->getUser();

            if (null !== $user) {
                Assert::isInstanceOf($user, User::class);

                $object->setHost($user);
            }

            $object->setSlug($this->slugService->generateRandomSlug());

            $object = $this->service->generateDefaultTitle($object);

            $event->setControllerResult($object);
        }
    }
}

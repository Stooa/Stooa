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

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Fishbowl;
use App\Entity\User;
use App\Service\FishbowlService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
use Webmozart\Assert\Assert;

class FishbowlSubscriber implements EventSubscriberInterface
{
    private FishbowlService $service;
    private Security $security;

    public function __construct(FishbowlService $service, Security $security)
    {
        $this->service = $service;
        $this->security = $security;
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

        if ($object instanceof Fishbowl && null === $object->getId()) {
            $user = $this->security->getUser();

            if (null !== $user) {
                Assert::isInstanceOf($user, User::class);

                $object->setHost($user);
            }

            $object->setSlug($this->service->generateRandomSlug($object));

            $object = $this->service->generateDefaultTitle($object);

            $event->setControllerResult($object);
        }
    }
}

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

use App\Entity\User;
use App\Service\FishbowlService;
use App\Service\JWTService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    private JWTService $JWTService;

    public function __construct(JWTService $JWTService)
    {
        $this->JWTService = $JWTService;
    }

    /** @return array<string, string> */
    public static function getSubscribedEvents(): array
    {
        return [
            Events::JWT_CREATED => 'onJWTCreated',
        ];
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        /** @var User */
        $user = $event->getUser();

        $payload = $event->getData();

        $this->JWTService->foo($payload, $user);

        $event->setData($payload);
    }
}

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
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
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
        $payload['iss'] = 'api_client';
        $payload['aud'] = 'api_client';
        $payload['sub'] = 'meet.jitsi';
        $payload['room'] = $this->buildRoomPermission($user);
        $payload['context'] = [
            'user' => [
                'name' => $user->getFullName(),
                'email' => $user->getEmail(),
                'twitter' => $user->getPublicTwitterProfile(),
                'linkedin' => $user->getPublicLinkedinProfile(),
            ],
        ];

        $event->setData($payload);
    }

    private function buildRoomPermission(User $user): string
    {
        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }
}

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
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    private RequestStack $requestStack;
    private FishbowlService $fishbowlService;

    public function __construct(RequestStack $requestStack, FishbowlService $fishbowlService)
    {
        $this->requestStack = $requestStack;
        $this->fishbowlService = $fishbowlService;
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
        $slug = $this->getRoomFromRequest($user);

        if (null !== $slug) {
            return $slug;
        }

        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }

    private function getRoomFromRequest(User $user): ?string
    {
        if (null === $currentRequest = $this->requestStack->getCurrentRequest()) {
            return null;
        }

        if ((null !== $slug = $currentRequest->get('slug')) && $this->fishbowlService->canFishbowlStart($slug, $user)) {
            return $slug;
        }

        return null;
    }
}

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

namespace App\Service;

use App\Entity\User;
use App\Model\Payload\JWTPayload;
use App\Model\Payload\UserPayload;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;
use Webmozart\Assert\Assert;

final class JWTService
{
    private RequestStack $requestStack;
    private FishbowlService $fishbowlService;
    private bool $isJAAS;

    public function __construct(RequestStack $requestStack, FishbowlService $fishbowlService, bool $isJAAS)
    {
        $this->requestStack = $requestStack;
        $this->fishbowlService = $fishbowlService;
        $this->isJAAS = $isJAAS;
    }

    public function addPayloadToEvent(JWTCreatedEvent $event): void
    {
        /** @var User */
        $user = $event->getUser();

        $payload = $event->getData();

        $jwtPayload = new JWTPayload();
        $jwtPayload->setIss('api_client');
        $jwtPayload->setAud('api_client');
        $jwtPayload->setSub('meet.jitsi');
        $jwtPayload->setRoom($this->buildRoomPermission($user));

        $userPayload = new UserPayload();
        $userPayload->setName($user->getFullName());
        $userPayload->setEmail($user->getEmail());
        $userPayload->setTwitter($user->getPublicTwitterProfile());
        $userPayload->setLinkedin($user->getPublicLinkedinProfile());
        $jwtPayload->setUser($userPayload);

        $event->setData(array_merge($jwtPayload->toArray(), $payload));
    }

    private function buildRoomPermission(UserInterface $user): string
    {
        $slug = $this->getRoomFromRequest($user);

        if (null !== $slug) {
            return $slug;
        }

        Assert::isInstanceOf($user, User::class);

        $currentFishbowl = $user->getCurrentFishbowl();

        if (null !== $currentFishbowl) {
            return (string) $currentFishbowl->getSlug();
        }

        return '';
    }

    /**
     * When a host has multiple fishbowls created we want to specify the room name via endpoint everytime we want to
     * refresh the token.
     */
    private function getRoomFromRequest(UserInterface $user): ?string
    {
        $currentRequest = $this->requestStack->getCurrentRequest();

        if (null !== $currentRequest) {
            $slug = $currentRequest->request->get('room');

            if (null !== $slug && \is_string($slug) && $this->fishbowlService->canFishbowlStart($slug, $user)) {
                return $slug;
            }
        }

        return null;
    }
}

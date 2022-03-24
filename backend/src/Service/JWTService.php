<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

final class JWTService
{
    private RequestStack $requestStack;
    private FishbowlService $fishbowlService;

    public function __construct(RequestStack $requestStack, FishbowlService $fishbowlService)
    {
        $this->requestStack = $requestStack;
        $this->fishbowlService = $fishbowlService;
    }

    public function foo(array $payload, UserInterface $user): array
    {
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

        return $payload;
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
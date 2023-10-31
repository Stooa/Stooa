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

namespace App\Core\Controller;

use App\Core\Entity\User;
use App\Core\Service\Hubspot\SyncContactsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class SyncContactsHubspotController extends AbstractController
{
    public function __construct(
        private readonly SyncContactsService $syncContactsService,
        private readonly Security $security
    ) {
    }

    #[Route('/hubspot/contacts/sync', name: 'app_create_hubspot_contact_sync', methods: ['POST'])]
    public function contacts(): Response
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return new JsonResponse(['error' => 'User not found']);
        }

        if (!$user->getHasHubspotRefreshToken()) {
            return new JsonResponse(['error' => 'User does not have a refresh token']);
        }

        $user = $this->syncContactsService->syncContacts($user);

        return new JsonResponse(['response' => $user->getLastSyncDate()->format(\DateTimeInterface::ATOM)]);
    }
}

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
use App\Core\Message\SyncHubspotNotification;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

final class SyncContactsHubspotController extends AbstractController
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly Security $security
    ) {
    }

    #[Route('/hubspot/contacts/sync', name: 'app_create_hubspot_contact_sync', methods: ['POST'])]
    public function contacts(): Response
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user || null === $userId = $user->getId()) {
            return new JsonResponse(['error' => 'User not found']);
        }

        $this->bus->dispatch(new SyncHubspotNotification($userId));

        return new JsonResponse(['response' => 'ok']);
    }
}

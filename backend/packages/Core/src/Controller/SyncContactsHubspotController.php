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

use App\Core\Service\Hubspot\SyncContactsHubspotService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class SyncContactsHubspotController extends AbstractController
{
    public function __construct(
        private readonly SyncContactsHubspotService $syncContactsHubspotService
    ) {
    }

    #[Route('/hubspot/contacts/sync', name: 'app.hubspot.contacts', methods: ['POST'])]
    public function contacts(): Response
    {
        try {
            $this->syncContactsHubspotService->syncContacts();

            return new JsonResponse(['contacts' => 'Contacts synced']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }
}

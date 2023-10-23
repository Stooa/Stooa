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

use App\Core\Service\Hubspot\ContactsHubspotService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class ContactsHubspotController extends AbstractController
{
    public function __construct(
        private readonly ContactsHubspotService $contactsHubspotService
    ) {
    }

    #[Route('/hubspot/contacts', name: 'app.hubspot.contacts', methods: ['GET'])]
    public function contacts(): Response
    {
        try {
            return new JsonResponse(['contacts' => $this->contactsHubspotService->contacts()]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }
}

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

use App\Core\Model\ContactHubspotDto;
use App\Core\Service\Hubspot\CreateContactHubspotService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

final class CreateContactHubspotController extends AbstractController
{
    public function __construct(
        private readonly CreateContactHubspotService $createContactHubspotService
    ) {
    }

    #[Route('/hubspot/contacts/create', name: 'app_create_hubspot_contact', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] ContactHubspotDto $contact
    ): Response {
        try {
            $this->createContactHubspotService->create($contact->name, $contact->email);

            return new JsonResponse(['contacts' => 'Contact created']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }

    }
}

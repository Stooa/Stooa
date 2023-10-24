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
use App\Core\Model\ContactHubspotDto;
use App\Core\Service\Hubspot\CreateContactService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

final class CreateContactHubspotController extends AbstractController
{
    public function __construct(
        private readonly CreateContactService $createContactService,
        private readonly Security $security
    ) {
    }

    #[Route('/hubspot/contacts/create', name: 'app_create_hubspot_contact_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] ContactHubspotDto $contact
    ): Response {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return new JsonResponse(['error' => 'User not found']);
        }

        try {
            $this->createContactService->create($user, $contact->name, $contact->email);

            return new JsonResponse(['contacts' => 'Contact created']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }

    }
}

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

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class CreateContactHubspotController
{
    #[Route('/hubspot/contacts/create', name: 'app_create_hubspot_contact')]
    public function create(): Response
    {
        return new JsonResponse(['contacts' => 'contact created']);
    }
}

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

use App\Core\Service\Hubspot\HubspotContactService;
use App\Core\Service\Hubspot\HubspotTokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class HubspotController extends AbstractController
{
    public function __construct(
        private readonly HubspotTokenService $hubspotTokenService,
        private readonly HubspotContactService $hubspotContactService
    ) {
    }

    public function token(string $code): Response
    {
        try {
            return new JsonResponse(['token' => $this->hubspotTokenService->createToken($code)]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }

    public function contacts(): Response
    {
        try {
            return new JsonResponse(['contacts' => $this->hubspotContactService->contacts()]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }
}

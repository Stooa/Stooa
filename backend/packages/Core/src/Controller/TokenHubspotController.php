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

use App\Core\Service\Hubspot\HubspotTokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class TokenHubspotController extends AbstractController
{
    public function __construct(
        private readonly HubspotTokenService $hubspotTokenService
    ) {
    }

    #[Route('/hubspot/token/{code}', name: 'app.hubspot.token', methods: ['POST'])]
    public function token(string $code): Response
    {
        try {
            return new JsonResponse(['token' => $this->hubspotTokenService->createToken($code)]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }
}

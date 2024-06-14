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

namespace App\WorldCafe\Controller;

use App\WorldCafe\Service\WorldCafeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class WorldCafeController extends AbstractController
{
    public function __construct(
        private readonly WorldCafeService $worldCafeService,
    ) {
    }

    public function status(string $slug): Response
    {
        return new JsonResponse(['status' => $this->worldCafeService->getWorldCafeStatus($slug)]);
    }

    public function participants(string $slug): Response
    {
        return new JsonResponse(['response' => $this->worldCafeService->getParticipants($slug)]);
    }

    public function ping(string $slug): Response
    {
        $participant = $this->worldCafeService->ping($slug);

        if (!$participant) {
            return new JsonResponse(['response' => null]);
        }

        return new JsonResponse(['response' => [
            'participantId' => '/participants/' . $participant->getId(),
            'participantSlug' => $participant->getWorldCafe()?->getSlug(),
        ]]);
    }
}

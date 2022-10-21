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

namespace App\Fishbowl\Controller;

use App\Fishbowl\Service\FishbowlService;
use App\Fishbowl\Service\PrivateFishbowlService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class FishbowlController extends AbstractController
{
    public function __construct(
        private readonly FishbowlService $fishbowlService,
        private readonly PrivateFishbowlService $privateFishbowlService
    ) {
    }

    public function ping(string $slug): Response
    {
        return new JsonResponse(['response' => $this->fishbowlService->ping($slug)]);
    }

    public function status(string $slug): Response
    {
        return new JsonResponse(['status' => $this->fishbowlService->getFishbowlStatus($slug)]);
    }

    public function participants(string $slug): Response
    {
        return new JsonResponse(['response' => $this->fishbowlService->getParticipants($slug)]);
    }

    public function private(string $slug): Response
    {
        return new JsonResponse(['response' => $this->privateFishbowlService->isPasswordEqual($slug)]);
    }
}

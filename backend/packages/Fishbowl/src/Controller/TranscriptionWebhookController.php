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

use App\Fishbowl\Service\TranscriptionFileService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class TranscriptionWebhookController extends AbstractController
{
    public function __construct(private readonly TranscriptionFileService $transcriptionFileService)
    {

    }

    #[Route('/webhooks/transcription', name: 'webhook_transcription', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $requestArray = $request->toArray();

        $path = $this->getParameter('kernel.project_dir') . '/transcriptions';

        $this->transcriptionFileService->save($requestArray, $path);

        return new JsonResponse(['response' => 'ok']);
    }
}

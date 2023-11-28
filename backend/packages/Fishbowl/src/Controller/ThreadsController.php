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

use App\Fishbowl\Service\GetTranscriptionSummaryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class ThreadsController extends AbstractController
{
    public function __construct(private readonly GetTranscriptionSummaryService $getTranscriptionSummaryService)
    {

    }

    #[Route('/openai/thread/{runId}/{threadId}', name: 'openai_threads', methods: ['POST'])]
    public function __invoke(string $runId, string $threadId, Request $request): JsonResponse
    {
        return new JsonResponse(['response' => $this->getTranscriptionSummaryService->getSummary($runId, $threadId, 'slug')]);
    }
}

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

use App\Fishbowl\Service\OpenAI\SummarizeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class SummarizeController extends AbstractController
{
    public function __construct(private readonly SummarizeService $openAIService)
    {

    }

    #[Route('/openai/summarize/{slug}', name: 'openai_summarize', methods: ['POST'])]
    public function __invoke(string $slug, Request $request): JsonResponse
    {
        $this->openAIService->create($slug);

        return new JsonResponse(['response' => 'File upload']);
    }
}

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

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class WebhookController extends AbstractController
{

    public function transcription(Request $request): Response
    {
        $requestArray = $request->toArray();

        if (isset($requestArray['data']['preAuthenticatedLink'])) {
            $url = $requestArray['data']['preAuthenticatedLink'];
            $sessionId = $requestArray['sessionId'];
            $path = $this->getParameter('kernel.project_dir') . '/transcriptions';
            $fileContent = file_get_contents($url);
            file_put_contents($path . '/' . $sessionId . '.json', $fileContent);
        }

        return new JsonResponse(['response' => $request->getContent()]);
    }
}

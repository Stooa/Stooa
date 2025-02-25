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
use App\Core\Model\SlackWebhookDto;
use App\Core\Service\SlackWebHookService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

final class WebHookSlackController extends AbstractController
{
    public function __construct(
        private readonly SlackWebHookService $slackWebHookService,
        private readonly Security $security
    ) {
    }

    #[Route('/slack/token', name: 'app.slack.token', methods: ['POST'])]
    public function token(#[MapRequestPayload] SlackWebhookDto $slackWebhookDto): Response
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            throw new \Exception('User not found');

        }

        try {
            return new JsonResponse(['token' => $this->slackWebHookService->setUserWebHook($user, $slackWebhookDto->webhook)]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }
    }
}

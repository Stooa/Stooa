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

namespace App\Core\Service;

use App\Fishbowl\Entity\Fishbowl;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SlackService
{
    public function __construct(
        protected readonly HttpClientInterface $client,
        protected readonly string $slackUrl,
        protected readonly string $appUrl
    ) {
    }

    public function sendNotification(Fishbowl $fishbowl): void
    {
        if (!$this->validateUrl($this->slackUrl)) {
            return;
        }

        $this->client->request('POST', $this->slackUrl, [
            'json' => [
                'blocks' => [
                    [
                        'type' => 'header',
                        'text' => [
                            'type' => 'plain_text',
                            'text' => 'New Fishbowl has been created :new:',
                            'emoji' => true,
                        ],
                    ],
                    [
                        'type' => 'section',
                        'fields' => [
                            [
                              'type' => 'mrkdwn',
                              'text' => "*Name:*\n{$fishbowl->getName()}",
                            ],
                            [
                              'type' => 'mrkdwn',
                              'text' => "*Created by:*\n<{$fishbowl->getHost()->getEmail()}|{$fishbowl->getHost()->getFullName()}>",
                            ],
                        ],

                    ],
                    [
                        'type' => 'section',
                        'text' => [
                            'type' => 'mrkdwn',
                            'text' => "*When :*\n {$fishbowl->getStartDateTimeTz()->format('d-m-Y H:i:s')}",
                        ],
                        'accessory' => [
                            'type' => 'button',
                            'text' => [
                                'type' => 'plain_text',
                                'text' => 'Join Fishbowl',
                                'emoji' => true,
                            ],
                            'url' => "{$this->appUrl}/fb/{$fishbowl->getSlug()}",
                            'action_id' => 'button-action',
                        ],
                    ],
                ],
            ],
        ]);
    }

    private function validateUrl(string $url): bool
    {
        return false !== filter_var($url, \FILTER_VALIDATE_URL);
    }
}

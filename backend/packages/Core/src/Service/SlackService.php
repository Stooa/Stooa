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
        protected readonly string $url
    ) {
    }

    public function sendNotification(Fishbowl $fishbowl): void
    {
        $this->client->request('POST', $this->url , [
            'json' => [
                'text' => "New Fishbowl has been created: {$fishbowl->getName()} by {$fishbowl->getHost()->getFullName()}",
            ],
        ]);
    }

}

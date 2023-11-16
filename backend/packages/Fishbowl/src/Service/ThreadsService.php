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

namespace App\Fishbowl\Service;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class ThreadsService extends AbstractController
{
    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function check(string $threadId): string
    {
        $client = \OpenAI::client($this->apiKey);

        $response = $client->threads()->messages()->list($threadId, [
            'limit' => 10,
        ]);

        return $response->data[0]->content[0]->text->value;
    }
}

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

namespace App\Fishbowl\Service\OpenAI;

class CleanTranscriptionService
{
    public function clean(string $json): string
    {
        $jsonArray = json_decode($json, true, 512, \JSON_THROW_ON_ERROR);

        $removeKeys = ['roomAddress', 'meetingFqn', 'sessionId', 'timestamp', 'messageType'];

        foreach ($removeKeys as $key) {
            unset($jsonArray[$key]);
        }

        $removeKeys = ['jid', 'timestamp', 'avatarUrl', 'messageId'];

        foreach ($jsonArray['messages'] as $index => $message) {
            foreach ($removeKeys as $key) {
                unset($jsonArray['messages'][$index][$key]);
            }
        }

        return json_encode($jsonArray, \JSON_THROW_ON_ERROR);
    }
}

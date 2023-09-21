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

namespace App\Fishbowl\EventListener;

use App\Core\Service\SlackService;
use App\Fishbowl\Entity\Fishbowl;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Fishbowl::class)]
class FishbowlListener
{
    public function __construct(protected readonly SlackService $slackService)
    {
    }

    public function postPersist(Fishbowl $fishbowl, PostPersistEventArgs $event): void
    {
        $this->slackService->sendNotification($fishbowl);
    }
}

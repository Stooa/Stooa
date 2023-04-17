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

interface PositionHandlerInterface
{
    public function countNextSiblings(object $entity): int;

    public function countPrevSiblings(object $entity): int;

    public function move(object $entity, string $movePosition): void;
}

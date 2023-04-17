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

namespace App\Core\Twig;

use App\Core\Service\PositionHandlerInterface;
use Twig\Extension\RuntimeExtensionInterface;

class TreePositionRuntime implements RuntimeExtensionInterface
{
    public function __construct(private readonly PositionHandlerInterface $positionHandler)
    {
    }

    public function countNextSiblings(object $entity): int
    {
        return $this->positionHandler->countNextSiblings($entity);
    }

    public function countPrevSiblings(object $entity): int
    {
        return $this->positionHandler->countPrevSiblings($entity);
    }
}

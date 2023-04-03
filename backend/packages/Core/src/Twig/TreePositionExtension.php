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

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class TreePositionExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('countPrevSiblings', [TreePositionRuntime::class, 'countPrevSiblings']),
            new TwigFunction('countNextSiblings', [TreePositionRuntime::class, 'countNextSiblings']),
        ];
    }
}

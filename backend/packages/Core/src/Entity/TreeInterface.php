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

namespace App\Core\Entity;

interface TreeInterface
{
    public function getRgt(): ?int;

    public function getLft(): ?int;

    public function getLvl(): ?int;

    public function getRoot(): ?self;
}

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

namespace App\WorldCafe\Operation;

use ApiPlatform\Metadata\Util\Inflector;
use ApiPlatform\Operation\PathSegmentNameGeneratorInterface;

class WorldCafeSegmentNameGenerator implements PathSegmentNameGeneratorInterface
{
    public function getSegmentName(string $name, bool $collection = true): string
    {
        if ('WorldCafe' === $name) {
            return $collection ? 'world_cafes' : 'world_cafe';
        }

        $name = Inflector::tableize($name);

        return $collection ? Inflector::pluralize($name) : $name;
    }
}

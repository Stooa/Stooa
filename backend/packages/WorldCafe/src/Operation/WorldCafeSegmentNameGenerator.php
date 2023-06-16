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

use ApiPlatform\Operation\PathSegmentNameGeneratorInterface;
use Doctrine\Inflector\InflectorFactory;

class WorldCafeSegmentNameGenerator implements PathSegmentNameGeneratorInterface
{
    public function getSegmentName(string $name, bool $collection = true): string
    {
        if ('WorldCafe' === $name) {
            return $collection ? 'world_cafes' : 'world_cafe';
        }

        $inflector = InflectorFactory::create()->build();

        $name = $inflector->tableize($name);

        return $collection ? $inflector->pluralize($name) : $name;
    }
}

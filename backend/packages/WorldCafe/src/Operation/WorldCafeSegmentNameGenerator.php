<?php

namespace App\WorldCafe\Operation;

use ApiPlatform\Operation\PathSegmentNameGeneratorInterface;

class WorldCafeSegmentNameGenerator implements PathSegmentNameGeneratorInterface
{
    public function getSegmentName(string $name, bool $collection = true): string
    {
        $name = $this->underscoreize($name);

        return $name;
    }

    private function underscoreize(string $string): string
    {
        return strtolower(preg_replace('~(?<=\\w)([A-Z])~', '_$1', $string));
    }
}

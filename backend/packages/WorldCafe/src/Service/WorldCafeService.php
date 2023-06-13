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

namespace App\WorldCafe\Service;

use App\Core\Model\Event;
use App\WorldCafe\Entity\WorldCafe;
use Symfony\Contracts\Translation\TranslatorInterface;

class WorldCafeService
{
    public function __construct(
        private readonly TranslatorInterface $translator
    ) {
    }

    public function generateDefaultTitle(WorldCafe $worldCafe): Event
    {
        $worldCafeName = $worldCafe->getName();

        if (!empty($worldCafeName) && !ctype_space($worldCafeName)) {
            return $worldCafe;
        }

        return $worldCafe->setName(
            $this->translator->trans('world_cafe.default_title', ['%name%' => $worldCafe->getHostName()], null, $worldCafe->getLocale())
        );
    }
}

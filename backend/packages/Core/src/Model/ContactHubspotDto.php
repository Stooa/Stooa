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

namespace App\Core\Model;

use Symfony\Component\Validator\Constraints as Assert;

class ContactHubspotDto
{
    public function __construct(
        #[Assert\NotBlank]
        public readonly string $name,
        #[Assert\Email]
        public readonly string $email,
    ) {
    }
}

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

namespace App\Model;

class GuestLogin
{
    private ?string $id;
    private ?string $name;

    public static function createFromData(\stdClass $data): self
    {
        $guestLogin = new self();

        $guestLogin->id = property_exists($data, 'id') ? $data->id : null;
        $guestLogin->name = property_exists($data, 'name') ? $data->name : null;

        return $guestLogin;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }
}

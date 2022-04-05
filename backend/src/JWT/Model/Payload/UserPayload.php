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

namespace App\JWT\Model\Payload;

use App\Entity\User;
use Ramsey\Uuid\UuidInterface;

final class UserPayload implements PayloadInterface
{
    private ?string $name;
    private ?string $email;
    private ?string $twitter;
    private ?string $linkedin;
    private ?string $avatar;
    private ?UuidInterface $id;
    private bool $moderator;

    public function __construct(User $user, bool $moderator, ?UuidInterface $id = null, ?string $avatar = null)
    {
        $this->name = $user->getFullName();
        $this->email = $user->getEmail();
        $this->twitter = $user->getPublicTwitterProfile();
        $this->linkedin = $user->getPublicLinkedinProfile();
        $this->moderator = $moderator;
        $this->id = $id;
        $this->avatar = $avatar;
    }

    /** @return array<string, string|bool|UuidInterface|null> */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin,
            'moderator' => $this->moderator,
            'id' => $this->id,
            'avatar' => $this->avatar,
        ];
    }
}

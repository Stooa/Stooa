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

namespace App\Core\JWT\Model\Payload;

use App\Core\Entity\User;
use Ramsey\Uuid\UuidInterface;

final class UserPayload implements PayloadInterface
{
    private readonly ?string $name;
    private readonly ?string $email;
    private readonly ?string $twitter;
    private readonly ?string $linkedin;

    public function __construct(
        User $user,
        private readonly bool $moderator,
        private readonly ?UuidInterface $id = null,
        private readonly ?string $avatar = null,
    ) {
        $this->name = $user->getFullName();
        $this->email = $user->getEmail();
        $this->twitter = $user->getPublicTwitterProfile();
        $this->linkedin = $user->getPublicLinkedinProfile();
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

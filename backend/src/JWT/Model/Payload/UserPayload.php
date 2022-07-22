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

use App\Entity\Foo1Interface;
use App\Entity\Foo2Interface;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserPayload implements PayloadInterface
{
    private ?string $name = null;
    private ?string $email = null;
    private ?string $twitter = null;
    private ?string $linkedin = null;

    public function __construct(
        UserInterface $user,
        private readonly bool $moderator,
        private readonly ?UuidInterface $id = null,
        private readonly ?string $avatar = null
    ) {
        if ($user instanceof Foo1Interface) {
            $this->name = $user->getFullName();
        }

        if ($user instanceof Foo2Interface) {
            $this->email = $user->getEmail();
            $this->twitter = $user->getPublicTwitterProfile();
            $this->linkedin = $user->getPublicLinkedinProfile();
        }
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

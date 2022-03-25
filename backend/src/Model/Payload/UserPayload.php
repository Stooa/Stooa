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

namespace App\Model\Payload;

final class UserPayload implements PayloadInterface
{
    private ?string $name;
    private ?string $email;
    private ?string $twitter;
    private ?string $linkedin;
    private ?string $id;
    private bool $moderator;

    public function __construct()
    {
        $this->moderator = false;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    public function getTwitter(): ?string
    {
        return $this->twitter;
    }

    public function setTwitter(?string $twitter): void
    {
        $this->twitter = $twitter;
    }

    public function getLinkedin(): ?string
    {
        return $this->linkedin;
    }

    public function setLinkedin(?string $linkedin): void
    {
        $this->linkedin = $linkedin;
    }

    public function isModerator(): bool
    {
        return $this->moderator;
    }

    public function setModerator(bool $moderator): void
    {
        $this->moderator = $moderator;
    }

    /** @return array<string, string|bool|null> */
    public function toArray(): array
    {
        return [
            'name' => $this->getName(),
            'email' => $this->getEmail(),
            'twitter' => $this->getTwitter(),
            'linkedin' => $this->getLinkedin(),
            'moderator' => $this->isModerator(),
            'avatar' => '',
        ];
    }
}

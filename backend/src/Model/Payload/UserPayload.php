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

    public function __construct(string $name, string $email, string $twitter, string $linkedin, bool $moderator)
    {
        $this->name = $name;
        $this->email = $email;
        $this->twitter = $twitter;
        $this->linkedin = $linkedin;
        $this->moderator = $moderator;
        $this->id = '';
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getTwitter(): ?string
    {
        return $this->twitter;
    }

    public function getLinkedin(): ?string
    {
        return $this->linkedin;
    }

    public function isModerator(): bool
    {
        return $this->moderator;
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
            'id' => $this->getId(),
        ];
    }
}

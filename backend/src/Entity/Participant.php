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

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"participant:read"}},
 *     denormalizationContext={"groups"={"participant:write"}},
 *     collectionOperations={"get"},
 *     itemOperations={},
 * )
 *
 * @Assert\Expression(
 *     "this.getUser() or this.getGuest()",
 *     message="Participant should have a User or a Guest"
 * )
 *
 * @ORM\Entity
 */
class Participant
{
    /**
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class=UuidGenerator::class)
     */
    private ?UuidInterface $id = null;

    /**
     * @Groups({"participant:read"})
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(referencedColumnName="id")
     */
    private ?User $user = null;

    /**
     * @Groups({"participant:read"})
     *
     * @ORM\ManyToOne(targetEntity="Guest", cascade={"all"})
     * @ORM\JoinColumn(referencedColumnName="id")
     */
    private ?Guest $guest = null;

    /**
     * @Groups({"participant:read"})
     *
     * @Assert\NotNull
     * @Assert\DateTime
     *
     * @ORM\Column(type="datetime")
     */
    private ?\DateTimeInterface $lastPing = null;

    /**
     * @Groups({"participant:read"})
     *
     * @Assert\NotNull
     *
     * @ORM\ManyToOne(targetEntity="Fishbowl", inversedBy="participants")
     */
    private ?Fishbowl $fishbowl = null;

    public function __toString(): string
    {
        return $this->getUserName();
    }

    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    public function setId(?UuidInterface $id): void
    {
        $this->id = $id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getGuest(): ?Guest
    {
        return $this->guest;
    }

    public function setGuest(?Guest $guest): void
    {
        $this->guest = $guest;
    }

    public function getFishbowl(): ?Fishbowl
    {
        return $this->fishbowl;
    }

    public function setFishbowl(?Fishbowl $fishbowl): void
    {
        $this->fishbowl = $fishbowl;
    }

    public function getLastPing(): ?\DateTimeInterface
    {
        return $this->lastPing;
    }

    public function setLastPing(?\DateTimeInterface $lastPing): self
    {
        $this->lastPing = $lastPing;

        return $this;
    }

    public function getUserName(): string
    {
        if (null !== $this->getUser()) {
            return $this->getUser()->getFullName();
        }

        if (null !== $this->getGuest()) {
            MAssert::notNull($this->getGuest()->getName());

            return $this->getGuest()->getName();
        }

        return '';
    }

    public function getPublicTwitterProfile(): ?string
    {
        if (null !== $this->getUser()) {
            return $this->getUser()->getPublicTwitterProfile();
        }

        return null;
    }

    public function getPublicLinkedinAccount(): ?string
    {
        if (null !== $this->getUser()) {
            return $this->getUser()->getPublicLinkedinProfile();
        }

        return null;
    }

    public function isModerator(Fishbowl $fishbowl): bool
    {
        if (null !== $this->getUser()) {
            return $fishbowl->getHost() === $this->getUser();
        }

        return false;
    }

    public function isCurrentUser(?UserInterface $currentUser): bool
    {
        if (null !== $this->getUser()) {
            return $this->getUser() === $currentUser;
        }

        return false;
    }

    public function getGuestId(): ?string
    {
        if (null !== $this->getGuest()) {
            $uid = $this->getGuest()->getId();

            if (null !== $uid) {
                return $uid->toString();
            }
        }

        return null;
    }
}

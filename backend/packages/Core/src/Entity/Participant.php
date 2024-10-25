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

namespace App\Core\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Fishbowl\Entity\Feedback;
use App\Fishbowl\Entity\Fishbowl;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

#[ApiResource(
    operations: [new GetCollection(security: 'is_granted(\'ROLE_USER\')')],
    normalizationContext: ['groups' => ['participant:read']],
    denormalizationContext: ['groups' => ['participant:write']]
)]
#[Assert\Expression('this.getUser() or this.getGuest()', message: 'user.participant')]
#[ORM\Entity]
class Participant implements \Stringable
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Groups(['participant:read', 'fishbowl:read'])]
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(referencedColumnName: 'id')]
    private ?User $user = null;

    #[Groups(['participant:read', 'fishbowl:read'])]
    #[ORM\ManyToOne(targetEntity: Guest::class, cascade: ['all'])]
    #[ORM\JoinColumn(referencedColumnName: 'id')]
    private ?Guest $guest = null;

    #[Groups(['participant:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $lastPing = null;

    #[Groups(['participant:read'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: Fishbowl::class, inversedBy: 'participants')]
    private ?Fishbowl $fishbowl = null;

    /** @var Collection<int, Feedback> */
    #[ORM\OneToMany(mappedBy: 'participant', targetEntity: Feedback::class)]
    private Collection $feedbacks;

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
        $user = $this->getUser();

        if (null !== $user) {
            return $user->getFullName();
        }

        $guest = $this->getGuest();

        if (null !== $guest) {
            $guestName = $guest->getName();
            MAssert::notNull($guestName);

            return $guestName;
        }

        return '';
    }

    public function getPublicTwitterProfile(): ?string
    {
        $user = $this->getUser();
        if (null !== $user) {
            return $user->getPublicTwitterProfile();
        }

        return null;
    }

    public function getPublicLinkedinAccount(): ?string
    {
        $user = $this->getUser();
        if (null !== $user) {
            return $user->getPublicLinkedinProfile();
        }

        return null;
    }

    /** @return Collection<int, Feedback> */
    public function getFeedbacks(): Collection
    {
        return $this->feedbacks;
    }

    public function addFeedback(Feedback $feedback): self
    {
        if (!$this->feedbacks->contains($feedback)) {
            $this->feedbacks[] = $feedback;
            $feedback->setParticipant($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): self
    {
        if ($this->feedbacks->contains($feedback)) {
            $this->feedbacks->removeElement($feedback);
            if ($feedback->getParticipant() === $this) {
                $feedback->setParticipant(null);
            }
        }

        return $this;
    }

    public function isModerator(Fishbowl $fishbowl): bool
    {
        $user = $this->getUser();
        if (null !== $this->getUser()) {
            return $fishbowl->getHost() === $user;
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
        $guest = $this->getGuest();
        if (null !== $guest) {
            $uid = $guest->getId();
            if (null !== $uid) {
                return $uid->toString();
            }
        }

        return null;
    }
}

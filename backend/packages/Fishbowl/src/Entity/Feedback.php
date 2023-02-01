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

namespace App\Fishbowl\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Core\Entity\Participant;
use App\Fishbowl\Repository\FeedbackRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(
            controller: NotFoundAction::class,
            output: false,
            read: false
        ),
        new Post(),
        new Put(),
    ],
    normalizationContext: ['groups' => ['feedback:read']],
    denormalizationContext: ['groups' => ['feedback:write']]
)]
class Feedback
{
    final public const ORIGIN_FISHBOWL = 'fishbowl';
    final public const ORIGIN_THANK_YOU = 'thank-you';
    final public const SATISFACTION_SAD = 'sad';
    final public const SATISFACTION_NEUTRAL = 'neutral';
    final public const SATISFACTION_HAPPY = 'sad';

    /**
     * @var array<string, string>
     *
     * @phpstan-var array<string, Feedback::SATISFACTION_*> $satisfactionChoices
     */
    public static array $satisfactionChoices = [
        'Sad' => self::SATISFACTION_SAD,
        'Neutral' => self::SATISFACTION_NEUTRAL,
        'Happy' => self::SATISFACTION_HAPPY,
    ];

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Groups(['feedback:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdDateTime = null;

    #[Groups(['feedback:read'])]
    #[Assert\Length(max: 255)]
    #[Assert\Choice([self::SATISFACTION_SAD, self::SATISFACTION_NEUTRAL, self::SATISFACTION_HAPPY])]
    #[ORM\Column(type: 'string', options: ['default' => self::SATISFACTION_NEUTRAL])]
    private string $satisfaction = self::SATISFACTION_NEUTRAL;

    #[Groups(['feedback:read', 'feedback:write'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $comment = null;

    #[Groups(['feedback:read', 'feedback:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Assert\Email]
    #[ORM\Column(type: 'string', unique: true)]
    private ?string $email = null;

    #[Groups(['feedback:read', 'feedback:write'])]
    #[Assert\Length(max: 255)]
    #[Assert\Choice([self::ORIGIN_FISHBOWL, self::ORIGIN_THANK_YOU])]
    #[ORM\Column(type: 'string', options: ['default' => self::ORIGIN_FISHBOWL])]
    private string $origin = self::ORIGIN_FISHBOWL;

    #[Groups(['feedback:read', 'feedback:write'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: Fishbowl::class, inversedBy: 'feedbacks')]
    private ?Fishbowl $fishbowl = null;

    #[Groups(['feedback:read', 'feedback:write'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: Participant::class, inversedBy: 'feedbacks')]
    private ?Participant $participant = null;

    /** @param UuidInterface|null $id */
    public function __construct()
    {
        $this->createdDateTime = new \DateTimeImmutable();
    }

    public function __toString(): string
    {
        $uid = $this->getId();

        return null !== $uid ? ' (' . $uid->toString() . ')' : '';
    }

    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = Uuid::fromString($id);

        return $this;
    }

    public function getCreatedDateTime(): ?\DateTimeInterface
    {
        return $this->createdDateTime;
    }

    public function setCreatedDateTime(?\DateTimeInterface $createdDateTime): self
    {
        $this->createdDateTime = $createdDateTime;

        return $this;
    }

    public function getSatisfaction(): string
    {
        return $this->satisfaction;
    }

    public function setSatisfaction(string $satisfaction): self
    {
        $this->satisfaction = $satisfaction;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getOrigin(): string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function getFishbowl(): ?Fishbowl
    {
        return $this->fishbowl;
    }

    public function setFishbowl(?Fishbowl $fishbowl): self
    {
        $this->fishbowl = $fishbowl;

        return $this;
    }

    public function getParticipant(): ?Participant
    {
        return $this->participant;
    }

    public function setParticipant(?Participant $participant): self
    {
        $this->participant = $participant;

        return $this;
    }
}

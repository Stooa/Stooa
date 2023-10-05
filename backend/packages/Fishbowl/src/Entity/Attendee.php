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

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Fishbowl\Repository\AttendeeRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AttendeeRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: 'is_granted(\'ROLE_USER\')'),
        new GetCollection(security: 'is_granted(\'ROLE_USER\')'),
        new Post(security: 'is_granted(\'ROLE_USER\')'),
    ],
    normalizationContext: ['groups' => ['attendee:read']],
    denormalizationContext: ['groups' => ['attendee:write']],
    order: ['createdDateTime' => 'ASC']
)]
class Attendee implements \Stringable
{
    #[ORM\Id]
    #[Groups(['attendee:read'])]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Groups(['attendee:read'])]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdDateTime;

    #[Groups(['attendee:write', 'attendee:read'])]
    #[Assert\Length(max: 255)]
    #[Assert\Timezone]
    #[ORM\Column(type: 'string')]
    private ?string $timezone = null;

    #[Groups(['attendee:read', 'attendee:write', 'fishbowl:read'])]
    #[Assert\Length(max: 255)]
    #[Assert\Email]
    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $email = null;

    #[Groups(['attendee:read', 'attendee:write', 'fishbowl:read'])]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $name = null;

    #[Groups(['attendee:read', 'attendee:write'])]
    #[ORM\ManyToOne(targetEntity: Fishbowl::class, inversedBy: 'attendees')]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    private ?Fishbowl $fishbowl = null;

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

    public function setCreatedDateTime(\DateTimeInterface $createdDateTime): self
    {
        $this->createdDateTime = $createdDateTime;

        return $this;
    }

    public function getTimezone(): ?string
    {
        return $this->timezone;
    }

    public function setTimezone(string $timezone): self
    {
        $this->timezone = $timezone;

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

    public function getFishbowl(): ?Fishbowl
    {
        return $this->fishbowl;
    }

    public function setFishbowl(?Fishbowl $fishbowl): self
    {
        $this->fishbowl = $fishbowl;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }
}

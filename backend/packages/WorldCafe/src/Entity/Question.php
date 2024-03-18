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

namespace App\WorldCafe\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\SortableGroup;
use Gedmo\Mapping\Annotation\SortablePosition;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    paginationEnabled: false,
)]
#[ORM\Entity]
class Question implements \Stringable
{
    #[Groups(['wc:create', 'wc:read'])]
    #[SortablePosition]
    #[ORM\Column(type: 'integer', nullable: true)]
    protected ?int $position = null;
    #[Groups(['wc:read'])]
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Groups(['wc:create', 'wc:read'])]
    #[ORM\Column(type: 'string')]
    private ?string $title = null;

    #[Groups(['wc:create', 'wc:read'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[SortableGroup]
    #[ORM\ManyToOne(targetEntity: WorldCafe::class, inversedBy: 'questions')]
    private ?WorldCafe $worldCafe = null;

    public function __toString(): string
    {
        return $this->getTitle() ?? '';
    }

    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    public function setId(?UuidInterface $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): void
    {
        $this->position = $position;
    }

    public function getWorldCafe(): ?WorldCafe
    {
        return $this->worldCafe;
    }

    public function setWorldCafe(?WorldCafe $worldCafe): self
    {
        $this->worldCafe = $worldCafe;

        return $this;
    }
}

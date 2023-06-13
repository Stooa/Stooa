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
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(),
    ],
)]
#[ORM\Entity]
class Question implements \Stringable
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Groups(['question:read', 'question:write', 'wc:write'])]
    #[ORM\Column(type: 'string')]
    private ?string $name = null;

    #[Groups(['question:read', 'question:write', 'wc:write'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[Groups(['question:read', 'question:write'])]
    //    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: WorldCafe::class, inversedBy: 'questions')]
    private ?WorldCafe $worldCafe = null;

    public function __toString(): string
    {
        return $this->getName() ?? '';
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

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

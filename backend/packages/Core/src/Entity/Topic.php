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

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Validator\Constraints as Assert;

#[Gedmo\Tree(type: 'nested')]
#[ORM\Entity(repositoryClass: NestedTreeRepository::class)]
class Topic implements TreeInterface, \Stringable
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string')]
    private ?string $name = null;

    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string', unique: true)]
    private ?string $translationId = null;

    #[Gedmo\TreeLeft]
    #[ORM\Column]
    private ?int $lft = null;

    #[Gedmo\TreeLevel]
    #[ORM\Column]
    private ?int $lvl = null;

    #[Gedmo\TreeRight]
    #[ORM\Column]
    private ?int $rgt = null;

    #[Gedmo\TreeParent]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(referencedColumnName: 'id', onDelete: 'CASCADE')]
    private ?self $parent = null;

    #[Gedmo\TreeRoot]
    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(referencedColumnName: 'id', onDelete: 'CASCADE')]
    private ?self $root = null;

    /** @var Collection<int, Topic> */
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    #[ORM\OrderBy(['name' => 'ASC'])]
    private Collection $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getName() ?? '';
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function setParent(self $parent = null): void
    {
        $this->parent = $parent;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function getRgt(): ?int
    {
        return $this->rgt;
    }

    public function getLft(): ?int
    {
        return $this->lft;
    }

    public function getLvl(): ?int
    {
        return $this->lvl;
    }

    public function getRoot(): ?self
    {
        return $this->root;
    }

    /** @return Collection<int, Topic> */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function getTranslationId(): ?string
    {
        return $this->translationId;
    }

    public function setTranslationId(?string $translationId): self
    {
        $this->translationId = $translationId;

        return $this;
    }

    public function generateTranslationId(): self
    {
        if (null !== $this->name) {
            $slugger = new AsciiSlugger();
            $this->translationId = $slugger->slug($this->name, '_')->toString();
        }

        return $this;
    }
}

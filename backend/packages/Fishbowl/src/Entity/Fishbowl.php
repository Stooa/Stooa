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

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Core\Model\Event;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Resolver\FishbowlCreatorResolver;
use App\Fishbowl\Resolver\FishbowlFinishMutationResolver;
use App\Fishbowl\Resolver\FishbowlIntroduceMutationResolver;
use App\Fishbowl\Resolver\FishbowlNoIntroRunMutationResolver;
use App\Fishbowl\Resolver\FishbowlResolver;
use App\Fishbowl\Resolver\FishbowlRunMutationResolver;
use App\Fishbowl\Validator\Constraints\FutureFishbowl;
use App\Fishbowl\Validator\Constraints\PrivateFishbowl;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

/**
 * @ApiFilter(DateFilter::class, properties={"finishDateTime"= DateFilter::EXCLUDE_NULL}),
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     normalizationContext={"groups"={"event:read"}},
 *     denormalizationContext={"groups"={"event:write"}},
 *     collectionOperations={
 *         "get"={"security"="is_granted('ROLE_USER')"},
 *         "post"={"security"="is_granted('ROLE_USER')"}
 *     },
 *     graphql={
 *         "bySlugQuery"={
 *             "item_query"=FishbowlResolver::class,
 *             "args"={"slug"={"type"="String!"}}
 *         },
 *         "isCreatorOf"={
 *             "item_query"=FishbowlCreatorResolver::class,
 *             "args"={"slug"={"type"="String!"}}
 *         },
 *         "introduce"={
 *             "mutation"=FishbowlIntroduceMutationResolver::class,
 *             "args"={
 *                 "slug"={"type"="String!"}
 *             },
 *             "validation_groups"={"Default"}
 *          },
 *         "run"={
 *             "mutation"=FishbowlRunMutationResolver::class,
 *             "args"={
 *                 "slug"={"type"="String!"}
 *             },
 *             "validation_groups"={"Default"}
 *          },
 *         "noIntroRun"={
 *             "mutation"=FishbowlNoIntroRunMutationResolver::class,
 *             "args"={
 *                 "slug"={"type"="String!"}
 *             },
 *             "validation_groups"={"Default"}
 *          },
 *         "finish"={
 *             "mutation"=FishbowlFinishMutationResolver::class,
 *             "args"={
 *                 "slug"={"type"="String!"}
 *             },
 *             "validation_groups"={"Default"}
 *          },
 *         "update"={
 *             "security"="object.getHost() == user",
 *             "validation_groups"={"Default", "fishbowl:update"}
 *         },
 *         "create"={
 *             "security"="is_granted('ROLE_USER')",
 *             "validation_groups"={"Default", "fishbowl:create"}
 *         },
 *     }
 * )
 * @UniqueEntity(fields={"slug"})
 * @FutureFishbowl(groups={"fishbowl:create", "fishbowl:update"})
 * @PrivateFishbowl(groups={"fishbowl:create", "fishbowl:update"})
 * @ORM\Entity(repositoryClass=FishbowlRepository::class)
 */
class Fishbowl extends Event
{
    final public const TRANSITION_INTRODUCE = 'introduce';
    final public const TRANSITION_RUN = 'run';
    final public const TRANSITION_NO_INTRO_RUN = 'no_intro_run';
    final public const TRANSITION_FINISH = 'finish';

    final public const STATUS_NOT_STARTED = 'not_started';
    final public const STATUS_INTRODUCTION = 'introduction';
    final public const STATUS_RUNNING = 'running';
    final public const STATUS_FINISHED = 'finished';

    /**
     * @var array<string, string>
     *
     * @phpstan-var array<string, Fishbowl::STATUS_*> $statusChoices
     */
    public static array $statusChoices = [
        'Not Started' => self::STATUS_NOT_STARTED,
        'Introduction' => self::STATUS_INTRODUCTION,
        'Running' => self::STATUS_RUNNING,
        'Finished' => self::STATUS_FINISHED,
    ];

    /**
     * @Groups({"event:read"})
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class=UuidGenerator::class)
     */
    private ?UuidInterface $id = null;

    /**
     * @Groups({"event:read"})
     * @Assert\NotNull
     * @ORM\ManyToOne(targetEntity="App\Core\Entity\User", inversedBy="fishbowls")
     */
    private ?User $host = null;

    /**
     * @var Collection<int, Participant>
     *
     * @ORM\OneToMany(targetEntity="App\Core\Entity\Participant", mappedBy="fishbowl", cascade={"all"})
     */
    private Collection $participants;

    /**
     * @Groups({"event:read"})
     * @Assert\Length(max=255)
     * @Assert\Choice({self::STATUS_NOT_STARTED, self::STATUS_INTRODUCTION, self::STATUS_RUNNING, self::STATUS_FINISHED})
     * @ORM\Column(type="string", options={"default": self::STATUS_NOT_STARTED})
     */
    private string $currentStatus = self::STATUS_NOT_STARTED;

    /**
     * @Groups({"event:read", "event:write"})
     * @ORM\Column(type="boolean")
     */
    private bool $isFishbowlNow = false;

    /**
     * @Groups({"event:read", "event:write"})
     * @ORM\Column(type="boolean")
     */
    private bool $hasIntroduction = false;

    /**
     * @Groups({"event:read", "event:write"})
     * @ORM\Column(type="boolean")
     */
    private bool $isPrivate = false;

    /** @ORM\Column(type="text", nullable=true) */
    private ?string $password = null;

    /**
     * @Groups({"event:read", "event:write"})
     * @Assert\Length(min=8, max=255)
     * @Assert\NotBlank(groups={"user:create"})
     */
    private ?string $plainPassword = null;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
    }

    public function __toString(): string
    {
        $uid = $this->getId();
        $stringUid = null !== $uid ? ' (' . $uid->toString() . ')' : '';

        return ($this->getName() ?? '') . $stringUid;
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

    public function getHost(): ?User
    {
        return $this->host;
    }

    public function setHost(?User $host): self
    {
        $this->host = $host;

        return $this;
    }

    public function getHostName(): ?string
    {
        if (null === $this->getHost()) {
            return '';
        }

        $host = $this->getHost();

        MAssert::isInstanceOf($host, User::class);

        return $host->getName() ?? '';
    }

    /** @return Collection<int, Participant> */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(Participant $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->$participant[] = $participant;
            $participant->setFishbowl($this);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        if ($this->participants->contains($participant)) {
            $this->participants->removeElement($participant);
        }

        return $this;
    }

    public function getCurrentStatus(): string
    {
        return $this->currentStatus;
    }

    public function setCurrentStatus(string $status): self
    {
        $this->currentStatus = $status;

        return $this;
    }

    public function isFinished(): bool
    {
        return self::STATUS_FINISHED === $this->getCurrentStatus();
    }

    public function getIsFishbowlNow(): bool
    {
        return $this->isFishbowlNow;
    }

    public function setIsFishbowlNow(bool $isFishbowlNow): self
    {
        $this->isFishbowlNow = $isFishbowlNow;

        return $this;
    }

    public function getHasIntroduction(): bool
    {
        return $this->hasIntroduction;
    }

    public function setHasIntroduction(bool $hasIntroduction): self
    {
        $this->hasIntroduction = $hasIntroduction;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function getIsPrivate(): bool
    {
        return $this->isPrivate;
    }

    public function setIsPrivate(bool $isPrivate): self
    {
        $this->isPrivate = $isPrivate;

        return $this;
    }

    public function privateFishbowlHasPassword(): bool
    {
        return true === $this->getIsPrivate() && (null === $this->getPlainPassword() || '' === $this->getPlainPassword());
    }

    public function publicFishbowlHasPassword(): bool
    {
        return false === $this->getIsPrivate() && null !== $this->getPlainPassword();
    }
}

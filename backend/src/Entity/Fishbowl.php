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

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\FishbowlRepository;
use App\Resolver\FishbowlCreatorResolver;
use App\Resolver\FishbowlFinishMutationResolver;
use App\Resolver\FishbowlIntroduceMutationResolver;
use App\Resolver\FishbowlResolver;
use App\Resolver\FishbowlRunMutationResolver;
use App\Validator\Constraints\FutureFishbowl;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"fishbowl:read"}},
 *     denormalizationContext={"groups"={"fishbowl:write"}},
 *     collectionOperations={
 *         "get"={
 *             "controller"=NotFoundAction::class,
 *             "read"=false,
 *             "output"=false,
 *         },
 *         "post"={"security"="is_granted('ROLE_USER')"}
 *     },
 *     itemOperations={
 *         "get",
 *         "put"={"security"="object.getHost() == user"}
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
 *
 * @UniqueEntity(fields={"slug"})
 * @FutureFishbowl(groups={"fishbowl:create", "fishbowl:update"})
 *
 * @ORM\Entity(repositoryClass=FishbowlRepository::class)
 */
class Fishbowl
{
    use TimestampableEntity;

    public const TRANSITION_INTRODUCE = 'introduce';
    public const TRANSITION_RUN = 'run';
    public const TRANSITION_FINISH = 'finish';

    public const STATUS_NOT_STARTED = 'not_started';
    public const STATUS_INTRODUCTION = 'introduction';
    public const STATUS_RUNNING = 'running';
    public const STATUS_FINISHED = 'finished';

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
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class=UuidGenerator::class)
     */
    private ?UuidInterface $id = null;

    /**
     * @Groups({"fishbowl:read", "fishbowl:write"})
     *
     * @Assert\Length(max=255)
     *
     * @ORM\Column(type="string")
     */
    private ?string $name = null;

    /**
     * @Groups({"fishbowl:read", "fishbowl:write"})
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $description = null;

    /**
     * @Groups({"fishbowl:read"})
     *
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     *
     * @ORM\Column(type="string", unique=true)
     */
    private ?string $slug = null;

    /**
     * @Groups({"fishbowl:write"})
     *
     * @Assert\NotNull
     * @Assert\DateTime
     *
     * @ORM\Column(type="datetime")
     */
    private ?\DateTimeInterface $startDateTime = null;

    /**
     * @Groups({"fishbowl:write"})
     *
     * @Assert\NotNull
     * @Assert\Length(max=255)
     * @Assert\Timezone
     *
     * @ORM\Column(type="string")
     */
    private ?string $timezone = null;

    /**
     * @Groups({"fishbowl:read", "fishbowl:write"})
     *
     * @Assert\NotNull
     * @Assert\Length(max=255)
     * @Assert\Locale(canonicalize=true)
     *
     * @ORM\Column(type="string")
     */
    private ?string $locale = null;

    /**
     * @Groups({"fishbowl:write"})
     *
     * @Assert\NotNull
     * @Assert\Time
     *
     * @ApiProperty(attributes={
     *     "openapi_context"={"format"="string"}
     * })
     *
     * @ORM\Column(type="time")
     */
    private ?\DateTimeInterface $duration = null;

    /**
     * @Groups({"fishbowl:read"})
     *
     * @Assert\NotNull
     *
     * @ORM\ManyToOne(targetEntity="User", inversedBy="fishbowls")
     */
    private ?User $host = null;

    /**
     * @Groups({"fishbowl:read"})
     *
     * @Assert\Length(max=255)
     * @Assert\Choice({self::STATUS_NOT_STARTED, self::STATUS_INTRODUCTION, self::STATUS_RUNNING, self::STATUS_FINISHED})
     *
     * @ORM\Column(type="string", options={"default": self::STATUS_NOT_STARTED})
     */
    private string $currentStatus = self::STATUS_NOT_STARTED;

    /**
     * @Assert\DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $introducedAt = null;

    /**
     * @Assert\DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $runnedAt = null;

    /**
     * @Assert\DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $finishedAt = null;

    /**
     * @Groups({"fishbowl:read"})
     *
     * @var Collection<int, Participant>
     *
     * @ORM\OneToMany(targetEntity="Participant", mappedBy="fishbowl", cascade={"all"})
     */
    private Collection $participants;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getRoomName(): string
    {
        return (string) $this->getName();
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description = null): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartDateTime(): ?\DateTimeInterface
    {
        return $this->startDateTime;
    }

    public function setStartDateTime(\DateTimeInterface $startDateTime): self
    {
        $this->startDateTime = $startDateTime;

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

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function setLocale(string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * This is needed to add the timezone information to the `startDateTime` property.
     *
     * @Groups({"fishbowl:read"})
     */
    public function getStartDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->startDateTime);
        MAssert::notNull($this->timezone);

        return new \DateTimeImmutable(
            $this->startDateTime->format('Y-m-d H:i:s'),
            new \DateTimeZone($this->timezone)
        );
    }

    /**
     * This is needed to calculate the end time with the `timezone` information.
     *
     * @Groups({"fishbowl:read"})
     */
    public function getEndDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->duration);

        return $this->getStartDateTimeTz()->add(
            new \DateInterval($this->duration->format('\P\TG\Hi\M'))
        );
    }

    public function getDuration(): ?\DateTimeInterface
    {
        return $this->duration;
    }

    public function setDuration(\DateTimeInterface $duration): self
    {
        $this->duration = $duration;

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

    /**
     * This is needed to avoid the default normalizer for \DateTime object,
     * instead we just want to output the time part of the `duration` property.
     *
     * @Groups({"fishbowl:read"})
     */
    public function getDurationFormatted(): string
    {
        MAssert::notNull($this->duration);

        return $this->duration->format('H:i');
    }

    public function getStartDateTimeFormatted(): string
    {
        MAssert::notNull($this->startDateTime);

        return $this->startDateTime->format('F d, Y');
    }

    public function getStartDateTimeHourFormatted(): string
    {
        MAssert::notNull($this->startDateTime);

        return $this->startDateTime->format('H:i');
    }

    public function isHappeningNow(): bool
    {
        $now = new \DateTimeImmutable();
        $oneHour = new \DateInterval('PT1H');
        $tenMinutes = new \DateInterval('PT10M');

        return $now >= $this->getStartDateTimeTz()->sub($oneHour) &&
            $now <= $this->getEndDateTimeTz()->add($tenMinutes);
    }

    public function shouldHaveEnd(int $hoursAgo = 24): bool
    {
        $now = new \DateTimeImmutable();
        $hoursInterval = new \DateInterval('PT' . (string) $hoursAgo . 'H');

        return $now > $this->getEndDateTimeTz()->add($hoursInterval);
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

    public function getIntroducedAt(): ?\DateTimeInterface
    {
        return $this->introducedAt;
    }

    public function setIntroducedAt(\DateTimeInterface $introducedAt): self
    {
        $this->introducedAt = $introducedAt;

        return $this;
    }

    public function getRunnedAt(): ?\DateTimeInterface
    {
        return $this->runnedAt;
    }

    public function setRunnedAt(\DateTimeInterface $runnedAt): self
    {
        $this->runnedAt = $runnedAt;

        return $this;
    }

    public function getFinishedAt(): ?\DateTimeInterface
    {
        return $this->finishedAt;
    }

    public function setFinishedAt(\DateTimeInterface $finishedAt): self
    {
        $this->finishedAt = $finishedAt;

        return $this;
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

    public function isFinished(): bool
    {
        return self::STATUS_FINISHED === $this->getCurrentStatus();
    }

    public function getHostName(): ?string
    {
        if (null === $this->getHost()) {
            return '';
        }

        $host = $this->getHost();

        MAssert::isInstanceOf($host, User::class);

        if (null === $host->getName()) {
            return '';
        }

        return $host->getName();
    }
}

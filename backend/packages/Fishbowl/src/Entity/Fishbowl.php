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

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\GraphQl\Mutation;
use ApiPlatform\Metadata\GraphQl\Query;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Core\Entity\Participant;
use App\Core\Entity\User;
use App\Fishbowl\Repository\FishbowlRepository;
use App\Fishbowl\Resolver\FishbowlCreatorResolver;
use App\Fishbowl\Resolver\FishbowlFinishMutationResolver;
use App\Fishbowl\Resolver\FishbowlIntroduceMutationResolver;
use App\Fishbowl\Resolver\FishbowlNoIntroRunMutationResolver;
use App\Fishbowl\Resolver\FishbowlResolver;
use App\Fishbowl\Resolver\FishbowlRunMutationResolver;
use App\Fishbowl\State\FishbowlProcessor;
use App\Fishbowl\State\FishbowlStateProvider;
use App\Fishbowl\Validator\Constraints\FutureFishbowl;
use App\Fishbowl\Validator\Constraints\PrivateFishbowl;
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
 * @FutureFishbowl (groups={"fishbowl:create", "fishbowl:update"})
 *
 * @PrivateFishbowl (groups={"fishbowl:create", "fishbowl:update"})
 */
#[ApiResource(
    operations: [
        new Get(),
        new Put(security: 'object.getHost() == user'),
        new GetCollection(security: 'is_granted(\'ROLE_USER\')', provider: FishbowlStateProvider::class),
        new Post(security: 'is_granted(\'ROLE_USER\')'),
    ],
    normalizationContext: ['groups' => ['fishbowl:read']],
    denormalizationContext: ['groups' => ['fishbowl:write']],
    paginationEnabled: false,
    graphQlOperations: [
        new Query(),
        new Query(
            resolver: FishbowlResolver::class,
            args: ['slug' => ['type' => 'String!']],
            name: 'bySlugQuery'
        ),
        new Query(
            resolver: FishbowlCreatorResolver::class,
            args: ['slug' => ['type' => 'String!']],
            name: 'isCreatorOf'
        ),
        new Mutation(
            resolver: FishbowlIntroduceMutationResolver::class,
            args: ['slug' => ['type' => 'String!']],
            validationContext: ['groups' => ['Default']],
            name: 'introduce'
        ),
        new Mutation(
            resolver: FishbowlRunMutationResolver::class,
            args: ['slug' => ['type' => 'String!']],
            validationContext: ['groups' => ['Default']],
            name: 'run'
        ),
        new Mutation(
            resolver: FishbowlNoIntroRunMutationResolver::class,
            args: ['slug' => ['type' => 'String!']],
            validationContext: ['groups' => ['Default']],
            name: 'noIntroRun'
        ),
        new Mutation(
            resolver: FishbowlFinishMutationResolver::class,
            args: ['slug' => ['type' => 'String!']],
            validationContext: ['groups' => ['Default']],
            name: 'finish'
        ),
        new Mutation(
            security: 'object.getHost() == user',
            validationContext: ['groups' => ['Default', 'fishbowl:update']],
            name: 'update'
        ),
        new Mutation(
            security: 'is_granted(\'ROLE_USER\')',
            validationContext: ['groups' => ['Default', 'fishbowl:create']],
            name: 'create'
        ),
    ],
    processor: FishbowlProcessor::class
)]
#[UniqueEntity(fields: ['slug'])]
#[ORM\Entity(repositoryClass: FishbowlRepository::class)]
#[ApiFilter(filterClass: DateFilter::class, properties: ['finishDateTime' => 'exclude_null'])]
class Fishbowl implements \Stringable
{
    use TimestampableEntity;
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

    #[Groups(['fishbowl:read'])]
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string')]
    private ?string $name = null;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[Groups(['fishbowl:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string', unique: true)]
    private ?string $slug = null;

    #[Groups(['fishbowl:write', 'fishbowl:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $startDateTime = null;

    #[Groups(['fishbowl:write', 'fishbowl:read'])]
    #[Assert\NotNull]
    #[Assert\Length(max: 255)]
    #[Assert\Timezone]
    #[ORM\Column(type: 'string')]

    private ?string $timezone = null;
    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[Assert\NotNull]
    #[Assert\Length(max: 255)]
    #[Assert\Locale(canonicalize: true)]
    #[ORM\Column(type: 'string')]
    private ?string $locale = null;

    #[ApiProperty(openapiContext: ['format' => 'string'])]
    #[Groups(['fishbowl:write', 'fishbowl:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'time')]
    private ?\DateTimeInterface $duration = null;

    #[Groups(['fishbowl:read'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'fishbowls')]
    private ?User $host = null;

    #[Groups(['fishbowl:read'])]
    #[Assert\Length(max: 255)]
    #[Assert\Choice([self::STATUS_NOT_STARTED, self::STATUS_INTRODUCTION, self::STATUS_RUNNING, self::STATUS_FINISHED])]
    #[ORM\Column(type: 'string', options: ['default' => self::STATUS_NOT_STARTED])]
    private string $currentStatus = self::STATUS_NOT_STARTED;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $introducedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $runnedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $finishedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $finishDateTime = null;

    /** @var Collection<int, Participant> */
    #[ORM\OneToMany(mappedBy: 'fishbowl', targetEntity: Participant::class, cascade: ['all'])]
    private Collection $participants;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[ORM\Column(type: 'boolean')]
    private bool $isFishbowlNow = false;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[ORM\Column(type: 'boolean')]
    private bool $hasIntroduction = false;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[ORM\Column(type: 'boolean')]
    private bool $isPrivate = false;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $password = null;

    #[Groups(['fishbowl:read', 'fishbowl:write'])]
    #[Assert\Length(min: 8, max: 255)]
    #[Assert\NotBlank(groups: ['user:create'])]
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

    /** This is needed to add the timezone information to the `startDateTime` property. */
    #[Groups(['fishbowl:read'])]
    public function getStartDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->startDateTime);
        MAssert::notNull($this->timezone);

        return new \DateTimeImmutable($this->startDateTime->format('Y-m-d H:i:s'), new \DateTimeZone($this->timezone));
    }

    /** This is needed to calculate the end time with the `timezone` information. */
    #[Groups(['fishbowl:read'])]
    public function getEndDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->duration);

        return $this->getStartDateTimeTz()->add(new \DateInterval($this->duration->format('\\P\\TG\\Hi\\M')));
    }

    public function getFinishDateTime(): ?\DateTimeInterface
    {
        return $this->finishDateTime;
    }

    public function setFinishDateTime(\DateTimeInterface $finishDateTime): self
    {
        $this->finishDateTime = $finishDateTime;

        return $this;
    }

    public function calculateFinishTime(): void
    {
        MAssert::notNull($this->startDateTime);
        MAssert::notNull($this->duration);
        $dateTime = new \DateTimeImmutable($this->startDateTime->format('Y-m-d H:i:s'));
        $dateTime = $dateTime->add(new \DateInterval($this->duration->format('\\P\\TG\\Hi\\M')));
        $this->setFinishDateTime($dateTime);
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
     */
    #[Groups(['fishbowl:read'])]
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

    public function getFinishDateTimeHourFormatted(): string
    {
        MAssert::notNull($this->finishDateTime);

        return $this->finishDateTime->format('H:i');
    }

    public function isHappeningNow(): bool
    {
        $now = new \DateTimeImmutable();
        $oneHour = new \DateInterval('PT1H');
        $tenMinutes = new \DateInterval('PT10M');

        return $now >= $this->getStartDateTimeTz()->sub($oneHour) && $now <= $this->getEndDateTimeTz()->add($tenMinutes);
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
            $this->{$participant}[] = $participant;
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

        return $host->getName() ?? '';
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

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

namespace App\Core\Model;

use App\Core\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

abstract class Event implements EventInterface
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

    public function getFinishDateTime(): ?\DateTimeInterface
    {
        return $this->finishDateTime;
    }

    public function setFinishDateTime(\DateTimeInterface $finishDateTime): self
    {
        $this->finishDateTime = $finishDateTime;

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
}

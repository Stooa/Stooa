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

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

#[ORM\MappedSuperclass]
abstract class Event implements EventInterface, \Stringable
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
     * @phpstan-var array<string, Event::STATUS_*> $statusChoices
     */
    public static array $statusChoices = [
        'Not Started' => self::STATUS_NOT_STARTED,
        'Introduction' => self::STATUS_INTRODUCTION,
        'Running' => self::STATUS_RUNNING,
        'Finished' => self::STATUS_FINISHED,
    ];

    #[Groups(['event:read', 'event:write'])]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string')]
    protected ?string $name = null;

    #[Groups(['event:read', 'event:write'])]
    #[ORM\Column(type: 'text', nullable: true)]
    protected ?string $description = null;

    #[Groups(['event:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string', unique: true)]
    protected ?string $slug = null;

    #[Groups(['event:write', 'event:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime')]
    protected ?\DateTimeInterface $startDateTime = null;

    #[Groups(['event:write', 'event:read'])]
    #[Assert\NotNull]
    #[Assert\Length(max: 255)]
    #[Assert\Timezone]
    #[ORM\Column(type: 'string')]
    protected ?string $timezone = null;

    #[Groups(['event:read', 'event:write'])]
    #[Assert\NotNull]
    #[Assert\Length(max: 255)]
    #[Assert\Locale(canonicalize: true)]
    #[ORM\Column(type: 'string')]
    protected ?string $locale = null;

    #[Groups(['event:read'])]
    #[Assert\Length(max: 255)]
    #[Assert\Choice([self::STATUS_NOT_STARTED, self::STATUS_INTRODUCTION, self::STATUS_RUNNING, self::STATUS_FINISHED])]
    #[ORM\Column(type: 'string', options: ['default' => self::STATUS_NOT_STARTED])]
    protected string $currentStatus = self::STATUS_NOT_STARTED;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    protected ?\DateTimeInterface $introducedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    protected ?\DateTimeInterface $runnedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    protected ?\DateTimeInterface $finishedAt = null;

    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'datetime', nullable: true)]
    protected ?\DateTimeInterface $finishDateTime = null;

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
    #[Groups(['event:read'])]
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

    public function isFinished(): bool
    {
        return self::STATUS_FINISHED === $this->getCurrentStatus();
    }
}

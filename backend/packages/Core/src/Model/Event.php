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

use ApiPlatform\Core\Annotation\ApiProperty;
use App\Core\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

abstract class Event implements EventInterface
{
    use TimestampableEntity;

    /**
     * @Groups({"event:read", "event:write"})
     * @Assert\Length(max=255)
     * @ORM\Column(type="string")
     */
    private ?string $name = null;

    /**
     * @Groups({"event:read", "event:write"})
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $description = null;

    /**
     * @Groups({"event:read"})
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     * @ORM\Column(type="string", unique=true)
     */
    private ?string $slug = null;

    /**
     * @Groups({"event:write", "event:read"})
     * @Assert\NotNull
     * @Assert\Type("\DateTimeInterface")
     * @ORM\Column(type="datetime")
     */
    private ?\DateTimeInterface $startDateTime = null;

    /**
     * @Groups({"event:write", "event:read"})
     * @Assert\NotNull
     * @Assert\Length(max=255)
     * @Assert\Timezone
     * @ORM\Column(type="string")
     */
    private ?string $timezone = null;

    /**
     * @Groups({"event:read", "event:write"})
     * @Assert\NotNull
     * @Assert\Length(max=255)
     * @Assert\Locale(canonicalize=true)
     * @ORM\Column(type="string")
     */
    private ?string $locale = null;

    /**
     * @Groups({"event:write", "event:read"})
     * @Assert\NotNull
     * @Assert\Type("\DateTimeInterface")
     * @ApiProperty(attributes={
     *     "openapi_context"={"format"="string"}
     * })
     * @ORM\Column(type="time")
     */
    private ?\DateTimeInterface $duration = null;

    /**
     * @Assert\Type("\DateTimeInterface")
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $introducedAt = null;

    /**
     * @Assert\Type("\DateTimeInterface")
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $runnedAt = null;

    /**
     * @Assert\Type("\DateTimeInterface")
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $finishedAt = null;

    /**
     * @Assert\Type("\DateTimeInterface")
     * @ORM\Column(type="datetime", nullable=true)
     */
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

    /**
     * This is needed to add the timezone information to the `startDateTime` property.
     *
     * @Groups({"event:read"})
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
     * @Groups({"event:read"})
     */
    public function getEndDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->duration);

        return $this->getStartDateTimeTz()->add(
            new \DateInterval($this->duration->format('\P\TG\Hi\M'))
        );
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

        $dateTime = $dateTime->add(
            new \DateInterval($this->duration->format('\P\TG\Hi\M'))
        );

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

    /**
     * This is needed to avoid the default normalizer for \DateTime object,
     * instead we just want to output the time part of the `duration` property.
     *
     * @Groups({"event:read"})
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

        return $now >= $this->getStartDateTimeTz()->sub($oneHour) &&
            $now <= $this->getEndDateTimeTz()->add($tenMinutes);
    }

    public function shouldHaveEnd(int $hoursAgo = 24): bool
    {
        $now = new \DateTimeImmutable();
        $hoursInterval = new \DateInterval('PT' . (string) $hoursAgo . 'H');

        return $now > $this->getEndDateTimeTz()->add($hoursInterval);
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

    public function getHostName(): ?string
    {
        if (null === $this->getHost()) {
            return '';
        }

        $host = $this->getHost();

        MAssert::isInstanceOf($host, User::class);

        return $host->getName() ?? '';
    }
}

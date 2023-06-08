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
use Ramsey\Uuid\UuidInterface;

interface EventInterface
{
    public function getId(): ?UuidInterface;

    public function setId(string $id): self;

    public function getName(): ?string;

    public function setName(string $name): self;

    public function getSlug(): ?string;

    public function setSlug(string $slug): self;

    public function getDescription(): ?string;

    public function setDescription(?string $description = null): self;

    public function getStartDateTime(): ?\DateTimeInterface;

    public function setStartDateTime(\DateTimeInterface $startDateTime): self;

    public function getStartDateTimeTz(): \DateTimeImmutable;

    public function getTimezone(): ?string;

    public function setTimezone(string $timezone): self;

    public function getLocale(): ?string;

    public function setLocale(string $locale): self;

    public function getEndDateTimeTz(): \DateTimeImmutable;

    public function getFinishDateTime(): ?\DateTimeInterface;

    public function setFinishDateTime(\DateTimeInterface $finishDateTime): self;

    public function calculateFinishTime(): void;

    public function getCurrentStatus(): string;

    public function setCurrentStatus(string $status): self;

    public function getHost(): ?User;

    public function setHost(?User $host): self;
}

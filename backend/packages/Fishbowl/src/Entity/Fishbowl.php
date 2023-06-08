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

use ApiPlatform\Doctrine\Common\Filter\DateFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
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
use App\Core\Entity\Topic;
use App\Core\Entity\User;
use App\Core\Model\Event;
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
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\InverseJoinColumn;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\ManyToMany;
use Metaclass\FilterBundle\Filter\FilterLogic;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

#[ApiResource(
    operations: [
        new Get(security: 'is_granted(\'ROLE_USER\')'),
        new Put(security: 'object.getHost() == user'),
        new GetCollection(security: 'is_granted(\'ROLE_USER\')', provider: FishbowlStateProvider::class),
        new Post(security: 'is_granted(\'ROLE_USER\')'),
    ],
    normalizationContext: ['groups' => ['fishbowl:read', 'event:read']],
    denormalizationContext: ['groups' => ['fishbowl:write', 'event:write']],
    paginationItemsPerPage: 25,
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
#[ApiFilter(OrderFilter::class, properties: ['startDateTime'], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(DateFilter::class, properties: ['finishDateTime' => DateFilterInterface::EXCLUDE_NULL, 'startDateTime'])]
#[ApiFilter(SearchFilter::class, properties: ['currentStatus' => 'exact'])]
#[ApiFilter(FilterLogic::class)]
#[FutureFishbowl(groups: ['fishbowl:create', 'fishbowl:update'])]
#[PrivateFishbowl(groups: ['fishbowl:create', 'fishbowl:update'])]
class Fishbowl extends Event
{
    #[Groups(['fishbowl:read'])]
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[ApiProperty(openapiContext: ['format' => 'string'])]
    #[Groups(['fishbowl:write', 'fishbowl:read'])]
    #[Assert\NotNull]
    #[Assert\Type('\\DateTimeInterface')]
    #[ORM\Column(type: 'time')]
    private ?\DateTimeInterface $duration = null;

    /** @var Collection<int, Participant> */
    #[Groups(['fishbowl:read'])]
    #[ORM\OneToMany(mappedBy: 'fishbowl', targetEntity: Participant::class, cascade: ['all'])]
    private Collection $participants;

    #[Groups(['fishbowl:read'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'fishbowls')]
    private ?User $host = null;

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

    /** @var Collection<int, Feedback> */
    #[ORM\OneToMany(mappedBy: 'fishbowl', targetEntity: Feedback::class)]
    #[Groups(['fishbowl:read'])]
    private Collection $feedbacks;

    /** @var Collection<int, Topic> */
    #[JoinTable(name: 'fishbowl_topics')]
    #[JoinColumn(name: 'fishbowl_id', referencedColumnName: 'id')]
    #[InverseJoinColumn(name: 'topic_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ManyToMany(targetEntity: Topic::class)]
    private Collection $topics;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->feedbacks = new ArrayCollection();
        $this->topics = new ArrayCollection();
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

    public function getRoomName(): string
    {
        return (string) $this->getName();
    }

    /** This is needed to calculate the end time with the `timezone` information. */
    #[Groups(['fishbowl:read'])]
    public function getEndDateTimeTz(): \DateTimeImmutable
    {
        MAssert::notNull($this->duration);

        return $this->getStartDateTimeTz()->add(new \DateInterval($this->duration->format('\\P\\TG\\Hi\\M')));
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

    public function getHost(): ?User
    {
        return $this->host;
    }

    public function setHost(?User $host): self
    {
        $this->host = $host;

        return $this;
    }

    /** @return Collection<int, Topic> */
    public function getTopics(): Collection
    {
        return $this->topics;
    }

    public function addTopic(Topic $topic): self
    {
        if (!$this->topics->contains($topic)) {
            $this->topics[] = $topic;
        }

        return $this;
    }

    public function removeTopic(Topic $topic): self
    {
        if ($this->topics->contains($topic)) {
            $this->topics->removeElement($topic);
        }

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

    /** @return Collection<int, Feedback> */
    public function getFeedbacks(): Collection
    {
        return $this->feedbacks;
    }

    public function addFeedback(Feedback $feedback): self
    {
        if (!$this->feedbacks->contains($feedback)) {
            $this->feedbacks[] = $feedback;
            $feedback->setFishbowl($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): self
    {
        if ($this->feedbacks->contains($feedback)) {
            $this->feedbacks->removeElement($feedback);
            if ($feedback->getFishbowl() === $this) {
                $feedback->setFishbowl(null);
            }
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

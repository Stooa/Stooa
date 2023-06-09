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
use ApiPlatform\Metadata\GraphQl\Mutation;
use ApiPlatform\Metadata\Post;
use App\Core\Entity\Participant;
use App\Core\Entity\Topic;
use App\Core\Entity\User;
use App\Core\Model\Event;
use App\Fishbowl\Entity\Feedback;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\InverseJoinColumn;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\ManyToMany;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as MAssert;

#[ApiResource(
    operations: [
        new Post(security: 'is_granted(\'ROLE_USER\')'),
    ],
    normalizationContext: ['groups' => ['wc:read', 'event:read']],
    denormalizationContext: ['groups' => ['wc:write', 'event:write']],
    paginationItemsPerPage: 25,
    graphQlOperations: [
        new Mutation(
            security: 'is_granted(\'ROLE_USER\')',
            validationContext: ['groups' => ['Default', 'wc:create']],
            name: 'create'
        ),
    ]
)]
#[UniqueEntity(fields: ['slug'])]
#[ORM\Entity]
class WorldCafe extends Event
{
    #[Groups(['wc:read'])]
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?UuidInterface $id = null;

    #[Groups(['wc:read'])]
    #[Assert\NotNull]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'worldCafes')]
    private ?User $host = null;

    /** @var Collection<int, Participant> */
    #[Groups(['wc:read'])]
    #[ORM\OneToMany(mappedBy: 'worldCafe', targetEntity: Participant::class, cascade: ['all'])]
    private Collection $participants;

    /** @var Collection<int, Feedback> */
    #[ORM\OneToMany(mappedBy: 'worldCafe', targetEntity: Feedback::class)]
    #[Groups(['wc:read'])]
    private Collection $feedbacks;

    /** @var Collection<int, Topic> */
    #[JoinTable(name: 'world_cafe_topics')]
    #[JoinColumn(name: 'world_cafe_id', referencedColumnName: 'id')]
    #[InverseJoinColumn(name: 'topic_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ManyToMany(targetEntity: Topic::class)]
    private Collection $topics;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->feedbacks = new ArrayCollection();
        $this->topics = new ArrayCollection();
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
            $participant->setWorldCafe($this);
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
            $feedback->setWorldCafe($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): self
    {
        if ($this->feedbacks->contains($feedback)) {
            $this->feedbacks->removeElement($feedback);
            if ($feedback->getWorldCafe() === $this) {
                $feedback->setWorldCafe(null);
            }
        }

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

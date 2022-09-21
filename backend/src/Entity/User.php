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
use ApiPlatform\Core\Annotation\ApiResource;
use App\Model\ChangePasswordInput;
use App\Model\ChangePasswordLoggedInput;
use App\Repository\UserRepository;
use App\Resolver\UserResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"user:read"}},
 *     denormalizationContext={"groups"={"user:write"}},
 *     collectionOperations={
 *         "get"={
 *             "controller"=NotFoundAction::class,
 *             "read"=false,
 *             "output"=false,
 *         },
 *         "post"={
 *             "validation_groups"={"Default", "user:create"},
 *             "denormalization_context"={"groups"={"user:write", "user:create"}}
 *         }
 *     },
 *     itemOperations={
 *         "get"={
 *             "normalization_context"={"groups"={"user:read", "user:foreign"}}
 *         },
 *         "put"={
 *             "security"="object == user",
 *             "normalization_context"={"groups"={"user:read", "user:self"}}
 *         }
 *     },
 *     graphql={
 *         "item_query"={
 *             "normalization_context"={"groups"={"user:read", "user:foreign"}}
 *         },
 *         "self"={
 *             "item_query"=UserResolver::class,
 *             "security"="object == user",
 *             "normalization_context"={"groups"={"user:read", "user:self"}},
 *             "args"={}
 *         },
 *         "update"={
 *             "security"="object == user",
 *             "normalization_context"={"groups"={"user:read", "user:self"}}
 *         },
 *         "create"={
 *             "validation_groups"={"Default", "user:create"},
 *             "denormalization_context"={"groups"={"user:write", "user:create"}}
 *         },
 *         "changePassword"={
 *             "args"={
 *                 "token"={"type"="String!"},
 *                 "password"={"type"="String!"},
 *                 "passwordConfirmation"={"type"="String!"}
 *             },
 *             "input"=ChangePasswordInput::class
 *         },
 *         "changePasswordLogged"={
 *             "args"={
 *                 "password"={"type"="String!"},
 *                 "newPassword"={"type"="String!"},
 *                 "newPasswordConfirmation"={"type"="String!"}
 *             },
 *             "input"=ChangePasswordLoggedInput::class
 *         }
 *     }
 * )
 * @UniqueEntity(
 *     fields={"email"},
 *     message="user.email"
 * )
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface, \Stringable, PasswordAuthenticatedUserInterface, Foo1Interface, Foo2Interface
{
    use TimestampableEntity;

    /**
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class=UuidGenerator::class)
     */
    private ?UuidInterface $id = null;

    /**
     * @Groups({"user:read", "user:write"})
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     * @ORM\Column(type="string")
     */
    private ?string $name = null;

    /**
     * @Groups({"user:read", "user:write"})
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     * @ORM\Column(type="string")
     */
    private ?string $surnames = null;

    /**
     * @Groups({"user:self", "user:create", "user:read"})
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     * @Assert\Email
     * @ORM\Column(type="string", unique=true)
     */
    private ?string $email = null;

    /**
     * @var string[]
     *
     * @ORM\Column(type="json")
     */
    private array $roles = [];

    /** @ORM\Column(type="string") */
    private ?string $password = null;

    /**
     * @Groups({"user:create"})
     * @Assert\IsTrue
     * @ORM\Column(type="boolean")
     */
    private bool $privacyPolicy = false;

    /**
     * @Groups({"user:self", "user:write"})
     * @ORM\Column(type="boolean")
     */
    private bool $allowShareData = false;

    /** @ORM\Column(type="boolean") */
    private bool $active = false;

    /**
     * @Groups({"user:self", "user:write"})
     * @Assert\Url
     * @Assert\Length(max=255)
     * @ORM\Column(type="string", nullable=true)
     */
    private ?string $linkedinProfile = null;

    /**
     * @Groups({"user:self", "user:write"})
     * @Assert\Url
     * @Assert\Length(max=255)
     * @ORM\Column(type="string", nullable=true)
     */
    private ?string $twitterProfile = null;

    /**
     * @Groups({"user:self", "user:create", "user:read"})
     * @Assert\NotNull
     * @Assert\Length(max=255)
     * @Assert\Locale(canonicalize=true)
     * @ORM\Column(type="string")
     */
    private ?string $locale = null;

    /**
     * @var Collection<int, Fishbowl>
     *
     * @ORM\OneToMany(targetEntity="Fishbowl", mappedBy="host")
     */
    private Collection $fishbowls;

    /**
     * @Groups({"user:write"})
     * @Assert\NotBlank(groups={"user:create"})
     */
    private ?string $plainPassword = null;

    public function __construct()
    {
        $this->fishbowls = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getFullName() . ' (' . $this->getUserIdentifier() . ')';
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

    public function getSurnames(): ?string
    {
        return $this->surnames;
    }

    public function setSurnames(string $surnames): self
    {
        $this->surnames = $surnames;

        return $this;
    }

    public function getFullName(): string
    {
        return $this->getName() . ' ' . $this->getSurnames();
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /** @param string[] $roles */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPrivacyPolicy(): bool
    {
        return $this->privacyPolicy;
    }

    public function setPrivacyPolicy(bool $privacyPolicy): self
    {
        $this->privacyPolicy = $privacyPolicy;

        return $this;
    }

    public function getAllowShareData(): bool
    {
        return $this->allowShareData;
    }

    public function setAllowShareData(bool $allowShareData): self
    {
        $this->allowShareData = $allowShareData;

        return $this;
    }

    public function getActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getLinkedinProfile(): ?string
    {
        return $this->linkedinProfile;
    }

    public function setLinkedinProfile(?string $linkedinProfile = null): self
    {
        $this->linkedinProfile = $linkedinProfile;

        return $this;
    }

    /** @Groups({"user:foreign"}) */
    public function getPublicLinkedinProfile(): ?string
    {
        if ($this->getAllowShareData()) {
            return $this->linkedinProfile;
        }

        return null;
    }

    public function getTwitterProfile(): ?string
    {
        return $this->twitterProfile;
    }

    public function setTwitterProfile(?string $twitterProfile = null): self
    {
        $this->twitterProfile = $twitterProfile;

        return $this;
    }

    /** @Groups({"user:foreign"}) */
    public function getPublicTwitterProfile(): ?string
    {
        if ($this->getAllowShareData()) {
            return $this->twitterProfile;
        }

        return null;
    }

    public function getPlainPassword(): string
    {
        return (string) $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

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

    /** @return Collection<int, Fishbowl> */
    public function getFishbowls(): Collection
    {
        return $this->fishbowls;
    }

    public function addFishbowl(Fishbowl $fishbowl): self
    {
        if (!$this->fishbowls->contains($fishbowl)) {
            $this->fishbowls[] = $fishbowl;
            $fishbowl->setHost($this);
        }

        return $this;
    }

    public function removeFishbowl(Fishbowl $fishbowl): self
    {
        if ($this->fishbowls->contains($fishbowl)) {
            $this->fishbowls->removeElement($fishbowl);

            if ($fishbowl->getHost() === $this) {
                $fishbowl->setHost(null);
            }
        }

        return $this;
    }

    public function getCurrentFishbowl(): ?Fishbowl
    {
        foreach ($this->fishbowls as $fishbowl) {
            if (!$fishbowl->isFinished() && $fishbowl->isHappeningNow()) {
                return $fishbowl;
            }
        }

        return null;
    }

    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getSalt(): ?string
    {
        return null;
    }
}

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

namespace App\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Resolver\ResetPasswordResolver;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     denormalizationContext={"groups"={"reset_password:write"}},
 *     collectionOperations={},
 *     itemOperations={"get"},
 *     graphql={
 *         "create"={
 *             "mutation"=ResetPasswordResolver::class,
 *             "args"={
 *                 "email"={"type"="String!"},
 *                 "locale"={"type"="String!"}
 *             },
 *             "read"=false,
 *             "write"=false
 *         },
 *     }
 * )
 */
class ResetPassword
{
    /** @ApiProperty(identifier=true) */
    private ?UuidInterface $id = null;

    /**
     * @Groups({"reset_password:write"})
     * @Assert\NotBlank
     * @Assert\Email
     */
    private ?string $email = null;

    /**
     * @Groups({"reset_password:write"})
     * @Assert\NotBlank
     * @Assert\Locale
     */
    private ?string $locale = null;

    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    public function setId(UuidInterface $id): self
    {
        $this->id = $id;

        return $this;
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

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function setLocale(string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }
}

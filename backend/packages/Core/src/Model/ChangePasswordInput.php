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

use App\Core\Validator\Constraints\ValidResetPasswordToken;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ChangePasswordInput
{
    /** @ValidResetPasswordToken */
    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    private ?string $token = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    #[Assert\EqualTo(propertyPath: 'passwordConfirmation')]
    private ?string $password = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    private ?string $passwordConfirmation = null;

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): self
    {
        $this->token = $token;

        return $this;
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

    public function getPasswordConfirmation(): ?string
    {
        return $this->passwordConfirmation;
    }

    public function setPasswordConfirmation(?string $passwordConfirmation): self
    {
        $this->passwordConfirmation = $passwordConfirmation;

        return $this;
    }
}

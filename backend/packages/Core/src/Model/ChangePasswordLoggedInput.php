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

use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ChangePasswordLoggedInput
{
    /** @SecurityAssert\UserPassword(message="user.password") */
    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    private ?string $password = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    #[Assert\EqualTo(propertyPath: 'newPasswordConfirmation')]
    private ?string $newPassword = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank]
    private ?string $newPasswordConfirmation = null;

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getNewPassword(): ?string
    {
        return $this->newPassword;
    }

    public function setNewPassword(?string $newPassword): self
    {
        $this->newPassword = $newPassword;

        return $this;
    }

    public function getNewPasswordConfirmation(): ?string
    {
        return $this->newPasswordConfirmation;
    }

    public function setNewPasswordConfirmation(?string $newPasswordConfirmation): self
    {
        $this->newPasswordConfirmation = $newPasswordConfirmation;

        return $this;
    }
}

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

namespace App\Core\Validator\Constraints;

use App\Core\Entity\User;
use App\Core\Model\ChangePasswordLoggedInput;
use App\Core\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Webmozart\Assert\Assert;

class SameUserPasswordValidator extends ConstraintValidator
{
    public function __construct(
        private readonly Security $security,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordEncoder,
    ) {
    }

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof SameUserPassword) {
            throw new UnexpectedTypeException($constraint, SameUserPassword::class);
        }

        if (!$value instanceof ChangePasswordLoggedInput) {
            throw new UnexpectedValueException($value, ChangePasswordLoggedInput::class);
        }

        $actualUser = $this->security->getUser();
        $inputPassword = $value->getPassword();

        if (null === $inputPassword || null === $actualUser) {
            return;
        }

        Assert::isInstanceOf($actualUser, User::class);

        $uid = $actualUser->getId();
        $user = null;

        if (null !== $uid) {
            $user = $this->userRepository->findUserById($uid->toString());
        }

        Assert::notNull($user);

        if (!$this->passwordEncoder->isPasswordValid($user, $inputPassword)) {
            $this->context->buildViolation($constraint->message)->atPath('password')->addViolation();
        }
    }
}

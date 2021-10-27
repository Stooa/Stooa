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

namespace App\Validator\Constraints;

use App\Entity\User;
use App\Model\ChangePasswordLoggedInput;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Webmozart\Assert\Assert;

class SameUserPasswordValidator extends ConstraintValidator
{
    private Security $security;
    private UserPasswordEncoderInterface $passwordEncoder;
    private UserRepository $userRepository;

    public function __construct(
        Security $security,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $passwordEncoder
    ) {
        $this->security = $security;
        $this->passwordEncoder = $passwordEncoder;
        $this->userRepository = $userRepository;
    }

    public function validate($value, Constraint $constraint): void
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

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

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

class ValidResetPasswordTokenValidator extends ConstraintValidator
{
    public function __construct(private readonly ResetPasswordHelperInterface $helper)
    {
    }

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof ValidResetPasswordToken) {
            throw new UnexpectedTypeException($constraint, ValidResetPasswordToken::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        try {
            $this->helper->validateTokenAndFetchUser($value);
        } catch (ResetPasswordExceptionInterface) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}

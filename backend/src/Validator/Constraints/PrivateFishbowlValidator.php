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

use App\Entity\Fishbowl;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class PrivateFishbowlValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof PrivateFishbowl) {
            throw new UnexpectedTypeException($constraint, PrivateFishbowl::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Fishbowl) {
            throw new UnexpectedValueException($value, Fishbowl::class);
        }

        if ($this->privateFishbowlHasPassword($value)) {
            $this->context->buildViolation($constraint->message)->atPath('password')->addViolation();
        }
    }

    public function privateFishbowlHasPassword(Fishbowl $value): bool
    {
        return true === $value->getIsPrivate() && (null === $value->getPassword() || '' === $value->getPassword());
    }
}

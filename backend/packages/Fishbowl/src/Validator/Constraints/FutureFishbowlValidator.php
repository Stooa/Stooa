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

namespace App\Fishbowl\Validator\Constraints;

use App\Fishbowl\Entity\Fishbowl;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class FutureFishbowlValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof FutureFishbowl) {
            throw new UnexpectedTypeException($constraint, FutureFishbowl::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Fishbowl) {
            throw new UnexpectedValueException($value, Fishbowl::class);
        }

        if ($this->isFromThePast($value)) {
            $this->context->buildViolation($constraint->message)->atPath('startDateTime')->addViolation();
        }
    }

    private function isFromThePast(Fishbowl $fishbowl): bool
    {
        return $fishbowl->getEndDateTimeTz() < new \DateTimeImmutable();
    }
}

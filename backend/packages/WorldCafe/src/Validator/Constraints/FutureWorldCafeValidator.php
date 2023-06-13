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

namespace App\WorldCafe\Validator\Constraints;

use App\WorldCafe\Entity\WorldCafe;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class FutureWorldCafeValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof FutureWorldCafe) {
            throw new UnexpectedTypeException($constraint, FutureWorldCafe::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof WorldCafe) {
            throw new UnexpectedValueException($value, WorldCafe::class);
        }

        if ($this->isFromThePast($value)) {
            $this->context->buildViolation($constraint->message)->atPath('startDateTime')->addViolation();
        }
    }

    private function isFromThePast(WorldCafe $worldCafe): bool
    {
        return false;
        //        return $worldCafe->getEndDateTimeTz() < new \DateTimeImmutable();
    }
}

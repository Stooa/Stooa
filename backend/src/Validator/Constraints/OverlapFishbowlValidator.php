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
use App\Repository\FishbowlRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class OverlapFishbowlValidator extends ConstraintValidator
{
    private FishbowlRepository $repository;
    private Security $security;

    public function __construct(
        FishbowlRepository $repository,
        Security $security
    ) {
        $this->repository = $repository;
        $this->security = $security;
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof OverlapFishbowl) {
            throw new UnexpectedTypeException($constraint, OverlapFishbowl::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Fishbowl) {
            throw new UnexpectedValueException($value, Fishbowl::class);
        }

        if ($this->hasOverlapWithOtherFishbowls($value)) {
            $this->context->buildViolation($constraint->message)->atPath('startDateTime')->addViolation();
        }
    }

    private function hasOverlapWithOtherFishbowls(Fishbowl $newFishbowl): bool
    {
        $user = $newFishbowl->getHost() ?? $this->security->getUser();

        if (null !== $user) {
            $fishbowls = $this->repository->findBy(['host' => $user]);

            foreach ($fishbowls as $fishbowl) {
                if ($fishbowl === $newFishbowl || $fishbowl->isFinished()) {
                    continue;
                }

                if ($this->isOverlapping($newFishbowl, $fishbowl)) {
                    return true;
                }
            }
        }

        return false;
    }

    private function isOverlapping(Fishbowl $new, Fishbowl $old): bool
    {
        $newStartDate = $new->getStartDateTimeTz();
        $newEndDate = $new->getEndDateTimeTz();

        $oldStartDate = $old->getStartDateTimeTz();
        $oldEndDate = $old->getEndDateTimeTz();

        return ($newStartDate <= $oldStartDate && $newEndDate > $oldStartDate) ||
            ($newStartDate < $oldEndDate && $newEndDate >= $oldEndDate) ||
            ($newStartDate >= $oldStartDate && $newEndDate <= $oldEndDate);
    }
}

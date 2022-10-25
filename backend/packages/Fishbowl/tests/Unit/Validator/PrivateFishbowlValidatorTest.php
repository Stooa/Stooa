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

namespace App\Fishbowl\Tests\Unit\Validator;

use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Validator\Constraints\PrivateFishbowl;
use App\Fishbowl\Validator\Constraints\PrivateFishbowlValidator;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;
use Zenstruck\Foundry\Test\Factories;

/**
 * @extends ConstraintValidatorTestCase<PrivateFishbowlValidator>
 */
class PrivateFishbowlValidatorTest extends ConstraintValidatorTestCase
{
    use Factories;

    /** @test */
    public function nullIsValid(): void
    {
        $this->validator->validate(null, new PrivateFishbowl());

        $this->assertNoViolation();
    }

    /** @test */
    public function itValidatesPrivateFishbowlWithoutPassword(): void
    {
        $constraint = new PrivateFishbowl();

        $fishbowl = FishbowlFactory::createOne([
            'isPrivate' => true,
            'plainPassword' => null,
        ])->object();

        $this->validator->validate($fishbowl, $constraint);

        $this->buildViolation($constraint->message)
            ->atPath('property.path.password')
            ->assertRaised();
    }

    public function itValidatesPublicFishbowlWithPassword(): void
    {
        $constraint = new PrivateFishbowl();

        $fishbowl = FishbowlFactory::createOne([
            'isPrivate' => false,
            'plainPassword' => 'password',
        ])->object();

        $this->validator->validate($fishbowl, $constraint);

        $this->buildViolation($constraint->message)
            ->atPath('property.path.isPrivate')
            ->assertRaised();
    }

    protected function createValidator(): PrivateFishbowlValidator
    {
        return new PrivateFishbowlValidator();
    }
}

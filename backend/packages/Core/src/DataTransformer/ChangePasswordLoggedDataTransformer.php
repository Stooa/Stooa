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

namespace App\Core\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Core\Entity\User;
use App\Core\Model\ChangePasswordLoggedInput;
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

class ChangePasswordLoggedDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly Security $security
    ) {
    }

    /** @param mixed[] $context */
    public function transform($object, string $to, array $context = []): object
    {
        $this->validator->validate($object);

        Assert::isInstanceOf($object, ChangePasswordLoggedInput::class);

        $user = $this->security->getUser();

        Assert::isInstanceOf($user, User::class);

        $user->setPlainPassword($object->getNewPassword());

        return $user;
    }

    /**
     * @param object|mixed[] $data
     * @param mixed[] $context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return User::class === $to && ChangePasswordLoggedInput::class === ($context['input']['class'] ?? null);
    }
}

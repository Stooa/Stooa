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

namespace App\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Entity\User;
use App\Model\ChangePasswordLoggedInput;
use Symfony\Component\Security\Core\Security;
use Webmozart\Assert\Assert;

class ChangePasswordLoggedDataTransformer implements DataTransformerInterface
{
    private ValidatorInterface $validator;
    private Security $security;

    public function __construct(
        ValidatorInterface $validator,
        Security $security
    ) {
        $this->validator = $validator;
        $this->security = $security;
    }

    /** @param array<string, mixed> $context */
    public function transform($object, string $to, array $context = [])
    {
        $this->validator->validate($object);

        Assert::isInstanceOf($object, ChangePasswordLoggedInput::class);

        $user = $this->security->getUser();

        Assert::isInstanceOf($user, User::class);

        $user->setPlainPassword($object->getNewPassword());

        return $user;
    }

    /**
     * @param object|array<string, mixed> $data
     * @param array<string, mixed> $context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return User::class === $to && ChangePasswordLoggedInput::class === ($context['input']['class'] ?? null);
    }
}

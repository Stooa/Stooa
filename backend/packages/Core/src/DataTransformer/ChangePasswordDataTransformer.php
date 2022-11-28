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
use App\Core\Model\ChangePasswordInput;
use App\Core\Security\PasswordEncoderService;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Webmozart\Assert\Assert;

class ChangePasswordDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly PasswordEncoderService $passwordEncoder,
        private readonly ResetPasswordHelperInterface $helper,
        private readonly ValidatorInterface $validator
    ) {
    }

    /** @param mixed[] $context */
    public function transform($object, string $to, array $context = []): object
    {
        $this->validator->validate($object);

        Assert::isInstanceOf($object, ChangePasswordInput::class);

        $token = (string) $object->getToken();
        $user = $this->helper->validateTokenAndFetchUser($token);

        Assert::isInstanceOf($user, User::class);

        $user->setPlainPassword($object->getPassword());

        $this->helper->removeResetRequest($token);
        $this->passwordEncoder->encodePassword($user);

        return $user;
    }

    /**
     * @param object|mixed[] $data
     * @param mixed[] $context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return User::class === $to && ChangePasswordInput::class === ($context['input']['class'] ?? null);
    }
}

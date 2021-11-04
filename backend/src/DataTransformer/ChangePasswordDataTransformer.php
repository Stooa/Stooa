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
use App\Model\ChangePasswordInput;
use App\Security\PasswordEncoderService;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Webmozart\Assert\Assert;

class ChangePasswordDataTransformer implements DataTransformerInterface
{
    private PasswordEncoderService $passwordEncoder;
    private ResetPasswordHelperInterface $helper;
    private ValidatorInterface $validator;

    public function __construct(
        PasswordEncoderService $passwordEncoder,
        ResetPasswordHelperInterface $helper,
        ValidatorInterface $validator
    ) {
        $this->helper = $helper;
        $this->passwordEncoder = $passwordEncoder;
        $this->validator = $validator;
    }

    /** @param mixed[] $context */
    public function transform($object, string $to, array $context = [])
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

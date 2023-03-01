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

namespace App\Core\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Core\Entity\User;
use App\Core\Repository\UserRepository;
use App\Core\Security\PasswordEncoderService;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Webmozart\Assert\Assert;

final class ChangePasswordProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly PasswordEncoderService $passwordEncoder,
        private readonly ResetPasswordHelperInterface $helper,
        private readonly UserRepository $userRepository
    ) {
    }

    /**
     * @param mixed $data
     * @param array<mixed> $uriVariables
     * @param array<mixed> $context
     *
     * @return User
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $token = (string) $data->getToken();

        /** @var User $user */
        $user = $this->helper->validateTokenAndFetchUser($token);

        Assert::isInstanceOf($user, User::class);

        $user->setPlainPassword($data->getPassword());

        $this->helper->removeResetRequest($token);

        $this->passwordEncoder->encodePassword($user);

        $this->userRepository->persist($user);

        return $user;
    }
}

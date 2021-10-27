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

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Model\ResetPassword;
use App\Repository\UserRepository;
use App\Service\MailerService;
use Ramsey\Uuid\Uuid;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

class ResetPasswordResolver implements MutationResolverInterface
{
    private UserRepository $userRepository;
    private MailerService $mailerService;
    private ResetPasswordHelperInterface $helper;

    public function __construct(
        UserRepository $userRepository,
        MailerService $mailerService,
        ResetPasswordHelperInterface $helper
    ) {
        $this->mailerService = $mailerService;
        $this->userRepository = $userRepository;
        $this->helper = $helper;
    }

    public function __invoke($item, array $context)
    {
        $email = $context['args']['input']['email'];
        $locale = $context['args']['input']['locale'];

        $user = $this->userRepository->loadUserByUsername($email);

        $resetPassword = new ResetPassword();
        $resetPassword->setId(Uuid::uuid4());
        $resetPassword->setEmail($email);
        $resetPassword->setLocale($locale);

        if (null !== $user) {
            try {
                $token = $this->helper->generateResetToken($user);
            } catch (ResetPasswordExceptionInterface $e) {
                return $resetPassword;
            }

            $this->mailerService->sendResetPasswordEmail($user, $token, $resetPassword);
        }

        return $resetPassword;
    }
}

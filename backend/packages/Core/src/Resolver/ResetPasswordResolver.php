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

namespace App\Core\Resolver;

use ApiPlatform\GraphQl\Resolver\MutationResolverInterface;
use App\Core\Model\ResetPassword;
use App\Core\Repository\UserRepository;
use App\Core\Service\MailerService;
use Ramsey\Uuid\Uuid;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

class ResetPasswordResolver implements MutationResolverInterface
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly MailerService $mailerService,
        private readonly ResetPasswordHelperInterface $helper
    ) {
    }

    /** @param mixed[] $context */
    public function __invoke($item, array $context): ResetPassword
    {
        $email = $context['args']['input']['email'];
        $locale = $context['args']['input']['locale'];

        $user = $this->userRepository->loadUserByIdentifier($email);

        $resetPassword = new ResetPassword();
        $resetPassword->setId(Uuid::uuid4());
        $resetPassword->setEmail($email);
        $resetPassword->setLocale($locale);

        if (null !== $user) {
            try {
                $token = $this->helper->generateResetToken($user);
            } catch (ResetPasswordExceptionInterface) {
                return $resetPassword;
            }

            $this->mailerService->sendResetPasswordEmail($user, $token, $resetPassword);
        }

        return $resetPassword;
    }
}

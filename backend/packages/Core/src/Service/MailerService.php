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

namespace App\Core\Service;

use App\Core\Entity\User;
use App\Core\Model\ResetPassword;
use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Service\PrivateFishbowlService;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Model\ResetPasswordToken;

class MailerService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly TranslatorInterface $translator,
        private readonly PrivateFishbowlService $privateFishbowlService,
        private readonly string $from,
        private readonly string $appUrl
    ) {
    }

    public function sendWelcomeEmail(User $user): void
    {
        // User registers on a specific locale, we store this information
        // and we should use it here to know the locale for the email
        $locale = $user->getLocale();

        $email = (new TemplatedEmail())
            ->from(new Address($this->from, $this->translator->trans('emails.from', [], null, $locale)))
            ->to((string) $user->getEmail())
            ->subject($this->translator->trans('emails.welcome_email.subject', [], null, $locale))
            ->htmlTemplate('emails/signup.html.twig')
            ->context([
                'name' => $user->getName(),
                'surnames' => $user->getSurnames(),
                'locale' => $locale,
                'appUrl' => $this->appUrl,
            ]);

        $this->mailer->send($email);
    }

    public function sendResetPasswordEmail(User $user, ResetPasswordToken $resetToken, ResetPassword $resetPassword): void
    {
        // User resets password in an specific locale, with this we make sure
        // we send the password reset email in that locale
        $locale = $resetPassword->getLocale();

        $email = (new TemplatedEmail())
            ->from(new Address($this->from, $this->translator->trans('emails.from', [], null, $locale)))
            ->to((string) $user->getEmail())
            ->subject($this->translator->trans('emails.reset_password_email.subject',
                ['%name%' => $user->getName()],
                null,
                $locale
            ))
            ->htmlTemplate('emails/reset-password.html.twig')
            ->context([
                'name' => $user->getName(),
                'resetToken' => $resetToken->getToken(),
                'locale' => $locale,
                'appUrl' => $this->appUrl,
            ]);

        $this->mailer->send($email);
    }

    public function sendFishbowlCreatedEmail(Fishbowl $fishbowl): void
    {
        // Fishbowl has its own locale, despite the one set on the request.
        $locale = $fishbowl->getLocale();
        $user = $fishbowl->getHost();
        $uid = $fishbowl->getId();

        if (null !== $user) {
            $email = (new TemplatedEmail())
                ->from(new Address($this->from, $this->translator->trans('emails.from', [], null, $locale)))
                ->to((string) $user->getEmail())
                ->subject($this->translator->trans(
                    'emails.fishbowl_created_email.subject',
                    ['%name%' => $user->getName()],
                    null,
                    $locale
                ))
                ->htmlTemplate('emails/fishbowl-created.html.twig')
                ->context([
                    'name' => $user->getName(),
                    'fishbowlId' => null !== $uid ? $uid->toString() : '',
                    'fishbowlName' => $fishbowl->getName(),
                    'fishbowlDescription' => $fishbowl->getDescription(),
                    'fishbowlStartDate' => $fishbowl->getStartDateTimeFormatted(),
                    'fishbowlStartTime' => $fishbowl->getStartDateTimeHourFormatted(),
                    'fishbowlFinishTime' => $fishbowl->getFinishDateTimeHourFormatted(),
                    'fishbowlDuration' => $fishbowl->getDurationFormatted(),
                    'fishbowlSlug' => $fishbowl->getSlug(),
                    'fishbowlPassword' => $this->privateFishbowlService->decryptPrivatePassword($fishbowl)->getPlainPassword(),
                    'fishbowlIsPrivate' => $fishbowl->getIsPrivate(),
                    'locale' => $locale,
                    'appUrl' => $this->appUrl,
                ]);

            $this->mailer->send($email);
        }
    }
}

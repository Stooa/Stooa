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

namespace App\Service;

use App\Entity\Fishbowl;
use App\Entity\User;
use App\Model\ResetPassword;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Model\ResetPasswordToken;

class MailerService
{
    private MailerInterface $mailer;
    private TranslatorInterface $translator;
    private string $from;
    private string $appUrl;

    public function __construct(
        MailerInterface $mailer,
        TranslatorInterface $translator,
        string $from,
        string $appUrl
    ) {
        $this->mailer = $mailer;
        $this->translator = $translator;
        $this->from = $from;
        $this->appUrl = $appUrl;
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
                    'fishbowlDuration' => $fishbowl->getDurationFormatted(),
                    'fishbowlSlug' => $fishbowl->getSlug(),
                    'locale' => $locale,
                    'appUrl' => $this->appUrl,
                ]);

            $this->mailer->send($email);
        }
    }
}

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

namespace App\Fishbowl\Service;

use App\Core\Entity\User;
use App\Fishbowl\Entity\Attendee;
use App\Fishbowl\Entity\Fishbowl;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Contracts\Translation\TranslatorInterface;

class AttendeeMailerService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly TranslatorInterface $translator,
        private readonly string $from,
        private readonly string $appUrl
    ) {
    }

    public function sendNewAttendeeNotification(Attendee $attendee, Fishbowl $fishbowl, User $host): void
    {
        $locale = $host->getLocale();

        $email = (new TemplatedEmail())
            ->from(new Address($this->from, $this->translator->trans('emails.new_attendee.title', ['%name%' => $attendee->getName()], null, $locale)))
            ->to((string) $host->getEmail())
            ->subject($this->translator->trans('emails.new_attendee.subject', ['%name%' => $attendee->getName()], null, $locale))
            ->htmlTemplate('emails/new-attendee.html.twig')
            ->context([
                'attendeeName' => $attendee->getName(),
                'attendeeEmail' => $attendee->getEmail(),
                'fishbowlName' => $fishbowl->getName(),
                'fishbowlSlug' => $fishbowl->getSlug(),
                'fishbowlDescription' => $fishbowl->getDescription(),
                'fishbowlStartDate' => $fishbowl->getStartDateTimeFormatted(),
                'fishbowlStartTime' => $fishbowl->getStartDateTimeHourFormatted(),
                'fishbowlFinishTime' => $fishbowl->getFinishDateTimeHourFormatted(),
                'fishbowlDuration' => $fishbowl->getDurationFormatted(),
                'locale' => $locale,
                'appUrl' => $this->appUrl,
            ]);

        $this->mailer->send($email);
    }

    public function sendNewAttendeeConfirmation(Attendee $attendee, Fishbowl $fishbowl, User $host): void
    {
        if (null === $attendee->getEmail()) {
            return;
        }

        $locale = $host->getLocale();

        $email = (new TemplatedEmail())
            ->from(new Address($this->from, $this->translator->trans('emails.new_attendee_confirmation.title', ['%fishbowl%' => $fishbowl->getName()], null, $locale)))
            ->to((string) $attendee->getEmail())
            ->subject($this->translator->trans('emails.new_attendee_confirmation.subject', ['%fishbowl%' => $fishbowl->getName()], null, $locale))
            ->htmlTemplate('emails/new-attendee-confirmation.html.twig')
            ->context([
                'fishbowlHostName' => $host->getFullName(),
                'fishbowlName' => $fishbowl->getName(),
                'fishbowlSlug' => $fishbowl->getSlug(),
                'fishbowlDescription' => $fishbowl->getDescription(),
                'fishbowlStartDate' => $fishbowl->getStartDateTimeFormatted(),
                'fishbowlStartTime' => $fishbowl->getStartDateTimeHourFormatted(),
                'fishbowlFinishTime' => $fishbowl->getFinishDateTimeHourFormatted(),
                'fishbowlDuration' => $fishbowl->getDurationFormatted(),
                'locale' => $locale,
                'appUrl' => $this->appUrl,
            ]);

        $this->mailer->send($email);
    }
}

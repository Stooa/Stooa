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

use App\Fishbowl\Entity\Attendee;
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

    public function sendNewAttendeeNotification(Attendee $attendee): void
    {
        $fishbowl = $attendee->getFishbowl();

        if (null === $fishbowl) {
            return;
        }

        $user = $fishbowl->getHost();

        if (null === $user) {
            return;
        }

        $locale = $user->getLocale();

        $email = (new TemplatedEmail())
            ->from(new Address($this->from, $this->translator->trans('emails.new_attendee.title', ['%name%' => $attendee->getName()], null, $locale)))
            ->to((string) $user->getEmail())
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
}

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

namespace App\WorldCafe\Service;

use App\WorldCafe\Entity\WorldCafe;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Contracts\Translation\TranslatorInterface;

class WorldCafeMailService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly TranslatorInterface $translator,
        private readonly string $from,
        private readonly string $appUrl
    ) {
    }

    public function sendWorldCafeCreatedEmail(WorldCafe $worldCafe): void
    {
        $locale = $worldCafe->getLocale();
        $user = $worldCafe->getHost();
        $uid = $worldCafe->getId();

        if (null !== $user) {
            $email = (new TemplatedEmail())
                ->from(new Address($this->from, $this->translator->trans('emails.from', [], null, $locale)))
                ->to((string) $user->getEmail())
                ->subject($this->translator->trans(
                    'emails.world_cafe_created_email.subject',
                    ['%name%' => $user->getName()],
                    null,
                    $locale
                ))
                ->htmlTemplate('emails/world-cafe-created.html.twig')
                ->context([
                    'name' => $user->getName(),
                    'fishbowlId' => null !== $uid ? $uid->toString() : '',
                    'fishbowlName' => $worldCafe->getName(),
                    'fishbowlDescription' => $worldCafe->getDescription(),
                    'fishbowlStartDate' => $worldCafe->getStartDateTimeFormatted(),
                    'fishbowlStartTime' => $worldCafe->getStartDateTimeHourFormatted(),
                    'fishbowlSlug' => $worldCafe->getSlug(),
                    'locale' => $locale,
                    'appUrl' => $this->appUrl,
                ]);

            $this->mailer->send($email);
        }
    }
}

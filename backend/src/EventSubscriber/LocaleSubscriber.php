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

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    /** @var string[] */
    private array $locales;

    /** @param string[] $locales */
    public function __construct(
        array $locales
    ) {
        $this->locales = $locales;
    }

    /** @return array<string, array<int, array<int, int|string>>> */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 200]],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if (!$request->headers->has('Accept-Language')) {
            return;
        }

        $locales = $request->headers->get('Accept-Language');

        if (null === $locales) {
            return;
        }

        $requestLocale = $request->getPreferredLanguage($this->locales);

        if (null === $requestLocale) {
            return;
        }

        $request->setLocale($requestLocale);
    }
}

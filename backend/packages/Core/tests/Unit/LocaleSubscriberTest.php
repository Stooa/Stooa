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

namespace App\Core\Tests\Unit;

use App\Core\EventSubscriber\LocaleSubscriber;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\Kernel;

class LocaleSubscriberTest extends TestCase
{
    private RequestEvent $event;
    private LocaleSubscriber $subscriber;

    protected function setUp(): void
    {
        $locales = ['en', 'es', 'ca'];
        $this->subscriber = new LocaleSubscriber($locales);
    }

    /** @test */
    public function itGetsDefaultLocaleWithoutHeaders(): void
    {
        $request = new Request();
        $this->event = new RequestEvent($this->createStub(Kernel::class), $request, HttpKernelInterface::MASTER_REQUEST);
        $this->subscriber->onKernelRequest($this->event);

        static::assertSame('en', $this->event->getRequest()->getLocale());
    }

    /** @test */
    public function itGetsDefaultLocaleWithWrongLocale(): void
    {
        $request = new Request();
        $request->headers->add(['Accept-Language' => 'fr']);
        $this->event = new RequestEvent($this->createStub(Kernel::class), $request, HttpKernelInterface::MASTER_REQUEST);
        $this->subscriber->onKernelRequest($this->event);

        static::assertSame('en', $this->event->getRequest()->getLocale());
    }

    /** @test */
    public function itSetsCorrectLocaleWithHeaders(): void
    {
        $request = new Request();
        $request->headers->add(['Accept-Language' => 'es']);
        $this->event = new RequestEvent($this->createStub(Kernel::class), $request, HttpKernelInterface::MASTER_REQUEST);
        $this->subscriber->onKernelRequest($this->event);

        static::assertSame('es', $this->event->getRequest()->getLocale());
    }

    /** @test */
    public function itSetsCorrectLocaleWithNavigatorHeaders(): void
    {
        $request = new Request();
        $request->headers->add(['Accept-Language' => 'es,en;q=0.9,en-US;q=0.8,ca;q=0.7,eu;q=0.6,nb;q=0.5,ru;q=0.4,ja;q=0.3,fr;q=0.2,de;q=0.1']);
        $this->event = new RequestEvent($this->createStub(Kernel::class), $request, HttpKernelInterface::MASTER_REQUEST);
        $this->subscriber->onKernelRequest($this->event);

        static::assertSame('es', $this->event->getRequest()->getLocale());
    }
}

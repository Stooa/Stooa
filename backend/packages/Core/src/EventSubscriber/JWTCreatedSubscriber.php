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

namespace App\Core\EventSubscriber;

use App\Core\Entity\User;
use App\Core\JWT\TokenGenerator\TokenGeneratorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly TokenGeneratorInterface $tokenGenerator)
    {
    }

    /** @return array<string, string> */
    public static function getSubscribedEvents(): array
    {
        return [
            Events::JWT_CREATED => 'onJWTCreated',
        ];
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        /** @var User */
        $user = $event->getUser();

        $payload = $event->getData();

        $jwtPayload = $this->tokenGenerator->generate($user);

        $event->setData(array_merge($jwtPayload->toArray(), $payload));

        $headerPayload = $jwtPayload->getHeaderPayload();

        if (null !== $headerPayload) {
            $header = $event->getHeader();

            $event->setHeader(array_merge($header, $headerPayload->toArray()));
        }
    }
}

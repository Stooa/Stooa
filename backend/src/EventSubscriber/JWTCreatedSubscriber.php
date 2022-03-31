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

use App\Entity\User;
use App\TokenGenerator\TokenGeneratorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    private TokenGeneratorInterface $tokenGenerator;

    public function __construct(TokenGeneratorInterface $tokenGenerator)
    {
        $this->tokenGenerator = $tokenGenerator;
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

        if (null !== $jwtPayload->getHeaderPayload()) {
            $header = $event->getHeader();

            $event->setHeader(array_merge($header, $jwtPayload->getHeaderPayload()->toArray()));
        }
    }

    private function fake(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();

        $jayParsedAry = [
            "aud" => "jitsi",
//            "exp" => 1648725228,
            "nbf" => new \DateTimeImmutable('- 1 day'),
            "iss" => "chat",
            "room" => "*",
            "sub" => "vpaas-magic-cookie-a9a8c47f6b204bdeb1cf7a8114598b6e",
            "context" => [
                "features" => [
                    "livestreaming" => true,
                    "outbound-call" => true,
                    "sip-outbound-call" => false,
                    "transcription" => true,
                    "recording" => true
                ],
                "user" => [
                    "moderator" => true,
                    "name" => "aitor",
                    "id" => "google-oauth2|113294531651258150396",
                    "avatar" => "",
                    "email" => "aitor@runroom.com"
                ]
            ]
        ];
        $event->setData(array_merge($jayParsedAry, $payload));

        $header = $event->getHeader();

        $customHeader = [
            'kid' => 'vpaas-magic-cookie-a9a8c47f6b204bdeb1cf7a8114598b6e/961b36-SAMPLE_APP',
            'typ' => 'JWT',
            'alg' => 'RS256',
        ];
        $event->setHeader(array_merge($header, $customHeader));
    }
}

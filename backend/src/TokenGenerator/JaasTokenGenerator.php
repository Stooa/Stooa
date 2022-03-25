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

namespace App\TokenGenerator;

use App\Entity\User;
use App\Model\Payload\FeaturesPayload;
use App\Model\Payload\HeaderPayload;
use App\Model\Payload\JWTPayload;
use App\Model\Payload\UserPayload;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

final class JaasTokenGenerator implements TokenGeneratorInterface
{
    private string $appId;
    private string $apiKey;

    public function __construct(string $appId, string $apiKey)
    {
        $this->appId = $appId;
        $this->apiKey = $apiKey;
    }

    public function generate(JWTCreatedEvent $event): void
    {
        /** @var User */
        $user = $event->getUser();

        $payload = $event->getData();

        $jwtPayload = new JWTPayload();
        $jwtPayload->setIss('chat');
        $jwtPayload->setAud('jitsi');
        $jwtPayload->setSub($this->appId);
        $jwtPayload->setRoom('*');

        $userPayload = new UserPayload();
        $userPayload->setName($user->getFullName());
        $userPayload->setEmail($user->getEmail());
        $userPayload->setTwitter($user->getPublicTwitterProfile());
        $userPayload->setLinkedin($user->getPublicLinkedinProfile());

        $featurePayload = new FeaturesPayload();
        $featurePayload->setLivestreaming(false);
        $featurePayload->setOutboundCall(false);
        $featurePayload->setRecording(false);
        $featurePayload->setTranscription(false);

        $jwtPayload->setUser($userPayload);
        $jwtPayload->setFeatures($featurePayload);

        $event->setData(array_merge($jwtPayload->toArray(), $payload));

        $header = $event->getHeader();

        $headerPayload = new HeaderPayload();
        $headerPayload->setAlg('RS256');
        $headerPayload->setKid($this->apiKey);
        $headerPayload->setTyp('JWT');

        $event->setHeader($header);
    }
}

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

namespace App\Security;

use App\Entity\Guest;
use App\Model\GuestLogin;
use App\Repository\GuestRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\InteractiveAuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\HttpUtils;

class GuestAuthenticator extends AbstractAuthenticator implements InteractiveAuthenticatorInterface
{
    /**
     * @param array<string, string|null> $options
     */
    public function __construct(
        private readonly AuthenticationSuccessHandlerInterface $authenticationSuccessHandler,
        private readonly AuthenticationFailureHandlerInterface $authenticationFailureHandler,
        private readonly HttpUtils $httpUtils,
        private readonly GuestRepository $guestRepository,
        private readonly array $options
    ) {
    }

    public function supports(Request $request): ?bool
    {
        if (!str_contains($request->getRequestFormat() ?? '', 'json') && !str_contains($request->getContentType() ?? '', 'json')) {
            return false;
        }

        if (isset($this->options['check_path']) && !$this->httpUtils->checkRequestPath($request, $this->options['check_path'])) {
            return false;
        }

        return true;
    }

    public function authenticate(Request $request): Passport
    {
        $guestLogin = $this->getValues($request);

        $userBadge = null !== $guestLogin->getId()
            ? new UserBadge($guestLogin->getId(), $this->guestRepository->loadUserByIdentifier(...))
            : new UserBadge('', fn () => $this->createGuest($guestLogin->getName()));

        return new SelfValidatingPassport($userBadge);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return $this->authenticationSuccessHandler->onAuthenticationSuccess($request, $token);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return $this->authenticationFailureHandler->onAuthenticationFailure($request, $exception);
    }

    public function isInteractive(): bool
    {
        return true;
    }

    private function getValues(Request $request): GuestLogin
    {
        try {
            $data = json_decode($request->getContent(), false, 512, \JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new BadRequestHttpException('Invalid JSON.');
        }

        $guestLogin = GuestLogin::createFromData($data);

        if (null === $guestLogin->getId() || '' === $guestLogin->getName()) {
            throw new BadRequestHttpException('The key "id" or "name" are mandatory.');
        }

        return $guestLogin;
    }

    private function createGuest(string $name): Guest
    {
        $guest = new Guest();
        $guest->setName($name);

        $this->guestRepository->persist($guest);

        return $guest;
    }
}

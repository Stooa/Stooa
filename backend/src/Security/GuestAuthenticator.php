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
    private AuthenticationSuccessHandlerInterface $authenticationSuccessHandler;
    private AuthenticationFailureHandlerInterface $authenticationFailureHandler;
    private HttpUtils $httpUtils;
    private GuestRepository $guestRepository;
    private array $options;

    public function __construct(
        AuthenticationSuccessHandlerInterface $authenticationSuccessHandler,
        AuthenticationFailureHandlerInterface $authenticationFailureHandler,
        HttpUtils $httpUtils,
        GuestRepository $guestRepository,
        array $options
    ) {
        $this->authenticationSuccessHandler = $authenticationSuccessHandler;
        $this->httpUtils = $httpUtils;
        $this->guestRepository = $guestRepository;
        $this->options = $options;
        $this->authenticationFailureHandler = $authenticationFailureHandler;
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
        $guestValues = $this->getValues($request);

        $userBadge = null === $guestValues['id']
            ? new UserBadge('', fn () => $this->createGuest($guestValues['name']))
            : new UserBadge($guestValues['id'], $this->guestRepository->loadUserByIdentifier(...));

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

    private function getValues(Request $request): ?array
    {
        $guestValues = [];

        try {
            $data = json_decode($request->getContent(), false, 512, \JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new BadRequestHttpException('Invalid JSON.');
        }

        $guestValues['id'] = property_exists($data, 'id') ? $data->id : null;
        $guestValues['name'] = property_exists($data, 'name') ? $data->name : null;

        if (null === $guestValues['id'] && null === $guestValues['name']) {
            throw new BadRequestHttpException('The key "id" or "name" are mandatory.');
        }

        if (null !== $guestValues['id'] && !\is_string($guestValues['id'])) {
            throw new BadRequestHttpException('The key "id" must be a string.');
        }

        return $guestValues;
    }

    private function createGuest(string $name): Guest
    {
        $guest = new Guest();
        $guest->setName($name);

        $this->guestRepository->persist($guest);

        return $guest;
    }
}

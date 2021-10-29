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

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\User;
use App\Security\PasswordEncoderService;
use App\Service\MailerService;

class UserDataPersister implements ContextAwareDataPersisterInterface
{
    private ContextAwareDataPersisterInterface $decorated;
    private PasswordEncoderService $passwordEncoder;
    private MailerService $mailerService;

    public function __construct(
        ContextAwareDataPersisterInterface $decorated,
        PasswordEncoderService $passwordEncoder,
        MailerService $mailerService
    ) {
        $this->decorated = $decorated;
        $this->passwordEncoder = $passwordEncoder;
        $this->mailerService = $mailerService;
    }

    /**
     * @param mixed $data
     * @param array<string, mixed> $context
     */
    public function supports($data, array $context = []): bool
    {
        return $this->decorated->supports($data, $context);
    }

    /**
     * @param mixed $data
     * @param array<string, mixed> $context
     *
     * @return object|void
     */
    public function persist($data, array $context = [])
    {
        if ($data instanceof User) {
            if (($context['collection_operation_name'] ?? null) === 'post' ||
                ($context['graphql_operation_name'] ?? null) === 'create') {
                $data->setActive(true);
            }

            $this->passwordEncoder->encodePassword($data);
        }

        $result = $this->decorated->persist($data, $context);

        if ($data instanceof User && (
            ($context['collection_operation_name'] ?? null) === 'post' ||
            ($context['graphql_operation_name'] ?? null) === 'create')
        ) {
            $this->mailerService->sendWelcomeEmail($data);
        }

        return $result;
    }

    /**
     * @param mixed $data
     * @param array<string, mixed> $context
     */
    public function remove($data, array $context = []): void
    {
        $this->decorated->remove($data, $context);
    }
}

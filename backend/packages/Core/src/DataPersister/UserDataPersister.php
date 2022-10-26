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

namespace App\Core\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Core\Entity\User;
use App\Core\Security\PasswordEncoderService;
use App\Core\Service\MailerService;

class UserDataPersister implements ContextAwareDataPersisterInterface
{
    public function __construct(
        private readonly ContextAwareDataPersisterInterface $decorated,
        private readonly PasswordEncoderService $passwordEncoder,
        private readonly MailerService $mailerService
    ) {
    }

    /**
     * @param mixed $data
     * @param mixed[] $context
     */
    public function supports($data, array $context = []): bool
    {
        return $this->decorated->supports($data, $context);
    }

    /**
     * @param mixed $data
     * @param mixed[] $context
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
     * @param mixed[] $context
     */
    public function remove($data, array $context = []): void
    {
        $this->decorated->remove($data, $context);
    }
}

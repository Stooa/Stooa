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

namespace App\Core\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Core\Entity\User;
use App\Core\Security\PasswordEncoderService;
use App\Core\Service\MailerService;

final readonly class UserProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $decorated,
        private PasswordEncoderService $passwordEncoder,
        private MailerService $mailerService
    ) {
    }

    /**
     * @param array<mixed> $context
     * @param array<mixed> $uriVariables
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof User) {
            if (($context['collection_operation_name'] ?? null) === 'post' ||
                ($context['graphql_operation_name'] ?? null) === 'create') {
                $data->setActive(true);
            }

            $this->passwordEncoder->encodePassword($data);
        }

        $result = $this->decorated->process($data, $operation, $uriVariables, $context);

        if ($data instanceof User && (
            ($context['collection_operation_name'] ?? null) === 'post' ||
            ($context['graphql_operation_name'] ?? null) === 'create')
        ) {
            $this->mailerService->sendWelcomeEmail($data);
        }

        return $result;
    }
}

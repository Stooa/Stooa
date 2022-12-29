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

namespace App\Fishbowl\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Core\Service\MailerService;
use App\Fishbowl\Entity\Fishbowl;

final readonly class FishbowlProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $decorated,
        private MailerService $mailerService
    ) {
    }

    /**
     * @param array<mixed> $context
     * @param array<mixed> $uriVariables
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $result = $this->decorated->process($data, $operation, $uriVariables, $context);

        if ($data instanceof Fishbowl && (
            ($context['collection_operation_name'] ?? null) === 'post' ||
            ($context['graphql_operation_name'] ?? null) === 'create')
        ) {
            $this->mailerService->sendFishbowlCreatedEmail($data);
        }

        return $result;
    }
}

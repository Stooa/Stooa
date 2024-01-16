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

namespace App\WorldCafe\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\WorldCafe\Entity\WorldCafe;
use App\WorldCafe\Service\WorldCafeMailService;

final class WorldCafeProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $decorated,
        private readonly WorldCafeMailService $mailerService
    ) {
    }

    /**
     * @param array<mixed> $context
     * @param array<mixed> $uriVariables
     *
     * @return WorldCafe
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $result = $this->decorated->process($data, $operation, $uriVariables, $context);

        if ($data instanceof WorldCafe && (
            ($context['collection_operation_name'] ?? null) === 'post'
            || ($context['graphql_operation_name'] ?? null) === 'create')
        ) {
            $this->mailerService->sendWorldCafeCreatedEmail($data);
        }

        return $result;
    }
}

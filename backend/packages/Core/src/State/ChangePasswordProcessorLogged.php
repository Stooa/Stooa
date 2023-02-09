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
use Symfony\Bundle\SecurityBundle\Security;
use Webmozart\Assert\Assert;

final class ChangePasswordProcessorLogged implements ProcessorInterface
{
    public function __construct(
        private readonly Security $security
    ) {
    }

    /**
     * @param mixed $data
     * @param array<mixed> $uriVariables
     * @param array<mixed> $context
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        /** @var User $user */
        $user = $this->security->getUser();

        Assert::isInstanceOf($user, User::class);

        $user->setPlainPassword($data->getNewPassword());

        return $user;
    }
}

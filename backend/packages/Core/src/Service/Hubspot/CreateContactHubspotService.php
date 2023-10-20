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

namespace App\Core\Service\Hubspot;

use App\Core\Entity\User;
use HubSpot\Client\Crm\Contacts\Model\SimplePublicObjectInputForCreate;
use HubSpot\Factory;
use Symfony\Bundle\SecurityBundle\Security;

class CreateContactHubspotService
{
    public function __construct(
        protected readonly TokenHubspotService $tokenHubspotService,
        protected readonly Security $security,
    ) {
    }

    public function create(string $name, string $email): void
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (null === $user) {
            return;
        }

        $accessToken = $this->tokenHubspotService->refreshToken();

        if (null === $accessToken) {
            return;
        }

        $hubspot = Factory::createWithAccessToken($accessToken);

        $contactInput = new SimplePublicObjectInputForCreate();
        $contactInput->setProperties([
            'firstname' => $name,
            'email' => $email,
        ]);

        $contact = $hubspot->crm()->contacts()->basicApi()->create($contactInput);
    }
}

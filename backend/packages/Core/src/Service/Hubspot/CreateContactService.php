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
use App\Fishbowl\Entity\Fishbowl;
use HubSpot\Client\Crm\Contacts\Model\SimplePublicObjectInput;
use HubSpot\Client\Crm\Contacts\Model\SimplePublicObjectInputForCreate;

class CreateContactService
{
    public function __construct(
        protected readonly HubspotService $hubspotService,
        protected readonly FindContactService $findContactHubspotService
    ) {
    }

    public function create(User $host, User $contact, Fishbowl $fishbowl): void
    {
        if (null === $contactEmail = $contact->getEmail()) {
            return;
        }

        $hubspot = $this->hubspotService->createHubspot($host);

        if (null === $hubspot) {
            return;
        }

        $contactId = $this->findContactHubspotService->findContact($host, $contactEmail);

        $properties = [
            'firstname' => $contact->getFullName(),
            'email' => $contactEmail,
            'message' => "Fishbowl: {$fishbowl->getName()}",
        ];

        if (null !== $contactId) {
            $contactInput = new SimplePublicObjectInput();
            $contactInput->setProperties($properties);

            $hubspot->crm()->contacts()->basicApi()->update($contactId, $contactInput);

            return;
        }

        $contactInput = new SimplePublicObjectInputForCreate();
        $contactInput->setProperties($properties);

        $hubspot->crm()->contacts()->basicApi()->create($contactInput);
    }
}

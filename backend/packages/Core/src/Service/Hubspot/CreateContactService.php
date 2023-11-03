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
use HubSpot\Client\Crm\Contacts\Model\SimplePublicObject;
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

        $contactObject = $this->findContactHubspotService->findContact($host, $contactEmail);

        $properties = [
            'firstname' => $contact->getFullName(),
            'email' => $contactEmail,
            'message' => $fishbowl->getCopyName(),
        ];

        if (null !== $contactObject && $this->isSameContact($contact, $contactObject)) {
            $contactInput = new SimplePublicObjectInput();

            $properties['message'] = $this->concatFishbowlName($fishbowl, $contactObject);

            $contactInput->setProperties($properties);

            $hubspot->crm()->contacts()->basicApi()->update($contactObject->getId(), $contactInput);

            return;
        }

        $contactInput = new SimplePublicObjectInputForCreate();
        $contactInput->setProperties($properties);

        $hubspot->crm()->contacts()->basicApi()->create($contactInput);
    }

    private function isSameContact(User $contact, SimplePublicObject $contactObject): bool
    {
        return $contact->getFullName() === $contactObject->getProperties()['firstname']
            && $contact->getEmail() === $contactObject->getProperties()['email'];
    }

    private function concatFishbowlName(Fishbowl $fishbowl, SimplePublicObject $contactObject): string
    {
        return $contactObject->getProperties()['message'] . ", {$fishbowl->getCopyName()}";
    }
}

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

class ContactsHubspotService
{
    public function __construct(
        protected readonly HubspotService $hubspotService,
    ) {
    }

    /** @return array<mixed> */
    public function contacts(): array
    {
        $hubspot = $this->hubspotService->createHubspot();

        if (null === $hubspot) {
            return [];
        }

        $contactsPage = $hubspot->crm()->contacts()->getAll();

        return array_map(
            fn ($contact) => $contact->jsonSerialize(),
            $contactsPage,
        );
    }
}

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
use HubSpot\Client\Crm\Contacts\Model\Error;
use HubSpot\Client\Crm\Contacts\Model\Filter;
use HubSpot\Client\Crm\Contacts\Model\FilterGroup;
use HubSpot\Client\Crm\Contacts\Model\PublicObjectSearchRequest;

class FindContactService
{
    public function __construct(
        protected readonly HubspotService $hubspotService
    ) {
    }

    public function findContact(User $user, string $email): ?string
    {
        $hubspot = $this->hubspotService->createHubspot($user);

        if (null === $hubspot) {
            return null;
        }

        $filter = new Filter();
        $filter
            ->setOperator('EQ')
            ->setPropertyName('email')
            ->setValue($email);

        $filterGroup = new FilterGroup();
        $filterGroup->setFilters([$filter]);
        $searchRequest = new PublicObjectSearchRequest();
        $searchRequest->setFilterGroups([$filterGroup]);

        $searchRequest->setProperties(['email']);

        $contactsPage = $hubspot->crm()->contacts()->searchApi()->doSearch($searchRequest);

        if ($contactsPage instanceof Error) {
            return null;
        }

        $results = $contactsPage->getResults();

        return isset($results[0]) ? $contactsPage->getResults()[0]->getId() : null;
    }
}

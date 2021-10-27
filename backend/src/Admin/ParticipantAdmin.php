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

namespace App\Admin;

use App\Entity\Participant;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\DoctrineORMAdminBundle\Filter\DateRangeFilter;
use Sonata\DoctrineORMAdminBundle\Filter\ModelAutocompleteFilter;
use Sonata\Form\Type\DateRangePickerType;

/** @extends AbstractAdmin<Participant> */
class ParticipantAdmin extends AbstractAdmin
{
    /** @param mixed[] $sortValues */
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues['_sort_by'] = 'lastPing';
        $sortValues['_sort_order'] = 'DESC';
    }

    protected function configureRoutes(RouteCollection $collection): void
    {
        $collection->remove('create');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper): void
    {
        $datagridMapper
            ->add('user', ModelAutocompleteFilter::class, [], null, [
                'property' => 'email',
                'callback' => FishbowlAdmin::hostCallbackFunction(),
            ])
            ->add('guest', ModelAutocompleteFilter::class, [], null, [
                'property' => 'name',
            ])
            ->add('fishbowl', ModelAutocompleteFilter::class, [], null, [
                'property' => 'name',
            ])
            ->add('lastPing', DateRangeFilter::class, [
                'field_type' => DateRangePickerType::class,
            ]);
    }

    protected function configureListFields(ListMapper $listMapper): void
    {
        $listMapper
            ->add('user')
            ->add('guest')
            ->add('fishbowl')
            ->add('lastPing');
    }

    protected function configureFormFields(FormMapper $formMapper): void
    {
        $formMapper
            ->add('user')
            ->add('guest')
            ->add('fishbowl')
            ->add('lastPing');
    }
}

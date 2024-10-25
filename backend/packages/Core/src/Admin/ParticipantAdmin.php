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

namespace App\Core\Admin;

use App\Core\Entity\Participant;
use App\Fishbowl\Admin\FishbowlAdmin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Form\Type\ModelAutocompleteType;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Sonata\DoctrineORMAdminBundle\Filter\DateRangeFilter;
use Sonata\DoctrineORMAdminBundle\Filter\ModelFilter;
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

    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('create');
    }

    protected function configureDatagridFilters(DatagridMapper $filter): void
    {
        $filter
            ->add('user', ModelFilter::class, [
                'field_type' => ModelAutocompleteType::class,
                'field_options' => [
                    'property' => 'email',
                    'callback' => FishbowlAdmin::hostCallbackFunction(),
                ],
            ])
            ->add('guest', ModelFilter::class, [
                'field_type' => ModelAutocompleteType::class,
                'field_options' => [
                    'property' => 'name',
                ],
            ])
            ->add('fishbowl', ModelFilter::class, [
                'field_type' => ModelAutocompleteType::class,
                'field_options' => [
                    'property' => 'name',
                ],
            ])
            ->add('lastPing', DateRangeFilter::class, [
                'field_type' => DateRangePickerType::class,
            ]);
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('user')
            ->add('guest')
            ->add('fishbowl')
            ->add('lastPing');
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->add('user')
            ->add('guest')
            ->add('fishbowl')
            ->add('lastPing');
    }
}

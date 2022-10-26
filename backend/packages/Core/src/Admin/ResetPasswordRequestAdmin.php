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

use App\Core\Entity\ResetPasswordRequest;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

/** @extends AbstractAdmin<ResetPasswordRequest> */
class ResetPasswordRequestAdmin extends AbstractAdmin
{
    /** @param mixed[] $sortValues */
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues['_sort_by'] = 'requestedAt';
        $sortValues['_sort_order'] = 'DESC';
    }

    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('create');
    }

    protected function configureDatagridFilters(DatagridMapper $filter): void
    {
        $filter
            ->add('user');
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('hashedToken')
            ->add('requestedAt')
            ->add('expiresAt')
            ->add('user');
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->add('hashedToken')
            ->add('requestedAt')
            ->add('expiresAt')
            ->add('user');
    }
}

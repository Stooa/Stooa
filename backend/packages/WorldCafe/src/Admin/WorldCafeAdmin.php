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

namespace App\WorldCafe\Admin;

use App\Core\Service\SlugService;

use App\WorldCafe\Entity\WorldCafe;
use App\WorldCafe\Service\WorldCafeService;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\FieldDescription\FieldDescriptionInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Form\Type\ModelAutocompleteType;
use Sonata\DoctrineORMAdminBundle\Filter\ModelFilter;
use Sonata\Form\Type\BooleanType;
use Sonata\Form\Type\CollectionType;
use Sonata\Form\Type\DateTimePickerType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;
use Symfony\Component\Form\Extension\Core\Type\TimezoneType;

/** @extends AbstractAdmin<WorldCafe> */
class WorldCafeAdmin extends AbstractAdmin
{
    protected ?WorldCafeService $worldCafeService = null;
    protected ?SlugService $slugService = null;

    public function setWorldCafeService(WorldCafeService $worldCafeService): void
    {
        $this->worldCafeService = $worldCafeService;
    }

    public function setSlugService(SlugService $slugService): void
    {
        $this->slugService = $slugService;
    }

    public function prePersist($object): void
    {
        if (null !== $this->worldCafeService && null !== $this->slugService) {
            $object->setSlug($this->slugService->generateRandomSlug());

            $this->worldCafeService->generateDefaultTitle($object);
        }
    }

    public static function hostCallbackFunction(): callable
    {
        return static function (AdminInterface $admin, string $property, string $value): void {
            $datagrid = $admin->getDatagrid();

            $valueParts = explode(':', $value);
            if (2 === \count($valueParts) && \in_array($valueParts[0], ['name', 'surnames'], true)) {
                [$property, $value] = $valueParts;
            }

            $datagrid->setValue($datagrid->getFilter($property)->getFormName(), null, $value);
        };
    }

    /** @param mixed[] $sortValues */
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues['_sort_by'] = 'createdAt';
        $sortValues['_sort_order'] = 'DESC';
    }

    protected function configureDatagridFilters(DatagridMapper $filter): void
    {
        $filter
            ->add('name')
            ->add('host', ModelFilter::class, [
                'field_type' => ModelAutocompleteType::class,
                'field_options' => [
                    'property' => 'email',
                    'callback' => self::hostCallbackFunction(),
                ],
            ])
            ->add('currentStatus', null, [
                'field_type' => ChoiceType::class,
                'field_options' => [
                    'choices' => WorldCafe::$statusChoices,
                ],
            ])
            ->add('hasExtraRoundTime');
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('createdAt')
            ->addIdentifier('name')
            ->add('description')
            ->add('host')
            ->add('currentStatus', null, [
                'template' => 'sonata/event_status.html.twig',
            ])
            ->add('startDateTimeTz', FieldDescriptionInterface::TYPE_DATETIME)
            ->add('timezone')
            ->add('locale')
            ->add('slug');
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->with('World Café')
                ->add('name')
                ->add('description')
                ->add('startDateTime', DateTimePickerType::class, [
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'dd/MM/yyyy HH:mm',
                ])
                ->add('timezone', TimezoneType::class, [
                    'intl' => true,
                ])
                ->add('locale', LocaleType::class)
                ->add('host', ModelAutocompleteType::class, [
                    'property' => 'email',
                    'callback' => self::hostCallbackFunction(),
                ])
                ->add('hasExtraRoundTime', BooleanType::class, [
                    'transform' => true,
                ])
                ->add('topics')
                ->add('questions', CollectionType::class, [
                    'type_options' => [
                        'delete' => false,
                    ],
                ], [
                    'edit' => 'inline',
                    'inline' => 'table',
                ])
            ->end()
            ->with('Disabled')
                ->add('currentStatus', ChoiceType::class, [
                    'choices' => WorldCafe::$statusChoices,
                    'disabled' => true,
                    'required' => true,
                ])
                ->add('finishedAt', DateTimePickerType::class, [
                    'disabled' => true,
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'dd/MM/yyyy HH:mm',
                ])
                ->add('slug', null, [
                    'disabled' => true,
                ])
            ->end();
    }
}

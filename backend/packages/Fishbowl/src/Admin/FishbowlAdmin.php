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

namespace App\Fishbowl\Admin;

use App\Fishbowl\Entity\Fishbowl;
use App\Fishbowl\Service\FishbowlService;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\FieldDescription\FieldDescriptionInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Form\Type\ModelAutocompleteType;
use Sonata\DoctrineORMAdminBundle\Filter\ModelFilter;
use Sonata\Form\Type\BooleanType;
use Sonata\Form\Type\DateTimePickerType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;
use Symfony\Component\Form\Extension\Core\Type\TimezoneType;

/** @extends AbstractAdmin<Fishbowl> */
class FishbowlAdmin extends AbstractAdmin
{
    protected ?FishbowlService $fishbowlService = null;

    public function setFishbowlService(FishbowlService $fishbowlService): void
    {
        $this->fishbowlService = $fishbowlService;
    }

    public function prePersist($object): void
    {
        if (null !== $this->fishbowlService) {
            $object->setSlug($this->fishbowlService->generateRandomSlug($object));

            $this->fishbowlService->generateDefaultTitle($object);
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
                    'choices' => Fishbowl::$statusChoices,
                ],
            ])
            ->add('isFishbowlNow')
            ->add('hasIntroduction')
            ->add('isPrivate');
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('createdAt')
            ->addIdentifier('name')
            ->add('description')
            ->add('host')
            ->add('currentStatus', null, [
                'template' => 'sonata/fishbowl_status.html.twig',
            ])
            ->add('isFishbowlNow')
            ->add('hasIntroduction')
            ->add('summary')
            ->add('summaryUpdatedAt')
            ->add('isPrivate')
            ->add('startDateTimeTz', FieldDescriptionInterface::TYPE_DATETIME)
            ->add('endDateTimeTz', FieldDescriptionInterface::TYPE_DATETIME)
            ->add('duration', FieldDescriptionInterface::TYPE_TIME)
            ->add('timezone')
            ->add('locale')
            ->add('slug');
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->with('Fishbowl')
                ->add('name')
                ->add('description')
                ->add('startDateTime', DateTimePickerType::class, [
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'dd/MM/yyyy HH:mm',
                ])
                ->add('duration', DateTimePickerType::class, [
                    'dp_pick_date' => false,
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'HH:mm',
                ])
                ->add('timezone', TimezoneType::class, [
                    'intl' => true,
                ])
                ->add('locale', LocaleType::class)
                ->add('host', ModelAutocompleteType::class, [
                    'property' => 'email',
                    'callback' => self::hostCallbackFunction(),
                ])
                ->add('isFishbowlNow', BooleanType::class, [
                    'transform' => true,
                ])
                ->add('hasIntroduction', BooleanType::class, [
                    'transform' => true,
                ])
                ->add('isPrivate', BooleanType::class, [
                    'transform' => true,
                ])
                ->add('topics')
            ->end()
            ->with('Disabled')
                ->add('currentStatus', ChoiceType::class, [
                    'choices' => Fishbowl::$statusChoices,
                    'disabled' => true,
                    'required' => true,
                ])
                ->add('introducedAt', DateTimePickerType::class, [
                    'disabled' => true,
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'dd/MM/yyyy HH:mm',
                ])
                ->add('runnedAt', DateTimePickerType::class, [
                    'disabled' => true,
                    'dp_use_seconds' => false,
                    'dp_minute_stepping' => 15,
                    'format' => 'dd/MM/yyyy HH:mm',
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

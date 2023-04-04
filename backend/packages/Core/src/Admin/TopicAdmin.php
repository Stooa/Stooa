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

use App\Core\Action\MoveTreeAction;
use App\Core\Entity\Topic;
use App\Core\Form\Type\TreeSelectorType;
use App\Core\Service\TopicService;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Sonata\DoctrineORMAdminBundle\Datagrid\ProxyQuery;

/** @extends AbstractAdmin<Topic> */
class TopicAdmin extends AbstractAdmin
{
    protected ?TopicService $topicService = null;

    public function setTopicService(TopicService $topicService): void
    {
        $this->topicService = $topicService;
    }

    public function prePersist($object): void
    {
        $object->generateTranslationId();
    }

    public function preBatchAction(
        string $actionName,
        ProxyQueryInterface $query,
        array &$idx,
        bool $allElements = false
    ): void {
        if ('delete' === $actionName) {
            $this->topicService?->removeTopics($idx);
        }

        parent::preBatchAction($actionName, $query, $idx, $allElements);
    }

    protected function configure(): void
    {
        $this->setTemplate('list', 'sonata/list.html.twig');
    }

    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->add('move', $this->getRouterIdParameter() . '/move/{position}', [
            'position' => 'up|down|top|bottom',
            '_controller' => MoveTreeAction::class,
        ]);
        $collection->remove('show');
    }

    protected function configureQuery(ProxyQueryInterface $query): ProxyQueryInterface
    {
        if ($query instanceof ProxyQuery) {
            $query->andWhere($query->getRootAliases()[0] . '.lvl = 0')
                ->orderBy($query->getRootAliases()[0] . '.lft', 'ASC');
        }

        /* @psalm-suppress LessSpecificReturnStatement */
        return $query;
    }

    /** @param mixed[] $sortValues */
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues['_sort_by'] = 'name';
        $sortValues['_sort_order'] = 'ASC';
    }

    protected function configureDatagridFilters(DatagridMapper $filter): void
    {
        $filter
            ->add('name');
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('name', null, [
                'template' => 'sonata/toggle.html.twig',
            ])
            ->add('translationId')
            ->add(ListMapper::NAME_ACTIONS, ListMapper::TYPE_ACTIONS, [
                'actions' => [
                    'edit' => [],
                    'delete' => [],
                    'move' => [
                        'template' => 'sonata/sort.html.twig',
                    ],
                ],
            ]);
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->with('Basic', [
                'box_class' => 'box box-solid box-primary',
            ])
                ->add('name')
                ->add('parent', TreeSelectorType::class, [
                    'required' => false,
                    'max_depth' => 0,
                    'subject' => $this->getSubject(),
                ])
            ->end();
    }

    protected function preRemove(object $object): void
    {
        $this->topicService?->removeFromTree($object);
    }
}

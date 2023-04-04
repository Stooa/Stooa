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

namespace App\Core\Form\Type;

use App\Core\Entity\Topic;
use App\Core\Form\ChoiceList\TreeChoiceLoader;
use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
use Sonata\AdminBundle\Form\Type\ModelType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\ChoiceList\Loader\ChoiceLoaderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

/** @psalm-suppress MissingTemplateParam */
class TreeSelectorType extends AbstractType
{
    protected EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $sanitizedMap = [];
        $allFieldNames = [];
        foreach ($options['map'] as $value => $fieldNames) {
            if (is_iterable($fieldNames)) {
                foreach ($fieldNames as $fieldName) {
                    $sanitizedFieldName = str_replace(['__', '.'], ['____', '__'], $fieldName);
                    $sanitizedMap[$value][] = $sanitizedFieldName;
                    $allFieldNames[] = $sanitizedFieldName;
                }
            }
        }

        $view->vars['all_fields'] = array_unique($allFieldNames);
        $view->vars['map'] = $sanitizedMap;

        $options['expanded'] = false;

        parent::buildView($view, $form, $options);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'choice_loader' => fn (Options $options): ChoiceLoaderInterface => new TreeChoiceLoader(array_flip($this->getChoices($options))),
            'class' => null,
            'max_depth' => null,
            'subject' => null,
            'map' => [],
        ]);

        $resolver->setAllowedTypes('map', 'array');
    }

    /** @return array<string, string> */
    public function getChoices(Options $options): array
    {
        if (null === $options['class']) {
            throw new \InvalidArgumentException('The "class" option must be set.');
        }

        if (null === $options['subject']) {
            throw new \InvalidArgumentException('The "subject" option must be set.');
        }

        $currentNode = $options['subject'];

        $nodes = $this->getAllRootNodes($options);

        $choices = [];

        foreach ($nodes as $node) {
            $nodeId = $node->getId()->toString();
            \assert(null !== $nodeId);

            if (null !== $options['max_depth'] && $node->getLvl() + $this->getMaxNestedLevel($currentNode) > $options['max_depth']) {
                continue;
            }

            $choices[$nodeId] = $node->getName();

            $this->childWalker($node, $currentNode, $choices, $options['max_depth']);
        }

        return $choices;
    }

    public function getParent(): string
    {
        return ModelType::class;
    }

    public function getBlockPrefix(): string
    {
        return 'sonata_type_choice_field_mask';
    }

    /** @return array<mixed, mixed> */
    private function getAllRootNodes(Options $options): array
    {
        /** @var NestedTreeRepository $repository */
        /* @phpstan-ignore-next-line */
        $repository = $this->entityManager->getRepository($options['class']);
        $rootNodes = $repository->getRootNodes();

        $nodes = [];
        foreach ($rootNodes as $rootNode) {
            if ($rootNode->getId() !== $options['subject']->getId()) {
                $nodes[] = $rootNode;
            }
        }

        return $nodes;
    }

    /** @param array<mixed, mixed> $choices */
    private function childWalker(Topic $node, Topic $currentNode, array &$choices, ?int $max_depth = null, int $level = 1): void
    {
        if (null !== $max_depth && $level > $max_depth) {
            return;
        }

        foreach ($node->getChildren() as $child) {
            $childId = $child->getId()?->toString();

            \assert(null !== $childId);

            if ($child->getId() === $currentNode->getId()) {
                continue;
            }

            if (null !== $max_depth && $child->getLvl() + $this->getMaxNestedLevel($currentNode) > $max_depth) {
                continue;
            }

            $choices[$childId] = sprintf('%s %s', str_repeat(' - ', $level), $child->getName() ?? '');

            $this->childWalker($child, $currentNode, $choices, $max_depth, $level + 1);
        }
    }

    private function getMaxNestedLevel(Topic $node, int $depth = 0): int
    {
        $maxDepth = $depth;
        foreach ($node->getChildren() as $child) {
            $maxDepth = max($maxDepth, $this->getMaxNestedLevel($child, $depth + 1));
        }

        return $maxDepth;
    }
}

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

use App\Core\Entity\User;
use App\Core\Security\PasswordEncoderService;
use App\Core\Service\MailerService;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\FieldDescription\FieldDescriptionInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

/** @extends AbstractAdmin<User> */
class UserAdmin extends AbstractAdmin
{
    protected ?PasswordEncoderService $passwordEncoder = null;
    protected ?MailerService $mailerService = null;

    public function setPasswordEncoder(PasswordEncoderService $passwordEncoder): void
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function setMailerService(MailerService $mailerService): void
    {
        $this->mailerService = $mailerService;
    }

    public function prePersist($object): void
    {
        if (null !== $this->passwordEncoder) {
            $this->passwordEncoder->encodePassword($object);
        }
        if (null !== $this->mailerService) {
            $this->mailerService->sendWelcomeEmail($object);
        }
    }

    public function preUpdate($object): void
    {
        if (null !== $this->passwordEncoder) {
            $this->passwordEncoder->encodePassword($object);
        }
    }

    protected function configureFormOptions(array &$formOptions): void
    {
        if (!$this->hasSubject()) {
            return;
        }

        $subject = $this->getSubject();

        if (null === $subject->getId()) {
            $formOptions = ['validation_groups' => ['Default', 'user:create']];
        }
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
            ->add('surnames')
            ->add('email');
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->add('createdAt')
            ->addIdentifier('email')
            ->add('name')
            ->add('surnames')
            ->add('privacyPolicy')
            ->add('allowShareData', FieldDescriptionInterface::TYPE_BOOLEAN, [
                'editable' => true,
            ])
            ->add('locale')
            ->add('slackWebHook')
            ->add('active', FieldDescriptionInterface::TYPE_BOOLEAN, [
                'editable' => true,
            ]);
    }

    protected function configureFormFields(FormMapper $form): void
    {
        $required = !$this->hasSubject() || null === $this->getSubject()->getId();

        $form
            ->add('email', EmailType::class, [
                'disabled' => !$required,
            ])
            ->add('name')
            ->add('surnames')
            ->add('privacyPolicy', CheckboxType::class, [
                'disabled' => !$required,
            ])
            ->add('allowShareData')
            ->add('linkedinProfile')
            ->add('twitterProfile')
            ->add('locale', LocaleType::class)
            ->add('topics')
            ->add('active')
            ->add('plainPassword', TextType::class, [
                'required' => $required,
            ]);
    }
}

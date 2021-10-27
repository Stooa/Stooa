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

use App\Entity\User;
use App\Security\PasswordEncoderService;
use App\Service\MailerService;
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
    protected ?PasswordEncoderService $passwordEncoder;
    protected ?MailerService $mailerService;

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
        $subject = $this->getSubject();

        if (null === $subject || null === $subject->getId()) {
            $formOptions = ['validation_groups' => ['Default', 'user:create']];
        }
    }

    /** @param mixed[] $sortValues */
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues['_sort_by'] = 'createdAt';
        $sortValues['_sort_order'] = 'DESC';
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper): void
    {
        $datagridMapper
            ->add('name')
            ->add('surnames')
            ->add('email');
    }

    protected function configureListFields(ListMapper $listMapper): void
    {
        $listMapper
            ->add('createdAt')
            ->addIdentifier('email')
            ->add('name')
            ->add('surnames')
            ->add('privacyPolicy')
            ->add('allowShareData', FieldDescriptionInterface::TYPE_BOOLEAN, [
                'editable' => true,
            ])
            ->add('locale')
            ->add('active', FieldDescriptionInterface::TYPE_BOOLEAN, [
                'editable' => true,
            ]);
    }

    protected function configureFormFields(FormMapper $formMapper): void
    {
        $user = $this->getSubject();

        $formMapper
            ->add('email', EmailType::class, [
                'disabled' => null !== $user && null !== $user->getId(),
            ])
            ->add('name')
            ->add('surnames')
            ->add('privacyPolicy', CheckboxType::class, [
                'disabled' => null !== $user && null !== $user->getId(),
            ])
            ->add('allowShareData')
            ->add('linkedinProfile')
            ->add('twitterProfile')
            ->add('locale', LocaleType::class)
            ->add('active')
            ->add('plainPassword', TextType::class, [
                'required' => null === $user || null === $user->getId(),
            ]);
    }
}

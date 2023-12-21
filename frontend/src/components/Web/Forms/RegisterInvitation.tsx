/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import Input from '@/components/Common/Fields/Input';
import StandardForm from '@/ui/Form';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Fishbowl } from '@/types/api-platform';
import FormError from '@/components/Web/Forms/FormError';

import { CREATE_ATTENDEE } from '@/lib/gql/Attendee';

import * as Yup from 'yup';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
}

interface Props {
  fishbowl: Fishbowl;
  onSubmit: () => void;
  buttonFormText: string;
}

const RegisterInvitation = ({ fishbowl, onSubmit, buttonFormText }: Props) => {
  const [backendErrors, setBackendErrors] = useState();
  const { t } = useTranslation('form');
  const schema = Yup.object({
    name: Yup.string()
      .required(t('validation.required'))
      .max(255, t('validation.maxLength', { length: '255' })),
    email: Yup.string().email().required(t('validation.required'))
  });
  const [CreateAttendeeMutation] = useMutation(CREATE_ATTENDEE);

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors, isSubmitted }
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '' }
  });

  const handleOnSubmit = (values: FormValues) => {
    CreateAttendeeMutation({
      variables: {
        input: {
          fishbowl: fishbowl.id,
          name: values.name,
          email: values.email
        }
      }
    })
      .then(res => {
        console.log(res);
        onSubmit();
      })
      .catch(err => {
        setBackendErrors(err);
      });
  };

  return (
    <StandardForm $isFull onSubmit={handleSubmit(handleOnSubmit)}>
      {backendErrors && <FormError errors={backendErrors} />}
      <fieldset>
        <Input
          isSubmitted={isSubmitted}
          data-testid="invitation-name"
          hasError={errors.name}
          label="Nombre"
          icon="user"
          isDirty={dirtyFields.name}
          autoComplete="off"
          {...register('name')}
        />
        <Input
          isSubmitted={isSubmitted}
          data-testid="invitation-mail"
          hasError={errors.email}
          label="Mail"
          icon="mail"
          isDirty={dirtyFields.email}
          autoComplete="off"
          type="email"
          {...register('email')}
        />
      </fieldset>
      <Button type="submit" size="large">
        {buttonFormText}
      </Button>
    </StandardForm>
  );
};

export default RegisterInvitation;

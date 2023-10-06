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
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

interface FormValues {
  name: string;
  email: string;
}

export const RegisterInvitation = () => {
  const schema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().required('El email es obligatorio')
  });

  const {
    register,
    handleSubmit,

    formState: { dirtyFields, errors, isSubmitted }
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '' }
  });

  const handleOnSubmit = (values: FormValues) => {};

  return (
    <StandardForm $isFull onSubmit={handleSubmit(handleOnSubmit)}>
      <fieldset>
        <Input
          isSubmitted={isSubmitted}
          data-testid="invitation-name"
          hasError={errors.name}
          label="Nombre"
          icon="world"
          isDirty={dirtyFields.name}
          autoComplete="off"
          {...register('name')}
        />
        <Input
          isSubmitted={isSubmitted}
          data-testid="invitation-name"
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
        Me apunto
      </Button>
    </StandardForm>
  );
};

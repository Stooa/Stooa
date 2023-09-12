/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { ROUTE_HOME } from '@/app.config';
import { RESET_LOGGED_PASSWORD } from '@/lib/gql/Password';
import StandardForm from '@/ui/Form';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';

interface FormValues {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const initialValues = {
  password: '',
  newPassword: '',
  newPasswordConfirmation: ''
};

const RecoverPassword = () => {
  const router = useRouter();
  const [changePassword] = useMutation(RESET_LOGGED_PASSWORD);
  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();
  const { t, lang } = useTranslation('form');

  const requiredError = t('validation.required');
  const equalPasswordError = t('validation.equalPassword');
  const minlengthError = t('validation.passwordLength');

  const schema = Yup.object({
    password: Yup.string().required(requiredError),
    newPassword: Yup.string().min(6, minlengthError).required(requiredError),
    newPasswordConfirmation: Yup.string()
      .required(requiredError)
      .oneOf([Yup.ref('newPassword'), null], equalPasswordError)
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  const onCompletedSubmit = async res => {
    if (res.type === 'Error') {
      setBackendErrors(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
    }
  };

  const onSubmit = async values => {
    const { password, newPassword, newPasswordConfirmation } = values;

    await changePassword({
      variables: {
        input: {
          password,
          newPassword,
          newPasswordConfirmation
        }
      }
    })
      .then(res => {
        reset(initialValues);
        onCompletedSubmit(res);
      })
      .catch(error => {
        onCompletedSubmit({
          type: 'Error',
          data: error
        });
      });
  };

  return (
    <>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.password}
            hasError={errors.password}
            label={t('password')}
            type="password"
            autoComplete="off"
            icon="lock"
            {...register('password')}
          />
        </fieldset>
        <fieldset>
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.newPassword}
            hasError={errors.newPassword}
            label={t('password:newPassword')}
            type="password"
            {...register('newPassword')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.newPasswordConfirmation}
            hasError={errors.newPasswordConfirmation}
            label={t('password:passwordConfirmation')}
            type="password"
            {...register('newPasswordConfirmation')}
          />
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('button.changePassword')} disabled={!isDirty || isSubmitting} />
        </fieldset>
      </StandardForm>
    </>
  );
};

export default RecoverPassword;

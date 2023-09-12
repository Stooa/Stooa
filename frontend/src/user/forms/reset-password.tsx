/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { RESET_PASSWORD } from '@/lib/gql/Password';
import { useAuth } from '@/contexts/AuthContext';
import StandardForm from '@/ui/Form';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';

interface FormValues {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword = ({ token }: { token: string }) => {
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();
  const { login } = useAuth();
  const { t } = useTranslation('form');

  const onSubmitCompleted = async (res, values) => {
    if (res.type === 'Error') {
      setBackendErrors(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      console.log('[STOOA] password changed', res);
      const {
        data: {
          changePasswordUser: {
            user: { email }
          }
        }
      } = res;

      await login(email, values.password).then(res => {
        if (res.type === 'Error') {
          setBackendErrors(res.data);
          console.error('[STOOA LOGIN]', res);
        }
      });
    }
  };

  const requiredError = t('validation.required');
  const equalPasswordError = t('validation.equalPassword');
  const minlengthError = t('validation.passwordLength');

  const schema = Yup.object({
    password: Yup.string().min(6, minlengthError).required(requiredError),
    passwordConfirmation: Yup.string()
      .required(requiredError)
      .oneOf([Yup.ref('password'), null], equalPasswordError)
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      passwordConfirmation: ''
    }
  });

  const onSubmit = async values => {
    await resetPassword({
      variables: {
        input: {
          token: token,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation
        }
      }
    })
      .then(res => {
        reset({ password: '', passwordConfirmation: '' });
        onSubmitCompleted(res, values);
      })
      .catch(error => {
        onSubmitCompleted(
          {
            type: 'Error',
            data: error
          },
          {}
        );
      });
  };

  return (
    <>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Input
            isSubmitted={isSubmitted}
            label={t('password:newPassword')}
            isDirty={dirtyFields.password}
            hasError={errors.password}
            type="password"
            icon="lock"
            {...register('password')}
          />
          <Input
            isSubmitted={isSubmitted}
            label={t('password:passwordConfirmation')}
            isDirty={dirtyFields.passwordConfirmation}
            hasError={errors.passwordConfirmation}
            type="password"
            icon="lock"
            {...register('passwordConfirmation')}
          />
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('password:changePassword')} disabled={!isDirty || isSubmitting} />
        </fieldset>
      </StandardForm>
    </>
  );
};

export default ResetPassword;

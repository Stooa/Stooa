/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_REGISTER, ROUTE_RECOVER_PASSWORD } from '@/app.config';
import RedirectLink from '@/components/Web/RedirectLink';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';
import StandardForm from '@/ui/Form';

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation('form');
  const { login, loginStatus, updateLogingStatus } = useAuth();
  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();

  const requiredError = t('validation.required');
  const emailError = t('validation.email');

  const schema = Yup.object({
    email: Yup.string().email().required(emailError),
    password: Yup.string().required(requiredError)
  });

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  useEffect(() => {
    if (loginStatus && loginStatus.type === 'Error') {
      setBackendErrors(loginStatus.data);
      updateLogingStatus();
    }
  }, [loginStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async values => {
    await login(values.email, values.password);
  };

  return (
    <>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Input
            isSubmitted={isSubmitted}
            data-testid="mail-input"
            hasError={errors.email}
            icon="mail"
            isDirty={dirtyFields.email}
            label={t('email')}
            {...register('email')}
          />
          <Input
            isSubmitted={isSubmitted}
            data-testid="password-input"
            hasError={errors.password}
            icon="lock"
            isDirty={dirtyFields.password}
            label={t('password')}
            type="password"
            {...register('password')}
          />
          <Link className="decorated" href={ROUTE_RECOVER_PASSWORD}>
            {t('login:forgotPassword')}
          </Link>
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('login:button')} disabled={!isDirty || isSubmitting} />
        </fieldset>
        <fieldset className="form__footer">
          <p className="body-sm">{t('login:noAccount')}</p>
          <RedirectLink href={ROUTE_REGISTER} passHref>
            <a className="decorated colored">{t('login:createAccount')}</a>
          </RedirectLink>
        </fieldset>
      </StandardForm>
    </>
  );
};

export default Login;

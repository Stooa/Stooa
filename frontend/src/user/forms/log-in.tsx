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
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_REGISTER, ROUTE_RECOVER_PASSWORD } from '@/app.config';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import RedirectLink from '@/components/Web/RedirectLink';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';

interface FormValues {
  email: string;
  password: string;
  isSubmitting: boolean;
}

interface FormProps {
  required: string;
  email: string;
  login: (email: string, password: string) => void;
}

const initialValues = {
  email: '',
  password: '',
  isSubmitting: false
};

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('form');

  return (
    <FormikForm>
      <fieldset>
        <Input label={t('email')} name="email" type="email" icon="mail" />
        <Input label={t('password')} name="password" type="password" icon="lock" />
        <Link className="decorated" href={ROUTE_RECOVER_PASSWORD}>
          {t('login:forgotPassword')}
        </Link>
      </fieldset>
      <fieldset>
        <SubmitBtn text={t('login:button')} disabled={props.isSubmitting} />
      </fieldset>
      <fieldset className="form__footer">
        <p className="body-sm">
          {t('login:noAccount')}{' '}
          <RedirectLink href={ROUTE_REGISTER} passHref>
            <a className="decorated colored">{t('login:createAccount')}</a>
          </RedirectLink>
        </p>
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props =>
    Yup.object({
      email: Yup.string().email(props.email).required(props.required),
      password: Yup.string().required(props.required)
    }),
  handleSubmit: async (values, { props, setSubmitting }) => {
    setSubmitting(false);
    await props.login(values.email, values.password);
  }
})(Form);

const LogIn = () => {
  const [error, setError] = useState<Record<string, unknown>>();
  const { t } = useTranslation('form');
  const { login, loginStatus, updateLogingStatus } = useAuth();

  const requiredError = t('validation.required');
  const emailError = t('validation.email');

  useEffect(() => {
    if (loginStatus && loginStatus.type === 'Error') {
      setError(loginStatus.data);
      updateLogingStatus();
    }
  }, [loginStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation required={requiredError} email={emailError} login={login} />
    </>
  );
};

export default LogIn;

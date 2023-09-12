/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { ROUTE_SIGN_IN } from '@/app.config';
import { RECOVER_PASSWORD } from '@/lib/gql/Password';
import StandardForm from '@/ui/Form';
import Alert from '@/ui/Alert';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '@/components/Common/Fields/Input';

interface FormValues {
  email: string;
}

const RecoverPassword = () => {
  const { t, lang } = useTranslation('form');
  const [recoverPassword] = useMutation(RECOVER_PASSWORD);
  const [submitted, setSubmitted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();

  const schema = Yup.object({
    email: Yup.string().email(t('validation.email')).required(t('validation.required'))
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { dirtyFields, isDirty, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    }
  });

  const onCompletedSubmit = async res => {
    if (res.type === 'Error') {
      setBackendErrors(res.data);

      console.log('[STOOA] submit error', res);
    } else {
      setSubmitted(true);
    }
  };

  const onSubmit = async values => {
    await recoverPassword({
      variables: {
        input: {
          email: values.email,
          locale: lang
        }
      }
    })
      .then(res => {
        reset({ email: '' });
        onCompletedSubmit(res);
      })
      .catch(error => {
        onCompletedSubmit({
          type: 'Error',
          data: error
        });
      });
  };

  return submitted ? (
    <Alert className="success medium">{t('recover:sent')}</Alert>
  ) : (
    <>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.email}
            hasError={errors.email}
            label={t('email')}
            type="email"
            icon="mail"
            {...register('email')}
          />
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('recover:button')} disabled={!isDirty || isSubmitting} />
        </fieldset>
        <fieldset className="form__footer">
          <p className="body-sm">
            <Link className="decorated colored" href={ROUTE_SIGN_IN}>
              {t('recover:back')}
            </Link>
          </p>
        </fieldset>
      </StandardForm>
    </>
  );
};

export default RecoverPassword;

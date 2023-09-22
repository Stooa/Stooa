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
import Trans from 'next-translate/Trans';
import * as Yup from 'yup';

import { ROUTE_SIGN_IN, ROUTE_PRIVACY_POLICY } from '@/app.config';
import i18nConfig from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { pushEventDataLayer, pushPageViewDataLayer } from '@/lib/analytics';
import { CREATE_USER } from '@/lib/gql/User';
import StandardForm from '@/ui/Form';
import RedirectLink from '@/components/Web/RedirectLink';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { useUser } from '@/jitsi';
import { linkedinValidator, twitterValidator } from '@/lib/Validators/SocialNetworkValidators';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';
import Checkbox from '@/components/Common/Fields/Checkbox';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  terms: boolean;
  linkedin: string;
  twitter: string;
  isSubmitting: boolean;
}

const Register = () => {
  const { t, lang } = useTranslation('form');
  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();
  const [createUser] = useMutation(CREATE_USER);
  const { login } = useAuth();

  const { clearUser } = useUser();

  const router = useRouter();
  const { prefishbowl } = router.query;

  const requiredError = t('validation.required');
  const emailError = t('validation.email');
  const termsError = t('validation.terms');
  const minlengthError = t('validation.passwordLength');
  const urlError = t('validation.url');
  const notEmptyError = t('validation.notEmpty');

  const privacyLink =
    lang === i18nConfig.defaultLocale ? ROUTE_PRIVACY_POLICY : `/${lang}${ROUTE_PRIVACY_POLICY}`;

  const schema = Yup.object({
    firstname: Yup.string()
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: notEmptyError
      })
      .required(requiredError),
    lastname: Yup.string()
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: notEmptyError
      })
      .required(requiredError),
    email: Yup.string().email(emailError).required(requiredError),
    password: Yup.string().min(6, minlengthError).required(requiredError),
    terms: Yup.boolean().required(requiredError).oneOf([true], termsError),
    linkedin: Yup.string()
      .matches(linkedinValidator, {
        message: urlError,
        excludeEmptyString: true
      })
      .url(urlError),
    twitter: Yup.string()
      .matches(twitterValidator, {
        message: urlError,
        excludeEmptyString: true
      })
      .url(urlError)
  });

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      terms: false,
      linkedin: '',
      twitter: ''
    }
  });

  const handleCompletedCreation = async (res, values) => {
    if (res.type === 'Error') {
      setBackendErrors(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      if (prefishbowl) {
        pushEventDataLayer({
          action: 'Register Confirmation',
          category: 'Prefishbowl',
          label: prefishbowl as string
        });
      }

      clearUser();

      pushPageViewDataLayer({ url: '/user-registered', title: 'User registered' });
      await login(values.email, values.password);
    }
  };

  const handleOnSubmit = async values => {
    console.log('[STOOA] submit', values);
    await createUser({
      variables: {
        input: {
          name: values.firstname,
          surnames: values.lastname,
          email: values.email,
          linkedinProfile: values.linkedin,
          twitterProfile: values.twitter,
          plainPassword: values.password,
          privacyPolicy: !!values.terms,
          locale: lang,
          allowShareData: values.linkedin !== '' || values.twitter !== '',
        }
      }
    })
      .then(res => {
        handleCompletedCreation(res, values);
      })
      .catch(error => {
        handleCompletedCreation(
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
      <StandardForm onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset className="fieldset-inline">
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.firstname}
            hasError={errors.firstname}
            label={t('firstname')}
            type="text"
            variant="small"
            {...register('firstname')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.lastname}
            hasError={errors.lastname}
            label={t('lastname')}
            type="text"
            variant="small"
            {...register('lastname')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.email}
            hasError={errors.email}
            label={t('email')}
            type="email"
            icon="mail"
            {...register('email')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.password}
            hasError={errors.password}
            label={t('password')}
            type="password"
            icon="lock"
            {...register('password')}
          />
        </fieldset>
        <fieldset>
          <p className="body-xs">
            <Trans i18nKey="register:shareAccount" components={{ strong: <strong /> }} />
          </p>
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.twitter}
            hasError={errors.twitter}
            label={t('register:twitter')}
            type="text"
            help={t('register:twitterHelp')}
            {...register('twitter')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.linkedin}
            hasError={errors.linkedin}
            label={t('register:linkedin')}
            type="text"
            help={t('register:linkedinHelp')}
            {...register('linkedin')}
          />
        </fieldset>
        <fieldset>
          <Checkbox id="terms" hasError={errors.terms} {...register('terms')}>
            <Trans
              i18nKey="register:terms"
              components={{
                a: (
                  <a
                    className="decorated"
                    href={privacyLink}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                  />
                )
              }}
            />
          </Checkbox>
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('register:button.register')} disabled={isSubmitting} />
        </fieldset>
        <fieldset className="form__footer">
          <p className="body-sm">{t('register:haveAccount')}</p>
          <RedirectLink href={ROUTE_SIGN_IN} passHref>
            <a className="decorated colored">{t('register:button.login')}</a>
          </RedirectLink>
        </fieldset>
      </StandardForm>
    </>
  );
};

export default Register;

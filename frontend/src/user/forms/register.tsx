/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
  useMutation
} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { ROUTE_SIGN_IN, ROUTE_PRIVACY_POLICY } from '@/app.config';
import i18nConfig from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { pushEventDataLayer, pushPageViewDataLayer } from '@/lib/analytics';
import { CREATE_USER } from '@/lib/gql/User';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import Checkbox from '@/components/Common/Fields/Checkbox';
import RedirectLink from '@/components/Web/RedirectLink';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { useUser } from '@/jitsi';
import { linkedinValidator, twitterValidator } from '@/lib/Validators/SocialNetworkValidators';
import { useRouter } from 'next/router';

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

interface FormProps {
  required: string;
  notEmpty: string;
  email: string;
  terms: string;
  minlength: string;
  locale: string;
  url: string;
  createUser: (
    options?: MutationFunctionOptions<unknown, OperationVariables>
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  onSubmit: (res: unknown, values?: unknown) => Promise<void>;
}

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  terms: false,
  linkedin: '',
  twitter: '',
  isSubmitting: false
};

const Form = (props: FormikProps<FormValues>) => {
  const { t, lang } = useTranslation('form');
  const privacyLink =
    lang === i18nConfig.defaultLocale ? ROUTE_PRIVACY_POLICY : `/${lang}${ROUTE_PRIVACY_POLICY}`;
  return (
    <FormikForm>
      <fieldset className="fieldset-inline">
        <Input label={t('firstname')} name="firstname" type="text" variant="sm" />
        <Input label={t('lastname')} name="lastname" type="text" variant="sm" />
        <Input label={t('email')} name="email" type="email" icon="mail" />
        <Input label={t('password')} name="password" type="password" icon="lock" />
      </fieldset>
      <fieldset>
        <p className="body-xs">
          <Trans i18nKey="register:shareAccount" components={{ strong: <strong /> }} />
        </p>
        <Input
          label={t('register:twitter')}
          name="twitter"
          type="text"
          help={t('register:twitterHelp')}
        />
        <Input
          label={t('register:linkedin')}
          name="linkedin"
          type="text"
          help={t('register:linkedinHelp')}
        />
      </fieldset>
      <fieldset>
        <Checkbox name="terms">
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
        <SubmitBtn text={t('register:button.register')} disabled={props.isSubmitting} />
      </fieldset>
      <fieldset className="form__footer">
        <p className="body-sm">
          {t('register:haveAccount')}{' '}
          <RedirectLink href={ROUTE_SIGN_IN} passHref>
            <a className="decorated colored">{t('register:button.login')}</a>
          </RedirectLink>
        </p>
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      firstname: Yup.string()
        .matches(/[^-\s]/, {
          excludeEmptyString: true,
          message: props.notEmpty
        })
        .required(props.required),
      lastname: Yup.string()
        .matches(/[^-\s]/, {
          excludeEmptyString: true,
          message: props.notEmpty
        })
        .required(props.required),
      email: Yup.string().email(props.email).required(props.required),
      password: Yup.string().min(6, props.minlength).required(props.required),
      terms: Yup.boolean().required(props.required).oneOf([true], props.terms),
      linkedin: Yup.string()
        .matches(linkedinValidator, {
          message: props.url
        })
        .url(props.url),
      twitter: Yup.string()
        .matches(twitterValidator, {
          message: props.url
        })
        .url(props.url)
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    await props
      .createUser({
        variables: {
          input: {
            name: values.firstname,
            surnames: values.lastname,
            email: values.email,
            linkedinProfile: values.linkedin,
            twitterProfile: values.twitter,
            plainPassword: values.password,
            privacyPolicy: !!values.terms,
            locale: props.locale,
            allowShareData: values.linkedin !== '' || values.twitter !== ''
          }
        }
      })
      .then(res => {
        setSubmitting(false);
        resetForm({ values: initialValues });
        props.onSubmit(res, values);
      })
      .catch(error => {
        setSubmitting(false);
        props.onSubmit({
          type: 'Error',
          data: error
        });
      });
  }
})(Form);

const Register = () => {
  const [error, setError] = useState(null);
  const [createUser] = useMutation(CREATE_USER);
  const { login } = useAuth();
  const { t, lang } = useTranslation('form');
  const router = useRouter();
  const { clearUser } = useUser();
  const { prefishbowl } = router.query;

  const requiredError = t('validation.required');
  const emailError = t('validation.email');
  const termsError = t('validation.terms');
  const minlengthError = t('validation.passwordLength');
  const urlError = t('validation.url');
  const notEmptyError = t('validation.notEmpty');

  const handleOnSubmit = async (res, values) => {
    if (res.type === 'Error') {
      setError(res.data);
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

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        notEmpty={notEmptyError}
        required={requiredError}
        email={emailError}
        terms={termsError}
        minlength={minlengthError}
        url={urlError}
        locale={lang}
        createUser={createUser}
        onSubmit={handleOnSubmit}
      />
    </>
  );
};

export default Register;

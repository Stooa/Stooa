/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import userRepository from '@/jitsi/User';
import { useStateValue } from '@/contexts/AppContext';

import Button from '@/components/Common/Button';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import { Formik } from 'formik';
import * as Yup from 'yup';

type TProps = {
  name: string;
  isPrivate: boolean;
};

interface FormValues {
  password: string;
}

const AuthUser = ({ name, isPrivate }: TProps) => {
  const [, dispatch] = useStateValue();
  const { t } = useTranslation('form');

  const handleOnSubmit = (values: FormValues) => {
    console.log(values);
    dispatch({
      type: 'JOIN_USER',
      prejoin: false,
      isGuest: false
    });
  };

  userRepository.setUser({ nickname: name });

  return (
    <Formik
      onSubmit={(values: FormValues) => handleOnSubmit(values)}
      initialValues={{
        password: ''
      }}
      validationSchema={Yup.object({
        password: isPrivate ? Yup.string().required(t('validation.required')) : Yup.string()
      })}
    >
      <FormikForm>
        <fieldset className="submit-wrapper">
          {isPrivate && (
            <Input
              placeholder={t('fishbowl.passwordPlaceholder')}
              label={t('fishbowl.passwordInputLabel')}
              name="password"
              type="password"
              autoComplete="off"
              id="password"
              icon="lock"
            />
          )}

          <Button type="submit" size="large">
            {t('button.enterFishbowl')}
          </Button>
        </fieldset>
      </FormikForm>
    </Formik>
  );
};

export default AuthUser;

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
import { useStooa } from '@/contexts/StooaManager';
import { connectWithPassword } from './connection';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type TProps = {
  name: string;
  isPrivate: boolean;
};

interface FormValues {
  password: string;
}

const AuthUser = ({ name, isPrivate }: TProps) => {
  const { isModerator, setFishbowlPassword } = useStooa();
  const [, dispatch] = useStateValue();
  const { t } = useTranslation('form');
  const { fid } = useRouter().query;

  const handleDispatchJoin = (): void => {
    dispatch({
      type: 'JOIN_USER',
      prejoin: false,
      isGuest: false
    });
  };

  const handleOnSubmit = (values: FormValues) => {
    if (isPrivate && values.password && !isModerator) {
      setFishbowlPassword(values.password);

      connectWithPassword(values.password, fid as string)
        .then(res => {
          console.log('[STOOA] ConnectWithPassword response', res);
          if (res.data.response) {
            handleDispatchJoin();
          } else {
            toast(t('validation.wrongPassword'), {
              icon: '🔒',
              type: 'error',
              position: 'bottom-center',
              autoClose: 5000
            });
          }
        })
        .catch(error => {
          console.log(error);
          toast(t('validation.unknownErrorServer'), {
            icon: '🔒',
            type: 'error',
            position: 'bottom-center',
            autoClose: 5000
          });
        });
    } else {
      handleDispatchJoin();
    }
  };

  userRepository.setUser({ nickname: name });

  return (
    <Formik
      onSubmit={(values: FormValues) => handleOnSubmit(values)}
      initialValues={{
        password: ''
      }}
      validationSchema={Yup.object({
        password:
          isPrivate && !isModerator ? Yup.string().required(t('validation.required')) : Yup.string()
      })}
    >
      <FormikForm>
        <fieldset className="submit-wrapper">
          {isPrivate && !isModerator && (
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

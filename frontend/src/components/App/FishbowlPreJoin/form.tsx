/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { useStateValue } from '@/contexts/AppContext';
import { CREATE_GUEST } from '@/lib/gql/Fishbowl';
import userRepository from '@/lib/jitsi-modules/User';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import SubmitBtn from '@/components/Web/SubmitBtn';

interface FormValues {
  name: string;
}

interface FormProps {
  required: string;
  onSubmit: (values: FormValues) => void;
}

const initialValues = {
  name: userRepository.getUserNickname()
};

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('form');

  return (
    <FormikForm className="prejoin">
      <Input label={t('name')} name="name" type="text" />
      <fieldset>
        <SubmitBtn text={t('button.enterFishbowl')} disabled={props.isSubmitting} />
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      name: Yup.string().required(props.required)
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    setSubmitting(false);
    resetForm({ values: initialValues });
    props.onSubmit(values);
  }
})(Form);

const Nickname = () => {
  const [{}, dispatch] = useStateValue();
  const [createGuest] = useMutation(CREATE_GUEST);
  const { t } = useTranslation('form');

  const requiredError = t('validation.required');

  const handleOnSubmit = async values => {
    const { name = '' } = values;
    createGuest({
      variables: {
        input: {
          name
        }
      }
    })
      .then(res => {
        const {
          data: {
            createGuest: {
              guest: { id }
            }
          }
        } = res;

        userRepository.setUser({
          guestId: id.replace('/guests/', '')
        });

        console.log('[STOOA] CreateGuest response', res);
      })
      .catch(error => {
        console.log(error);
      });

    userRepository.setUser({
      nickname: name
    });

    dispatch({
      type: 'JOIN_GUEST',
      isGuest: true,
      prejoin: false
    });
  };

  return <FormValidation required={requiredError} onSubmit={handleOnSubmit} />;
};

export default Nickname;

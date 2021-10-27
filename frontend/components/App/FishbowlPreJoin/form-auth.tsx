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
import { useStateValue } from 'contexts/AppContext';

import { InputStyled } from 'ui/Form';
import Button from 'ui/Button';
import FormikForm from 'ui/Form';

type TProps = {
  name: string;
};

const AuthUser = ({ name }: TProps) => {
  const [{}, dispatch] = useStateValue();
  const { t } = useTranslation('form');

  const handleOnSubmit = () => {
    dispatch({
      type: 'JOIN_USER',
      prejoin: false
    });
  };

  userRepository.setUser({ nickname: name });

  return (
    <FormikForm as="div">
      <InputStyled className="disabled">
        <input className="filled" type="text" disabled value={name} />
        <label>{t('name')}</label>
      </InputStyled>
      <fieldset>
        <Button type="button" full onClick={handleOnSubmit}>
          {t('button.enterFishbowl')}
        </Button>
      </fieldset>
    </FormikForm>
  );
};

export default AuthUser;

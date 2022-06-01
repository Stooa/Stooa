/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logout from '@/ui/svg/logout.svg';
import useTranslation from 'next-translate/useTranslation';
import { MouseEventHandler } from 'react';
import { StyledButton } from './styles';

interface Props {
  'onClick': MouseEventHandler<HTMLButtonElement>;
  'data-testid'?: string;
}

const ButtonKickUser = ({ onClick, 'data-testid': dataTestid }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledButton onClick={onClick} data-testid={dataTestid}>
      <Logout />
      <p className="body-sm">{t('kick.button')}</p>
    </StyledButton>
  );
};

export default ButtonKickUser;

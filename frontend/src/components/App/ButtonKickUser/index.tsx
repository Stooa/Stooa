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
import { StyledButton } from './styles';

interface Props {
  onClick: () => void;
}

const ButtonKickUser = ({ onClick }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledButton onClick={onClick}>
      <Logout />
      <p className="body-sm">{t('kick.button')}</p>
    </StyledButton>
  );
};

export default ButtonKickUser;

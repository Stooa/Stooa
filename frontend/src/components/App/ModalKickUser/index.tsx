/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import Cross from '@/ui/svg/cross.svg';
import useTranslation from 'next-translate/useTranslation';
import StyledKickModal from './styles';

interface Props {
  closeModal: () => void;
}

const ModalKickUser: React.FC<Props> = ({ closeModal, children }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledKickModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        {children}
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </StyledKickModal>
  );
};

export default ModalKickUser;

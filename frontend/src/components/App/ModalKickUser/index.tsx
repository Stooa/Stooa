/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import { Participant } from '@/types/participant';
import Cross from '@/ui/svg/cross.svg';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import KickReasonForm from '@/components/App/KickReasonForm';
import StyledKickModal from './styles';

interface Props {
  closeModal: () => void;
  onSubmit: () => void;
  participant: Participant;
}

const ModalKickUser: React.FC<Props> = ({ closeModal, onSubmit, participant }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledKickModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <div className="modal--body">
          <h2 className="title-sm">
            {t('kick.modal.title', {
              userName: participant.getDisplayName()
            })}
          </h2>
          <p className="body-sm subtitle">
            <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
          </p>
        </div>
        <KickReasonForm participant={participant} onCompletedSubmit={onSubmit} />
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

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import Cross from '@/ui/svg/cross.svg';
import Button from '@/components/Common/Button';
import { StyledRecordingModal } from './styles';

interface Props {
  stopRecording: () => void;
  closeModal: () => void;
}

const ModalStopRecording = ({ closeModal, stopRecording }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledRecordingModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <div className="modal--body">
          <h2 className="title-sm">{t('recording.stopModal.title')}</h2>
          <p className="body-md experimental">{t('recording.stopModal.description')}</p>
        </div>

        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={stopRecording} data-testid="stop-recording-button">
            {t('recording.stop')}
          </Button>
        </div>
      </div>
    </StyledRecordingModal>
  );
};

export default ModalStopRecording;

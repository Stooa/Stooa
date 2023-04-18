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
import Trans from 'next-translate/Trans';
import { StyledTranscriptionModal } from './styles';

interface Props {
  startRecording: () => void;
  closeModal: () => void;
}

const ModalTranscription = ({ closeModal, startRecording }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledTranscriptionModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">In what language do you speak?</h2>
        <p>
          Before we start, we need you to
          <b> indicate in which language you will be participating</b> in this conversation.
        </p>
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={startRecording} data-testid="start-recording-button">
            {t('recording.start')}
          </Button>
        </div>
      </div>
    </StyledTranscriptionModal>
  );
};

export default ModalTranscription;

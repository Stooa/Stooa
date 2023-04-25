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
// import Trans from 'next-translate/Trans';
import { StyledTranscriptionModal } from './styles';
import TranscriptionSelector from '../TranscriptionSelector/TranscriptionSelector';
import Trans from 'next-translate/Trans';

interface Props {
  startTranscription: () => void;
  closeModal: () => void;
}

const ModalTranscription = ({ closeModal, startTranscription }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledTranscriptionModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('transcription.modalTitle')}</h2>
        <p className="body">
          <Trans
            i18nKey="fishbowl:transcription.modalBody"
            components={{ span: <span className="medium" /> }}
          />
        </p>

        <TranscriptionSelector location="modal" />

        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={startTranscription} data-testid="start-recording-button">
            {t('transcription.enable')}
          </Button>
        </div>
      </div>
    </StyledTranscriptionModal>
  );
};

export default ModalTranscription;

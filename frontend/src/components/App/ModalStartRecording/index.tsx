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
import { StyledRecordingModal } from './styles';

interface Props {
  startRecording: () => void;
  closeModal: () => void;
}

const ModalStartRecording: React.FC<Props> = ({ closeModal, startRecording }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledRecordingModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('recording.startModal.title')}</h2>
        <p className="body-md experimental">({t('recording.startModal.experimental')})</p>
        <ul>
          <li>
            <Trans
              i18nKey="fishbowl:recording.startModal.firstBullet"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="fishbowl:recording.startModal.secondBullet"
              components={{ span: <span className="medium" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="fishbowl:recording.startModal.thirdBullet"
              components={{ span: <span className="medium" />, i: <i /> }}
            />
          </li>
        </ul>
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={startRecording} data-testid="start-recording-button">
            {t('recording.start')}
          </Button>
        </div>
      </div>
    </StyledRecordingModal>
  );
};

export default ModalStartRecording;

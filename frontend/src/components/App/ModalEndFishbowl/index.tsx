/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Button from '@/components/Common/Button';

interface Props {
  closeModal: () => void;
  endFishbowl: () => void;
  disabled: boolean;
  isRecording: boolean;
  stopRecording: () => void;
}

const EndFishbowl: React.FC<Props> = ({
  closeModal,
  endFishbowl,
  disabled,
  isRecording,
  stopRecording
}) => {
  const { t } = useTranslation('fishbowl');

  const title = isRecording ? 'recording.endModal.title' : 'endModal.title';
  const description = isRecording ? 'recording.endModal.description' : 'endModal.description';
  const button = isRecording ? 'recording.endModal.button' : 'endModal.button';

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t(title)}</h2>
        <p className="description">{t(description)}</p>
        <div className="modal-footer">
          {isRecording ? (
            <Button onClick={stopRecording} disabled={disabled}>
              {t(button)}
            </Button>
          ) : (
            <Button className="error" onClick={endFishbowl} disabled={disabled}>
              {t(button)}
            </Button>
          )}
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndFishbowl;

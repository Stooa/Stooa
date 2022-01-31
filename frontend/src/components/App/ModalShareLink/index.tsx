/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { React, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import CopyUrl from '@/components/Common/CopyUrl';
import { useStooa } from '@/contexts/StooaManager';
import { getOnBoardingCookie } from '@/lib/auth';

const ModalShareLink: React.FC = () => {
  const { t } = useTranslation('fishbowl');
  const { data, isModerator } = useStooa();
  const [show, setShow] = useState(true);

  const closeModal = () => {
    setShow(false);
  };

  const showModal = () => {
    return show && data.isFishbowlNow && getOnBoardingCookie(isModerator);
  };

  return (
    <>
      {showModal() && (
        <Modal>
          <div className="content">
            <button className="close" onClick={closeModal}>
              <Cross />
            </button>
            <h2 className="app-lg">{t('shareModal.title')}</h2>
            <p className="description">{t('shareModal.description')}</p>
            <div className="modal-footer">
              <CopyUrl className="centered" data={data} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ModalShareLink;

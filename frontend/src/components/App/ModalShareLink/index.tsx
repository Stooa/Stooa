/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';

import Trans from 'next-translate/Trans';
import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import CopyUrl from '@/components/Common/CopyUrl';
import { useStooa } from '@/contexts/StooaManager';
import { getOnBoardingCookie, isFishbowlShareLinkCookie, setShareLinkCookie } from '@/lib/auth';
import { useRouter } from 'next/router';

const ModalShareLink: React.FC = () => {
  const { t } = useTranslation('fishbowl');
  const { data, isModerator } = useStooa();
  const [show, setShow] = useState<boolean>(true);
  const router = useRouter();
  const { fid } = router.query;

  const closeModal = (): void => {
    setShow(false);
  };

  const showModal = (): boolean => {
    return (
      show &&
      data.isFishbowlNow &&
      isModerator &&
      getOnBoardingCookie(isModerator) &&
      !isFishbowlShareLinkCookie(fid as string)
    );
  };

  useEffect(() => {
    if (!show) {
      setShareLinkCookie(fid as string);
    }
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {showModal() && (
        <Modal>
          <div className="content">
            <button className="close" onClick={closeModal}>
              <Cross />
            </button>
            <h2 className="app-lg">{t('shareModal.title')}</h2>
            <p className="description">
              <Trans i18nKey="fishbowl:shareModal.description" components={{ i: <i /> }} />
            </p>
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

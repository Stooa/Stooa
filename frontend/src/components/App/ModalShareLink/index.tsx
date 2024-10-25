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
import { useRouter } from 'next/router';

import Trans from 'next-translate/Trans';
import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import { useStooa } from '@/contexts/StooaManager';
import { useUserAuth } from '@/user/auth/useUserAuth';

const ModalShareLink: React.FC = () => {
  const { t } = useTranslation('fishbowl');
  const { data, isModerator, getPassword } = useStooa();
  const { getOnBoardingCookie, isFishbowlShareLinkCookie, setShareLinkCookie } = useUserAuth();
  const [show, setShow] = useState<boolean>(true);
  const router = useRouter();
  const { fid } = router.query;

  const closeModal = (): void => {
    setShow(false);
  };

  const showModal = (): boolean => {
    return (
      show &&
      (data.isFishbowlNow ?? false) &&
      isModerator &&
      undefined !== getOnBoardingCookie(isModerator) &&
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
            <h2 className="title-sm">{t('shareModal.title')}</h2>
            <p className="description">
              <Trans i18nKey="fishbowl:shareModal.description" components={{ i: <i /> }} />
            </p>
            <div className="modal-footer">
              <ButtonCopyUrl
                withSvg
                variant="primary"
                fid={fid as string}
                locale={data.locale}
                isPrivate={data.isPrivate}
                plainPassword={getPassword()}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ModalShareLink;

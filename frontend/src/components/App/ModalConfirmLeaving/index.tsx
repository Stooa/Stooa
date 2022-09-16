/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Button from '@/components/Common/Button';
import { useMutation } from '@apollo/client';
import { FINISH_FISHBOWL } from '@/graphql/Fishbowl';
import { useRouter } from 'next/router';

interface Props {
  closeModal: () => void;
  handleFinished: () => void;
}

const ModalConfirmLeaving: React.FC<Props> = ({ closeModal, handleFinished }) => {
  const { t } = useTranslation('fishbowl');
  const [loading, setLoading] = useState(false);
  const [endFishbowl] = useMutation(FINISH_FISHBOWL);
  const { fid } = useRouter().query;

  const finishFishbowl = () => {
    setLoading(true);

    endFishbowl({
      variables: {
        input: {
          slug: fid as string
        }
      }
    })
      .then(() => {
        console.log('[STOOA] Finished fishbowl. redirecting to thankyou page');
        setLoading(false);
        handleFinished();
      })
      .catch(error => {
        console.error('[STOOA] error finishing fishbowl: ', error);
        setLoading(false);
      });
  };

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">Are you leaving?</h2>
        <p className="description">Please don&apos;t forget to finish your fishbowl!</p>
        <div className="modal-footer">
          <Button onClick={() => finishFishbowl()} className="error" disabled={loading}>
            Finish fishbowl
          </Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmLeaving;

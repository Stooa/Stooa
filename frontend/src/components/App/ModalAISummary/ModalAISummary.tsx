/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import { StyledAiSummaryModal } from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Button from '@/components/Common/Button';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  title: string;
  summary: string;
  closeModal: () => void;
}

const ModalAISummary = ({ closeModal, title, summary }: Props) => {
  const { t } = useTranslation('form');
  const handleCopySummaryToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast('Copiado al portapapeles', {
      icon: '📋',
      position: 'bottom-center',
      autoClose: 5000,
      toastId: 'copy-summary',
      type: 'success'
    });
  };

  return (
    <StyledAiSummaryModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{title}</h2>
        <p className="summary">{summary}</p>
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={handleCopySummaryToClipboard}>Copiar al portapapeles</Button>
        </div>
      </div>
    </StyledAiSummaryModal>
  );
};

export default ModalAISummary;

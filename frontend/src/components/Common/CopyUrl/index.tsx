/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { Fishbowl } from '@/types/api-platform';
import { ROUTE_FISHBOWL } from '@/app.config';
import { defaultLocale } from '@/i18n';
import Copy from '@/ui/svg/copy.svg';
import Share from '@/components/Common/CopyUrl/styles';

interface Props {
  data: Fishbowl;
  className?: string;
  variant?: 'default' | 'left';
}

const CopyUrl: React.FC<Props> = ({ data, className = '', variant = 'default' }) => {
  const linkRef = useRef<HTMLSpanElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { t } = useTranslation('fishbowl');

  const fbRoute = `${ROUTE_FISHBOWL}/${data.slug}`;
  const fbUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${
    data.locale === defaultLocale ? '' : `/${data.locale}`
  }${fbRoute}`;

  const copyToClipboard = () => {
    if (linkRef.current) {
      const text = linkRef.current.innerHTML;
      navigator.clipboard.writeText(text);
      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 1500);
    }
  };

  return (
    <Share
      className={`${copySuccess ? 'success' : ''} ${
        variant === 'left' ? 'align-left' : ''
      } ${className}`}
    >
      <button className={`button`} onClick={copyToClipboard} disabled={copySuccess}>
        {!copySuccess ? (
          <span ref={linkRef} data-url={fbUrl}>
            {fbUrl}
          </span>
        ) : (
          <span>{t('copySuccess')}</span>
        )}
        <Copy />
      </button>
      <span className="help">{t('copyText')}</span>
    </Share>
  );
};

export default CopyUrl;

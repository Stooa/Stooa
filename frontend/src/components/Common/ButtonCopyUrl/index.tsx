/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Button, { ButtonLinkColored, ButtonSmall } from '@/ui/Button';
import UrlSvg from '@/ui/svg/url.svg';
import Check from '@/ui/svg/checkmark.svg';

import { toast } from 'react-toastify';
import { ROUTE_FISHBOWL } from '@/app.config';
import { defaultLocale } from '@/i18n';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  fid: string;
  locale: string;
  secondary?: boolean;
  variant?: 'small' | 'link';
}

const ButtonCopyUrl: React.FC<Props> = ({ fid, locale, secondary, variant }) => {
  const { t } = useTranslation('common');
  const fbRoute = `${ROUTE_FISHBOWL}/${fid}`;
  const fbUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${
    locale === defaultLocale ? '' : `/${locale}`
  }${fbRoute}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fbUrl);
    toast(t('successCopiedLink'), {
      icon: <Check />,
      type: 'success',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  let ButtonToUse;

  if (variant === 'small') {
    ButtonToUse = ButtonSmall;
  } else if (variant === 'link') {
    ButtonToUse = ButtonLinkColored;
  } else {
    ButtonToUse = Button;
  }

  return (
    <ButtonToUse onClick={handleCopyUrl} className={`${secondary && 'secondary '}`}>
      {t('linkButton')}
      {variant !== 'link' && <UrlSvg />}
    </ButtonToUse>
  );
};

export default ButtonCopyUrl;

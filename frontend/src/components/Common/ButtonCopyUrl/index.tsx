/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import UrlSvg from '@/ui/svg/url.svg';
import Check from '@/ui/svg/checkmark.svg';

import { toast } from 'react-toastify';
import { ROUTE_FISHBOWL, ROUTE_WORLD_CAFE } from '@/app.config';
import { defaultLocale } from '@/i18n';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/Common/Button';
import { EventType } from '@/types/event-types';

interface Props {
  slug: string;
  eventType: EventType;
  locale: string;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  withSvg?: boolean;
  full?: boolean;
}

type PrivateProps =
  | { isPrivate?: false; plainPassword?: never }
  | { isPrivate: boolean; plainPassword: string };

const ButtonCopyUrl = ({
  slug,
  eventType,
  locale,
  size,
  variant,
  withSvg,
  isPrivate,
  plainPassword,
  ...props
}: Props & PrivateProps) => {
  const { t } = useTranslation('common');
  const fbRoute = `${eventType === 'fishbowl' ? ROUTE_FISHBOWL : ROUTE_WORLD_CAFE}/${slug}`;
  const finalUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${
    locale === defaultLocale ? '' : `/${locale}`
  }${fbRoute}`;

  const invitation = `${finalUrl}\n${t(`form:password`)}: ${plainPassword}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(isPrivate ? invitation : finalUrl);
    toast(t('successCopiedInvitation'), {
      icon: <Check />,
      toastId: 'link-copied',
      type: 'success',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  return (
    <Button size={size} variant={variant} onClick={handleCopyUrl} {...props}>
      {t('copyInvitation')}
      {withSvg && <UrlSvg />}
    </Button>
  );
};

export default ButtonCopyUrl;

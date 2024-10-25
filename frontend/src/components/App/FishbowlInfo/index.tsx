/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect, useRef } from 'react';

import { pushEventDataLayer } from '@/lib/analytics';
import Info from '@/ui/svg/info-brown.svg';
import InfoStyled, { Description, Icon } from '@/components/App/FishbowlInfo/styles';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import Trans from 'next-translate/Trans';
import { Fishbowl } from '@/types/api-platform';
import { useStooa } from '@/contexts/StooaManager';

interface Props {
  data: Fishbowl;
}

const FishbowlInfo = ({ data }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { getPassword } = useStooa();

  const toggleInfo = () => {
    pushEventDataLayer({
      action: active ? 'Info close' : 'Info open',
      category: 'Header',
      label: window.location.href
    });

    setActive(!active);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (active && wrapperRef.current && !wrapperRef.current.contains(target)) {
        toggleInfo();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoStyled ref={wrapperRef}>
      <p className="title body-sm medium">{data.name}</p>
      <Icon onClick={toggleInfo} className={`${active ? 'active' : ''}`}>
        <Info />
      </Icon>
      {active && (
        <Description>
          <p className="body-sm medium description__title">{data.name}</p>
          <p className="info-text body-xs">{data.description}</p>
          <ButtonCopyUrl
            variant="secondary"
            size="medium"
            fid={data.slug}
            locale={data.locale}
            isPrivate={data.isPrivate}
            plainPassword={getPassword()}
          />
          <p className="body-xs description__share-text">
            <Trans i18nKey="fishbowl:fishbowlDescription.shareText" components={{ i: <i /> }} />
          </p>
        </Description>
      )}
    </InfoStyled>
  );
};

export default FishbowlInfo;

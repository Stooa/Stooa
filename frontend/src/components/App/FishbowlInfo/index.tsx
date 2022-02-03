/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect, useRef } from 'react';

import { Fishbowl } from '@/types/api-platform';
import { pushEventDataLayer } from '@/lib/analytics';
import Dots from '@/ui/svg/dots.svg';
import InfoStyled, { Description, Icon } from '@/components/App/FishbowlInfo/styles';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import Trans from 'next-translate/Trans';

interface Props {
  data: Fishbowl;
}

const FishbowlInfo: React.FC<Props> = ({ data }) => {
  const wrapperRef = useRef(null);
  const [active, setActive] = useState(false);

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
      if (active && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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
      <p className="title app-md medium">{data.name}</p>
      <Icon onClick={toggleInfo} className={`${active ? 'active' : ''}`}>
        <span className="icon-wrapper">
          <Dots />
        </span>
      </Icon>
      {active && (
        <Description>
          <p className="app-md medium description__title">{data.name}</p>
          <p className="info-text app-sm">{data.description}</p>
          <ButtonCopyUrl variant="small" secondary fid={data.slug} locale={data.locale} />
          <p className="app-sm description__share-text">
            <Trans i18nKey="fishbowl:shareModal.description" components={{ i: <i /> }} />
          </p>
        </Description>
      )}
    </InfoStyled>
  );
};

export default FishbowlInfo;

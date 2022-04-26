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
import CopyUrl from '@/components/Common/CopyUrl';
import Dots from '@/ui/svg/dots.svg';
import InfoStyled, { Description, Icon } from '@/components/App/Info/styles';

interface Props {
  data: Fishbowl;
}

const Info: React.FC<Props> = ({ data }) => {
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
      <p className="title body-sm medium">{data.name}</p>
      <Icon onClick={toggleInfo} className={`${active ? 'active' : ''}`}>
        <span className="icon-wrapper">
          <Dots />
        </span>
      </Icon>
      {active && (
        <Description>
          <p className="body-sm medium">{data.name}</p>
          <p className="info-text body-xs">{data.description}</p>
          <CopyUrl variant="left" data={data} />
        </Description>
      )}
    </InfoStyled>
  );
};

export default Info;

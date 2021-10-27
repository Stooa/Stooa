/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState, useEffect, useRef } from 'react';

import { GAEvent } from 'lib/analytics';
import CopyUrl from 'components/Common/CopyUrl';
import Dots from 'ui/svg/dots.svg';
import InfoStyled, { Description, Icon } from 'components/App/Info/styles';

interface IProps {
  data: any;
}

const Info: React.FC<IProps> = ({ data }) => {
  const wrapperRef = useRef(null);
  const [active, setActive] = useState(false);

  const toggleInfo = () => {
    GAEvent({
      action: active ? 'Info close' : 'Info open',
      category: 'Header',
      label: window.location.href
    });

    setActive(!active);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (active && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      toggleInfo();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, active]);

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
          <p className="app-md medium">{data.name}</p>
          <p className="info-text app-sm">{data.description}</p>
          <CopyUrl variant="left" data={data} />
        </Description>
      )}
    </InfoStyled>
  );
};

export default Info;

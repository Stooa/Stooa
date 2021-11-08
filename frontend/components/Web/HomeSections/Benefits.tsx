/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import lottie from 'lottie-web';

import { Column, Description, Row, Wrapper } from 'ui/pages';

export interface LazyMovin {
  id: string;
  name: string;
  path: string;
  morph?: string;
  reverse?: boolean;
  assetsPath?: string;
};

interface IProps {
  item: LazyMovin;
}

const Benefits = ({ item }: IProps): JSX.Element => {
  const { t } = useTranslation('home');

  useEffect(() => {
    const AnimPath = dynamic(import(`ui/animations/home/${item.path}`), { loading: () => ({}) });

    lottie.loadAnimation({
      container: document.getElementById(item.id),
      animationData: AnimPath,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      assetsPath: `img/animations/${item.path}/`
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper>
      <Row flex reverse={item.reverse} className="animate">
        <Column className="col animate-item">
          <h2 className="title-lg">{t(`keybenefits.${item.name}.title`)}</h2>
          <Description className="text-lg">{t(`keybenefits.${item.name}.description`)}</Description>
        </Column>
        <Column className="col animate-item">
          <div id={item.id}></div>
        </Column>
      </Row>
    </Wrapper>
  );
};

export default Benefits;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import lottie from 'lottie-web';

import { Lottie } from '@/types/animations';
import { Column, Row, Wrapper } from '@/landing/ui/styles';
import Description from '@/components/Common/Description';

interface Props {
  item: Lottie;
}

const importAnimatiom = (path: string) => require(`@/landing/ui/animations/home/${path}`);

const BenefitWithLottie = ({ item }: Props): JSX.Element => {
  const { t } = useTranslation('home');

  useEffect(() => {
    const AnimPath = importAnimatiom(item.path);
    const element = document.getElementById(item.id);

    if (element) {
      lottie.loadAnimation({
        container: element,
        animationData: AnimPath,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        assetsPath: `img/animations/${item.path}/`
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper>
      <Row flex reverse={item.reverse} className="animate">
        <Column className="col animate-item">
          <h2 className="title-lg">{t(`${item.name}.title`)}</h2>
          <Description className="body-lg">{t(`${item.name}.description`)}</Description>
        </Column>
        <Column className="col animate-item">
          <div id={item.id}></div>
        </Column>
      </Row>
    </Wrapper>
  );
};

export default BenefitWithLottie;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import lottie from 'lottie-web';

import { ROUTE_FISHBOWL_CREATE } from '@/app.config';
import { Banner as BannerStyled } from '@/ui/pages';
import Button from '@/ui/Button';
import ArrowRight from '@/ui/svg/arrow-right.svg';
import AnimPath from '@/ui/animations/home/banner-morph.json';

const Banner: React.FC = () => {
  const { t } = useTranslation('home');

  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById('animated-banner-morph'),
      animationData: AnimPath,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      assetsPath: `img/animations/banner-morph/`
    });
  }, []);

  return (
    <BannerStyled className="animate">
      <div id="animated-banner-morph"></div>
      <div>
        <p className="body-lg animate-item">{t('banner')}</p>
        <Link href={ROUTE_FISHBOWL_CREATE} passHref>
          <Button as="a" className="animate-item cta-create-fishbowl">
            <span>{t('scheduleFishbowl')}</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </BannerStyled>
  );
};

export default Banner;

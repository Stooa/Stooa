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

import { ROUTE_FISHBOWL_CREATE } from '@/app.config';
import { Banner as BannerStyled } from '@/landing/ui/styles';
import AnimPath from '@/landing/ui/animations/home/banner-morph.json';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import { pushEventDataLayer } from '@/lib/analytics';

const Banner: React.FC = () => {
  const { t } = useTranslation('home');

  useEffect(() => {
    const element = document.getElementById('animated-banner-morph');

    if (element) {
      lottie.loadAnimation({
        container: element,
        animationData: AnimPath,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        assetsPath: `img/animations/banner-morph/`
      });
    }
  }, []);

  return (
    <BannerStyled className="animate">
      <div id="animated-banner-morph"></div>
      <div>
        <p className="body-lg animate-item">{t('banner')}</p>
        <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
          <Button
            onClick={() => {
              pushEventDataLayer({
                category: 'Schedule Fishbowl',
                action: 'Prefooter',
                label: 'Prefooter'
              });
            }}
            size="large"
            as="a"
            className="animate-item cta-create-fishbowl"
          >
            <span>{t('scheduleFishbowl')}</span>
          </Button>
        </RedirectLink>
      </div>
    </BannerStyled>
  );
};

export default Banner;

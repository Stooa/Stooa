/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import lottie from 'lottie-web';
import { TweenMax } from 'gsap';

import { ROUTE_FISHBOWL_CREATE, ROUTE_FISHBOWL_HOST_NOW } from '@/app.config';
import Layout from '@/layouts/Home';

import { Lottie } from '@/types/animations';

import { pushEventDataLayer } from '@/lib/analytics';

import { Billboard, Content, Row, Sections, Wrapper } from '@/landing/ui/styles';
import WaveMobile from '@/landing/ui/svg/wave-mobile.svg';
import WaveDesktop from '@/landing/ui/svg/wave-desktop.svg';
import BillboardDeskAnimPath from '@/landing/ui/animations/home/billboard-desktop.json';
import BillboardMobAnimPath from '@/landing/ui/animations/home/billboard-mobile.json';
import MorphBillAnimPath from '@/landing/ui/animations/home/billboard-morph.json';
import Morph2BillAnimPath from '@/landing/ui/animations/home/billboard-morph-2.json';
import KeyBenefit2MorphPath from '@/landing/ui/animations/home/keybenefit2-morph.json';
import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import Description from '@/components/Common/Description';

const Benefits = dynamic(import('@/landing/HomeSections/Benefits'), {
  loading: () => <div />
});
const Banner = dynamic(import('@/landing/HomeSections/Banner'), { loading: () => <div /> });

const Home = () => {
  const { t } = useTranslation('home');

  const lazyMovinAnimations: Lottie[] = [
    {
      id: 'animated-keybenefit1',
      name: 'first',
      reverse: true,
      path: 'keybenefit1',
      assetsPath: 'img/animations/keybenefit1/'
    },
    {
      id: 'animated-keybenefit2',
      name: 'second',
      path: 'keybenefit2',
      morph: 'animated-keybenefit2-morph'
    },
    { id: 'animated-keybenefit3', name: 'third', reverse: true, path: 'keybenefit3' },
    { id: 'animated-keybenefit4', name: 'fourth', path: 'keybenefit4' }
  ];

  const handleAnimation = (targetClass = 'animate', delay = 0.6) => {
    const HANDLED_CLASS = 'animated';
    const ANIMATION_ITEM_CLASS = 'animate-item';
    const items = [].slice.call(document.querySelectorAll(`.${targetClass}`));
    const top = window.innerHeight;

    items.map((item: HTMLElement) => {
      if (!item.classList.contains(HANDLED_CLASS) && item.getBoundingClientRect().top < top) {
        const animations = [].slice.call(item.querySelectorAll(`.${ANIMATION_ITEM_CLASS}`));

        animations.map((anim: HTMLElement, i: number) => {
          TweenMax.to(anim, 1, {
            opacity: 1,
            y: 0,
            ease: 'Power3.easeOut',
            delay: delay + 0.15 * i
          });
        });

        item.classList.add(HANDLED_CLASS);
      }
    });
  };

  useEffect(() => {
    const bodyMovinanimations = [
      {
        id: 'animated-billboard-desktop',
        path: BillboardDeskAnimPath,
        assetsPath: 'img/animations/billboard/'
      },
      {
        id: 'animated-billboard-mobile',
        path: BillboardMobAnimPath,
        assetsPath: 'img/animations/billboard/'
      },
      { id: 'animated-billboard-morph', path: MorphBillAnimPath },
      { id: 'animated-billboard-morph2', path: Morph2BillAnimPath },
      { id: 'animated-keybenefit2-morph', path: KeyBenefit2MorphPath }
    ];

    bodyMovinanimations.map(item => {
      const element = document.getElementById(item.id);

      if (element) {
        lottie.loadAnimation({
          container: element,
          animationData: item.path,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          assetsPath: item.assetsPath
        });
      }
    }, []);

    handleAnimation('billboard-animate', 0.2);
    handleAnimation();

    window.addEventListener('scroll', () => {
      handleAnimation();
    });
  }, []);

  return (
    <Layout title={t('title')}>
      <Billboard className="billboard-animate">
        <div id="animated-billboard-morph"></div>
        <h1 data-testid="landing-title" className="title-display animate-item">
          {t('title')}
        </h1>
        <Description className="body-lg animate-item" center>
          {t('description')}
        </Description>
        <div className="cta-wrapper">
          <RedirectLink href={ROUTE_FISHBOWL_HOST_NOW} passHref>
            <Button
              size="large"
              as="a"
              className="animate-item cta-create-fishbowl"
              onClick={() => {
                pushEventDataLayer({
                  category: 'Host Fishbowl Now',
                  action: 'Billboard',
                  label: 'Home'
                });
              }}
            >
              <span>{t('hostFishbowlNow')}</span>
            </Button>
          </RedirectLink>
          <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
            <Button
              size="large"
              as="a"
              variant="secondary"
              className="animate-item cta-create-fishbowl "
              onClick={() => {
                pushEventDataLayer({
                  category: 'Schedule Fishbowl',
                  action: 'Billboard',
                  label: 'Home'
                });
              }}
            >
              <span>{t('scheduleFishbowl')}</span>
            </Button>
          </RedirectLink>
        </div>
        <div className="ph-badge animate-item">
          <a
            href="https://www.producthunt.com/posts/stooa?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-stooa"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=320231&theme=light&period=daily"
              alt="Stooa - The open source online fishbowl tool | Product Hunt"
              width="100%"
              height="54"
            />
          </a>
        </div>
        <div id="animated-billboard-morph2"></div>
      </Billboard>
      <Content>
        <div className="row-list">
          <div id="animated-billboard-desktop" className="hide-mobile"></div>
          <div id="animated-billboard-mobile" className="hide-desktop"></div>
          <WaveMobile className="wave hide-desktop" />
          <WaveDesktop className="wave hide-mobile" />
        </div>
        <Row dark className="animate">
          <h2 className="title-lg animate-item definition">{t('definition.title')}</h2>
          <Description center className="animate-item body-lg">
            <Trans
              i18nKey="home:definition.description"
              components={{ strong: <strong />, p: <p /> }}
            />
          </Description>
        </Row>
        <Sections>
          {lazyMovinAnimations.map((item: Lottie, i: number) => {
            return (
              <div data-testid={`benefit-${i + 1}`} key={item.id}>
                {item.morph && (
                  <Wrapper>
                    <div id={item.morph}></div>
                  </Wrapper>
                )}
                <Benefits item={item} />
              </div>
            );
          })}
        </Sections>
        <Banner />
      </Content>
    </Layout>
  );
};

export default Home;

/**
 * Workaround for:
 * [next-translate] In Next 10.x.x there is an issue related to i18n and getInitialProps.
 * We recommend to replace getInitialProps to getServerSideProps on /index.tsx.
 *
 * https://github.com/vercel/next.js/discussions/18396
 */
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  };
};

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GetStaticProps } from 'next';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import lottie from 'lottie-web';
import { gsap } from 'gsap';

import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import Description from '@/components/Common/Description';

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
import StooaScrollPath from '@/landing/ui/animations/home/stooa-scroll.json';
import YoutubeEmbed from '@/landing/Components/YoutubeEmbed';
import ResponsiveRow from '@/landing/HomeSections/ResponsiveRow';
import FishbowlExplanation from '@/landing/Components/FishbowlExplanation';
import FixedButton from '@/landing/Components/FixedButton';
import { useAuth } from '@/contexts/AuthContext';

const BenefitWithLottie = dynamic(import('@/landing/HomeSections/BenefitWithLottie'), {
  loading: () => <div />
});
const Banner = dynamic(import('@/landing/HomeSections/Banner'), { loading: () => <div /> });

const Home = () => {
  const { t } = useTranslation('home');
  const previewRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const lazyMovinAnimations: Lottie[] = [
    {
      id: 'animated-keybenefit1',
      name: 'keybenefits.first',
      reverse: true,
      path: 'keybenefit1',
      assetsPath: 'img/animations/keybenefit1/'
    },
    {
      id: 'animated-keybenefit2',
      name: 'keybenefits.second',
      path: 'keybenefit2',
      morph: 'animated-keybenefit2-morph'
    },
    { id: 'animated-keybenefit3', name: 'keybenefits.third', reverse: true, path: 'keybenefit3' },
    { id: 'animated-keybenefit4', name: 'keybenefits.fourth', path: 'keybenefit4' }
  ];

  const handleAnimation = (targetClass = 'animate', delay = 0.6) => {
    const HANDLED_CLASS = 'animated';
    const ANIMATION_ITEM_CLASS = 'animate-item';
    const items = [].slice.call(document.querySelectorAll(`.${targetClass}`));
    const top = window.innerHeight;

    items.map((item: HTMLElement) => {
      if (!item.classList.contains(HANDLED_CLASS) && item.getBoundingClientRect().top < top) {
        const animations = [].slice.call(item.querySelectorAll(`.${ANIMATION_ITEM_CLASS}`));

        animations.map((element: HTMLElement, i: number) => {
          gsap.to(element, {
            duration: 1,
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
      { id: 'animated-youtube-morph', path: MorphBillAnimPath },
      { id: 'animated-billboard-morph2', path: Morph2BillAnimPath },
      { id: 'animated-keybenefit2-morph', path: KeyBenefit2MorphPath },
      { id: 'scroll-indicator', path: StooaScrollPath }
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
      <Billboard id="billboard" className="billboard-animate">
        <div id="animated-billboard-morph"></div>
        <div id="scroll-indicator" />

        <div className="billboard-text">
          <h1 data-testid="landing-title" className="animate-item title-lg">
            {t('title')}
          </h1>
          <div ref={previewRef} className="fishbowl-preview animate-item hide-desktop mobile">
            <Image
              src="/img/web/stooa-preview.png"
              priority
              alt="Stooa fishbowl event "
              width={1347}
              height={848}
            />
          </div>
          <p className="body-lg animate-item">
            <Trans i18nKey="home:description1" components={{ span: <span className="medium" /> }} />
          </p>
          <p className="body-lg animate-item">
            <Trans i18nKey="home:description2" components={{ span: <span className="medium" /> }} />
          </p>
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
                <span>{isAuthenticated ? t('hostFishbowlNow') : t('tryNow')}</span>
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
        </div>
        <div ref={previewRef} className="fishbowl-preview animate-item hide-mobile">
          <Image
            src="/img/web/stooa-preview.png"
            priority
            alt="Stooa fishbowl event "
            width={1347}
            height={848}
          />
        </div>

        <FixedButton buttonText={isAuthenticated ? t('hostFishbowlNow') : t('tryNow')} />

        <div id="animated-billboard-morph2"></div>
      </Billboard>
      <Content>
        {/* WAVES */}
        <WaveMobile className="wave hide-desktop" />
        <WaveDesktop className="wave hide-mobile" />

        {/* HOW ONLINE DEBATES */}
        <ResponsiveRow spacing="large" className="animate curve-top" reverse colored>
          <>
            <h3 className="title-md animate-item definition">{t('howOnlineDebates')}</h3>
          </>

          <div className="youtube-wrapper">
            <Image
              className="red-blob"
              src="/img/web/blobs/red-blob.png"
              alt="Red blob floating around"
              width={457}
              height={408}
            />
            <YoutubeEmbed src="https://www.youtube.com/embed/mj2-daCUxGo?rel=0" />
          </div>
        </ResponsiveRow>

        {/* HOW STOOA WORKS */}
        <Wrapper className="animate" colored>
          <div className="how-it-works-title animate-item">
            <h2 className="title-lg animate-item definition">
              {t('howStooa.title')} <span className="hide-desktop">{t('howStooa.subtitle')}</span>
            </h2>
            <h4 className="title-md animate-item definition how-subtitle hide-mobile">
              {t('howStooa.subtitle')}
            </h4>
          </div>
        </Wrapper>
        <ResponsiveRow
          align="end"
          spacing="medium"
          className="animate last-row how-it-works-explanation"
          colored
          secondItemClassName="hide-mobile"
        >
          <FishbowlExplanation />

          <div className="larger-image-wrapper">
            <Image
              src="/img/web/reading-friend.png"
              alt="A Stooa's friend reading why should they use stooa"
              fill
            />
          </div>
        </ResponsiveRow>

        <Wrapper>
          <Row className="animate no-padding">
            <div className="row-list">
              <div id="animated-billboard-desktop" className="hide-mobile"></div>
              <div id="animated-billboard-mobile" className="hide-desktop"></div>
            </div>
            <h2 className="title-lg animate-item definition">{t('definition.title')}</h2>
            <Description center className="animate-item body-lg">
              <Trans
                i18nKey="home:definition.description"
                components={{ strong: <strong />, p: <p /> }}
              />
            </Description>
          </Row>
        </Wrapper>

        <Sections>
          {lazyMovinAnimations.map((item: Lottie, i: number) => {
            return (
              <div data-testid={`benefit-${i + 1}`} key={item.id}>
                {item.morph && (
                  <Wrapper>
                    <div id={item.morph}></div>
                  </Wrapper>
                )}
                <BenefitWithLottie item={item} />
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

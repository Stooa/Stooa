/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState, useEffect, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import SlickSlider from 'react-slick';
import { TweenMax } from 'gsap';

import ModalOnBoarding from '@/components/App/ModalOnBoarding';
import { getOnBoardingCookie, setOnBoardingCookie } from '@/lib/auth';
import { pushEventDataLayer } from '@/lib/analytics';
import { ButtonApp, ButtonLinkApp } from '@/ui/Button';

import ArrowPrev from '@/ui/svg/arrow-prev.svg';
import ArrowNext from '@/ui/svg/arrow-next.svg';
import Cross from '@/ui/svg/cross.svg';
import QuestionMark from '@/ui/svg/questionmark.svg';
import OnboardingWrapper, {
  Icon,
  Slider,
  Slide,
  Tooltip
} from '@/components/App/Onboarding/styles';
import onBoardingData from '@/components/App/Onboarding/data.json';

interface Props {
  initialized: boolean;
  isModerator: boolean;
}

interface Arrow {
  currentSlide?: number;
  slideCount?: number;
  children?: React.ReactElement;
}

const SlickButtonFix = ({ children, ...props }) => (
  <button className="arrow prev" {...props}>
    {children}
  </button>
);

// This props are required to fix the issue with the SlickSlider component
// ref: https://github.com/akiran/react-slick/issues/1195
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrevArrow = ({ currentSlide, slideCount, children, ...props }: Arrow) => (
  <SlickButtonFix {...props}>
    <ArrowPrev />
  </SlickButtonFix>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NextArrow = ({ currentSlide, slideCount, children, ...props }: Arrow) => (
  <SlickButtonFix {...props}>
    <ArrowNext />
  </SlickButtonFix>
);

const Onboarding: React.FC<Props> = ({ isModerator }) => {
  const sliderRef = useRef(null);
  const [active, setActive] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(false);
  const [data, setData] = useState([]);
  const { t } = useTranslation('on-boarding');

  const SLIDE_SETTINGS = {
    dots: true,
    speed: 500,
    fade: true,
    infinite: false,
    lazyload: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (current: number) => {
      clearAnimation(current);
      hideSlide(current, 0.5);
    },
    afterChange: (current: number) => {
      showSlide(current);
    }
  };

  const toggleOnBoarding = () => {
    pushEventDataLayer({
      action: active ? 'OnBoarding close' : 'OnBoarding open',
      category: 'Header',
      label: window.location.href
    });

    setActive(!active);
  };

  const skipOnBoarding = () => {
    toggleOnBoarding();
    setOnBoardingCookie(isModerator);
    if (!alreadySeen) setActiveTooltip(true);
  };

  const shouldShow = () => {
    const cookie = getOnBoardingCookie(isModerator);

    if (!cookie) {
      setActive(true);
      setAlreadySeen(false);
    }
  };

  const clearAnimation = (slide: number) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach(item => {
      item.removeAttribute('style');
    });
  };

  const hideSlide = (slide: number, delay = 0) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach(item => {
      TweenMax.to(item, 0, {
        opacity: 0,
        y: 30,
        ease: 'none',
        delay
      });
    });
  };

  const showSlide = (slide: number, delay = 0.3) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach((item, i) => {
      TweenMax.to(item, 1, {
        opacity: 1,
        y: 0,
        ease: 'Power3.easeOut',
        delay: delay + 0.1 * i
      });
    });
  };

  useEffect(() => {
    setData(onBoardingData[isModerator ? 'moderator' : 'participant']);
    shouldShow();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) sliderRef.current.slickGoTo(0);
    else showSlide(0);
  }, [active]);

  return (
    <OnboardingWrapper>
      <Icon onClick={toggleOnBoarding}>
        <QuestionMark />
      </Icon>
      {activeTooltip && (
        <Tooltip className="info">
          <p>{t('tooltip')}</p>
          <button
            onClick={() => {
              setActiveTooltip(false);
              setAlreadySeen(true);
            }}
          >
            <Cross />
          </button>
        </Tooltip>
      )}
      <ModalOnBoarding closeModal={skipOnBoarding} show={active}>
        <Slider>
          <SlickSlider {...SLIDE_SETTINGS} ref={sliderRef}>
            {data.map((item, i) => (
              <Slide
                key={`slide-${i}`}
                className={`${isModerator ? 'moderator' : 'participant'} slide slide-${i}`}
                data-slide={i}
              >
                <div className="left">
                  <div className="animate">
                    {item.pretitle && <p>{t(item.preTitle)}</p>}
                    {item.title && <h2 className="title-md">{t(item.title)}</h2>}
                    {item.text && (
                      <Trans
                        i18nKey={item.text}
                        components={{
                          div: <div />,
                          p: <p />,
                          ul: <ul />,
                          li: <li />,
                          strong: <strong />
                        }}
                      />
                    )}
                    {i === data.length - 1 ? (
                      <ButtonApp onClick={skipOnBoarding}>{t('done')}</ButtonApp>
                    ) : (
                      <ButtonLinkApp onClick={skipOnBoarding}>{t('skip')}</ButtonLinkApp>
                    )}
                  </div>
                </div>
                <div className="right">
                  {item.img1 && <img className="animate img-1" src={item.img1} alt="" />}{' '}
                  {/* eslint-disable-line @next/next/no-img-element */}
                  {item.img2 && <img className="animate img-2" src={item.img2} alt="" />}{' '}
                  {/* eslint-disable-line @next/next/no-img-element */}
                </div>
              </Slide>
            ))}
          </SlickSlider>
        </Slider>
      </ModalOnBoarding>
    </OnboardingWrapper>
  );
};

export default Onboarding;

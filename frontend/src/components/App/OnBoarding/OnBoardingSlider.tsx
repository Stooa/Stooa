/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef } from 'react';
import Trans from 'next-translate/Trans';
import SlickSlider from 'react-slick';

import { gsap } from 'gsap';

import { Slider, Slide } from '@/components/App/OnBoarding/styles';
import Button from '@/components/Common/Button';
import { useStooa } from '@/contexts/StooaManager';
import ArrowPrev from '@/ui/svg/arrow-prev.svg';
import ArrowNext from '@/ui/svg/arrow-next.svg';
import useTranslation from 'next-translate/useTranslation';

import onBoardingDataWithIntroduction from '@/components/App/OnBoarding/dataWithIntroduction.json';
import onBoardingDataWithoutIntroduction from '@/components/App/OnBoarding/dataWithoutIntroduction.json';
import { useModals } from '@/contexts/ModalsContext';

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

const OnBoardingSlider = ({ skipOnBoarding }: { skipOnBoarding: () => void }) => {
  const sliderRef = useRef<SlickSlider>(null);
  const { t } = useTranslation('on-boarding');
  const { data: fishbowlData, isModerator } = useStooa();
  const { showOnBoardingModal } = useModals();

  let onBoardingData;
  if (fishbowlData.hasIntroduction) {
    if (isModerator) {
      onBoardingData = onBoardingDataWithIntroduction['moderator'];
    } else {
      onBoardingData = onBoardingDataWithIntroduction['participant'];
    }
  } else {
    if (isModerator) {
      onBoardingData = onBoardingDataWithoutIntroduction['moderator'];
    } else {
      onBoardingData = onBoardingDataWithoutIntroduction['participant'];
    }
  }

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

  const clearAnimation = (slide: number) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach(item => {
      item.removeAttribute('style');
    });
  };

  const showSlide = (slide: number, delay = 0.3) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach((item, index) => {
      gsap.to(item, 1, {
        opacity: 1,
        y: 0,
        ease: 'Power3.easeOut',
        delay: delay + 0.1 * index
      });
    });
  };

  const hideSlide = (slide: number, delay = 0) => {
    const items = document.querySelectorAll(`.slide[data-slide="${slide}"] .animate`);

    items.forEach(item => {
      gsap.to(item, 0, {
        opacity: 0,
        y: 30,
        ease: 'none',
        delay
      });
    });
  };

  useEffect(() => {
    if (!showOnBoardingModal && sliderRef.current) sliderRef.current.slickGoTo(0);
    else showSlide(0);
  }, [showOnBoardingModal]);

  return (
    <Slider>
      <SlickSlider {...SLIDE_SETTINGS} ref={sliderRef}>
        {onBoardingData.map((item, i) => (
          <Slide
            key={item}
            className={`${isModerator ? 'moderator' : 'participant'} slide slide-${i}`}
            data-slide={i}
          >
            <div className="left">
              <div className="animate">
                {item.preTitle && <p>{t(item.preTitle)}</p>}
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
                {i === onBoardingData.length - 1 ? (
                  <Button size="medium" onClick={skipOnBoarding}>
                    {t('done')}
                  </Button>
                ) : (
                  <Button variant="subtleLink" onClick={skipOnBoarding}>
                    {t('skip')}
                  </Button>
                )}
              </div>
            </div>
            <div className="right">
              {item.img1 && (
                <img
                  className="animate img-1"
                  src={item.img1}
                  alt="Image explaining the onboarding"
                />
              )}
              {/* eslint-disable-line @next/next/no-img-element */}
              {item.img2 && (
                <img
                  className="animate img-2"
                  src={item.img2}
                  alt="Image explaining the onboarding"
                />
              )}
              {/* eslint-disable-line @next/next/no-img-element */}
            </div>
          </Slide>
        ))}
      </SlickSlider>
    </Slider>
  );
};

export default OnBoardingSlider;

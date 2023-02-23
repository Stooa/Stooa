/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledThanksTextWrapper, StyledStepWrapper } from './styles';
import useTranslation from 'next-translate/useTranslation';

import Whatsapp from '@/ui/svg/RRSS-whatsapp.svg';
import LinkedIn from '@/ui/svg/RRSS-linkedin.svg';
import Twitter from '@/ui/svg/RRSS-twitter.svg';
import Mail from '@/ui/svg/RRSS-mail.svg';
import Image from 'next/image';
import Cross from '@/ui/svg/cross.svg';

const StepEnd = ({
  variant,
  handleFinish
}: {
  variant: 'fishbowl' | 'fishbowl-mobile' | 'thankyou';
  handleFinish?: () => void;
}) => {
  const { t } = useTranslation('fishbowl');
  return (
    <StyledStepWrapper className="nopadding">
      {variant !== 'thankyou' && (
        <button className="close" onClick={handleFinish}>
          <Cross />
        </button>
      )}

      {variant === 'thankyou' && (
        <Image
          className="friend-image"
          src="/img/friends/thankyou-friend.png"
          alt="Thank you!"
          width={204}
          height={226}
        />
      )}
      <StyledThanksTextWrapper>
        <h4 className={`medium ${variant === 'fishbowl' ? 'body-sm' : 'body-lg centered'}`}>
          {t('feedback.thanks')} {variant === 'thankyou' && t('feedback.thanksDescription')}
        </h4>
        {(variant === 'fishbowl' || variant === 'fishbowl-mobile') && (
          <p className="body-sm">{t('feedback.thanksDescription')}</p>
        )}
      </StyledThanksTextWrapper>
      {variant === 'fishbowl' && (
        <>
          <hr />
          <StyledThanksTextWrapper>
            <div className="social-share">
              <h4 className="body-sm medium">{t('feedback.spreadTheWord')}</h4>
              <div className="social-share__buttons">
                <a
                  href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Whatsapp />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=stooa.com&title=Mira qué app he encontrado&summary=Mira qué app he encontrado&source=stooa.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedIn />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=Mira qué app he encontrado ${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Twitter />
                </a>
                <a
                  href="mailto:?subject=Stooa&body=Mira qué app he encontrado https://stooa.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail />
                </a>
              </div>
            </div>
          </StyledThanksTextWrapper>
        </>
      )}
    </StyledStepWrapper>
  );
};

export default StepEnd;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { StyledList } from './styles';

const FishbowlExplanation = () => {
  const { t } = useTranslation('home');
  return (
    <>
      <StyledList>
        <li className="animate-item">
          <div className="with-icon">
            <Image
              src="/img/web/explanation/chair.png"
              alt="Fishbowl chair"
              width={79}
              height={72}
            />
            <div>
              <h4 className="title-md">{t('howStooa.firstBulletTitle')}</h4>
              <p className="body-lg hide-mobile">{t('howStooa.firstBulletSub')}</p>
            </div>
          </div>
          <p className="body-lg hide-desktop">{t('howStooa.firstBulletSub')}</p>
        </li>
        <li className="animate-item">
          <div className="with-icon">
            <Image
              src="/img/web/explanation/talking-head.png"
              alt="Talking head"
              width={75}
              height={70}
            />
            <div className="animate-item">
              <h4 className="title-md">{t('howStooa.secondBulletTitle')}</h4>
              <p className="body-lg hide-mobile">{t('howStooa.secondBulletSub')}</p>
            </div>
          </div>
          <p className="body-lg hide-desktop">{t('howStooa.secondBulletSub')}</p>
        </li>
      </StyledList>
      <p className="body-lg animate-item">
        <Trans
          i18nKey="home:howStooa.longExplanation"
          components={{ span: <span className="medium" />, br: <br /> }}
        />
      </p>
    </>
  );
};

export default FishbowlExplanation;

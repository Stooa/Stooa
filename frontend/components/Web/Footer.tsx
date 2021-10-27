/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import {
  ROUTE_COOKIES_POLICY,
  ROUTE_PRIVACY_POLICY,
  TWITTER_USER,
  INSTAGRAM_USER,
  LINKEDIN_USER,
  FACEBOOK_USER
} from 'app.config';
import Facebook from 'ui/svg/RRSS-facebook.svg';
import Instagram from 'ui/svg/RRSS-instagram.svg';
import Linkedin from 'ui/svg/RRSS-linkedin.svg';
import Twitter from 'ui/svg/RRSS-twitter.svg';
import GAButton from 'components/Common/GAButton';
import LanguageSwitcher from 'components/Common/LanguageSwitcher';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="rrss">
        <Link href={`https://twitter.com/${TWITTER_USER}/`} passHref>
          <GAButton
            target="_blank"
            rel="noreferrer"
            variant="link"
            event={{
              category: 'Footer',
              action: 'RRSS',
              label: 'Twitter'
            }}>
            <Twitter />
          </GAButton>
        </Link>
        <Link href={`https://www.instagram.com/${INSTAGRAM_USER}`} passHref>
          <GAButton
            target="_blank"
            rel="noreferrer"
            variant="link"
            event={{
              category: 'Footer',
              action: 'RRSS',
              label: 'Instagram'
            }}>
            <Instagram />
          </GAButton>
        </Link>
        <Link href={`https://www.linkedin.com/showcase/${LINKEDIN_USER}/`} passHref>
          <GAButton
            target="_blank"
            rel="noreferrer"
            variant="link"
            event={{
              category: 'Footer',
              action: 'RRSS',
              label: 'Linkedin'
            }}>
            <Linkedin />
          </GAButton>
        </Link>
        <Link href={`https://www.facebook.com/${FACEBOOK_USER}/`} passHref>
          <GAButton
            target="_blank"
            rel="noreferrer"
            variant="link"
            event={{
              category: 'Footer',
              action: 'RRSS',
              label: 'Facebook'
            }}>
            <Facebook />
          </GAButton>
        </Link>
      </div>
      <div className="text-xxs">
        <p className="copyright">{t('copyright').replace('%year%', currentYear.toString())}</p>
        <div className="legals">
          <Link href={ROUTE_PRIVACY_POLICY} passHref>
            <a>{t('privacyPolicy')}</a>
          </Link>
          <Link href={ROUTE_COOKIES_POLICY} passHref>
            <a>{t('cookiesPolicy')}</a>
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default Footer;

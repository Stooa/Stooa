/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import {
  ROUTE_FISHBOWL_CREATE,
  ROUTE_HOME,
  ROUTE_SIGN_IN,
  ROUTE_COOKIES_POLICY,
  ROUTE_PRIVACY_POLICY,
  ROUTE_REGISTER,
  TWITTER_USER,
  INSTAGRAM_USER,
  LINKEDIN_USER,
  FACEBOOK_USER,
  GITHUB_ISSUES,
  GITHUB_ROADMAP,
  GITBOOK_DOCUMENTATION,
  GITBOOK_CONDUCT,
  SUPPORT_EMAIL,
  GITHUB_BASE,
  APP_NAME,
  ROUTE_FISHBOWL_HOST_NOW,
  ROUTE_BLOG
} from '@/app.config';

import { pushEventDataLayer } from '@/lib/analytics';

import { useAuth } from '@/contexts/AuthContext';

import Logo from '@/components/Common/Logo';
import LanguageSwitcher from '@/components/Common/LanguageSwitcher';
import RedirectLink from '@/components/Web/RedirectLink';

import Facebook from '@/ui/svg/RRSS-facebook.svg';
import Github from '@/ui/svg/RRSS-github.svg';
import Instagram from '@/ui/svg/RRSS-instagram.svg';
import LinkedIn from '@/ui/svg/RRSS-linkedin.svg';
import Twitter from '@/ui/svg/RRSS-x.svg';
import { Container, FooterCopyright, FooterNav, Nav, NavList, NavTitle } from './styles';
import { useRouter } from 'next/router';

type TSocial = {
  name: string;
  component: JSX.Element;
  url: string;
};

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();
  const { pathname } = useRouter();

  const socialNetworks: TSocial[] = [
    {
      name: 'X',
      component: <Twitter />,
      url: `https://x.com/${TWITTER_USER}/`
    },
    {
      name: 'Instagram',
      component: <Instagram />,
      url: `https://www.instagram.com/${INSTAGRAM_USER}`
    },
    {
      name: 'LinkedIn',
      component: <LinkedIn />,
      url: `https://www.linkedin.com/company/${LINKEDIN_USER}/`
    },
    {
      name: 'Facebook',
      component: <Facebook />,
      url: `https://www.facebook.com/${FACEBOOK_USER}/`
    },
    {
      name: 'Github',
      component: <Github />,
      url: GITHUB_BASE
    }
  ];

  return (
    <Container className={pathname === '/' ? 'home' : ''}>
      <FooterNav>
        <div>
          <Logo className="logo" href={ROUTE_HOME} />
          <a
            href="https://www.producthunt.com/posts/stooa?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-stooa"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=320231&theme=light&period=daily"
              alt="Stooa - The&#0032;open&#0032;source&#0032;online&#0032;fishbowl&#0032;tool | Product Hunt"
              style={{ marginBottom: '1rem' }}
              width="250"
              height="54"
            />
          </a>
        </div>
        <Nav>
          <NavTitle className="body-md bold hide-mobile">{APP_NAME}</NavTitle>
          <NavList>
            <li>
              <Link
                href={ROUTE_FISHBOWL_CREATE}
                onClick={() => {
                  pushEventDataLayer({
                    category: 'Schedule Fishbowl',
                    action: 'Footer',
                    label: 'Footer'
                  });
                }}
              >
                <span>{t('scheduleFishbowl')}</span>
              </Link>
            </li>
            <li>
              <Link
                href={ROUTE_FISHBOWL_HOST_NOW}
                onClick={() => {
                  pushEventDataLayer({
                    category: 'Host Fishbowl Now',
                    action: 'Footer',
                    label: 'Footer'
                  });
                }}
              >
                <span>{t('hostFishbowlNow')}</span>
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <Link href={`${ROUTE_REGISTER}`}>{t('register')}</Link>
                </li>
                <li>
                  <RedirectLink href={ROUTE_SIGN_IN} passHref>
                    <a data-testid="footer-login">{t('signin')}</a>
                  </RedirectLink>
                </li>
              </>
            )}
            <li>
              <Link href={`${ROUTE_BLOG}`}>{t('blog')}</Link>
            </li>
          </NavList>
        </Nav>
        <Nav>
          <NavTitle className="body-md bold">{t('help')}</NavTitle>
          <NavList>
            <li>
              <Link href={GITHUB_ISSUES} target="_blank" rel="noreferrer noopener">
                {t('githubIssues')}
              </Link>
            </li>
            <li>
              <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
            </li>
            <li>
              <Link href={GITHUB_ROADMAP} target="_blank" rel="noreferrer noopener">
                {t('roadmap')}
              </Link>
            </li>
            <li>
              <Link href={GITBOOK_DOCUMENTATION} target="_blank" rel="noreferrer noopener">
                {t('documentation')}
              </Link>
            </li>
            <li>
              <Link href={GITBOOK_CONDUCT} target="_blank" rel="noreferrer noopener">
                {t('conductCode')}
              </Link>
            </li>
          </NavList>
        </Nav>
        <Nav>
          <NavTitle className="body-md bold">{t('legal')}</NavTitle>
          <NavList>
            <li>
              <Link href={ROUTE_PRIVACY_POLICY}>{t('privacyPolicy')}</Link>
            </li>
            <li>
              <Link href={ROUTE_COOKIES_POLICY}>{t('cookiesPolicy')}</Link>
            </li>
          </NavList>
        </Nav>
        <Nav className="social">
          {socialNetworks.map(({ name, url, component }) => (
            <div key={name} className="icon">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  pushEventDataLayer({
                    category: 'Footer',
                    action: 'RRSS',
                    label: name
                  });
                }}
              >
                {component}
              </a>
            </div>
          ))}
        </Nav>
      </FooterNav>
      <FooterCopyright className="body-xs">
        <p className="copyright">{t('copyright').replace('%year%', currentYear.toString())}</p>
        <LanguageSwitcher />
      </FooterCopyright>
    </Container>
  );
};

export default Footer;

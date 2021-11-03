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
} from 'app.config';
import { useAuth } from 'contexts/AuthContext';
import Logo from 'components/Common/Logo';
import GAButton from 'components/Common/GAButton';
import LanguageSwitcher from 'components/Common/LanguageSwitcher';
import RedirectLink from 'components/Web/RedirectLink';
import Facebook from 'ui/svg/RRSS-facebook.svg';
import Github from 'ui/svg/RRSS-github.svg';
import Instagram from 'ui/svg/RRSS-instagram.svg';
import LinkedIn from 'ui/svg/RRSS-linkedin.svg';
import Twitter from 'ui/svg/RRSS-twitter.svg';
import { Container, FooterCopyright, FooterNav, Nav, NavList, NavTitle } from './styles';

type TSocial = {
  name: string;
  component: JSX.Element;
  url: string;
};

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const socialNetworks: TSocial[] = [
    {
      name: 'Twitter',
      component: <Twitter className="icon" />,
      url: `https://twitter.com/${TWITTER_USER}/`,
    },
    {
      name: 'Instagram',
      component: <Instagram className="icon" />,
      url: `https://www.instagram.com/${INSTAGRAM_USER}`,
    },
    {
      name: 'LinkedIn',
      component: <LinkedIn className="icon" />,
      url: `https://www.linkedin.com/showcase/${LINKEDIN_USER}/`,
    },
    {
      name: 'Facebook',
      component: <Facebook className="icon" />,
      url: `https://www.facebook.com/${FACEBOOK_USER}/`,
    },
    {
      name: 'Github',
      component: <Github className="icon" />,
      url: GITHUB_BASE,
    },
  ];

  return (
    <Container>
      <FooterNav>
        <Logo className="logo" href={ROUTE_HOME} />
        <Nav>
          <NavTitle className="text-md bold">{APP_NAME}</NavTitle>
          <NavList>
            <li className="text-sm">
              <Link href={ROUTE_FISHBOWL_CREATE} passHref>
                <GAButton
                  variant="link"
                  event={{
                    category: 'Create Fishbowl',
                    action: 'Footer',
                    label: 'Footer',
                  }}
                >
                  <span>{t('cta')}</span>
                </GAButton>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={`${ROUTE_REGISTER}`} passHref>
                <a>{t('register')}</a>
              </Link>
            </li>
            {!isAuthenticated && (
              <li className="text-sm">
                <RedirectLink href={ROUTE_SIGN_IN} passHref>
                  <a data-testid="footer-login">{t('signin')}</a>
                </RedirectLink>
              </li>
            )}
          </NavList>
        </Nav>
        <Nav>
          <NavTitle className="text-md bold">{t('help')}</NavTitle>
          <NavList>
            <li className="text-sm">
              <Link href={GITHUB_ISSUES} passHref>
                <a target="_blank" rel="noreferrer noopener">
                  {t('githubIssues')}
                </a>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={`mailto:${SUPPORT_EMAIL}`} passHref>
                <a>{SUPPORT_EMAIL}</a>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={GITHUB_ROADMAP} passHref>
                <a target="_blank" rel="noreferrer noopener">
                  {t('roadmap')}
                </a>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={GITBOOK_DOCUMENTATION} passHref>
                <a target="_blank" rel="noreferrer noopener">
                  {t('documentation')}
                </a>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={GITBOOK_CONDUCT} passHref>
                <a target="_blank" rel="noreferrer noopener">
                  {t('conductCode')}
                </a>
              </Link>
            </li>
          </NavList>
        </Nav>
        <Nav>
          <NavTitle className="text-md bold">{t('legal')}</NavTitle>
          <NavList>
            <li className="text-sm">
              <Link href={ROUTE_PRIVACY_POLICY} passHref>
                <a>{t('privacyPolicy')}</a>
              </Link>
            </li>
            <li className="text-sm">
              <Link href={ROUTE_COOKIES_POLICY} passHref>
                <a>{t('cookiesPolicy')}</a>
              </Link>
            </li>
          </NavList>
        </Nav>
        <Nav className="social">
          {socialNetworks.map(({ name, url, component }) => (
            <Link href={url} passHref key={name}>
              <GAButton
                target="_blank"
                rel="noreferrer"
                variant="link"
                event={{
                  category: 'Footer',
                  action: 'RRSS',
                  label: name,
                }}
              >
                {component}
              </GAButton>
            </Link>
          ))}
        </Nav>
      </FooterNav>
      <FooterCopyright className="text-xxs">
        <p className="copyright">{t('copyright').replace('%year%', currentYear.toString())}</p>
        <LanguageSwitcher />
      </FooterCopyright>
    </Container>
  );
};

export default Footer;

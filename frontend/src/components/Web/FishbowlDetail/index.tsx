/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Trans from 'next-translate/Trans';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { Fishbowl } from '@/types/api-platform';
import { Container } from '@/ui/pages/event-detail';
import { MainGrid } from './styles';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import FishbowlDataCard from '@/components/Web/FishbowlDataCard';
import Twitter from '@/ui/svg/x.svg';
import Linkedin from '@/ui/svg/share-linkedin.svg';
import { pushEventDataLayer } from '@/lib/analytics';
import { toast } from 'react-toastify';
import RedirectLink from '../RedirectLink';
import Button from '@/components/Common/Button';
import { ROUTE_FISHBOWL } from '@/app.config';
import useTranslation from 'next-translate/useTranslation';
import { isTimeLessThanNMinutes } from '@/lib/helpers';

interface Props {
  data: Fishbowl;
}

const FishbowlDetail: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation('form');
  const shareTitle = `${data.name}.`;

  useEffect(() => {
    toast(
      <Trans i18nKey="fishbowl:detail.fishbowlCreatedSuccessfully" components={{ i: <i /> }} />,
      {
        toastId: 'successful-created-fishbowl',
        icon: '🎉',
        type: 'success',
        position: 'bottom-center',
        autoClose: 5000,
        delay: 2000
      }
    );
  }, []);

  return (
    <Container>
      <MainGrid>
        <div className="left-column">
          <h2 className="title-md">
            <Trans i18nKey="fishbowl:detail.shareTitle" components={{ br: <br />, i: <i /> }} />
          </h2>
          <p className="body-md description">
            <Trans i18nKey="fishbowl:detail.shareSubtitle" components={{ i: <i /> }} />
          </p>
          <div className="hide-desktop enter-fishbowl">
            <RedirectLink href={`${ROUTE_FISHBOWL}/${data.slug}`} locale={data.locale} passHref>
              <Button size="large" as="a" data-testid="enter-fishbowl">
                <span>{t('button.enterFishbowl')}</span>
              </Button>
            </RedirectLink>
          </div>
          <ButtonCopyUrl
            variant={isTimeLessThanNMinutes(data.startDateTimeTz, 30) ? 'secondary' : 'primary'}
            size="large"
            withSvg
            slug={data.slug}
            eventType="fishbowl"
            locale={data.locale}
            isPrivate={data.isPrivate}
            plainPassword={data.plainPassword as string}
          />
          <p className="body-xs share-text">
            <Trans i18nKey="fishbowl:detail.shareInSocials" />
          </p>
          <ul className="social-links">
            <li>
              <Link
                href={`https://www.linkedin.com/shareArticle?url=${process.env.NEXT_PUBLIC_APP_DOMAIN}/fb/${data.slug}&title=${shareTitle}&mini=true`}
                passHref
                legacyBehavior
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    pushEventDataLayer({
                      category: 'Share',
                      action: 'Linkedin',
                      label: `fishbowl/detail/${data.slug}`
                    });
                  }}
                >
                  <span className="icon-wrapper">
                    <Linkedin />
                  </span>
                </a>
              </Link>
            </li>
            <li>
              <Link
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${process.env.NEXT_PUBLIC_APP_DOMAIN}/fb/${data.slug}`}
                passHref
                legacyBehavior
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    pushEventDataLayer({
                      category: 'Share',
                      action: 'Twitter',
                      label: `fishbowl/detail/${data.slug}`
                    });
                  }}
                >
                  <span className="icon-wrapper">
                    <Twitter />
                  </span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="right-column">
          <FishbowlDataCard data={data} />
          <p className="body-xs">
            <Trans i18nKey="fishbowl:detail.mailInfo" components={{ i: <i /> }} />
          </p>
        </div>
      </MainGrid>
    </Container>
  );
};

export default FishbowlDetail;

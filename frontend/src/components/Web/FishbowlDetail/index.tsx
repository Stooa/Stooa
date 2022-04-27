/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import Link from 'next/link';

import { Fishbowl } from '@/types/api-platform';
import { Container } from '@/ui/pages/fishbowl-detail';
import { MainGrid } from './styles';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import FishbowlDataCard from '@/components/Web/FishbowlDataCard';
import Twitter from '@/ui/svg/share-twitter.svg';
import Linkedin from '@/ui/svg/share-linkedin.svg';
import { pushEventDataLayer } from '@/lib/analytics';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { BREAKPOINTS } from '@/ui/settings';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  data: Fishbowl;
}

const FishbowlDetail: React.FC<Props> = ({ data }) => {
  const { width } = useWindowSize();

  const isLargerThanTablet = width > BREAKPOINTS.tablet;

  const shareTitle = `Come to my online 🐠 fishbowl in Stooa. ${data.name}.`;

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
            <Trans i18nKey="fishbowl:detail.shareTitle" components={{ br: <br /> }} />
          </h2>
          <p className="body-md description">
            <Trans i18nKey="fishbowl:detail.shareSubtitle" components={{ i: <i /> }} />
          </p>
          <ButtonCopyUrl
            size={isLargerThanTablet ? 'medium' : 'large'}
            full={!isLargerThanTablet}
            withSvg
            fid={data.slug}
            locale={data.locale}
          />
          <p className="body-xs">
            <Trans i18nKey="fishbowl:detail.shareInSocials" />
          </p>
          <ul className="social-links">
            <li>
              <Link
                href={`https://www.linkedin.com/shareArticle?url=${process.env.NEXT_PUBLIC_APP_DOMAIN}/fb/${data.slug}&title=${shareTitle}&mini=true`}
                passHref
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
            📩 You&apos;ll receive an email with all the details of your scheduled fishbowl.
          </p>
        </div>
      </MainGrid>
    </Container>
  );
};

export default FishbowlDetail;

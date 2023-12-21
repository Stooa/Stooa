/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';
import { StyledBlogBannerCTA } from './styles';
import RedirectLink from '../RedirectLink';
import { ROUTE_HOME } from '@/app.config';
import Button from '@/components/Common/Button';
import { pushEventDataLayer } from '@/lib/analytics';
import useTranslation from 'next-translate/useTranslation';

const BlogBannerCTA = () => {
  const { t } = useTranslation('blog');
  return (
    <StyledBlogBannerCTA>
      <div className="banner--content">
        <div className="banner--image-title">
          <Image src="/img/friends/dancing.png" width={252} height={277} alt="" />
          <h3 className="title-lg">{t('bannerText')}</h3>
        </div>
        <div className="banner--cta">
          <RedirectLink href={ROUTE_HOME} passHref>
            <Button
              size="large"
              as="a"
              variant="primary"
              className="animate-item cta-create-fishbowl "
              onClick={() => {
                pushEventDataLayer({
                  category: 'Home',
                  action: 'Blog Banner CTA',
                  label: 'Blog'
                });
              }}
            >
              <span>{t('common:scheduleFishbowl')}</span>
            </Button>
          </RedirectLink>
        </div>
      </div>
    </StyledBlogBannerCTA>
  );
};

export default BlogBannerCTA;

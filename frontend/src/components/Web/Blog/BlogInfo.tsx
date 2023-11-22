/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import { StyledBlogPostInfo } from './styles';
import Image from 'next/image';
import { pushEventDataLayer } from '@/lib/analytics';

import Linkedin from '@/ui/svg/share-linkedin.svg';
import Twitter from '@/ui/svg/x.svg';
import useTranslation from 'next-translate/useTranslation';
import { usePathname } from 'next/navigation';

interface Props {
  title: string;
  author: string;
  dateAndDuration: string;
  bottom?: boolean;
}

const BlogInfo = ({ author, dateAndDuration, title, bottom }: Props) => {
  const pathname = usePathname();

  const { t } = useTranslation('blog');
  return (
    <StyledBlogPostInfo bottom={bottom}>
      {!bottom && <Image src="/img/web/stooa-logo.png" width={32} height={32} alt="Stooa logo" />}
      <div className="post-info--author">
        <p className="medium">{author}</p>
        {!bottom && <p className="body-sm">{dateAndDuration}</p>}
      </div>
      <div className="post-info--share">
        <p>{t('share')}</p>
        <div>
          <Link
            href={`https://twitter.com/intent/tweet?text=${title}&url=${process.env.NEXT_PUBLIC_APP_DOMAIN}${pathname}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              pushEventDataLayer({
                category: 'Share',
                action: 'Twitter',
                label: `blog`
              });
            }}
          >
            <Twitter />
          </Link>
          <Link
            href={`https://www.linkedin.com/shareArticle?url=${process.env.NEXT_PUBLIC_APP_DOMAIN}${pathname}&title=${title}&mini=true`}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              pushEventDataLayer({
                category: 'Share',
                action: 'Linkedin',
                label: `blog`
              });
            }}
          >
            <Linkedin />
          </Link>
        </div>
      </div>
    </StyledBlogPostInfo>
  );
};
export default BlogInfo;

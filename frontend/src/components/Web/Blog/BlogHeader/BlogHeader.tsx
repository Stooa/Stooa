/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';
import { StyledBlogHeader, StyledBlogHeaderContent, StyledBlogHeaderTitle } from './styles';
import useTranslation from 'next-translate/useTranslation';

const BlogHeader = () => {
  const { t } = useTranslation('blog');
  return (
    <StyledBlogHeader>
      <StyledBlogHeaderContent>
        <StyledBlogHeaderTitle>
          <h1 className="title-display">{t('blogPage.headerTitle')}</h1>
          {t('blogPage.headerSubtitle')}
          <p className="body-lg"></p>
        </StyledBlogHeaderTitle>
        <Image src="/img/friends/computer-no-bg.png" width="160" height="200" alt="" />
      </StyledBlogHeaderContent>
    </StyledBlogHeader>
  );
};

export default BlogHeader;

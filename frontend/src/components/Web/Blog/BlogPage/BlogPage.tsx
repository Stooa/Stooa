/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BlogPosts } from '../BlogPostsData';
import { StyledBlogContainer, StyledBlogList, StyledBlogPage } from './styles';
import BlogCard from '../BlogCard';
import BlogWave from '@/ui/svg/waves/blog-wave.svg';
import BlogBannerCTA from '../../BlogBannerCTA';
import useTranslation from 'next-translate/useTranslation';

const BlogPage = () => {
  const { t } = useTranslation('blog');
  return (
    <StyledBlogPage>
      <BlogWave className="wave" />
      <StyledBlogContainer>
        <h2 className="title-md">{t('blogPage.lastPosts')}</h2>
        <StyledBlogList>
          {Object.keys(BlogPosts).map(post => {
            return <BlogCard key={post} blogPost={BlogPosts[post]} />;
          })}
        </StyledBlogList>
      </StyledBlogContainer>
      <BlogBannerCTA />
    </StyledBlogPage>
  );
};

export default BlogPage;

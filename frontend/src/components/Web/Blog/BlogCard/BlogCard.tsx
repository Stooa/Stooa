/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import { BlogPost } from '../BlogPostsData';
import Image from 'next/image';
import { StyledBlogCard, StyledLinkCard } from './styles';
import { ROUTE_BLOG } from '@/app.config';

interface Props {
  blogPost: BlogPost;
}

const BlogCard = ({ blogPost }: Props) => {
  const { t } = useTranslation('blog');
  return (
    <StyledBlogCard key={blogPost.title}>
      <StyledLinkCard href={`${ROUTE_BLOG}/${blogPost.slug}`}>
        <Image className="blog-card__image" src={blogPost.image} height={200} width={400} alt="" />
        <h3 className="title-sm">{t(blogPost.title)}</h3>
        <p className="body-lg medium">{t(blogPost.author)}</p>
        <p className="body-sm">{t(blogPost.dateAndDuration)}</p>
      </StyledLinkCard>
    </StyledBlogCard>
  );
};

export default BlogCard;

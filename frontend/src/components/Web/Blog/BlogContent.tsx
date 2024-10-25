/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Head from 'next/head';
import {
  StyledBlogWrapper,
  StyledPostContent,
  StyledPostContentWrapper,
  StyledPostSubtitle,
  StyledPostTitle
} from './styles';

import BlogInfo from './BlogInfo';
import BlogBannerCTA from '../BlogBannerCTA';
import Image from 'next/image';
import { BlogPosts } from './BlogPostsData';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ROUTE_NOT_FOUND } from '@/app.config';

interface Props {
  slug: string;
}

const BlogContent = ({ slug }: Props) => {
  const { t } = useTranslation('blog');
  const router = useRouter();

  if (!BlogPosts[slug as string]) {
    router.push(ROUTE_NOT_FOUND);
    return null;
  }
  const slugStr = slug as string;
  const selectedBlog = BlogPosts[slugStr];
  const Content = selectedBlog.content;
  const title = selectedBlog.title;
  const ISODate = new Date(selectedBlog.datePublishedTimestamp).toISOString();

  /** @type {import('schema-dts').Article} */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': t(title),
    'author': {
      '@type': 'Person',
      'name': t(selectedBlog.author),
      // The full URL must be provided, including the website's domain.
      'url': new URL('https://stooa.com', 'https://stooa.com')
    },
    // 'image': 'https://stooa.com' + selectedBlog.image,
    'datePublished': ISODate,
    'dateModified': ISODate
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <StyledPostTitle>{t(title)}</StyledPostTitle>
      <StyledBlogWrapper>
        {/* BLOBS */}
        <Image
          src="/img/web/blobs/green-blob.png"
          width={285}
          height={377}
          className="green-blob"
          alt=""
        />
        <Image
          src="/img/web/blobs/purple-blob.png"
          width={181}
          height={374}
          className="purple-blob"
          alt=""
        />
        <Image
          src="/img/web/blobs/red-blob.png"
          width={457}
          height={408}
          className="red-blob"
          alt=""
        />
        <Image
          src="/img/web/blobs/yellow-blob.png"
          width={190}
          height={462}
          className="yellow-blob"
          alt=""
        />
        {/* TODO: We need to fix some cases we don't have time to */}
        {/* <AnchorMenu items={selectedBlog.menuItems} /> */}
        <StyledPostContentWrapper>
          <StyledPostSubtitle>{t(selectedBlog.subtitle)}</StyledPostSubtitle>

          <BlogInfo
            title={t(title)}
            author={t(selectedBlog.author)}
            dateAndDuration={t(selectedBlog.dateAndDuration)}
          />

          <StyledPostContent>
            <Content />
          </StyledPostContent>

          <BlogInfo
            bottom
            title={t(title)}
            author={t(selectedBlog.author)}
            dateAndDuration={t(selectedBlog.dateAndDuration)}
          />
        </StyledPostContentWrapper>
      </StyledBlogWrapper>
      <BlogBannerCTA />
    </>
  );
};

export default BlogContent;

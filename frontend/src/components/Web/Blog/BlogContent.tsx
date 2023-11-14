/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Head from 'next/head';
import { ImproveMeetings } from './posts/ImproveMeets';
import OpenGraphDefault from '@/components/Common/OpenGraphDefault';
import {
  StyledBlogWrapper,
  StyledPostContent,
  StyledPostContentWrapper,
  StyledPostSubtitle,
  StyledPostTitle
} from './styles';
import AnchorMenu, { BlogMenuItemType } from './AnchorMenu';
import BlogInfo from './BlogInfo';
import BlogBannerCTA from '../BlogBannerCTA';
import Image from 'next/image';

interface Props {
  slug: string;
}

type BlogPost = {
  title: string;
  subtitle: string;
  content: () => JSX.Element;
  image: string;
  author: string;
  dateAndDuration: string;
  datePublishedTimestamp: number;
  dateModifiedTimestamp: number;
  menuItems: BlogMenuItemType[];
};

const BlogPosts: Record<string, BlogPost> = {
  'improve-meetings': {
    title: 'Improve meetings',
    subtitle: 'Subtitle',
    content: ImproveMeetings,
    image: '/img/blog/improve-meetings.png',
    author: 'Jose de Stooa',
    dateAndDuration: '6 min de lectura - 10 de Noviembre',
    datePublishedTimestamp: 1699638349,
    dateModifiedTimestamp: 1699638349,
    menuItems: [
      { anchorId: 'ice-breakers', displayText: 'Icebreakers' },
      { anchorId: 'surveys', displayText: 'Encuestas' },
      { anchorId: 'agenda', displayText: 'Agenda' },
      { anchorId: 'reactions', displayText: 'Reactions' },
      { anchorId: 'fishbowl', displayText: 'Fishbowl' }
    ]
  }
};

const BlogContent = ({ slug }: Props) => {
  const selectedBlog = BlogPosts[slug as string];
  const Content = selectedBlog.content;
  const title = selectedBlog.title;

  /** @type {import('schema-dts').Article} */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'author': {
      '@type': 'Person',
      'name': selectedBlog.author,
      // The full URL must be provided, including the website's domain.
      'url': new URL('https://stooa.com', 'https://stooa.com')
    },
    'image': 'https://stooa.com' + selectedBlog.image,
    'datePublished': selectedBlog.datePublishedTimestamp,
    'dateModified': selectedBlog.dateModifiedTimestamp
  };

  return (
    <>
      <OpenGraphDefault seoTitle={title} seoDescription={selectedBlog.subtitle} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <StyledPostTitle>{title}</StyledPostTitle>
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

        <AnchorMenu items={selectedBlog.menuItems} />
        <StyledPostContentWrapper>
          <StyledPostSubtitle>{selectedBlog.subtitle}</StyledPostSubtitle>

          <BlogInfo
            title={title}
            author={selectedBlog.author}
            dateAndDuration={selectedBlog.dateAndDuration}
          />

          <StyledPostContent>
            <Content />
          </StyledPostContent>

          <BlogInfo
            bottom
            title={title}
            author={selectedBlog.author}
            dateAndDuration={selectedBlog.dateAndDuration}
          />
        </StyledPostContentWrapper>
      </StyledBlogWrapper>
      <BlogBannerCTA />
    </>
  );
};

export default BlogContent;

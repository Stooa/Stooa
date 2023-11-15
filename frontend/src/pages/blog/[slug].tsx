/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import BlogContent from '@/components/Web/Blog';
import { BlogPosts } from '@/components/Web/Blog/BlogPostsData';
import { GetServerSideProps } from 'next';

const Blog = ({ slug }) => {
  return (
    <Layout positionDefault>
      <BlogContent slug={slug as string} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  const selectedBlog = BlogPosts[slug as string];

  return {
    props: {
      slug,
      seoTitle: selectedBlog?.title,
      seoDescription: selectedBlog?.subtitle
    }
  };
};

export default Blog;

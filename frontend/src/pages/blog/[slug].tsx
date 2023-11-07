/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRouter } from 'next/router';

import Layout from '@/layouts/Default';
import { ImproveMeetings } from '@/components/Web/Blog';

const BlogPosts = {
  'improve-meetings': ImproveMeetings
};

const Blog = () => {
  const { slug } = useRouter().query;
  const BlogComponent = BlogPosts[slug as string];

  return (
    <Layout>
      <BlogComponent slug={slug as string} />
    </Layout>
  );
};

export default Blog;

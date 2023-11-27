/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BlogHeader from '@/components/Web/Blog/BlogHeader';
import BlogPage from '@/components/Web/Blog/BlogPage';
import Layout from '@/layouts/Default';

const Blog = () => {
  return (
    <Layout positionDefault blogLayout>
      <BlogHeader />
      <BlogPage />
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
//   const t = await getT(locale, 'blog');
//   const currentBlog = BlogPosts[slug as string];

//   return {
//     props: {
//       slug,
//       seoTitle: currentBlog?.title ? t(currentBlog.title) : null,
//       seoDescription: currentBlog?.title ? t(currentBlog.description) : null
//     }
//   };
// };

export default Blog;

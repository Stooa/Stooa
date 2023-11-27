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
import { GetServerSideProps } from 'next';
import getT from 'next-translate/getT';

const Blog = () => {
  return (
    <Layout positionDefault blogLayout>
      <BlogHeader />
      <BlogPage />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const t = await getT(locale, 'blog');

  return {
    props: {
      seoTitle: 'Stooa Blog. We love, we share.',
      seoDescription: t('blogPage.headerSubtitle')
    }
  };
};

export default Blog;

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
import { GetServerSideProps } from 'next';
import getT from 'next-translate/getT';

const Blog = ({ slug }) => {
  return (
    <Layout positionDefault>
      <BlogContent slug={slug as string} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  const slug = params?.slug;
  const t = await getT(locale, 'blog');

  return {
    props: {
      slug,
      seoTitle: t(`posts.${slug}.title`),
      seoDescription: t(`posts.${slug}.description`)
    }
  };
};

export default Blog;

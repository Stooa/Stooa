/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ImproveMeetings } from './posts/ImproveMeets';

interface Props {
  slug: string;
}

const BlogPosts = {
  'improve-meetings': ImproveMeetings
};

const BlogContent = ({ slug }: Props) => {
  const BlogComponent = BlogPosts[slug as string];

  return <BlogComponent slug={slug} />;
};

export default BlogContent;

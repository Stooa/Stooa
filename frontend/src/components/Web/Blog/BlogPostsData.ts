/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BlogMenuItemType } from './AnchorMenu';
import { ImproveMeetings } from './posts/ImproveMeets';

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

export const BlogPosts: Record<string, BlogPost> = {
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

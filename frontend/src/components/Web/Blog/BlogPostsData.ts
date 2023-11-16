/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BlogMenuItemType } from './AnchorMenu';
import { ImproveOnlineMeetings } from './posts/ImproveOnlineMeetings';

type BlogPost = {
  title: string;
  description: string;
  subtitle: string;
  content: () => JSX.Element;
  author: string;
  dateAndDuration: string;
  datePublishedTimestamp: number;
  dateModifiedTimestamp: number;
  menuItems: BlogMenuItemType[];
};

export const BlogPosts: Record<string, BlogPost> = {
  'improve-online-meetings': {
    title: 'posts.improve-online-meetings.title',
    description: 'posts.improve-online-meetings.description',
    subtitle: 'posts.improve-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.improve-online-meetings.author',
    dateAndDuration: 'posts.improve-online-meetings.date-and-duration',
    datePublishedTimestamp: 1699638349,
    dateModifiedTimestamp: 1699638349,
    menuItems: [
      {
        anchorId: 'ice-breakers',
        displayText: 'posts.improve-online-meetings.content.icebreakers'
      },
      { anchorId: 'surveys', displayText: 'posts.improve-online-meetings.content.surveys' },
      { anchorId: 'agenda', displayText: 'posts.improve-online-meetings.content.agenda' },
      { anchorId: 'reactions', displayText: 'posts.improve-online-meetings.content.reactions' },
      { anchorId: 'fishbowl', displayText: 'posts.improve-online-meetings.content.fishbowl' }
    ]
  }
};

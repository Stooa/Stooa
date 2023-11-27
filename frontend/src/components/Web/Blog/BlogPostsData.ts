/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BlogMenuItemType } from './AnchorMenu';
import { ImproveOnlineMeetings } from './posts/5tipsToImprove';

export type BlogPost = {
  slug: string;
  title: string;
  image: string;
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
  '5-tips-boost-participation-online-meetings': {
    slug: '5-tips-boost-participation-online-meetings',
    title: 'posts.5-tips-boost-participation-online-meetings.title',
    image: '/img/web/blog/improve/blog-1.png',
    description: 'posts.5-tips-boost-participation-online-meetings.description',
    subtitle: 'posts.5-tips-boost-participation-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.5-tips-boost-participation-online-meetings.author',
    dateAndDuration: 'posts.5-tips-boost-participation-online-meetings.date-and-duration',
    datePublishedTimestamp: 1700477847,
    dateModifiedTimestamp: 1700477847,
    menuItems: [
      {
        anchorId: 'ice-breakers',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.icebreakers'
      },
      {
        anchorId: 'surveys',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.surveys'
      },
      {
        anchorId: 'agenda',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.agenda'
      },
      {
        anchorId: 'reactions',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.reactions'
      },
      {
        anchorId: 'fishbowl',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.fishbowl'
      }
    ]
  },
  '5-tips-boost-participation-online-meetingss': {
    slug: '5-tips-boost-participation-online-meetings',
    title: 'posts.5-tips-boost-participation-online-meetings.title',
    image: '/img/web/blog/improve/blog-1.png',
    description: 'posts.5-tips-boost-participation-online-meetings.description',
    subtitle: 'posts.5-tips-boost-participation-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.5-tips-boost-participation-online-meetings.author',
    dateAndDuration: 'posts.5-tips-boost-participation-online-meetings.date-and-duration',
    datePublishedTimestamp: 1700477847,
    dateModifiedTimestamp: 1700477847,
    menuItems: [
      {
        anchorId: 'ice-breakers',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.icebreakers'
      },
      {
        anchorId: 'surveys',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.surveys'
      },
      {
        anchorId: 'agenda',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.agenda'
      },
      {
        anchorId: 'reactions',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.reactions'
      },
      {
        anchorId: 'fishbowl',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.fishbowl'
      }
    ]
  },
  '5-tips-boost-participation-online-meetiangs': {
    slug: '5-tips-boost-participation-online-meetings',
    title: 'posts.5-tips-boost-participation-online-meetings.title',
    image: '/img/web/blog/improve/blog-1.png',
    description: 'posts.5-tips-boost-participation-online-meetings.description',
    subtitle: 'posts.5-tips-boost-participation-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.5-tips-boost-participation-online-meetings.author',
    dateAndDuration: 'posts.5-tips-boost-participation-online-meetings.date-and-duration',
    datePublishedTimestamp: 1700477847,
    dateModifiedTimestamp: 1700477847,
    menuItems: [
      {
        anchorId: 'ice-breakers',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.icebreakers'
      },
      {
        anchorId: 'surveys',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.surveys'
      },
      {
        anchorId: 'agenda',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.agenda'
      },
      {
        anchorId: 'reactions',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.reactions'
      },
      {
        anchorId: 'fishbowl',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.fishbowl'
      }
    ]
  },
  '5-tips-boost-participatdion-online-meetings': {
    slug: '5-tips-boost-participation-online-meetings',
    title: 'posts.5-tips-boost-participation-online-meetings.title',
    image: '/img/web/blog/improve/blog-1.png',
    description: 'posts.5-tips-boost-participation-online-meetings.description',
    subtitle: 'posts.5-tips-boost-participation-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.5-tips-boost-participation-online-meetings.author',
    dateAndDuration: 'posts.5-tips-boost-participation-online-meetings.date-and-duration',
    datePublishedTimestamp: 1700477847,
    dateModifiedTimestamp: 1700477847,
    menuItems: [
      {
        anchorId: 'ice-breakers',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.icebreakers'
      },
      {
        anchorId: 'surveys',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.surveys'
      },
      {
        anchorId: 'agenda',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.agenda'
      },
      {
        anchorId: 'reactions',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.reactions'
      },
      {
        anchorId: 'fishbowl',
        displayText: 'posts.5-tips-boost-participation-online-meetings.content.fishbowl'
      }
    ]
  }
};

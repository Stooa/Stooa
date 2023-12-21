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
import { InnovativeRetroDynamics } from './posts/3innovativeRetroDynamics';
import { ComparingOnlineMeetings } from './posts/ComparingOnlineMeetings';
import { ConductLargeGroupMeetings } from './posts/ConductLargeGroupMeetings';

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
  menuItems?: BlogMenuItemType[];
};

export const BlogPosts: Record<string, BlogPost> = {
  'conduct-large-group-online-meetings': {
    slug: 'conduct-large-group-online-meetings',
    title: 'posts.conduct-large-group-online-meetings.title',
    image: '/img/web/blog/conduct/women-meeting.jpg',
    description: 'posts.conduct-large-group-online-meetings.description',
    subtitle: 'posts.conduct-large-group-online-meetings.subtitle',
    content: ConductLargeGroupMeetings,
    author: 'posts.conduct-large-group-online-meetings.author',
    dateAndDuration: 'posts.conduct-large-group-online-meetings.date-and-duration',
    datePublishedTimestamp: 1702893825,
    dateModifiedTimestamp: 1702893825
  },
  'comparing-online-meetings-stooa-fishbowl': {
    slug: 'comparing-online-meetings-stooa-fishbowl',
    title: 'posts.comparing-online-meetings-stooa-fishbowl.title',
    image: '/img/web/blog/compare/dog-fishbowl.jpeg',
    description: 'posts.comparing-online-meetings-stooa-fishbowl.description',
    subtitle: 'posts.comparing-online-meetings-stooa-fishbowl.subtitle',
    content: ComparingOnlineMeetings,
    author: 'posts.comparing-online-meetings-stooa-fishbowl.author',
    dateAndDuration: 'posts.comparing-online-meetings-stooa-fishbowl.date-and-duration',
    datePublishedTimestamp: 1702893825,
    dateModifiedTimestamp: 1702893825
  },
  '3-innovative-dynamics-for-retros': {
    slug: '3-innovative-dynamics-for-retros',
    title: 'posts.3-innovative-dynamics-for-retros.title',
    description: 'posts.3-innovative-dynamics-for-retros.description',
    subtitle: 'posts.3-innovative-dynamics-for-retros.subtitle',
    image: '/img/web/blog/retros/darts-og.jpg',
    content: InnovativeRetroDynamics,
    author: 'posts.3-innovative-dynamics-for-retros.author',
    dateAndDuration: 'posts.3-innovative-dynamics-for-retros.date-and-duration',
    datePublishedTimestamp: 1701252055,
    dateModifiedTimestamp: 1701252055
  },
  '5-tips-boost-participation-online-meetings': {
    slug: '5-tips-boost-participation-online-meetings',
    title: 'posts.5-tips-boost-participation-online-meetings.title',
    image: '/img/web/blog/improve/improve-og.jpg',
    description: 'posts.5-tips-boost-participation-online-meetings.description',
    subtitle: 'posts.5-tips-boost-participation-online-meetings.subtitle',
    content: ImproveOnlineMeetings,
    author: 'posts.5-tips-boost-participation-online-meetings.author',
    dateAndDuration: 'posts.5-tips-boost-participation-online-meetings.date-and-duration',
    datePublishedTimestamp: 1700477847,
    dateModifiedTimestamp: 1700477847
  }
};

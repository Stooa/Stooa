/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User } from '@/types/user';

export type Fishbowl = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  locale: string;
  host?: User;
  currentStatus: string;
  participants?: (
    first?: number,
    last?: number,
    before?: string,
    after?: string
  ) => ParticipantConnection;
  startDateTimeTz: string;
  endDateTimeTz: string;
  durationFormatted: string;
};

type ParticipantConnection = {
  edges?: ParticipantEdge[];
  pageInfo: ParticipantPageInfo;
  totalCount: number;
};

type ParticipantEdge = {
  node?: Participant;
  cursor: string;
};

type ParticipantPageInfo = {
  endCursor?: string;
  startCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type Participant = {
  id: string;
  user?: UserItem;
  guest?: Guest;
  lastPing: string;
  fishbowl?: Fishbowl;
};

type Guest = {
  id: string;
};

type UserItem = {
  id: string;
  name: string;
  surnames: string;
  email: string;
  locale: string;
  publicLinkedinProfile?: string;
  publicTwitterProfile?: string;
};

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User } from '@/types/user';
import { Fishbowl as apiPlatformFishbowl } from './api-platform/interfaces/fishbowl';
import { faker } from '@faker-js/faker';

export interface Fishbowl extends Omit<apiPlatformFishbowl, 'startDateTimeTz' | 'endDateTimeTz'> {
  startDateTimeTz: string;
  endDateTimeTz: string;
}

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

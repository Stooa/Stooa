/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Participant } from '@/types/api-platform/interfaces/participant';
import { Feedback } from '@/types/api-platform/interfaces/feedback';
import {User} from "@/types/api-platform/interfaces/user";

export interface Fishbowl {
  '@id'?: string;
  'name'?: string;
  'description'?: string;
  'startDateTime': Date;
  'timezone': string;
  'locale': string;
  'duration': Date;
  'isFishbowlNow'?: boolean;
  'hasIntroduction'?: boolean;
  'hasInvitationInfo'?: boolean;
  'invitationTitle'?: string;
  'invitationSubtitle'?: string;
  'invitationText'?: string;
  'isPrivate'?: boolean;
  'plainPassword'?: string;
  readonly 'slug': string;
  readonly 'host': User|string;
  readonly 'currentStatus'?: string;
  readonly 'participants'?: Participant[];
  readonly 'feedbacks'?: Feedback[];
  readonly 'startDateTimeTz'?: Date;
  readonly 'endDateTimeTz'?: Date;
  readonly 'durationFormatted'?: string;
}

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { atcb_action } from 'add-to-calendar-button';

import { Fishbowl } from '@/types/api-platform';
import { formatDateTime } from '@/lib/helpers';
import { ROUTE_FISHBOWL } from '@/app.config';
import { StyledCalendarButtonWrapper } from './styles';
import { useRef } from 'react';

interface Props {
  fishbowl: Fishbowl;
}

type IConfig = Parameters<typeof atcb_action>[0];

export const CustomAddToCalendarButton = ({ fishbowl }: Props) => {
  const calendarButton = useRef<HTMLButtonElement>(null);

  const { month, day, year, time } = formatDateTime(fishbowl.startDateTimeTz);
  const { time: endTime } = formatDateTime(fishbowl.endDateTimeTz);

  const starDateToCalendar = `${year}-${month}-${day}`;
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${ROUTE_FISHBOWL}/${fishbowl.slug}`;
  const eventDescription = `JOIN HERE: ${eventUrl}\n\n${fishbowl.description}`;

  const config: IConfig = {
    name: fishbowl.name || '',
    description: eventDescription,
    startDate: starDateToCalendar,
    startTime: time,
    endTime: endTime,
    location: eventUrl,
    organizer: 'Stooa|stooa@stooa.com',
    buttonsList: true,
    hideBackground: true,
    hideCheckmark: true,
    hideIconModal: true
  };

  const googleConfig: IConfig = { ...config, options: ['Google'] };
  const appleConfig: IConfig = { ...config, options: ['Apple'] };

  return (
    <StyledCalendarButtonWrapper>
      <button
        ref={calendarButton}
        onClick={() => atcb_action(googleConfig, calendarButton.current ?? undefined)}
      >
        Google
      </button>
      <button
        ref={calendarButton}
        onClick={() => atcb_action(appleConfig, calendarButton.current ?? undefined)}
      >
        Apple
      </button>
    </StyledCalendarButtonWrapper>
  );
};

export default CustomAddToCalendarButton;

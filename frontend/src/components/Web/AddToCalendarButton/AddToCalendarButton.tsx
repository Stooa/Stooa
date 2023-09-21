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
import Button from '@/components/Common/Button';

interface Props {
  fishbowl: Fishbowl;
}

type IConfig = Parameters<typeof atcb_action>[0];

export const CustomAddToCalendarButton = ({ fishbowl }: Props) => {
  const calendarButton = useRef<HTMLButtonElement>(null);

  const {
    month: startMonth,
    day: startDay,
    year: startYear,
    time: startTime
  } = formatDateTime(fishbowl.startDateTimeTz);
  const {
    month: endMonth,
    day: endDay,
    year: endYear,
    time: endTime
  } = formatDateTime(fishbowl.endDateTimeTz);

  const starDateToCalendar = `${startYear}-${startMonth}-${startDay}`;
  const endDateToCalendar = `${endYear}-${endMonth}-${endDay}`;
  const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${ROUTE_FISHBOWL}/${fishbowl.slug}`;
  const eventDescription = `JOIN HERE: ${eventUrl}\n\n${fishbowl.description}`;

  const config: IConfig = {
    name: fishbowl.name || '',
    description: eventDescription,
    startDate: starDateToCalendar,
    startTime: startTime,
    endDate: endDateToCalendar,
    endTime: endTime,
    location: eventUrl,
    organizer: 'Stooa|stooa@stooa.com',
    buttonsList: true,
    hideBackground: true,
    hideCheckmark: true
  };

  const googleConfig: IConfig = { ...config, options: ['Google'] };
  const appleConfig: IConfig = { ...config, options: ['Apple'] };

  return (
    <StyledCalendarButtonWrapper>
      <Button
        variant="link"
        ref={calendarButton}
        onClick={() => atcb_action(googleConfig, calendarButton.current ?? undefined)}
      >
        Google
      </Button>
      <Button
        variant="link"
        ref={calendarButton}
        onClick={() => atcb_action(appleConfig, calendarButton.current ?? undefined)}
      >
        Apple
      </Button>
    </StyledCalendarButtonWrapper>
  );
};

export default CustomAddToCalendarButton;

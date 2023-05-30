/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SEATS_CHANGE, NOTIFICATION, NOTIFICATION_CLOSE, USER_MUST_LEAVE } from '@/jitsi/Events';
import conferenceRepository from '@/jitsi/Conference';
import { dispatchEvent, removeItem } from '@/lib/helpers';
import { useJitsiStore } from '@/store';

export const useSeats = () => {
  const { seats, createSeats } = useJitsiStore();

  const create = number => {
    const seats = createSeats(number);

    console.log('[STOOA] Seats created', number);

    return seats;
  };

  const getIds = () => {
    const ids = seats.filter(seat => seat !== null);

    console.log('[STOOA] Seats occupied by', ids);

    return ids;
  };

  const getSeat = id => {
    if (id === undefined) {
      id = conferenceRepository.getMyUserId();
    }

    return seats.indexOf(id) + 1;
  };

  const getSeats = () => {
    return seats;
  };

  const hasFreeSeat = () => getSeat(null) > 0;

  const _handleDispatchEvent = () => {
    dispatchEvent(SEATS_CHANGE, { seats: hasFreeSeat(), seatsValues: getSeats() });
  };

  const join = id => {
    const seat = getSeat(null);

    if (seat <= 0) return;

    if (id === undefined) {
      id = conferenceRepository.getMyUserId();
    }

    const participantName = conferenceRepository.getParticipantNameById(id);
    const seatHtml = document.getElementById(`seat-${seat}`);

    if (!seatHtml) return;

    seatHtml.setAttribute('data-username', participantName);
    seatHtml.setAttribute('data-id', id);
    seatHtml.classList.add('user-joined');

    seats[seat - 1] = id;

    _handleDispatchEvent(id);

    if (!hasFreeSeat()) {
      const notificationUsers = removeItem(getIds(), id);

      dispatchEvent(NOTIFICATION, {
        type: USER_MUST_LEAVE,
        seats: notificationUsers,
        message: 'notification.emptySeats'
      });
    }

    console.log(
      '[STOOA] Join seat',
      seat,
      '| Seats left',
      seats.reduce((carry, seat) => carry + (seat === null ? 1 : 0), 0)
    );

    return seat;
  };

  const _clearGeneratedClasses = (el, needle = 'user-') =>
    el.className
      .split(' ')
      .filter(item => !item.startsWith(needle))
      .join(' ');

  const leave = id => {
    if (id === undefined) {
      id = conferenceRepository.getMyUserId();
    }

    const seat = getSeat(id);

    if (seat <= 0) return;

    const seatHtml = document.getElementById(`seat-${seat}`);

    if (seatHtml !== null) {
      seatHtml.className = _clearGeneratedClasses(seatHtml);
      seatHtml.removeAttribute('data-username');
      seatHtml.removeAttribute('data-id');
    }

    if (!hasFreeSeat()) {
      dispatchEvent(NOTIFICATION_CLOSE, { type: USER_MUST_LEAVE });
    }

    seats[seat - 1] = null;

    _handleDispatchEvent();

    console.log(
      '[STOOA] Leave seat',
      seat,
      seats.reduce((carry, seat) => carry + (seat === null ? 1 : 0), 0)
    );

    return seat;
  };

  const updateStatus = (id, status) => {
    const seat = getSeat(id);

    if (seat <= 0) return;

    const seatHtml = document.getElementById(`seat-${seat}`);

    if (seatHtml === null) return;

    seatHtml.className = _clearGeneratedClasses(seatHtml, 'user-status-');

    if (status) {
      seatHtml.classList.add(`user-status-${status}`);
    }
  };

  const updateDominantSpeaker = id => {
    const seat = getSeat(id);
    const seatsHtml = document.querySelectorAll('[id^="seat-"]');
    const seatHtml = document.getElementById(`seat-${seat}`);

    // Some times, first render doesn't find HTML Element
    if (seatHtml) {
      seatsHtml.forEach(item => item.classList.remove('user-dominant'));
      seatHtml.classList.add('user-dominant');
      console.log('[STOOA] Dominant speaker changed', id);
    }
  };

  const getParticipantIdBySeat = seat => {
    const seatHtml = document.getElementById(`seat-${seat}`);

    if (!seatHtml.hasAttribute('data-id')) {
      return null;
    }

    return seatHtml.getAttribute('data-id');
  };

  return {
    create,
    getIds,
    getSeat,
    getSeats,
    getParticipantIdBySeat,
    hasFreeSeat,
    join,
    leave,
    updateStatus,
    updateDominantSpeaker
  };
};

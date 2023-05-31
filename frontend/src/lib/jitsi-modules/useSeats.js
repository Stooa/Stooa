/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SEATS_CHANGE, NOTIFICATION, NOTIFICATION_CLOSE, USER_MUST_LEAVE } from '@/jitsi/Events';
import { useConference } from '@/jitsi';
import { dispatchEvent, removeItem } from '@/lib/helpers';
import { useJitsiStore } from '@/store';

export const useSeats = () => {
  const { seats, createSeats, findEmptySeat, count, getOccupiedSeats, sit, stand } =
    useJitsiStore();
  const { getMyUserId } = useConference();

  const create = number => {
    const seats = createSeats(number);

    console.log('[STOOA] Seats created', number);

    return seats;
  };

  const getIds = () => {
    const ids = getOccupiedSeats();

    console.log('[STOOA] Seats occupied by', ids);

    return ids;
  };

  const getSeat = id => {
    return findSeat(id ?? getMyUserId());
  };

  const getSeats = () => {
    return seats;
  };

  const hasFreeSeat = () => count() > 0;

  const _handleDispatchEvent = () => {
    dispatchEvent(SEATS_CHANGE, { seats: hasFreeSeat(), seatsValues: getSeats() });
  };

  const join = (id, participantName) => {
    const seat = findEmptySeat();

    if (seat === undefined) return;

    if (id === undefined) {
      id = getMyUserId();
    }

    const seatHtml = document.getElementById(`seat-${seat}`);

    if (!seatHtml) return;

    seatHtml.setAttribute('data-username', participantName);
    seatHtml.setAttribute('data-id', id);
    seatHtml.classList.add('user-joined');

    sit(id, seat);

    _handleDispatchEvent(id);

    const count = count();

    if (count === 0) {
      dispatchEvent(NOTIFICATION, {
        type: USER_MUST_LEAVE,
        seats: removeItem(getIds(), id),
        message: 'notification.emptySeats'
      });
    }

    console.log('[STOOA] Join seat', seat, '| Seats left', count);

    return seat;
  };

  const _clearGeneratedClasses = (el, needle = 'user-') =>
    el.className
      .split(' ')
      .filter(item => !item.startsWith(needle))
      .join(' ');

  const leave = id => {
    if (id === undefined) {
      id = getMyUserId();
    }

    const seat = getSeat(id);

    if (seat === undefined) return;

    const seatHtml = document.getElementById(`seat-${seat}`);

    if (seatHtml !== null) {
      seatHtml.className = _clearGeneratedClasses(seatHtml);
      seatHtml.removeAttribute('data-username');
      seatHtml.removeAttribute('data-id');
    }

    if (!hasFreeSeat()) {
      dispatchEvent(NOTIFICATION_CLOSE, { type: USER_MUST_LEAVE });
    }

    stand(seat);

    _handleDispatchEvent();

    console.log('[STOOA] Leave seat', seat, count());

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

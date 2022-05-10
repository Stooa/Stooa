/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { screen, render, act, fireEvent } from '@testing-library/react';
import ButtonContextMenu from '@/components/App/ButtonContextMenu';
import { useStateValue } from '@/contexts/AppContext';
import { useStooa } from '@/contexts/StooaManager';
import conferenceRepository from '@/jitsi/Conference';
import { mapObjectArray } from '../../../test-utils';
import { CONFERENCE_RUNNING } from '@/jitsi/Status';
import { PARTICIPANT_TEST_CASES, SEAT_TEST_CASES } from './cases';

jest.mock('@/contexts/StooaManager');
jest.mock('@/contexts/AppContext');

describe('Tests with initial participant', () => {
  const testCases = mapObjectArray(PARTICIPANT_TEST_CASES);

  test.each(testCases)(
    'When moderator %p, is current user %p, conference ready is %p, fishbowl ready %p, conferenceStatus %p, should button render %p',
    (
      isModerator,
      isCurrentUser,
      conferenceReady,
      fishbowlReady,
      conferenceStatus,
      shouldRender
    ) => {
      useStooa.mockReturnValue({ isModerator, conferenceReady });

      useStateValue.mockReturnValue([{ fishbowlReady, conferenceStatus }, () => jest.fn()]);

      const participant = {
        id: '12345',
        name: 'test',
        isModerator,
        isCurrentUser
      };

      jest
        .spyOn(conferenceRepository, 'getParticipantById')
        .mockImplementation(() => participant.id);

      render(<ButtonContextMenu initialParticipant={participant} />);

      const button = screen.queryByTestId('wrapper-context-menu');

      if (shouldRender) {
        expect(button).toBeInTheDocument();
      } else {
        expect(button).not.toBeInTheDocument();
      }
    }
  );
});

describe('Tests with seat number', () => {
  const testCases = mapObjectArray(SEAT_TEST_CASES);

  test.each(testCases)(
    'When moderator %p, conference ready is %p, fishbowl ready %p, conferenceStatus %p, in seat number %p, should button render %p',
    async (
      isModerator,
      conferenceReady,
      fishbowlReady,
      conferenceStatus,
      seatNumber,
      shouldRender
    ) => {
      useStooa.mockReturnValue({ isModerator, conferenceReady });

      useStateValue.mockReturnValue([{ fishbowlReady, conferenceStatus }, () => jest.fn()]);

      jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => '123456');

      const seatsValues = ['123456', null, null, null, null];
      const changeSeatEvent = new CustomEvent('seats:change', { detail: { seatsValues } });

      render(<ButtonContextMenu seatNumber={seatNumber} />);

      act(() => {
        dispatchEvent(changeSeatEvent);
      });

      const button = screen.queryByTestId('wrapper-context-menu');

      if (shouldRender) {
        return expect(button).toBeInTheDocument();
      } else {
        return expect(button).not.toBeInTheDocument();
      }
    }
  );
});

describe('User clicks on button and show available context menu options', () => {
  it('should show button', () => {
    useStooa.mockReturnValue({ isModerator: true, conferenceReady: true });

    useStateValue.mockReturnValue([
      { fishbowlReady: true, conferenceStatus: CONFERENCE_RUNNING },
      () => jest.fn()
    ]);

    const participant = {
      id: '12345',
      name: 'test',
      isModerator: true,
      isCurrentUser: false
    };

    jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => participant.id);

    render(<ButtonContextMenu initialParticipant={participant} />);

    const button = screen.getByTestId('button-context-menu');

    fireEvent.click(button);

    const contextMenu = screen.getByTestId('context-menu');

    expect(contextMenu).toBeInTheDocument();
  });

  it('should show button in seat', () => {
    useStooa.mockReturnValue({ isModerator: true, conferenceReady: true });

    useStateValue.mockReturnValue([
      { fishbowlReady: true, conferenceStatus: CONFERENCE_RUNNING },
      () => jest.fn()
    ]);

    const participant = {
      id: '12345',
      name: 'test',
      isModerator: true,
      isCurrentUser: false
    };

    jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => participant.id);

    const changeSeatEvent = new CustomEvent('seats:change', {
      detail: { seatsValues: ['12345', null, null, null, null] }
    });

    render(<ButtonContextMenu seatNumber={1} />);

    act(() => {
      dispatchEvent(changeSeatEvent);
    });

    const button = screen.getByTestId('button-context-menu');

    fireEvent.click(button);
    const contextMenu = screen.getByTestId('context-menu');

    expect(contextMenu).toBeInTheDocument();
  });

  it('should show button in seat and click kick', () => {
    useStooa.mockReturnValue({
      isModerator: true,
      conferenceReady: true,
      setParticipantToKick: jest.fn()
    });

    useStateValue.mockReturnValue([
      { fishbowlReady: true, conferenceStatus: CONFERENCE_RUNNING },
      () => jest.fn()
    ]);

    const participant = {
      id: '12345',
      name: 'test',
      isModerator: true,
      isCurrentUser: false
    };

    jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => participant.id);

    const changeSeatEvent = new CustomEvent('seats:change', {
      detail: { seatsValues: ['12345', null, null, null, null] }
    });

    render(<ButtonContextMenu seatNumber={1} />);

    act(() => {
      dispatchEvent(changeSeatEvent);
    });

    const button = screen.getByTestId('button-context-menu');

    fireEvent.click(button);
    const contextMenu = screen.getByTestId('context-menu');
    expect(contextMenu).toBeInTheDocument();

    const kickButton = screen.getByTestId('kick-button');
    expect(kickButton).toBeInTheDocument();
  });
});

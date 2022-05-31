/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {screen, render} from '@testing-library/react';
import ButtonContextMenu from '@/components/App/ButtonContextMenu';
import { useStateValue } from '@/contexts/AppContext';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus } from '@/jitsi/Status';
import conferenceRepository from '@/jitsi/Conference';

jest.mock('@/contexts/StooaManager');
jest.mock('@/contexts/AppContext');
jest.mock('@/ui/svg/dots.svg', () => () => <></>);

describe('Button Context Menu', () => {
  it('It doesnt render when a moderator fishbowl is not ready', () => {

    useStooa.mockReturnValue({ isModerator: true });

    useStateValue.mockReturnValue([
      { fishbowlReady: false, conferenceStatus: IConferenceStatus.NOT_STARTED },
      () => jest.fn(),
    ]);

    render(<ButtonContextMenu initialParticipant={null}/>)

    const button = screen.queryByTestId('button-context-menu');

    expect(button).not.toBeInTheDocument()
  });

  it('It renders moderator with initial participant', () => {

    useStooa.mockReturnValue({ isModerator: true, setParticipantToKick: false, conferenceReady: true });

    useStateValue.mockReturnValue([
      { fishbowlReady: true, conferenceStatus: IConferenceStatus.RUNNING },
      () => jest.fn(),
    ]);

    const participant = {
      id: '12345',
      name: 'test',
      isModerator: true,
      isCurrentUser: false
    }

    jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => participant.id);

    render(<ButtonContextMenu initialParticipant={participant}/>)

    const button = screen.queryByTestId('button-context-menu');

    expect(button).toBeInTheDocument()
  });

  it('It doesnt render when initial participant is current user ', () => {
    useStooa.mockReturnValue({ isModerator: true, setParticipantToKick: false, conferenceReady: true });

    useStateValue.mockReturnValue([
      { fishbowlReady: true, conferenceStatus: IConferenceStatus.RUNNING },
      () => jest.fn(),
    ]);

    const participant = {
      id: '12345',
      name: 'test',
      isModerator: true,
      isCurrentUser: true
    }

    jest.spyOn(conferenceRepository, 'getParticipantById').mockImplementation(() => participant.id);

    render(<ButtonContextMenu initialParticipant={participant}/>)

    const button = screen.queryByTestId('button-context-menu');

    expect(button).not.toBeInTheDocument()

  });
});

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useEventListener from '@/hooks/useEventListener';
import Conference from '@/jitsi/Conference';
import { CONFERENCE_BREAKOUT_ROOMS_UPDATED, CONNECTION_ESTABLISHED_FINISHED } from '@/jitsi/Events';
import { useState } from 'react';

const BreakoutRooms = () => {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState({});

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    setRooms(handleBreakoutRooms());
  });

  useEventListener(CONFERENCE_BREAKOUT_ROOMS_UPDATED, () => {
    setRooms(handleBreakoutRooms());
  });

  const handleBreakoutRooms = () => {
    const { room, _rooms } = Conference.getBreakoutRooms();
    console.log(_rooms, room);

    return _rooms;
  };

  const handleCreateBreakoutRoom = () => {
    Conference.createBreakoutRoom(roomName);
    handleBreakoutRooms();
  };

  return (
    <div>
      <input type="text" onChange={value => setRoomName(value.target.value)} />
      <button onClick={handleCreateBreakoutRoom}>create room</button>

      <div>
        {rooms &&
          Object.keys(rooms).map(room => (
            <div key={room}>
              {rooms[room].isMainRoom ? 'main' : rooms[room].name}{' '}
              <button onClick={() => Conference.joinRoom(room)}>JOIN</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BreakoutRooms;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Conference from '@/jitsi/Conference';
import { Participant } from '@/types/participant';
import React, { useState } from 'react';

interface Props {
  initialParticipant: { _connectionJid: string };
}

export const SendToRoomButton = ({ initialParticipant }: Props) => {
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState({});

  const handleButtonClick = () => {
    const { _rooms } = Conference.getBreakoutRooms();
    console.log('LAS RUMS', _rooms);
    setRooms(_rooms);
    setShowRooms(!showRooms);
  };

  const handleSendToRoom = roomId => {
    console.log('INITIAL PARTICIPANT', initialParticipant);
    console.log('ROOM ID ---->', roomId);
    Conference.sendParticipantToRoom(initialParticipant._connectionJid, roomId);
  };

  return (
    <>
      <div>
        <button onClick={handleButtonClick}>Send to room</button>
      </div>
      {showRooms && rooms && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            height: '204px',
            right: '64px',
            backgroundColor: '#ede3d5',
            padding: '16px'
          }}
        >
          {Object.keys(rooms).map(room => (
            <div key={room} style={{ marginBottom: '16px' }}>
              {rooms[room].name} <button onClick={() => handleSendToRoom(room)}>JOIN</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

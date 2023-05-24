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
  initialParticipant: Participant;
}

export const SendToRoomButton = ({ initialParticipant }: Props) => {
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState({});

  const handleButtonClick = () => {
    setRooms(Conference.getBreakoutRooms()._rooms);
    setShowRooms(!showRooms);
  };

  const handleSendToRoom = roomId => {
    Conference.sendParticipantToRoom(initialParticipant.id, roomId);
  };

  return (
    <>
      <div>
        <button onClick={handleButtonClick}>Send to room</button>
      </div>
      {showRooms && rooms && (
        <div>
          {Object.keys(rooms).map(room => (
            <div
              style={{
                position: 'absolute',
                top: '24px',
                right: '64px',
                backgroundColor: '#e1e2d5',
                padding: '16px'
              }}
              key={room}
            >
              {rooms[room].name} <button onClick={() => handleSendToRoom(room)}>JOIN</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

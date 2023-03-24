/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useWindowSize } from '@/hooks/useWIndowSize';
import { TranscriptionMessageType } from '@/types/transcriptions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledTextContainer } from './styles';

interface Props {
  messageData: TranscriptionMessageType;
  messageId: string;
}

export const TranscriptedText = ({ messageData, messageId }: Props) => {
  const [maxWidth, setMaxWidth] = useState(100);
  const textRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const calculateSeatWidth = useCallback((): number => {
    const seatHTML = document.querySelector('.seat');
    const seatPosition = seatHTML?.getBoundingClientRect();
    if (seatPosition?.width) return seatPosition?.width - 120;
    return 0;
  }, [width]);

  const positionTranscriptMessageReceived = (id: string) => {
    const seatHTML = document.querySelector(`.seat[data-id="${id}"]`);
    const seatPosition = seatHTML?.getBoundingClientRect();

    if (textRef.current && seatPosition) {
      textRef.current.style.bottom = `${seatPosition?.bottom - 40}px`;
      textRef.current.style.left = `${seatPosition?.left + 100}px`;
    }
  };

  useEffect(() => {
    setMaxWidth(calculateSeatWidth());
  }, [calculateSeatWidth]);

  useEffect(() => {
    positionTranscriptMessageReceived(messageData.userId);
  }, []);

  return (
    <StyledTextContainer
      key={messageId}
      style={{ '--max-width': maxWidth + 'px' } as React.CSSProperties}
      ref={textRef}
    >
      {messageData && <div>{messageData.text}</div>}
    </StyledTextContainer>
  );
};

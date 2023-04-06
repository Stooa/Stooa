/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useStooa } from '@/contexts/StooaManager';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { TranscriptionMessageType } from '@/types/transcriptions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledTextContainer } from './styles';

interface Props {
  messageData: TranscriptionMessageType;
  userId: string;
}

export const TranscriptedText = ({ messageData, userId }: Props) => {
  const [maxWidth, setMaxWidth] = useState(100);
  const [textToShow, setTextToShow] = useState(messageData.text);
  const textRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { participantsActive } = useStooa();

  const calculateSeatWidth = useCallback((): number => {
    const seatHTML = document.querySelector('.seat');
    const seatPosition = seatHTML?.getBoundingClientRect();
    if (seatPosition?.width) return seatPosition?.width - 120;
    return 0;
  }, [width, participantsActive]);

  const positionTranscriptMessageReceived = (id: string) => {
    const seatHTML = document.querySelector(`.seat[data-id="${id}"]`);
    const seatPosition = seatHTML?.getBoundingClientRect();

    if (textRef.current && seatPosition) {
      textRef.current.style.bottom = `${seatPosition?.bottom - 40}px`;
      textRef.current.style.left = `${seatPosition?.left + 100}px`;
    }
  };

  const scrollToBottom = () => {
    if (textRef.current) {
      const textElement = textRef.current.querySelector('#transcription-text');
      console.log(textElement?.getBoundingClientRect().height);
      textRef.current.scrollTo(0, textElement?.getBoundingClientRect().height || 0);
    }
  };

  useEffect(() => {
    setMaxWidth(calculateSeatWidth());
  }, [calculateSeatWidth]);

  useEffect(() => {
    positionTranscriptMessageReceived(userId);
  }, []);

  useEffect(() => {
    scrollToBottom();

    setTextToShow(messageData.text);

    const timeOut = setTimeout(() => {
      setTextToShow('');
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [messageData]);

  if (!textToShow) {
    return null;
  }
  return (
    <StyledTextContainer
      key={userId}
      style={{ '--max-width': maxWidth + 'px' } as React.CSSProperties}
      ref={textRef}
    >
      <div id="transcription-text" dangerouslySetInnerHTML={{ __html: textToShow }}></div>
    </StyledTextContainer>
  );
};

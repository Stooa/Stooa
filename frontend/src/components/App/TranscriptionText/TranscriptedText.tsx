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
import { BREAKPOINTS } from '@/ui/settings';

interface Props {
  messageData: TranscriptionMessageType;
  userId: string;
}

export const TranscriptedText = ({ messageData, userId }: Props) => {
  const [maxWidth, setMaxWidth] = useState(100);
  const [textToShow, setTextToShow] = useState(messageData.text);
  const [positioned, setPositioned] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { participantsActive } = useStooa();

  const calculateSeatWidth = useCallback((): number => {
    const seatHTML = document.querySelector('.seat');
    const seatPosition = seatHTML?.getBoundingClientRect();
    if (seatPosition?.width) {
      if (width && width < BREAKPOINTS.tablet) {
        return seatPosition?.width - 8;
      }
      return seatPosition?.width - 64;
    }
    return 0;
  }, [width, participantsActive]);

  const positionTranscriptMessageReceived = (id: string) => {
    const seatHTML = document.querySelector(`.seat[data-id="${id}"]`);
    const seatPosition = seatHTML?.getBoundingClientRect();

    if (textRef.current && seatPosition) {
      textRef.current.style.top = `${seatPosition?.top + seatPosition?.height - 80 - 100}px`;
      if (width && width < BREAKPOINTS.tablet) {
        textRef.current.style.left = `${seatPosition?.left + 4}px`;
      } else {
        textRef.current.style.left = `${seatPosition?.left + 32}px`;
      }
      setPositioned(true);
    }
  };

  const scrollToBottom = () => {
    if (textRef.current) {
      const textElement = textRef.current.querySelector('#transcription-text');
      textRef.current.scrollTo(0, textElement?.getBoundingClientRect().height || 0);
    }
  };

  useEffect(() => {
    setMaxWidth(calculateSeatWidth());
  }, [calculateSeatWidth]);

  useEffect(() => {
    positionTranscriptMessageReceived(userId);

    return () => {
      setPositioned(false);
    };
  }, []);

  useEffect(() => {
    positionTranscriptMessageReceived(userId);

    setTextToShow(messageData.text);

    scrollToBottom();

    const timeOut = setTimeout(() => {
      setTextToShow('');
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [messageData, userId]);

  return (
    <StyledTextContainer
      key={userId}
      className={!positioned || textToShow.length < 1 ? 'hidden' : ''}
      style={{ '--max-width': maxWidth + 'px' } as React.CSSProperties}
      ref={textRef}
    >
      <div id="transcription-text" dangerouslySetInnerHTML={{ __html: textToShow }}></div>
    </StyledTextContainer>
  );
};

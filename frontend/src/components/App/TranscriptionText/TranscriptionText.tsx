/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useDebounce from '@/hooks/useDebouce';
import useEventListener from '@/hooks/useEventListener';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledTextContainer } from './styles';

const TranscriptionText = () => {
  const [textToShow, setTextToShow] = useState('');
  const [maxWidth, setMaxWidth] = useState(100);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const handleTranscriptionMessageReceived = (text: string, id: string) => {
    const seatHTML = document.querySelector(`.seat[data-id="${id}"]`);
    const seatPosition = seatHTML?.getBoundingClientRect();

    if (textWrapperRef.current && seatPosition) {
      textWrapperRef.current.style.bottom = `${seatPosition?.bottom - 40}px`;
      textWrapperRef.current.style.left = `${seatPosition?.left + 100}px`;
    }

    setTextToShow(text);
  };

  const calculateSeatWidth = useCallback((): number => {
    const seatHTML = document.querySelector('.seat');
    const seatPosition = seatHTML?.getBoundingClientRect();
    if (seatPosition?.width) return seatPosition?.width - 120;
    return 0;
  }, [width]);

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { text, voiceParticipant } }) => {
    handleTranscriptionMessageReceived(text, voiceParticipant.id);
  });

  const sentText = useDebounce<string>(textToShow, 2000);

  useEffect(() => {
    if (sentText.length > 0) {
      setTextToShow('');
    }
  }, [sentText]);

  useEffect(() => {
    setMaxWidth(calculateSeatWidth());
  }, [calculateSeatWidth]);

  return (
    <StyledTextContainer
      style={{ '--max-width': maxWidth + 'px' } as React.CSSProperties}
      ref={textWrapperRef}
    >
      {textToShow.length > 0 && <div>{textToShow}</div>}
    </StyledTextContainer>
  );
};

export default TranscriptionText;

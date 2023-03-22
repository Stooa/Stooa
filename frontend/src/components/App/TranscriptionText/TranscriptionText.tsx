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
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { useEffect, useRef, useState } from 'react';
import { StyledTextContainer } from './styles';

const TranscriptionText = () => {
  const [textToShow, setTextToShow] = useState('');
  const textWrapperRef = useRef<HTMLDivElement>(null);

  const handleTranscriptionMessageReceived = (text: string, id: string) => {
    const seatHTML = document.querySelector(`.seat[data-id="${id}"]`);
    const seatPosition = seatHTML?.getBoundingClientRect();

    if (textWrapperRef.current && seatPosition) {
      textWrapperRef.current.style.top = `${seatPosition?.bottom - 124}px`;
      textWrapperRef.current.style.left = `${seatPosition?.left + 100}px`;
    }
  };

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { text, voiceParticipant } }) => {
    handleTranscriptionMessageReceived(text, voiceParticipant.id);
    setTextToShow(text);
  });

  const sentText = useDebounce<string>(textToShow, 3000);

  useEffect(() => {
    if (sentText.length > 0) {
      setTextToShow('');
    }
  }, [sentText]);

  return (
    <StyledTextContainer ref={textWrapperRef}>
      {textToShow.length > 0 && <div>{textToShow}</div>}
    </StyledTextContainer>
  );
};

export default TranscriptionText;

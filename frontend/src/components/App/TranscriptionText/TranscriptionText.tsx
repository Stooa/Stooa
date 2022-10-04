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
import { useEffect, useState } from 'react';
import { StyledTextContainer } from './styles';

const TranscriptionText = () => {
  const [textToShow, setTextToShow] = useState('');

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, text => {
    console.log('Sauriki text', text.detail.text);
    setTextToShow(text.detail.text);
  });

  const sentText = useDebounce<string>(textToShow, 3000);

  useEffect(() => {
    if (sentText.length > 0) {
      setTextToShow('');
    }
  }, [sentText]);

  return (
    <StyledTextContainer>{textToShow.length > 0 && <div>{textToShow}</div>}</StyledTextContainer>
  );
};

export default TranscriptionText;

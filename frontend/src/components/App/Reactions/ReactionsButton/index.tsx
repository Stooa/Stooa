/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { StyledButtonReaction, StyledWrapper } from './styles';
import ReactionsSender from '../ReactionsSender';
import ReactionsButtonSvg from '@/ui/svg/emojis/reactions-button.svg';
import { useWindowSize } from '@/hooks/useWIndowSize';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  disabled?: boolean;
}

const ReactionsButton = ({ disabled }: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const [animation, setAnimation] = useState<'open' | 'close'>('open');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const reactionButtonRef = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation('fishbowl');

  const { width } = useWindowSize();

  const hide = async (ms: number) => {
    setAnimation('close');
    timeOutRef.current = setTimeout(() => setShowReactions(false), ms);
  };

  const show = () => {
    setAnimation('open');
    setShowReactions(true);
  };

  const handleClick = () => {
    if (showReactions && animation === 'open') {
      hide(600);
    } else {
      show();
    }
  };

  const handleOnMouseLeave: MouseEventHandler = e => {
    const target = e.target as HTMLElement;

    if (
      showReactions &&
      animation === 'open' &&
      reactionButtonRef.current &&
      !reactionButtonRef.current.contains(target)
    ) {
      hide(600);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showReactions && wrapperRef.current && !wrapperRef.current.contains(target)) {
        hide(600);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  }, [animation]);

  return (
    <StyledWrapper ref={wrapperRef} data-testid="wrapper-reactions-button">
      {showReactions && (
        <ReactionsSender
          data-testid="reactions-sender"
          className={animation}
          onMouseLeave={width !== undefined && width < 680 ? () => null : handleOnMouseLeave}
        />
      )}
      <StyledButtonReaction
        data-testid="reactions-button"
        disabled={disabled}
        ref={reactionButtonRef}
        onClick={handleClick}
      >
        <ReactionsButtonSvg />
        <div className="label medium">{t('reactions')}</div>
      </StyledButtonReaction>
    </StyledWrapper>
  );
};

export default ReactionsButton;

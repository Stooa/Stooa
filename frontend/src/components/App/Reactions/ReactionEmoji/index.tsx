/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Tooltip from '@/components/Common/Tooltip';
import useTranslation from 'next-translate/useTranslation';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { REACTION_EMOJIS } from '../ReactionsEmojis';
import { StyledEmojiReaction } from './styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  emoji: keyof typeof REACTION_EMOJIS;
  onClick?: (mouseEvent: React.MouseEvent) => void;
  disabled?: boolean;
}

const ReactionEmoji = ({ onClick, emoji, disabled, ...props }: Props) => {
  const reactionRef = useRef<HTMLDivElement>(null);

  const [initialScale, setInitialScale] = useState<number>(1);
  const [size, setSize] = useState<number>(1);
  const [clicked, setClicked] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const { t } = useTranslation('fishbowl');

  const changeCssScaleVariable = (scale: number) => {
    if (reactionRef.current) {
      reactionRef.current.style.setProperty('--emojiScale', scale.toString());
    }

    setSize(scale);
  };

  const handleOnClick: MouseEventHandler = event => {
    if (!disabled && reactionRef.current) {
      setClicked(clicked => clicked + 1);

      const scaleInterval = clicked === 0 ? 0.12 : 0.035;
      const scaleToSet = size < 1.435 ? size + scaleInterval : size;

      changeCssScaleVariable(scaleToSet);

      if (onClick) {
        onClick(event);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setClicked(0);
      changeCssScaleVariable(initialScale);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [clicked, initialScale]);

  useEffect(() => {
    if (reactionRef.current) {
      const cssVariableSize = parseFloat(
        getComputedStyle(reactionRef.current).getPropertyValue('--emojiScale')
      );

      setInitialScale(cssVariableSize);
      setSize(cssVariableSize);
    }
  }, [reactionRef.current]);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => (showTooltip ? setShowTooltip(false) : null)}
    >
      <Tooltip showTooltip={showTooltip}>{t(`reaction.${emoji}`)}</Tooltip>

      <StyledEmojiReaction
        data-testid={`emoji-reaction-${emoji}`}
        ref={reactionRef}
        className={disabled ? 'disabled' : ''}
        id={emoji}
        onClick={handleOnClick}
        {...props}
      >
        {REACTION_EMOJIS[emoji]}
      </StyledEmojiReaction>
    </div>
  );
};

export default ReactionEmoji;

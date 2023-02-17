/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BadSVG from '@/ui/svg/emojis/feedback/bad.svg';
import OkaySVG from '@/ui/svg/emojis/feedback/okay.svg';
import LoveSVG from '@/ui/svg/emojis/feedback/love.svg';
import { StyledLabelOption, StyledSatisfactionForm, StyledSatisfactionWrapper } from './styles';

interface Props {
  onSelectSatisfaction: (level: string) => void;
}

const FeedbackSatisfaction = ({ onSelectSatisfaction }: Props) => {
  const handleClick = (level: string) => {};

  return (
    <StyledSatisfactionWrapper>
      <h4 className="body-sm medium">Give us your feedback</h4>
      <StyledSatisfactionForm>
        <div>
          <input
            type="radio"
            id="Bad"
            name="satisfaction"
            value="Bad"
            onClick={() => onSelectSatisfaction('bad')}
          />
          <StyledLabelOption htmlFor="Bad">
            <BadSVG />
            <p>Bad</p>
          </StyledLabelOption>
        </div>

        <div>
          <input
            type="radio"
            id="okay"
            name="satisfaction"
            value="okay"
            onClick={() => onSelectSatisfaction('okay')}
          />
          <StyledLabelOption htmlFor="okay">
            <OkaySVG />
            <p>Okay</p>
          </StyledLabelOption>
        </div>

        <div>
          <input
            type="radio"
            id="awesome"
            name="satisfaction"
            value="awesome"
            onClick={() => onSelectSatisfaction('awesome')}
          />
          <StyledLabelOption htmlFor="awesome">
            <LoveSVG />
            <p>Awesome</p>
          </StyledLabelOption>
        </div>
      </StyledSatisfactionForm>
    </StyledSatisfactionWrapper>
  );
};

export default FeedbackSatisfaction;

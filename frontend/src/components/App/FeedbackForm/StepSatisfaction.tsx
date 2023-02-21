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
import { StyledLabelOption, StyledSatisfactionForm, StyledStepWrapper } from './styles';

interface Props {
  onSelectSatisfaction: (satisfactionLevel: 'sad' | 'neutral' | 'happy') => void;
}

const StepSatisfaction = ({ onSelectSatisfaction }: Props) => {
  return (
    <StyledStepWrapper>
      <h4 className="body-sm medium">Give us your feedback</h4>
      <StyledSatisfactionForm>
        <div>
          <input
            type="radio"
            id="sad"
            name="satisfaction"
            value="sad"
            onClick={() => onSelectSatisfaction('sad')}
          />
          <StyledLabelOption htmlFor="sad">
            <BadSVG />
            <p>Bad</p>
          </StyledLabelOption>
        </div>

        <div>
          <input
            type="radio"
            id="neutral"
            name="satisfaction"
            value="neutral"
            onClick={() => onSelectSatisfaction('neutral')}
          />
          <StyledLabelOption htmlFor="neutral">
            <OkaySVG />
            <p>Okay</p>
          </StyledLabelOption>
        </div>

        <div>
          <input
            type="radio"
            id="happy"
            name="satisfaction"
            value="happy"
            onClick={() => onSelectSatisfaction('happy')}
          />
          <StyledLabelOption htmlFor="happy">
            <LoveSVG />
            <p>Awesome</p>
          </StyledLabelOption>
        </div>
      </StyledSatisfactionForm>
    </StyledStepWrapper>
  );
};

export default StepSatisfaction;

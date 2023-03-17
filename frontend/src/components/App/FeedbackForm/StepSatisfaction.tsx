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
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

interface Props {
  onSelectSatisfaction: (satisfactionLevel: 'sad' | 'neutral' | 'happy') => void;
}

const StepSatisfaction = ({ onSelectSatisfaction }: Props) => {
  const { t } = useTranslation('fishbowl');
  return (
    <StyledStepWrapper key="satisfaction">
      <h4 className="body-sm medium">{t('feedback.satisfactionTitle')}</h4>
      <p className="body-sm description">
        <Trans i18nKey="fishbowl:feedback.satisfactionDescription" components={{ i: <i /> }} />
      </p>
      <StyledSatisfactionForm className="medium">
        <div>
          <input
            type="radio"
            id="sad"
            name="satisfaction"
            value="sad"
            onClick={() => onSelectSatisfaction('sad')}
          />
          <StyledLabelOption data-testid="feedback-notmuch-button" htmlFor="sad">
            <BadSVG />
            {t('feedback.notMuch')}
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
          <StyledLabelOption data-testid="feedback-okay-button" htmlFor="neutral">
            <OkaySVG />
            {t('feedback.okay')}
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
          <StyledLabelOption data-testid="feedback-awesome-button" htmlFor="happy">
            <LoveSVG />
            {t('feedback.great')}
          </StyledLabelOption>
        </div>
      </StyledSatisfactionForm>
    </StyledStepWrapper>
  );
};

export default StepSatisfaction;

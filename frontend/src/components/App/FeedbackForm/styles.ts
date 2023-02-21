/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const stepVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

const AnimatedStep = styled(motion.div).attrs({
  variants: stepVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
})``;

const StyledFormWrapper = styled.div`
  position: absolute;
  bottom: calc(100% + ${space()});
  right: 0;
  width: 380px;
  max-height: 200px;
  padding: ${space(2)} ${space(3)};

  border: 1px solid #e5e5e5;
  border-radius: ${BORDER_RADIUS};
  background-color: ${COLOR_NEUTRO_100};

  color: ${COLOR_NEUTRO_600};
`;

const StyledStepWrapper = styled(AnimatedStep)`
  & h4 {
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space()};
  }
`;

const StyledSatisfactionForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space(2)};

  & input[type='radio'] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
`;

const StyledLabelOption = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & svg {
    margin-bottom: ${space(1)};
    transition: transform 0.2s ease-in-out;
  }

  &:hover {
    cursor: pointer;

    & svg {
      transform: scale(1.05) translateY(-2px);
    }
  }
`;

const StyledCommentForm = styled(AnimatedStep)`
  display: flex;
  flex-direction: column;

  & textarea {
    margin-bottom: ${space(2)};
  }

  & .actions {
    display: flex;
    gap: ${space(2)};
    justify-content: flex-end;
  }
`;

export {
  StyledFormWrapper,
  StyledLabelOption,
  StyledSatisfactionForm,
  StyledStepWrapper,
  StyledCommentForm
};

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
  animate: { opacity: 1, x: 0, transition: { delay: 0.2 } },
  exit: { opacity: 0, x: -100 }
};

const formVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 }
};

const StyledFormWrapper = styled(motion.div).attrs({
  variants: formVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
})`
  overflow: hidden;
  text-align: left;

  &.fishbowl-mobile {
    position: absolute;
    bottom: ${space()};
    right: calc(50% - 150px);

    width: 300px;
    z-index: 30;
  }

  &.fishbowl {
    position: absolute;
    bottom: calc(100% + ${space()});
    right: 0;
    width: 300px;
  }

  &.thankyou {
    max-width: 400px;
    margin: 0 auto;
  }

  border: 1px solid ${COLOR_NEUTRO_700};
  border-radius: ${BORDER_RADIUS};
  background-color: ${COLOR_NEUTRO_100};

  color: ${COLOR_NEUTRO_600};
`;

const StyledStepWrapper = styled(motion.div).attrs({
  variants: stepVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
})<{ nopadding?: boolean }>`
  padding: ${({ nopadding }) => (!nopadding ? `${space(2)} ${space(3)}` : `0`)};

  & h4 {
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space()};
  }

  & .description {
    margin-bottom: ${space(2)};
  }

  & hr {
    height: 1px;
    background-color: ${COLOR_NEUTRO_700};
    border: none;
    margin: 0;
  }
`;

const StyledSatisfactionForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space(2)};

  & > div {
    flex: 1;
  }

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

const StyledCommentForm = styled.form`
  display: flex;
  flex-direction: column;

  & textarea {
    height: 100px;
  }

  & textarea,
  & input {
    margin-bottom: ${space(2)};
  }

  & .actions {
    display: flex;
    gap: ${space(2)};
    justify-content: flex-end;
  }
`;

const StyledThanksTextWrapper = styled.div`
  padding: ${space(2)} ${space(3)};

  & .social-share {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${space(2)};
  }

  & .social-share__buttons {
    display: flex;
    gap: ${space(0.5)};

    & svg {
      width: 25px;
      object-fit: cover;
      & path {
        fill: ${COLOR_NEUTRO_600};
      }
    }
  }
`;

export {
  StyledFormWrapper,
  StyledLabelOption,
  StyledSatisfactionForm,
  StyledStepWrapper,
  StyledCommentForm,
  StyledThanksTextWrapper
};

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { forwardRef } from 'react';
import { InputStyled } from '@/ui/Form';
import { ValidationError, ValidationIcon } from '@/ui/Validation';
import Icon from '../Icon';

type Props = Omit<JSX.IntrinsicElements['textarea'], 'as' | 'type' | 'ref'> & {
  label?: string;
  legend?: string | React.ReactNode;
  hasError?: boolean;
  errorMessage?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  validationError?: string;
  isDirty?: boolean;
};

const NewTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { label, hasError, errorMessage, isValid, isInvalid, validationError, isDirty, ...props },
    ref
  ) => {
    return (
      <InputStyled>
        <textarea
          ref={ref}
          className={`textarea ${isDirty ? 'filled' : ''} ${hasError ? 'invalid' : ''}`}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        ></textarea>
        {isValid && (
          <ValidationIcon>
            <Icon variant="checkmark" />
          </ValidationIcon>
        )}
        <label htmlFor={props.id || props.name}>{label}</label>
        {isInvalid && (
          <>
            <ValidationIcon>
              <Icon variant="cross" />
            </ValidationIcon>
            <ValidationError>{validationError}</ValidationError>
          </>
        )}
        {hasError && errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </InputStyled>
    );
  }
);

export default NewTextarea;

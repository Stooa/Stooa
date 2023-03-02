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
import { FieldError } from 'react-hook-form';

type Props = Omit<JSX.IntrinsicElements['textarea'], 'as' | 'type' | 'ref'> & {
  label?: string;
  legend?: string | React.ReactNode;
  hasError?: FieldError;
  errorMessage?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  validationError?: string;
  isDirty?: boolean;
  counter?: number;
  lengthState?: '' | 'warning' | 'error';
};

const NewTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      hasError,
      errorMessage,
      isValid,
      isInvalid,
      validationError,
      isDirty,
      lengthState,
      counter,
      ...props
    },
    ref
  ) => {
    const showCounter = counter !== undefined && counter > 0;

    return (
      <InputStyled className="textarea">
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
        {showCounter && <span className={`body-xs counter ${lengthState}`}>{counter}</span>}
        {hasError && isDirty && <ValidationError>{errorMessage}</ValidationError>}
      </InputStyled>
    );
  }
);

export default NewTextarea;

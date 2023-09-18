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
import Icon from './Icon';
import { FieldError } from 'react-hook-form';

type Props = Omit<JSX.IntrinsicElements['textarea'], 'as' | 'type' | 'ref'> & {
  className?: string;
  label?: string;
  legend?: string | React.ReactNode;
  hasError?: FieldError;
  errorMessage?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  validationError?: string;
  counter?: number;
  lengthState?: '' | 'warning' | 'error';
  isDirty?: boolean;
  variant?: 'default' | 'large-text';
  placeholderStyle?: 'default' | 'large-text';
  placeholder?: string;
  taller?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      hasError,
      isValid,
      lengthState,
      counter,
      variant = 'default',
      placeholderStyle = 'default',
      placeholder = '',
      className = '',
      isDirty,
      taller = false,
      ...props
    },
    ref
  ) => {
    const showCounter = counter !== undefined && counter > 0;

    return (
      <InputStyled placeholderStyle={placeholderStyle} variant={variant} className="textarea">
        <textarea
          placeholder={placeholder}
          ref={ref}
          className={`textarea ${(props.value !== '' && props.value) || isDirty ? 'filled' : ''} ${
            hasError ? 'invalid' : ''
          } ${!label ? 'no-label' : ''} ${taller ? 'taller' : ''} ${className}`}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        ></textarea>
        {isValid && (
          <ValidationIcon>
            <Icon variant="checkmark" />
          </ValidationIcon>
        )}
        {label && <label htmlFor={props.id || props.name}>{label}</label>}
        {hasError && (
          <>
            <ValidationIcon>
              <Icon variant="cross" />
            </ValidationIcon>
            <ValidationError>{hasError.message}</ValidationError>
          </>
        )}
        {showCounter && <span className={`body-xs counter ${lengthState}`}>{counter}</span>}
      </InputStyled>
    );
  }
);

export default Textarea;

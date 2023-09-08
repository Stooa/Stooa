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
import Icon, { IconVariant } from './Icon';
import { FieldError } from 'react-hook-form';

type Props = Omit<JSX.IntrinsicElements['input'], 'as' | 'ref'> & {
  label?: string;
  placeholder?: string;
  icon?: IconVariant;
  help?: string;
  hasError?: FieldError;
  isValid?: boolean;
  isDirty?: boolean;
  validationError?: string;
  variant?: 'default' | 'small' | 'large-text';
};

const NewInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, hasError, isValid, icon, help, isDirty, variant = 'default', placeholder, ...props },
    ref
  ) => {
    console.log('VAAAAALEEEEEU', props);
    return (
      <InputStyled
        variant={variant}
        className={`${icon ? 'withicon' : ''} ${!label ? 'no-label' : ''}`}
      >
        {icon && <Icon variant={icon} className="icon" />}
        <input
          placeholder={placeholder}
          ref={ref}
          className={` ${(props.value !== '' && props.value) || isDirty ? 'filled' : ''} ${
            hasError ? 'invalid' : ''
          }`}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        />
        {isValid && (
          <ValidationIcon>
            <Icon variant="checkmark" />
          </ValidationIcon>
        )}
        <label htmlFor={props.id || props.name}>{label}</label>
        {hasError && (
          <>
            <ValidationIcon>
              <Icon variant="cross" />
            </ValidationIcon>
            <ValidationError>{hasError.message}</ValidationError>
          </>
        )}
        {help && <p className="help body-sm">{help}</p>}
      </InputStyled>
    );
  }
);

export default NewInput;

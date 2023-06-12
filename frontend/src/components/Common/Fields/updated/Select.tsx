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
import { ValidationError } from '@/ui/Validation';
import Icon, { IconVariant } from '@/components/Common/Fields/Icon';
import { FieldError } from 'react-hook-form';

type Props = Omit<JSX.IntrinsicElements['select'], 'as' | 'type' | 'ref'> & {
  label?: string;
  icon?: IconVariant;
  hasError?: FieldError;
  isValid?: boolean;
  validationError?: string;
  isDirty?: boolean;
  help?: string;
};

const Select = forwardRef<HTMLInputElement, Props>(
  ({ label, hasError, isValid, isDirty, icon, variant, help, ...props }, ref) => {
    return (
      <InputStyled className={`${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''}`}>
        {icon && <Icon variant={icon} className="icon" />}
        <select {...props} className={`${isDirty ? 'filled' : ''} ${!hasError ? 'invalid' : ''}`} />
        <label htmlFor={props.id || props.name}>{label}</label>
        <Icon variant="chevron-down" className="dropdown-icon" />
        {hasError && <ValidationError>{hasError.message}</ValidationError>}
        {help && <p className="help body-sm">{help}</p>}
      </InputStyled>
    );
  }
);

export default Select;

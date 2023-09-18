/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CheckboxStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import { FieldError } from 'react-hook-form';
import { forwardRef } from 'react';

type Props = Omit<JSX.IntrinsicElements['input'], 'as' | 'type' | 'ref'> & {
  id: string;
  label?: string;
  hasError?: FieldError;
  isDirty?: boolean;
  children?: React.ReactNode;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, hasError, children, id, ...props }, ref) => {
    return (
      <CheckboxStyled ref={ref}>
        <input className="switch-checkbox" type="checkbox" id={id} {...props} />
        {label && !children && (
          <label htmlFor={id} className="body-sm" dangerouslySetInnerHTML={{ __html: label }} />
        )}
        {children && !label && (
          <label htmlFor={id} className="body-sm">
            {children}
          </label>
        )}
        {hasError ? <ValidationError>{hasError.message}</ValidationError> : null}
      </CheckboxStyled>
    );
  }
);

export default Checkbox;

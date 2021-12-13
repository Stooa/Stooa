/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Field, FieldAttributes, useField } from 'formik';

import { CheckboxStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';

type Props = {
  label?: string;
} & FieldAttributes<Record<string, unknown>>;

const Checkbox: React.FC<Props> = ({ label, children, ...props }) => {
  const [field, meta] = useField<Record<string, unknown>>({ ...props, type: 'checkbox' });

  return (
    <CheckboxStyled>
      <Field {...field} {...props} type="checkbox" id={props.id || props.name} />
      {label && !children && (
        <label
          htmlFor={props.id || props.name}
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}
      {children && !label && (
        <label htmlFor={props.id || props.name} className="text-sm">
          {children}
        </label>
      )}
      {meta.touched && meta.error ? <ValidationError>{meta.error}</ValidationError> : null}
    </CheckboxStyled>
  );
};

export default Checkbox;

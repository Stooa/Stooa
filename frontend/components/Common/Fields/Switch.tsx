/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { FormEvent } from 'react';

import { Field, FieldAttributes, useField } from 'formik';

import { SwitchLabel, SwitchStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';

type Props = {
  label?: string;
} & FieldAttributes<Record<string, unknown>>;

const Switch = (props: Props) => {
  const [field, meta] = useField<Record<string, unknown>>({ ...props, type: 'checkbox' });

  return (
    <Field {...field} {...props} id={props.id || props.name}>
      <SwitchStyled>
        <input id={`switch-new`} type="checkbox" />
        <SwitchLabel className="switch-label" htmlFor={`switch-new`}>
          <span className={`switch-button`} />
        </SwitchLabel>
        {props.label && <span className="label-text">Quiero intro wacho!</span>}
      </SwitchStyled>
      {meta.touched && meta.error ? <ValidationError>{meta.error}</ValidationError> : null}
    </Field>
  );
};

export default Switch;

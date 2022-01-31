/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { ReactElement, useState } from 'react';
import { Field, FieldAttributes, useField } from 'formik';

import { StyledIntroductionTooltip, SwitchLabel, SwitchStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import Info from '@/ui/svg/info-brown.svg';

type Props = {
  label: string;
  tooltipText: string | ReactElement;
} & FieldAttributes<Record<string, unknown>>;

const Switch: React.FC<Props> = ({ label, tooltipText, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [field, meta] = useField<Record<string, unknown>>({ ...props, type: 'checkbox' });

  return (
    <SwitchStyled>
      <Field
        className="switch-checkbox"
        {...field}
        {...props}
        type="checkbox"
        id={props.id || props.name}
      />
      <SwitchLabel htmlFor={props.id || props.name}>
        <span className={`switch-button`} />
      </SwitchLabel>
      {label && <span className="label-text">{label}</span>}
      <div
        className="icon-wrapper"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && <StyledIntroductionTooltip>{tooltipText}</StyledIntroductionTooltip>}
        <Info />
      </div>
      {meta.touched && meta.error ? <ValidationError>{meta.error}</ValidationError> : null}
    </SwitchStyled>
  );
};

export default Switch;

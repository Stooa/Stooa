/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { ReactElement, useRef, useState } from 'react';
import { Field, FieldAttributes, useField } from 'formik';

import { SwitchLabel, SwitchStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import Info from '@/ui/svg/info-brown.svg';
import ColoredFullTooltip from '../ColoredFullTooltip/ColoredFullTooltip';

type Props = {
  label: string;
  tooltipText: string | ReactElement;
  full?: boolean;
} & FieldAttributes<Record<string, unknown>>;

const Switch = ({ label, tooltipText, full, ...props }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [arrowPosition, setArrowPosition] = useState<string>('');
  const [field, meta] = useField<Record<string, unknown>>({ ...props, type: 'checkbox' });
  const tipToHover = useRef<HTMLDivElement>(null);

  const handleOnMouseEnter: React.MouseEventHandler = () => {
    if (tipToHover.current) {
      const left = tipToHover.current.offsetLeft;
      setArrowPosition(left + 'px');
      setShowTooltip(true);
    }
  };

  return (
    <SwitchStyled full={full}>
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
      <div className="label-wrapper">
        {label && (
          <label htmlFor={props.id || props.name}>
            <span className="label-text">{label}</span>
          </label>
        )}
        <div
          className="icon-wrapper"
          onClick={() => setShowTooltip(showTooltip => !showTooltip)}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={() => setShowTooltip(false)}
          ref={tipToHover}
        >
          {showTooltip && <ColoredFullTooltip arrowPosition={arrowPosition} text={tooltipText} />}
          <Info />
        </div>
      </div>
      {meta.touched && meta.error ? <ValidationError>{meta.error}</ValidationError> : null}
    </SwitchStyled>
  );
};

export default Switch;

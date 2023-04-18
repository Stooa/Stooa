/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { ReactElement, forwardRef, useRef, useState } from 'react';

import { StyledIntroductionTooltip, SwitchLabel, SwitchStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import { FieldError } from 'react-hook-form';
import Info from '@/ui/svg/info-brown.svg';

type Props = Omit<JSX.IntrinsicElements['input'], 'as' | 'type' | 'ref'> & {
  tooltipText?: string | ReactElement;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hasError?: FieldError;
  isValid?: boolean;
  validationError?: string;
  isDirty?: boolean;
};

const Switch = forwardRef<HTMLInputElement, Props>(
  ({ label, tooltipText, isDirty, hasError, ...props }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [arrowPosition, setArrowPosition] = useState<string>();
    const tipToHover = useRef<HTMLDivElement>(null);

    const handleOnMouseEnter: React.MouseEventHandler = () => {
      if (tipToHover.current) {
        const left = tipToHover.current.offsetLeft;
        setArrowPosition(left + 'px');
        setShowTooltip(true);
      }
    };

    return (
      <SwitchStyled ref={ref}>
        <input className="switch-checkbox" type="checkbox" {...props} />
        <SwitchLabel className={props.disabled ? 'disabled' : ''} htmlFor={props.id || props.name}>
          <span className={`switch-button`} />
        </SwitchLabel>
        {label && (
          <div className="label-wrapper">
            <label htmlFor={props.id || props.name}>
              <span className="label-text">{label}</span>
            </label>

            {tooltipText && (
              <div
                className="icon-wrapper"
                onClick={() => setShowTooltip(showTooltip => !showTooltip)}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={() => setShowTooltip(false)}
                ref={tipToHover}
              >
                {showTooltip && (
                  <StyledIntroductionTooltip>
                    <div
                      className="arrow"
                      style={{ '--leftPosition': arrowPosition } as React.CSSProperties}
                    ></div>
                    {tooltipText}
                  </StyledIntroductionTooltip>
                )}
                <Info />
              </div>
            )}
          </div>
        )}
        {isDirty && hasError ? <ValidationError>{hasError.message}</ValidationError> : null}
      </SwitchStyled>
    );
  }
);

export default Switch;

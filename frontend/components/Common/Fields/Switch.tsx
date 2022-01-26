/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FormEvent } from 'react';
import { SwitchLabel, SwitchStyled } from '@/ui/Form';

interface Props {
  isOn: boolean;
  handleToggle: (event: FormEvent<HTMLInputElement>) => void;
}

const Switch = (props: Props) => {
  return (
    <SwitchStyled>
      <input
        checked={props.isOn}
        onChange={props.handleToggle}
        id={`switch-new`}
        type="checkbox"
        {...props}
      />
      <SwitchLabel className="switch-label" htmlFor={`switch-new`}>
        <span className={`switch-button`} />
      </SwitchLabel>
      <span className="label-text">Quiero intro wacho!</span>
    </SwitchStyled>
  );
};

export default Switch;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { InputStyled } from '@/ui/Form';
import { ValidationError, ValidationIcon } from '@/ui/Validation';
import Icon from '../Icon';

type Props = Omit<JSX.IntrinsicElements['textarea'], 'as' | 'type' | 'ref'> & {
  label?: string;
  legend?: string | React.ReactNode;
  hasError?: boolean;
  errorMessage?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  validationError?: string;
};

const NewTextarea = ({
  label,
  hasError,
  errorMessage,
  isValid,
  isInvalid,
  validationError,
  ...props
}: Props) => {
  return (
    <InputStyled>
      <textarea
        className="textarea"
        aria-invalid={hasError ? 'true' : 'false'}
        {...props}
      ></textarea>
      {isValid && (
        <ValidationIcon>
          <Icon variant="checkmark" />
        </ValidationIcon>
      )}
      <label htmlFor={props.id || props.name}>{label}</label>
      {isInvalid && (
        <>
          <ValidationIcon>
            <Icon variant="cross" />
          </ValidationIcon>
          <ValidationError>{validationError}</ValidationError>
        </>
      )}
      {hasError && errorMessage && <span>{errorMessage}</span>}
    </InputStyled>
  );
};

export default NewTextarea;

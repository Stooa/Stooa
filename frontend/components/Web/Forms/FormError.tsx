/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FormError as FormErrorStyled } from 'ui/Form';

const FormError = ({ errors }) => (
  <FormErrorStyled className="error">
    {errors.graphQLErrors &&
      errors.graphQLErrors.map((message, key) => (
        <span key={`message-${key}`}>
          {message.debugMessage ? message.debugMessage : message.message}
        </span>
      ))}
    {!errors.graphQLErrors &&
      errors.message
        .split('\n')
        .map((message, key) => <span key={`message-${key}`}>{message}</span>)}
  </FormErrorStyled>
);

export default FormError;

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FormError as FormErrorStyled } from 'ui/Form';
import FormErrorParser from '@/components/Web/Forms/FormErrorParser';

const FormError = ({ errors }) => (
  <FormErrorStyled className="error">
    {errors.graphQLErrors &&
      errors.graphQLErrors.map((message, key) => (
        <span key={`message-${key}`}>
          {message.debugMessage
            ? FormErrorParser.parse(message.debugMessage)
            : FormErrorParser.parse(message.message)}
        </span>
      ))}
    {!errors.graphQLErrors &&
      errors.message
        .split('\n')
        .map((message, key) => (
          <span key={`message-${key}`}>{FormErrorParser.parse(message)}</span>
        ))}
  </FormErrorStyled>
);

export default FormError;

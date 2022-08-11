/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FormError as FormErrorStyled } from '@/ui/Form';
import FormErrorParser from '@/components/Web/Forms/FormErrorParser';

type GraphQLErrors = {
  graphQLErrors: {
    debugMessage?: string;
    message: string;
  }[];
};

type RestErrors = {
  message: string;
};

type FormErrorProps = {
  errors: GraphQLErrors | RestErrors;
};

const isGraphQLErrors = (errors: GraphQLErrors | RestErrors): errors is GraphQLErrors => {
  return (errors as GraphQLErrors).graphQLErrors !== undefined;
};

const FormError = ({ errors }: FormErrorProps) => (
  <FormErrorStyled className="error">
    {isGraphQLErrors(errors) &&
      errors.graphQLErrors.map((message, key) => (
        <span key={`message-${key}`}>
          {message.debugMessage
            ? FormErrorParser.parse(message.debugMessage)
            : FormErrorParser.parse(message.message)}
        </span>
      ))}
    {!isGraphQLErrors(errors) &&
      errors.message
        .split('\n')
        .map((message, key) => (
          <span key={`message-${key}`}>{FormErrorParser.parse(message)}</span>
        ))}
  </FormErrorStyled>
);

export default FormError;

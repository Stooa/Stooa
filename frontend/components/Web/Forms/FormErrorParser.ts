/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {GraphQLError} from "graphql";

const FormErrorParser = () => {
    const parse = (errorMessage: string): string => {
        return errorMessage.includes(':') ? errorMessage.substring(errorMessage.indexOf(':') + 2) : errorMessage;
    }
    return { parse };
}

export default FormErrorParser();

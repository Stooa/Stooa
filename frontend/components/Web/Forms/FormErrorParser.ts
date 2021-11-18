import {GraphQLError} from "graphql";

const FormErrorParser = () => {
    const parse = (errorMessage: string): string => {
        return errorMessage.includes(':') ? errorMessage.substring(errorMessage.indexOf(':') + 2) : errorMessage;
    }
    return { parse };
}

export default FormErrorParser();

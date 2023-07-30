import BaseError from "./BaseError";
export default class ForbidenError extends BaseError {
    message: string;
    statusCode: number;
    constructor(message: string);
    formatError(): {
        message: string;
        path?: string | undefined;
    }[];
}

import BaseError from "./BaseError";
export default class BadRequestError extends BaseError {
    message: string;
    statusCode: number;
    constructor(message?: string);
    formatError(): {
        message: string;
        path?: string | undefined;
    }[];
}

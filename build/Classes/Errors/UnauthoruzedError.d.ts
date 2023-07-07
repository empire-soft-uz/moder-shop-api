import BaseError from "./BaseError";
export default class UnauthorizedError extends BaseError {
    message: string;
    statusCode: number;
    constructor(message: string);
    formatError(): {
        message: string;
        path?: string | undefined;
    }[];
}

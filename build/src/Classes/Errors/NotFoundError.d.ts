import BaseError from "./BaseError";
export default class NotFoundError extends BaseError {
    message: string;
    statusCode: number;
    constructor(message?: string);
    formatError(): {
        message: string;
        path?: string | undefined;
    }[];
}

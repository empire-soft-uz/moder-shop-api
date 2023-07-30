import { ValidationError } from "express-validator";
import BaseError from "./BaseError";
export default class RequestValidationError extends BaseError {
    errors: ValidationError[];
    message: string;
    statusCode: number;
    constructor(errors: ValidationError[], message?: string);
    formatError(): {
        message: string;
        path?: string | undefined;
    }[];
}

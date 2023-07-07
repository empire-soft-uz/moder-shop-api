"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class RequestValidationError extends BaseError_1.default {
    constructor(errors, message = "Invalid request parameters") {
        super(message);
        this.errors = errors;
        this.message = message;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    formatError() {
        return this.errors.map((e) => {
            //@ts-ignore
            return { message: e.msg, path: e.path };
        });
    }
}
exports.default = RequestValidationError;

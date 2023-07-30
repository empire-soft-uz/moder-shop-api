"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class UnauthorizedError extends BaseError_1.default {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    formatError() {
        return [{ message: this.message }];
    }
}
exports.default = UnauthorizedError;

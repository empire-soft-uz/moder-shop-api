"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class NotFoundError extends BaseError_1.default {
    constructor(message = "Not Found") {
        super(message);
        this.message = message;
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    formatError() {
        return [{ message: this.message }];
    }
}
exports.default = NotFoundError;

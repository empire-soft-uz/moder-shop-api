"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(messagge) {
        super(messagge);
        this.messagge = messagge;
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}
exports.default = BaseError;

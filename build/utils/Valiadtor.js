"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const RequestValidationError_1 = __importDefault(require("../Classes/Errors/RequestValidationError"));
class Validator {
    static validate(req) {
        const errs = (0, express_validator_1.validationResult)(req).array();
        if (errs.length > 0) {
            throw new RequestValidationError_1.default(errs);
        }
        return;
    }
}
exports.default = Validator;

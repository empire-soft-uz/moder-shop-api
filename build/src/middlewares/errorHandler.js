"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("../Classes/Errors/BaseError"));
//@ts-ignore
const errorHandler = (err, req, res, next) => {
    console.log(err, err instanceof BaseError_1.default);
    if (err instanceof BaseError_1.default) {
        console.log("Base Error instance");
        res.status(err.statusCode).send({ errors: err.formatError() });
        return;
    }
    res.status(500).send({ errors: [err] });
};
exports.default = errorHandler;

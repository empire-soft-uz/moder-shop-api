import { NextFunction, Request } from "express";
import BaseError from "../Classes/Errors/BaseError";
import { validationResult } from "express-validator";
import RequestValidationError from "../Classes/Errors/RequestValidationError";

export default class Validator {
  static validate(req: Request,): void {
    const errs = validationResult(req).array();
    if (errs.length > 0) {
      throw new RequestValidationError(errs);
    }
    return
  }
}

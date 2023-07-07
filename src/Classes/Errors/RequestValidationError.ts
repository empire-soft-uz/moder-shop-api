import { ValidationError } from "express-validator";
import BaseError from "./BaseError";

export default class RequestValidationError extends BaseError {
  public statusCode: number = 400;

  constructor(
    public errors: ValidationError[],
    public message: string = "Invalid request parameters"
  ) {
    super(message);
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  public formatError(): { message: string; path?: string | undefined }[] {
    return this.errors.map((e) => {
      //@ts-ignore
      return { message: e.msg, path: e.path };
    });
  }
}

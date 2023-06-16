import BaseError from "./BaseError";

export default class BadRequestError extends BaseError {
  public statusCode: number = 400;
  constructor(public message: string = "Bad Request") {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  public formatError(): { message: string; path?: string | undefined }[] {
    return [{ message: this.message }];
  }
}

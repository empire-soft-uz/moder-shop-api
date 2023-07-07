import BaseError from "./BaseError";

export default class UnauthorizedError extends BaseError {
  statusCode: number = 401;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  public formatError(): { message: string; path?: string | undefined }[] {
    return [{ message: this.message }];
  }
}

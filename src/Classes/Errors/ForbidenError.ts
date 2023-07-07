import BaseError from "./BaseError";

export default class ForbidenError extends BaseError {
  public statusCode: number = 403;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbidenError.prototype);
  }
  public formatError(): { message: string; path?: string | undefined }[] {
    return [{ message: this.message }];
  }
}

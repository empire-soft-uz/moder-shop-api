import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  public statusCode: number = 404;
  constructor(public message: string = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError);
  }
  public formatError(): { message: string; path?: string | undefined }[] {
    return [{ message: this.message }];
  }
}

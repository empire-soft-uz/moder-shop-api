export default abstract class BaseError extends Error {
  public abstract statusCode: number;
  constructor(protected messagge: string) {
    super(messagge);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
  public abstract formatError(): Array<{ message: string; path?: string }>;
}

export default abstract class BaseError extends Error {
    protected messagge: string;
    abstract statusCode: number;
    constructor(messagge: string);
    abstract formatError(): Array<{
        message: string;
        path?: string;
    }>;
}

import { Request } from "express";
declare const errorHandler: (err: any, req: Request, res: any, next: any) => void;
export default errorHandler;

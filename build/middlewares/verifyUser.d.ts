import { NextFunction, Request, Response } from "express";
export default function verifyUser(req: Request, res: Response, next: NextFunction): Promise<void>;

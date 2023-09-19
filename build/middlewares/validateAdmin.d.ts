import { NextFunction, Request, Response } from "express";
export default function validateAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare const isSuperAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;

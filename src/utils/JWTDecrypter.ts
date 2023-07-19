import { NextFunction, Request } from "express";
import UnauthorizedError from "../Classes/Errors/UnauthoruzedError";
import ForbidenError from "../Classes/Errors/ForbidenError";
import jwt from "jsonwebtoken";

export default class JWTDecrypter {
  static decryptUser<T>(jwtKey: string, req: Request): T {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedError("User Unathorised");
    try {
      const validatedUser = jwt.verify(authHeader, jwtKey) as T;
      return validatedUser;
    } catch (error) {
      throw new ForbidenError("Invalid User Signature");
    }
  }
}

import { Request } from "express";
import jwt from "jsonwebtoken";
export default class JWTDecrypter {
    static decryptUser(jwtKey: string, req: Request): string | jwt.JwtPayload;
}

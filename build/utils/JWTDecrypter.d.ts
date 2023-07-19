import { Request } from "express";
export default class JWTDecrypter {
    static decryptUser<T>(jwtKey: string, req: Request): T;
}

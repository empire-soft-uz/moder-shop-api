import { Request } from "express";
export default class JWTDecrypter {
    static decryptUser<T>(req: Request, jwtKey: string): T;
}

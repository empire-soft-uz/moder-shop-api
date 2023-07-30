"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UnauthoruzedError_1 = __importDefault(require("../Classes/Errors/UnauthoruzedError"));
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTDecrypter {
    static decryptUser(jwtKey, req) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new UnauthoruzedError_1.default("User Unathorised");
        try {
            const validatedUser = jsonwebtoken_1.default.verify(authHeader, jwtKey);
            return validatedUser;
        }
        catch (error) {
            throw new ForbidenError_1.default("Invalid User Signature");
        }
    }
}
exports.default = JWTDecrypter;

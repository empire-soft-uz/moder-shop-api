"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
const jwtKey = process.env.JWT || "someKEy";
function validateUser(req, res, next) {
    JWTDecrypter_1.default.decryptUser(req, jwtKey);
    next();
}
exports.default = validateUser;

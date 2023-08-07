"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = void 0;
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
function validateAdmin(req, res, next) {
    JWTDecrypter_1.default.decryptUser(req, jwtKey);
    next();
}
exports.default = validateAdmin;
const isSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const u = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    const admin = yield Admin_1.default.find({ id: u.id, super: true });
    if (!admin)
        throw new ForbidenError_1.default("Access denied");
    next();
});
exports.isSuperAdmin = isSuperAdmin;

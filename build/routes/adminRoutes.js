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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const Admin_1 = __importDefault(require("../Models/Admin"));
const Password_1 = __importDefault(require("../utils/Password"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AdminRules_1 = require("../Validation/AdminRules");
const validateAdmin_1 = __importDefault(require("../middlewares/validateAdmin"));
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const adminRoute = express_1.default.Router();
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
adminRoute.post("/new", validateAdmin_1.default, [...AdminRules_1.adminCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    const superAdmin = yield Admin_1.default.findById(author.id);
    if (!superAdmin)
        throw new BadRequestError_1.default("Invalid Crtedentials");
    if (!superAdmin.super)
        throw new ForbidenError_1.default("Access Denied");
    const admin = Admin_1.default.build(req.body);
    const hash = yield Password_1.default.hashPassword(req.body.password);
    admin.password = `${hash.buff}.${hash.salt}`;
    yield admin.save();
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
    }, jwtKey);
    res.send({ id: admin.id, email: admin.email, token });
}));
adminRoute.post("/login", [...AdminRules_1.adminCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { email, password } = req.body;
    const admin = yield Admin_1.default.findOne({ email });
    const isValidPass = admin &&
        (yield Password_1.default.compare(password, {
            buff: admin.password.split(".")[0],
            salt: admin.password.split(".")[1],
        }));
    if (!admin || !isValidPass)
        throw new BadRequestError_1.default("Invalid Credentials");
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
    }, jwtKey);
    res.send({ id: admin.id, email: admin.email, token });
}));
exports.default = adminRoute;

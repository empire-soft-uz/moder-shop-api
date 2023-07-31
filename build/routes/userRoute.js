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
const express_1 = require("express");
const userRoute = (0, express_1.Router)();
require("express-async-errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRules_1 = require("../Validation/UserRules");
const User_1 = __importDefault(require("../Models/User"));
const Password_1 = __importDefault(require("../utils/Password"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
require("express-async-errors");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const OTP_1 = __importDefault(require("../Models/OTP"));
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const expiresAt = parseInt(process.env.EXPIRATION || "5");
const jwtKey = process.env.JWT || "SomeJwT_keY";
userRoute.post("/get-code", [...UserRules_1.userRegistrationRules], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { phoneNumber } = req.body;
    var code = "0000" || Math.floor(1000 + Math.random() * 9000).toString();
    const existingUserOPT = yield OTP_1.default.findOneAndUpdate({ phoneNumber }, { code, expiresAt: new Date(Date.now() + expiresAt * 60 * 1000) });
    if (!existingUserOPT) {
        const opt = OTP_1.default.build({
            phoneNumber,
            code,
            expiresAt: new Date(Date.now() + expiresAt * 60 * 1000),
            isVerified: false,
        });
        //handle opt sending
        yield opt.save();
    }
    res.send({ message: `One Time Password was send to ${phoneNumber}` });
}));
userRoute.put("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, code } = req.body;
    const opt = yield OTP_1.default.findOne({ phoneNumber, code });
    if (!opt)
        throw new BadRequestError_1.default("Invalid Verification Credentials");
    if (opt.expiresAt.getTime() < Date.now())
        throw new BadRequestError_1.default("Verification Code Expired");
    opt.isVerified = true;
    opt.expiresAt = undefined;
    yield opt.save();
    const token = jsonwebtoken_1.default.sign({
        phoneNumber,
    }, jwtKey, {
        expiresIn: new Date(Date.now() + parseInt(process.env.EXPIRATION || "5") * 60000).getTime(),
    });
    res.send({ message: `User with ${phoneNumber} is verified`, token });
}));
userRoute.post("/register", verifyUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, password, gender, birthDate } = req.body;
    const existingUser = yield User_1.default.findOne({ phoneNumber });
    if (existingUser)
        throw new BadRequestError_1.default(`User with ${phoneNumber} already exists`);
    const user = User_1.default.build(req.body);
    if (password) {
        const p = yield Password_1.default.hashPassword(password);
        user.password = `${p.buff}.${p.salt}`;
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
    }, jwtKey);
    yield user.save();
    res.send({
        name: user.fullName,
        id: user.id,
        phoneNumber: user.phoneNumber,
        token,
    });
}));
userRoute.post("/login", [...UserRules_1.userLoginRules], verifyUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { phoneNumber, password } = req.body;
    const user = yield User_1.default.findOne({ phoneNumber });
    const isValidPass = user &&
        (yield Password_1.default.compare(password, {
            buff: user.password.split(".")[0],
            salt: user.password.split(".")[1],
        }));
    if (!user || !isValidPass)
        throw new BadRequestError_1.default("Invalid Credentials");
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
    }, jwtKey);
    res.send({
        name: user.fullName,
        id: user.id,
        phoneNumber: user.phoneNumber,
        token,
    });
}));
userRoute.put("/update", [...UserRules_1.userRegistrationRules], verifyUser_1.default, validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = JWTDecrypter_1.default.decryptUser(jwtKey, req);
    if (author.exp && author.exp < Date.now())
        throw new BadRequestError_1.default("Token expired");
    const p = yield Password_1.default.hashPassword(req.body.password);
    let query = {};
    if (author.id) {
        query = Object.assign(Object.assign({}, query), { id: author.id });
    }
    if (author.phoneNumber) {
        query = Object.assign(Object.assign({}, query), { phoneNumber: author.phoneNumber });
    }
    const user = yield User_1.default.findOneAndUpdate(query, Object.assign(Object.assign({}, req.body), { password: `${p.buff}.${p.salt}` }));
    //@ts-ignore
    user === null || user === void 0 ? void 0 : user.password = undefined;
    res.send(user);
}));
userRoute.get("/current", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = JWTDecrypter_1.default.decryptUser(jwtKey, req);
    const user = yield User_1.default.findOne({ _id: author.id }, { password: 0 });
    res.send(user);
}));
exports.default = userRoute;

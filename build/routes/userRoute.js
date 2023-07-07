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
const jwtKey = process.env.JWT || "SomeJwT_keY";
userRoute.post("/register", [...UserRules_1.userRegistrationRules], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { fullName, phoneNumber, password, gender, birthDate } = req.body;
    const existingUser = yield User_1.default.findOne({ phoneNumber });
    if (existingUser)
        throw new BadRequestError_1.default(`User with ${phoneNumber} already exists`);
    const user = User_1.default.build(req.body);
    const p = yield Password_1.default.hashPassword(password);
    user.password = `${p.buff}.${p.salt}`;
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
userRoute.post("/login", [...UserRules_1.userLoginRules], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
userRoute.put("/update", [...UserRules_1.userRegistrationRules], validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = jsonwebtoken_1.default.verify(
    //@ts-ignore
    req.headers.authorization, jwtKey
    //@ts-ignore
    );
    const p = yield Password_1.default.hashPassword(req.body.password);
    const user = yield User_1.default.findByIdAndUpdate(author.id, Object.assign(Object.assign({}, req.body), { password: `${p.buff}.${p.salt}` }));
    //@ts-ignore
    user === null || user === void 0 ? void 0 : user.password = undefined;
    res.send(user);
}));
userRoute.get("/current", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = jsonwebtoken_1.default.verify(
    //@ts-ignore
    req.headers.authorization, jwtKey
    //@ts-ignore
    );
    const user = yield User_1.default.findOne({ _id: author.id }, { password: 0 });
    res.send(user);
}));
exports.default = userRoute;

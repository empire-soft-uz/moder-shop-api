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
const validateAdmin_1 = require("../middlewares/validateAdmin");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const adminRoute = express_1.default.Router();
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
adminRoute.get("/", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield Admin_1.default.find({}, { password: 0 }).populate({
        path: "vendorId",
        select: "id name contacts",
    });
    res.send(admins);
}));
adminRoute.put("/edit/:id", validateAdmin_1.isSuperAdmin, [...AdminRules_1.adminCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const hash = yield Password_1.default.hashPassword(req.body.password);
    const admin = yield Admin_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { password: `${hash.buff}.${hash.salt}` }));
    if (!admin)
        throw new NotFoundError_1.default("Admin Not Found");
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
    }, jwtKey);
    res.send({ id: admin.id, email: admin.email, token });
}));
adminRoute.get("/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield Admin_1.default.findById(req.params.id, { password: 0 }).populate({
        path: "vendorId",
        select: "id name contacts",
    });
    res.send(admins);
}));
adminRoute.delete("/:id", validateAdmin_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield Admin_1.default.findOneAndDelete({
        _id: req.params.id,
        root: false,
    });
    if (!admins)
        throw new BadRequestError_1.default("Account doesnt exists or it is root account!");
    res.send(admins);
}));
adminRoute.post("/new", validateAdmin_1.isSuperAdmin, [...AdminRules_1.adminCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const admin = Admin_1.default.build(req.body);
    const hash = yield Password_1.default.hashPassword(req.body.password);
    admin.password = `${hash.buff}.${hash.salt}`;
    yield admin.save();
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
        super: admin.super,
    }, jwtKey);
    res.send({ id: admin.id, email: admin.email, token, super: admin.super });
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
        super: admin.super,
        vendorId: admin.vendorId,
    }, jwtKey);
    res.send({ id: admin.id, email: admin.email, token, super: admin.super });
}));
exports.default = adminRoute;

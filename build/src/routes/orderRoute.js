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
require("express-async-errors");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Order_1 = __importDefault(require("../Models/Order"));
const mongoose_1 = require("mongoose");
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const orderRoute = (0, express_1.Router)();
const jwtKey = process.env.JWT || "SomeJwT_keY";
orderRoute.get("/user", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    const order = yield Order_1.default.find({ userId: author.id }).populate({
        path: "products.productId",
        model: "Product",
        populate: {
            path: "vendorId",
            model: "Vendor",
        },
    });
    if (!order)
        throw new NotFoundError_1.default("Order Not Found");
    //@ts-ignore
    res.send(order);
}));
orderRoute.get("/:id", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const orderId = req.params.id;
    if (!(0, mongoose_1.isValidObjectId)(orderId))
        throw new BadRequestError_1.default("Invalid Order Id");
    const order = yield Order_1.default.findById(orderId).populate({
        path: "products.productId",
        model: "Product",
        populate: {
            path: "vendorId",
            model: "Vendor",
        },
    });
    if (!order)
        throw new NotFoundError_1.default("Order Not Found");
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    //@ts-ignore
    if (!order.userId.equals(author.id))
        throw new ForbidenError_1.default("You don't Own this Order!");
    res.send(order);
}));
orderRoute.post("/new", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    const order = Order_1.default.build(Object.assign(Object.assign({}, req.body), { userId: author.id }));
    yield order.save();
    res.send(order);
}));
orderRoute.delete("/delete/:id", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const orderId = req.params.id;
    if (!(0, mongoose_1.isValidObjectId)(orderId))
        throw new BadRequestError_1.default("Invalid Order Id");
    const order = yield Order_1.default.findById(orderId);
    if (!order)
        throw new NotFoundError_1.default("Order Not Found");
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    //@ts-ignore
    if (!order.userId.equals(author.id))
        throw new ForbidenError_1.default("You don't Own this Order!");
    const deletedOrder = yield Order_1.default.findByIdAndDelete(req.params.id);
    res.send(deletedOrder);
}));
// orderRoute.put(
//   "/edit/:id",
//   validateUser,
//   async (req: Request, res: Response) => {
//     const authHeader = req.headers.authorization;
//     //@ts-ignore
//     const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
//     const order = await Order.findByIdAndUpdate({});
//     res.send(order);
//   }
// );
exports.default = orderRoute;

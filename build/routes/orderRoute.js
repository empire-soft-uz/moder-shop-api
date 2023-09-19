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
const Product_1 = __importDefault(require("../Models/Product"));
const validateAdmin_1 = __importDefault(require("../middlewares/validateAdmin"));
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
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
orderRoute.get("/vendor", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN || "");
    const products = yield Product_1.default.find({ vendorId: admin.vendorId }).select("id");
    const prIds = products.map((p) => p.id.toString());
    console.log(prIds);
    const orders = yield Order_1.default.find({
        "products.productId": { $in: [prIds] },
    });
    res.send(orders);
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
    const orderProducts = req.body.products;
    const prIds = orderProducts.map((p) => p.productId);
    const products = yield Product_1.default.find({ _id: { $in: prIds } });
    const orderProductPrice = [];
    if (products.length <= 0)
        throw new NotFoundError_1.default("Products Not Found!");
    let total = 0;
    products.forEach((p, i) => {
        if (orderProducts[i].productId === p.id.toString()) {
            const pr = p.price.find((pr) => {
                if (pr.qtyMin <= orderProducts[i].qty &&
                    orderProducts[i].qty <= pr.qtyMax) {
                    return pr;
                }
            }) || { price: 1 };
            total += pr.price * orderProducts[i].qty;
            orderProductPrice.push({
                productId: p.id,
                qty: orderProducts[i].qty,
                price: pr.price * orderProducts[i].qty,
            });
        }
    });
    const order = Order_1.default.build(Object.assign(Object.assign({}, req.body), { products: orderProductPrice, userId: author.id, total }));
    yield order.save();
    res.send(order);
}));
orderRoute.delete("/delete/:id", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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

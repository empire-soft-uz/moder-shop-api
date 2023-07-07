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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const Review_1 = __importDefault(require("../Models/Review"));
const Product_1 = __importDefault(require("../Models/Product"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const ReviewRules_1 = require("../Validation/ReviewRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const reviewRouter = (0, express_1.Router)();
const jwtKey = process.env.JWT || "SomeJwT_keY";
reviewRouter.post("/new/:postId", validateUser_1.default, [...ReviewRules_1.createReview], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const product = yield Product_1.default.findById(req.params.postId);
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    const review = Review_1.default.build(Object.assign(Object.assign({}, req.body), { authorId: author.id, createdDate: new Date() }));
    yield review.save();
    product.reviews.push(review.id);
    yield product.save();
    res.send(review);
}));
reviewRouter.put("/edit/:reviewId", validateUser_1.default, [...ReviewRules_1.createReview], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const review = yield Review_1.default.findById(req.params.reviewId);
    if (!review)
        throw new NotFoundError_1.default("Review Not Found");
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    //@ts-ignore
    if (!review.authorId.equals(author.id))
        throw new ForbidenError_1.default("You don't Own this Review!");
    review.rating = req.body.rating;
    review.review = req.body.review;
    yield review.save();
    res.send(review);
}));
reviewRouter.delete("/product/:prodId/delete/:reviewId", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findById(req.params.reviewId);
    if (!review)
        throw new NotFoundError_1.default("Review Not Found");
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jsonwebtoken_1.default.verify(authHeader, jwtKey);
    //@ts-ignore
    if (!review.authorId.equals(author.id))
        throw new ForbidenError_1.default("You don't Own this Review!");
    const deleted = yield Review_1.default.findByIdAndDelete(req.params.reviewId);
    yield Product_1.default.findByIdAndUpdate(req.params.prodId, {
        $pull: { reviews: deleted === null || deleted === void 0 ? void 0 : deleted.id },
    });
    res.send({ deleted });
}));
exports.default = reviewRouter;

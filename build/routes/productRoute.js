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
const Product_1 = __importDefault(require("../Models/Product"));
const ProductRules_1 = require("../Validation/ProductRules");
const Valiadtor_1 = __importDefault(require("../utils/Valiadtor"));
const Vendor_1 = __importDefault(require("../Models/Vendor"));
const NotFoundError_1 = __importDefault(require("../Classes/Errors/NotFoundError"));
const multer_1 = __importDefault(require("multer"));
const MediaManager_1 = __importDefault(require("../utils/MediaManager"));
const validateAdmin_1 = __importDefault(require("../middlewares/validateAdmin"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 50 * 1048576 } });
const productRouter = (0, express_1.Router)();
productRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const { page, limit, name, priceMax, priceMin, subcategory } = req.query;
    let query = {};
    if (name) {
        //@ts-ignore
        query = Object.assign(Object.assign({}, query), { name: { $regex: new RegExp(name, "i") } });
    }
    if (priceMin) {
        query = Object.assign(Object.assign({}, query), { price: { price: { $gte: priceMin } } });
    }
    if (priceMax) {
        query = Object.assign(Object.assign({}, query), { price: { price: { $lte: priceMax } } });
    }
    if (priceMin && priceMax) {
        //@ts-ignore
        query = Object.assign(Object.assign({}, query), { price: { price: { $gte: priceMin, $lte: priceMax } } });
    }
    if (subcategory) {
        query = Object.assign(Object.assign({}, query), { subcategory });
    }
    const products = yield Product_1.default.find(query)
        //@ts-ignore
        .skip(page * limit)
        //@ts-ignore
        .limit(limit)
        .populate("vendorId", "name");
    const totalCount = yield Product_1.default.count(query);
    res.send({ page: page || 1, limit, totalCount, products });
}));
productRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id).populate({
        path: "reviews",
        model: "Review",
        populate: {
            path: "authorId",
            model: "User",
            select: "id fullName phoneNumber",
        },
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    product.viewCount += 1;
    yield product.save();
    res.send(product);
}));
productRouter.post("/new", validateAdmin_1.default, upload.array("media", 4), [...ProductRules_1.productCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { files } = req;
    //@ts-ignore
    // let vendor;
    const product = Product_1.default.build(Object.assign({}, req.body));
    // if (req.body.vendorId) {
    //   const vendor = await Vendor.findById(req.body.vendorId);
    //   if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
    //   vendor?.products.push(product.id);
    // }
    if (files) {
        const video = [
            "video/mp4",
            "video/webm",
            "video/x-m4v",
            "video/quicktime",
        ];
        //@ts-ignore
        for (let i = 0; i < files.length; i++) {
            //@ts-ignore
            if (video.find((e) => e === files[i].mimetype)) {
                //@ts-ignore
                product.video = yield MediaManager_1.default.uploadFile(files[i]);
            }
            //@ts-ignore
            const img = yield MediaManager_1.default.uploadFile(files[i]);
            //@ts-ignore
            product.media.push(img);
        }
    }
    yield product.save();
    //await vendor.save();
    res.send(product);
}));
productRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield Product_1.default.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
        throw new NotFoundError_1.default("Product Not Found");
    yield Vendor_1.default.findByIdAndUpdate(deletedProduct.vendorId, {
        $pull: { products: req.params.id },
    });
    if (deletedProduct.media && deletedProduct.media.length > 0) {
        deletedProduct.media.forEach((i) => __awaiter(void 0, void 0, void 0, function* () {
            yield MediaManager_1.default.deletefiles(i);
        }));
    }
    if (deletedProduct.video) {
        yield MediaManager_1.default.deletefiles(deletedProduct.video);
    }
    res.send({ deletedProduct });
}));
exports.default = productRouter;

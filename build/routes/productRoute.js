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
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const ForbidenError_1 = __importDefault(require("../Classes/Errors/ForbidenError"));
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 50 * 1048576 } });
const productRouter = (0, express_1.Router)();
productRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const { page, limit, name, priceMax, priceMin, category, subcategory, popularProducts, props, } = req.query;
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
    if (category) {
        query = Object.assign(Object.assign({}, query), { category });
    }
    if (subcategory) {
        query = Object.assign(Object.assign({}, query), { subcategory });
    }
    if (props && Array.isArray(props) && props.length > 0) {
        query = Object.assign(Object.assign({}, query), { props: { $in: props } });
    }
    let sort = {};
    if (popularProducts) {
        sort = { viewCount: -1 };
    }
    const products = yield Product_1.default.find(query)
        .sort(sort)
        //@ts-ignore
        .skip(page * limit)
        //@ts-ignore
        .limit(limit)
        .populate("vendorId", "name")
        .populate("category", "name id")
        .populate("subcategory", "name id")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    });
    const totalCount = yield Product_1.default.count(query);
    res.send({ page: page || 1, limit, totalCount, products });
}));
productRouter.get("/liked", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT || "");
    const products = yield Product_1.default.find({ likes: { $in: [user.id] } });
    res.send(products);
}));
productRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id)
        .populate({
        path: "category",
        model: "Category",
        select: "id name",
    })
        .populate({
        path: "reviews",
        model: "Review",
        populate: {
            path: "authorId",
            model: "User",
            select: "id fullName phoneNumber",
        },
    })
        .populate("subcategory", "name id")
        .populate("author", "id email")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    product.viewCount += 1;
    yield product.save();
    let temp = {};
    product.props.map((p, i) => {
        const name = p.prop.name.split(" ").join("_");
        //@ts-ignore
        if (temp[name]) {
            //@ts-ignore
            temp[name].props.push(p);
        }
        else {
            //@ts-ignore
            temp[name] = { id: p.prop.id, label: p.prop.label, props: [p] };
        }
    });
    const obj = Object.assign(Object.assign({ id: product.id }, product.toObject()), { props: temp });
    delete obj._id;
    res.send(obj);
}));
productRouter.put("/like/:id", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT || "");
    const product = yield Product_1.default.likeProduct(req.params.id, user.id);
    res.send(product);
}));
productRouter.post("/new", validateAdmin_1.default, upload.array("media", 4), [...ProductRules_1.productCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { files } = req;
    const { prices } = req.body;
    //@ts-ignore
    let temp = [];
    Array.isArray(prices) && prices.map((p) => temp.push(JSON.parse(p)));
    const product = Product_1.default.build(Object.assign(Object.assign({}, req.body), { price: temp }));
    const admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    if (admin.vendorId) {
        const vendor = yield Vendor_1.default.findByIdAndUpdate(req.body.vendorId, {
            $push: { products: product.id },
        });
        if (!vendor)
            throw new NotFoundError_1.default(`Vendor with given id not found`);
        yield vendor.save();
    }
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
            else {
                //@ts-ignore
                const img = yield MediaManager_1.default.uploadFile(files[i]);
                //@ts-ignore
                product.media.push(img);
            }
        }
    }
    product.author = admin.id;
    yield product.save();
    res.send(product);
}));
productRouter.put("/edit/:id", validateAdmin_1.default, upload.array("media", 4), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { files } = req;
    let tempProps = [];
    if (req.body.props && req.body.props.length > 0) {
        tempProps.push(...req.body.props);
    }
    const newData = Object.assign({}, req.body);
    delete newData.props;
    // console.log(newData, tempProps, req.body);
    // res.send({ newData, tempProps, body: req.body });
    const product = yield Product_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, newData), { $push: { props: { $each: tempProps } } }));
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    if (req.body.vendorId) {
        const vendor = yield Vendor_1.default.findByIdAndUpdate(req.body.vendorId, {
            $push: { products: product.id },
        });
        if (!vendor)
            throw new NotFoundError_1.default(`Vendor with given id not found`);
        yield vendor.save();
    }
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
    res.send(product);
}));
productRouter.delete("/delete/:id", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deleteing");
    const [deletedProduct, admin] = yield Promise.all([
        Product_1.default.findById(req.params.id),
        Admin_1.default.findById(JWTDecrypter_1.default.decryptUser(req, jwtKey).id),
    ]);
    if (!admin)
        throw new ForbidenError_1.default("Access denied");
    if (!deletedProduct)
        throw new NotFoundError_1.default("Product Not Found");
    if (deletedProduct.author != admin.id || !admin.super)
        throw new ForbidenError_1.default("Access denied");
    const fns = [
        deletedProduct.deleteOne(),
        Vendor_1.default.findByIdAndUpdate(deletedProduct.vendorId, {
            $pull: { products: req.params.id },
        }),
    ];
    if (deletedProduct.media && deletedProduct.media.length > 0) {
        deletedProduct.media.forEach((i) => {
            //@ts-ignore
            fns.push(MediaManager_1.default.deletefiles(i));
        });
    }
    if (deletedProduct.video) { //@ts-ignore
        fns.push(MediaManager_1.default.deletefiles(deletedProduct.video));
    }
    const [pr] = yield Promise.all(fns);
    console.log(pr);
    res.send({ deletedProduct });
}));
exports.default = productRouter;

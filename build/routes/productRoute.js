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
const PropFormater_1 = __importDefault(require("../utils/PropFormater"));
const VendorProducts_1 = __importDefault(require("../Models/VendorProducts"));
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 },
});
const productRouter = (0, express_1.Router)();
productRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield Promise.all([
        Product_1.default.find(query)
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
            //populate: { path: "prop", model: "Prop" },
        }),
        Product_1.default.count(query),
    ]);
    res.send({
        page: page || 1,
        limit,
        totalCount: result[1],
        products: result[0],
    });
}));
productRouter.get("/admin", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    const { page, limit } = req.query;
    let query = {};
    if (!admin.super) {
        query = { author: admin.id };
    }
    const products = admin.super
        ? yield Product_1.default.find(query)
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
        })
        : yield VendorProducts_1.default.find(query)
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
    const totalCount = admin.super
        ? yield Product_1.default.count(query)
        : yield VendorProducts_1.default.count(query);
    res.send({ page: page || 1, limit, totalCount, products });
}));
productRouter.get("/liked", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT || "");
    const query = { likes: { $in: [user.id] } };
    const products = yield Promise.all([
        Product_1.default.find(query),
        VendorProducts_1.default.find(query),
    ]);
    res.send([...products[0], ...products[1]]);
}));
productRouter.get("/vendor/:vendorId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    const product = yield VendorProducts_1.default.findById(req.params.id)
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
            model: "Admin",
            select: "id fullName phoneNumber",
        },
    })
        .populate("subcategory", "name id")
        .populate("author", "id email")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    })
        .populate({
        path: "vendorId",
        model: Vendor_1.default,
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    if (req.query.admin) {
        res.send(product);
        return;
    }
    if (!admin) {
        product.viewCount += 1;
        yield product.save();
    }
    const fProps = PropFormater_1.default.format(product.props);
    const obj = Object.assign(Object.assign({ id: product.id }, product.toObject()), { props: fProps, author: { id: product.author.id, email: product.author.email } });
    delete obj._id;
    res.send(obj);
}));
productRouter.get("/vendor/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield VendorProducts_1.default.findById(req.params.id)
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
            model: "Admin",
            select: "id fullName phoneNumber",
        },
    })
        .populate("subcategory", "name id")
        .populate("author", "id email")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    })
        .populate({
        path: "vendorId",
        model: Vendor_1.default,
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    if (req.query.admin) {
        res.send(product);
        return;
    }
    product.viewCount += 1;
    yield product.save();
    const fProps = PropFormater_1.default.format(product.props);
    const obj = Object.assign(Object.assign({ id: product.id }, product.toObject()), { props: fProps, author: { id: product.author.id, email: product.author.email } });
    delete obj._id;
    res.send(obj);
}));
productRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let admin;
    try {
        admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    }
    catch (error) {
        admin = undefined;
    }
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
            model: "Admin",
            select: "id fullName phoneNumber",
        },
    })
        .populate("subcategory", "name id")
        .populate("author", "id email")
        .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
    })
        .populate({
        path: "vendorId",
        model: Vendor_1.default,
    });
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    if (req.query.admin) {
        res.send(product);
        return;
    }
    if (!admin) {
        product.viewCount += 1;
        yield product.save();
    }
    const fProps = PropFormater_1.default.format(product.props);
    const obj = Object.assign(Object.assign({ id: product.id }, product.toObject()), { props: fProps, author: { id: product.author.id, email: product.author.email } });
    delete obj._id;
    res.send(obj);
}));
productRouter.put("/like/:id", validateUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT || "");
    const [product, vendorProduct] = yield Promise.all([
        Product_1.default.likeProduct(req.params.id, user.id),
        VendorProducts_1.default.likeProduct(req.params.id, user.id),
    ]);
    if (!product && !vendorProduct)
        throw new NotFoundError_1.default("Product Not Found");
    res.send(product || vendorProduct);
}));
productRouter.post("/new", validateAdmin_1.default, upload.array("media", 10), ProductRules_1.productCreation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { files } = req;
    const { prices } = req.body;
    //@ts-ignore
    let temp = [];
    Array.isArray(prices) && prices.map((p) => temp.push(JSON.parse(p)));
    let product;
    const admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    console.log(admin.vendorId);
    //@ts-ignore
    product = admin.super
        ? Product_1.default.build(Object.assign(Object.assign({}, req.body), { price: temp }))
        : VendorProducts_1.default.build(Object.assign(Object.assign({}, req.body), { price: temp }));
    const vendor = yield Vendor_1.default.findByIdAndUpdate(admin.vendorId, {
        $push: { products: product.id },
    });
    if (!vendor)
        throw new NotFoundError_1.default(`Vendor with given id not found`);
    product.vendorId = vendor.id;
    yield vendor.save();
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
    //@ts-ignore
    product.author = admin.id;
    yield product.save();
    res.send(product);
}));
productRouter.put("/edit/:id", validateAdmin_1.default, upload.array("media", 4), [...ProductRules_1.productCreation], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Valiadtor_1.default.validate(req);
    const { prices } = req.body;
    const { files } = req;
    const admin = JWTDecrypter_1.default.decryptUser(req, jwtKey);
    const product = admin.super
        ? yield Product_1.default.findById(req.params.id)
        : yield VendorProducts_1.default.findById(req.params.id);
    if (!product)
        throw new NotFoundError_1.default("Product Not Found");
    let fns = [];
    req.body.delFiles && //@ts-ignore
        req.body.delFiles.map((f) => 
        //@ts-ignore
        fns.push(MediaManager_1.default.deletefiles(f)));
    let tempProps = [...new Set(req.body.props)];
    const newData = Object.assign(Object.assign({}, req.body), { video: product.video, media: product.media, price: [] });
    Array.isArray(prices) &&
        prices.map((p) => newData.price.push(JSON.parse(p)));
    delete newData.props;
    //@ts-ignore
    if (files && files.length > 0) {
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
                newData.video = yield MediaManager_1.default.uploadFile(files[i]);
            }
            //@ts-ignore
            const img = yield MediaManager_1.default.uploadFile(files[i]);
            //@ts-ignore
            newData.media.push(img);
        }
    }
    if (admin.super) {
        fns = [
            Product_1.default.findByIdAndUpdate(product.id, Object.assign(Object.assign({}, newData), { props: tempProps }), { new: true }),
            ...fns,
        ];
    }
    else {
        fns = [
            VendorProducts_1.default.findByIdAndUpdate(product.id, Object.assign(Object.assign({}, newData), { props: tempProps }), { new: true }),
            ...fns,
        ];
    }
    const [newPr] = yield Promise.all([...fns]);
    res.send(newPr);
}));
productRouter.delete("/delete/:id", validateAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.default.findById(JWTDecrypter_1.default.decryptUser(req, jwtKey).id);
    if (!admin)
        throw new ForbidenError_1.default("Access denied");
    const deletedProduct = admin.super
        ? yield Product_1.default.findById(req.params.id)
        : yield VendorProducts_1.default.findById(req.params.id);
    if (!deletedProduct)
        throw new NotFoundError_1.default("Product Not Found");
    if (!admin.super) {
        if (deletedProduct.author.toString() != admin.id)
            throw new ForbidenError_1.default("Access denied");
    }
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
    if (deletedProduct.video) {
        //@ts-ignore
        fns.push(MediaManager_1.default.deletefiles(deletedProduct.video));
    }
    const [pr] = yield Promise.all(fns);
    res.send({ deletedProduct });
}));
exports.default = productRouter;
